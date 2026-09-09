/**
 * Founder-reachable application reads and the engage/pass writes.
 * The intake queue is partner-only. Founder-shaped types omit `rawPayload`
 * so a component cannot render it.
 */
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { applications, type applicationStatus } from "@/db/schema";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";

type ApplicationStatus = (typeof applicationStatus.enumValues)[number];

export type PartnerApplication = {
  id: string;
  status: ApplicationStatus;
  companyName: string;
  founderName: string | null;
  founderEmail: string | null;
  founderAvatar: string | null;
  problem: string | null;
  createdAt: Date;
  rawPayload: Record<string, unknown>;
};

export type ManualApplicationInput = {
  companyName: string;
  problem?: string | null;
  founderName?: string | null;
  founderEmail?: string | null;
  founderAvatar?: string | null;
  color?: string | null;
  deck?: {
    storageKey: string;
    name: string;
    mimeType: string;
    sizeBytes: number;
  } | null;
};

/**
 * A partner adding a lead to the pipeline by hand. Lands in the Application
 * column (`status = 'new'`, `source = 'manual'`) exactly like a website
 * submission; Engage turns it into a venture in Meet (ADR-0002).
 */
export async function createManualApplication(
  user: CurrentUser,
  input: ManualApplicationInput,
  executor: typeof db = db,
): Promise<{ id: string } | null> {
  if (!isInternalUser(user)) return null;
  const companyName = input.companyName.trim();
  if (!companyName) throw new Error("A name is required.");

  const [row] = await executor
    .insert(applications)
    .values({
      status: "new",
      source: "manual",
      companyName,
      problem: input.problem?.trim() || null,
      founderName: input.founderName?.trim() || null,
      founderEmail: input.founderEmail?.trim().toLowerCase() || null,
      founderAvatar: input.founderAvatar ?? null,
      color: input.color ?? null,
      deckStorageKey: input.deck?.storageKey ?? null,
      deckName: input.deck?.name ?? null,
      deckMimeType: input.deck?.mimeType ?? null,
      deckSizeBytes: input.deck?.sizeBytes ?? null,
      rawPayload: { addedBy: user.id },
    })
    .returning({ id: applications.id });
  return row ?? null;
}

export type FounderApplication = Omit<PartnerApplication, "rawPayload">;

const INBOX_STATUSES: ApplicationStatus[] = ["new", "reviewing"];

export async function listInboxApplications(
  user: InternalUser,
): Promise<PartnerApplication[]>;
export async function listInboxApplications(
  user: CurrentUser,
): Promise<PartnerApplication[] | FounderApplication[]>;
export async function listInboxApplications(
  user: CurrentUser,
): Promise<PartnerApplication[] | FounderApplication[]> {
  if (!isInternalUser(user)) return [];
  return db
    .select({
      id: applications.id,
      status: applications.status,
      companyName: applications.companyName,
      founderName: applications.founderName,
      founderEmail: applications.founderEmail,
      founderAvatar: applications.founderAvatar,
      problem: applications.problem,
      createdAt: applications.createdAt,
      rawPayload: applications.rawPayload,
    })
    .from(applications)
    .where(inArray(applications.status, INBOX_STATUSES))
    .orderBy(asc(applications.createdAt));
}

export async function getApplication(
  user: InternalUser,
  applicationId: string,
): Promise<PartnerApplication | null>;
export async function getApplication(
  user: CurrentUser,
  applicationId: string,
): Promise<PartnerApplication | FounderApplication | null>;
export async function getApplication(
  user: CurrentUser,
  applicationId: string,
): Promise<PartnerApplication | FounderApplication | null> {
  if (!isInternalUser(user)) {
    void applicationId;
    return null;
  }
  const [row] = await db
    .select({
      id: applications.id,
      status: applications.status,
      companyName: applications.companyName,
      founderName: applications.founderName,
      founderEmail: applications.founderEmail,
      founderAvatar: applications.founderAvatar,
      problem: applications.problem,
      createdAt: applications.createdAt,
      rawPayload: applications.rawPayload,
    })
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);
  return row ?? null;
}

export async function findApplicationById(
  applicationId: string,
  executor: typeof db = db,
) {
  const [row] = await executor
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);
  return row ?? null;
}

export async function linkApprovedApplication(
  applicationId: string,
  ventureId: string,
  opts: { reviewedBy?: string | null; executor?: typeof db } = {},
) {
  const executor = opts.executor ?? db;
  await executor
    .update(applications)
    .set({
      ventureId,
      status: "approved",
      reviewedBy: opts.reviewedBy ?? null,
      reviewedAt: new Date(),
    })
    .where(eq(applications.id, applicationId));
}

export async function markApplicationPassed(
  applicationId: string,
  opts: { reviewedBy: string | null; executor?: typeof db },
) {
  const executor = opts.executor ?? db;
  await executor
    .update(applications)
    .set({
      status: "passed",
      reviewedBy: opts.reviewedBy,
      reviewedAt: new Date(),
    })
    .where(eq(applications.id, applicationId));
}
