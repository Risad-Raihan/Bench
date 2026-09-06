/**
 * Founder-reachable doc reads and writes. Pages never touch `db`
 * (ADR-0006). Founders see `shared` docs on their venture and may upload
 * to that venture (forced `shared`). Archive stays partner-only.
 */
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { docs, users, type visibility } from "@/db/schema";
import { recordActivity } from "@/lib/data/activity";
import { canSeeVenture, hasLiveMembership } from "@/lib/data/scope";
import { getVentureById } from "@/lib/data/ventures";
import {
  canSupersede,
  chainHead,
  isSuperseded,
  resolveVersionChain,
  type DocVersion,
} from "@/lib/docs/versions";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";

export type Executor = typeof db;

type Visibility = (typeof visibility.enumValues)[number];

const VISIBILITIES = new Set<Visibility>(["studio", "shared"]);

export type PartnerDoc = {
  id: string;
  ventureId: string | null;
  name: string;
  mimeType: string;
  sizeBytes: number;
  folder: string | null;
  visibility: Visibility;
  supersedesId: string | null;
  createdAt: Date;
  archivedAt: Date | null;
  uploadedByInitials: string | null;
};

export type FounderDoc = PartnerDoc;

export type PartnerDocHead = PartnerDoc & {
  versionCount: number;
  versions: PartnerDoc[];
};

export type DocDownload = PartnerDoc & {
  storageKey: string;
};

const listColumns = {
  id: docs.id,
  ventureId: docs.ventureId,
  name: docs.name,
  mimeType: docs.mimeType,
  sizeBytes: docs.sizeBytes,
  folder: docs.folder,
  visibility: docs.visibility,
  supersedesId: docs.supersedesId,
  createdAt: docs.createdAt,
  archivedAt: docs.archivedAt,
  uploadedByInitials: users.initials,
};

type DocListRow = PartnerDoc & { storageKey?: string };

function asVersion(row: { id: string; supersedesId: string | null; archivedAt: Date | null }): DocVersion {
  return {
    id: row.id,
    supersedesId: row.supersedesId,
    archivedAt: row.archivedAt,
  };
}

function chainFor(startId: string, rows: DocVersion[]): DocVersion[] {
  const byId = new Map(rows.map((row) => [row.id, row]));
  if (!byId.has(startId)) return [];
  let cursor: string | null = startId;
  const seen = new Set<string>();
  let rootId = startId;
  while (cursor && byId.has(cursor) && !seen.has(cursor)) {
    seen.add(cursor);
    rootId = cursor;
    cursor = byId.get(cursor)!.supersedesId;
  }
  return rows.filter((row) => {
    let id: string | null = row.id;
    const walk = new Set<string>();
    while (id && byId.has(id) && !walk.has(id)) {
      if (id === rootId) return true;
      walk.add(id);
      id = byId.get(id)!.supersedesId;
    }
    return false;
  });
}

async function loadVentureDocs(
  ventureId: string,
  executor: Executor,
): Promise<(PartnerDoc & { storageKey: string })[]> {
  return executor
    .select({ ...listColumns, storageKey: docs.storageKey })
    .from(docs)
    .leftJoin(users, eq(docs.uploadedBy, users.id))
    .where(eq(docs.ventureId, ventureId))
    .orderBy(desc(docs.createdAt));
}

function toPublic(row: DocListRow): PartnerDoc {
  return {
    id: row.id,
    ventureId: row.ventureId,
    name: row.name,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    folder: row.folder,
    visibility: row.visibility,
    supersedesId: row.supersedesId,
    createdAt: row.createdAt,
    archivedAt: row.archivedAt,
    uploadedByInitials: row.uploadedByInitials,
  };
}

function headsFrom(rows: PartnerDoc[]): PartnerDocHead[] {
  const versions = rows.map(asVersion);
  const heads = rows.filter(
    (row) => row.archivedAt == null && !isSuperseded(asVersion(row), versions),
  );
  return heads.map((head) => {
    const chain = resolveVersionChain(chainFor(head.id, versions));
    const byId = new Map(rows.map((row) => [row.id, row]));
    const older = chain.slice(1).map((node) => byId.get(node.id)!);
    return {
      ...head,
      versionCount: chain.length,
      versions: older,
    };
  });
}

export async function listDocs(
  user: InternalUser,
  ventureId: string,
  executor?: Executor,
): Promise<PartnerDocHead[]>;
export async function listDocs(
  user: CurrentUser,
  ventureId: string,
  executor?: Executor,
): Promise<PartnerDocHead[]>;
export async function listDocs(
  user: CurrentUser,
  ventureId: string,
  executor: Executor = db,
): Promise<PartnerDocHead[]> {
  if (!isInternalUser(user)) {
    if (!canSeeVenture(user, ventureId)) return [];
    const rows = await loadVentureDocs(ventureId, executor);
    return headsFrom(
      rows.filter((row) => row.visibility === "shared").map(toPublic),
    );
  }
  const rows = await loadVentureDocs(ventureId, executor);
  return headsFrom(rows.map(toPublic));
}

export async function listDocFolders(
  user: CurrentUser,
  ventureId: string,
  executor: Executor = db,
): Promise<string[]> {
  const heads = await listDocs(user, ventureId, executor);
  const names = new Set<string>();
  for (const head of heads) {
    if (head.folder) names.add(head.folder);
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

export async function getDocById(
  user: InternalUser,
  docId: string,
  executor?: Executor,
): Promise<PartnerDoc | null>;
export async function getDocById(
  user: CurrentUser,
  docId: string,
  executor?: Executor,
): Promise<PartnerDoc | FounderDoc | null>;
export async function getDocById(
  user: CurrentUser,
  docId: string,
  executor: Executor = db,
): Promise<PartnerDoc | FounderDoc | null> {
  const [row] = await executor
    .select(listColumns)
    .from(docs)
    .leftJoin(users, eq(docs.uploadedBy, users.id))
    .where(eq(docs.id, docId))
    .limit(1);
  if (!row) return null;
  if (!isInternalUser(user)) {
    if (row.visibility !== "shared" || !canSeeVenture(user, row.ventureId)) {
      return null;
    }
  }
  return row;
}

export async function getDocForDownload(
  user: CurrentUser,
  docId: string,
  executor: Executor = db,
): Promise<DocDownload | null> {
  const [row] = await executor
    .select({ ...listColumns, storageKey: docs.storageKey })
    .from(docs)
    .leftJoin(users, eq(docs.uploadedBy, users.id))
    .where(eq(docs.id, docId))
    .limit(1);
  if (!row) return null;
  if (!isInternalUser(user)) {
    if (row.visibility !== "shared" || !canSeeVenture(user, row.ventureId)) {
      return null;
    }
  }
  return row;
}

export async function countDocs(
  user: CurrentUser,
  ventureId: string,
  executor: Executor = db,
): Promise<number> {
  const heads = await listDocs(user, ventureId, executor);
  return heads.length;
}

export type InsertDocValues = {
  ventureId: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  folder?: string | null;
  uploadedBy?: string | null;
  visibility?: Visibility;
  supersedesId?: string | null;
};

export async function insertDoc(
  values: InsertDocValues,
  executor: Executor = db,
) {
  const [row] = await executor
    .insert(docs)
    .values({
      ventureId: values.ventureId,
      name: values.name,
      mimeType: values.mimeType,
      sizeBytes: values.sizeBytes,
      storageKey: values.storageKey,
      folder: values.folder ?? null,
      uploadedBy: values.uploadedBy ?? null,
      visibility: values.visibility ?? "studio",
      supersedesId: values.supersedesId ?? null,
    })
    .returning();
  if (!row) throw new Error("doc insert returned no row");
  return row;
}

export async function archiveDoc(
  user: CurrentUser,
  docId: string,
  executor: Executor = db,
): Promise<PartnerDoc | null> {
  if (!isInternalUser(user)) return null;
  const current = await getDocById(user, docId, executor);
  if (!current) return null;

  // Archive only from the chain head. Archiving a middle version would split
  // the chain (both the old parent and the newer child would surface as heads).
  if (current.ventureId) {
    const siblings = await loadVentureDocs(current.ventureId, executor);
    if (isSuperseded(asVersion(current), siblings.map(asVersion))) {
      throw new Error("Archive the current version, not an older one.");
    }
  }

  const [row] = await executor
    .update(docs)
    .set({ archivedAt: new Date() })
    .where(and(eq(docs.id, docId), isNull(docs.archivedAt)))
    .returning({ id: docs.id });
  if (!row) return current;
  return getDocById(user, docId, executor);
}

export type AuthorizeUploadInput = {
  ventureId: string;
  folder?: string | null;
  visibility?: string | null;
  supersedesId?: string | null;
  name: string;
};

export async function authorizeDocUpload(
  user: CurrentUser,
  input: AuthorizeUploadInput,
  executor: Executor = db,
): Promise<InsertDocValues & { uploaderId: string }> {
  if (!isInternalUser(user)) {
    const ok = await hasLiveMembership(user, input.ventureId?.trim() ?? "", executor);
    if (!ok) throw new Error("Venture not found.");
  }
  const ventureId = input.ventureId?.trim();
  if (!ventureId) throw new Error("A venture is required.");
  const venture = await getVentureById(ventureId, executor);
  if (!venture) throw new Error("Venture not found.");
  const rows = await loadVentureDocs(ventureId, executor);

  let visibility: Visibility = isInternalUser(user) ? "studio" : "shared";
  if (input.visibility) {
    if (!VISIBILITIES.has(input.visibility as Visibility)) {
      throw new Error("Visibility must be studio or shared.");
    }
    visibility = isInternalUser(user)
      ? (input.visibility as Visibility)
      : "shared";
  }

  const folder = input.folder?.trim() ? input.folder.trim().slice(0, 80) : null;
  const name = input.name.trim().slice(0, 200) || "Untitled";

  let supersedesId: string | null = null;
  if (input.supersedesId) {
    if (!isInternalUser(user)) {
      const target = rows.find((row) => row.id === input.supersedesId);
      if (!target || target.visibility !== "shared") {
        throw new Error("Doc to supersede was not found.");
      }
    }
    const versions = rows.map(asVersion);
    const related = chainFor(input.supersedesId, versions);
    if (related.length === 0) {
      throw new Error("Doc to supersede was not found.");
    }
    const head = chainHead(related);
    if (!head) throw new Error("Doc to supersede was not found.");
    if (!canSupersede(head.id, related)) {
      throw new Error("This doc already has a newer version.");
    }
    supersedesId = head.id;
  }

  return {
    ventureId,
    name,
    mimeType: "application/octet-stream",
    sizeBytes: 0,
    storageKey: "",
    folder,
    uploadedBy: user.id,
    visibility,
    supersedesId,
    uploaderId: user.id,
  };
}

export type DocUploadPayload = {
  ventureId: string;
  folder: string | null;
  visibility: Visibility;
  uploaderId: string;
  supersedesId: string | null;
  name: string;
};

export function parseUploadPayload(raw: string | null | undefined): DocUploadPayload {
  if (!raw) throw new Error("Missing upload payload.");
  const parsed = JSON.parse(raw) as Partial<DocUploadPayload>;
  if (!parsed.ventureId || !parsed.uploaderId || !parsed.name) {
    throw new Error("Invalid upload payload.");
  }
  const visibility = parsed.visibility === "shared" ? "shared" : "studio";
  return {
    ventureId: parsed.ventureId,
    folder: parsed.folder ?? null,
    visibility,
    uploaderId: parsed.uploaderId,
    supersedesId: parsed.supersedesId ?? null,
    name: parsed.name,
  };
}

export async function recordUploadedBlob(
  payload: DocUploadPayload,
  blob: { url: string; contentType?: string },
  sizeBytes: number,
  executor: Executor = db,
) {
  const [existing] = await executor
    .select({ id: docs.id })
    .from(docs)
    .where(eq(docs.storageKey, blob.url))
    .limit(1);
  if (existing) return existing;

  const row = await insertDoc(
    {
      ventureId: payload.ventureId,
      name: payload.name,
      mimeType: blob.contentType || "application/octet-stream",
      sizeBytes,
      storageKey: blob.url,
      folder: payload.folder,
      uploadedBy: payload.uploaderId,
      visibility: payload.visibility,
      supersedesId: payload.supersedesId,
    },
    executor,
  );

  await recordActivity(
    {
      verb: "uploaded",
      entity: "doc",
      entityId: row.id,
      ventureId: payload.ventureId,
      actorId: payload.uploaderId,
      payload: { name: payload.name },
    },
    executor,
  );

  return row;
}
