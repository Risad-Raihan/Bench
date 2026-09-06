/**
 * Founder-reachable doc reads. Partner path returns studio + shared.
 * Founder visibility filter (`shared` only) lands in S14.
 */
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { docs, type visibility } from "@/db/schema";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";

type Visibility = (typeof visibility.enumValues)[number];

export type PartnerDoc = {
  id: string;
  ventureId: string | null;
  name: string;
  folder: string | null;
  visibility: Visibility;
  supersedesId: string | null;
  createdAt: Date;
};

export type FounderDoc = PartnerDoc;

export async function listDocs(
  user: InternalUser,
  ventureId: string,
): Promise<PartnerDoc[]>;
export async function listDocs(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerDoc[] | FounderDoc[]>;
export async function listDocs(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerDoc[] | FounderDoc[]> {
  if (!isInternalUser(user)) {
    // S14: visibility = shared, 404 out of scope.
    void ventureId;
    return [];
  }
  return db
    .select({
      id: docs.id,
      ventureId: docs.ventureId,
      name: docs.name,
      folder: docs.folder,
      visibility: docs.visibility,
      supersedesId: docs.supersedesId,
      createdAt: docs.createdAt,
    })
    .from(docs)
    .where(and(eq(docs.ventureId, ventureId), isNull(docs.archivedAt)))
    .orderBy(desc(docs.createdAt));
}

export async function getDocById(
  user: InternalUser,
  docId: string,
): Promise<PartnerDoc | null>;
export async function getDocById(
  user: CurrentUser,
  docId: string,
): Promise<PartnerDoc | FounderDoc | null>;
export async function getDocById(
  user: CurrentUser,
  docId: string,
): Promise<PartnerDoc | FounderDoc | null> {
  if (!isInternalUser(user)) {
    void docId;
    return null;
  }
  const [row] = await db
    .select({
      id: docs.id,
      ventureId: docs.ventureId,
      name: docs.name,
      folder: docs.folder,
      visibility: docs.visibility,
      supersedesId: docs.supersedesId,
      createdAt: docs.createdAt,
    })
    .from(docs)
    .where(and(eq(docs.id, docId), isNull(docs.archivedAt)))
    .limit(1);
  return row ?? null;
}

export async function countDocs(
  user: CurrentUser,
  ventureId: string,
): Promise<number> {
  if (!isInternalUser(user)) return 0;
  const [row] = await db
    .select({ n: count() })
    .from(docs)
    .where(and(eq(docs.ventureId, ventureId), isNull(docs.archivedAt)));
  return row?.n ?? 0;
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
};

export async function insertDoc(
  values: InsertDocValues,
  executor: typeof db = db,
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
    })
    .returning();
  if (!row) throw new Error("doc insert returned no row");
  return row;
}
