/**
 * Founder-reachable application reads. The intake queue is partner-only.
 * Founder-shaped types omit `rawPayload` so a component cannot render it.
 * Inbox listing for the Application column lands in S6.
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
  founderName: string;
  founderEmail: string;
  createdAt: Date;
  rawPayload: Record<string, unknown>;
};

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
  executor: typeof db = db,
) {
  await executor
    .update(applications)
    .set({ ventureId, status: "approved" })
    .where(eq(applications.id, applicationId));
}
