/**
 * Founder-reachable decision reads and partner writes. Pages never touch
 * `db` (ADR-0006). Founder visibility filter (`shared` only) lands in S14.
 */
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { decisions, notes, users, type visibility } from "@/db/schema";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";

export type Executor = typeof db;

type Visibility = (typeof visibility.enumValues)[number];

export type PartnerDecision = {
  id: string;
  ventureId: string | null;
  title: string;
  rationale: string | null;
  visibility: Visibility;
  decidedAt: Date;
  decidedBy: string | null;
  decidedByInitials: string | null;
  sourceNoteId: string | null;
  sourceNoteTitle: string | null;
};

export type FounderDecision = PartnerDecision;

const decisionColumns = {
  id: decisions.id,
  ventureId: decisions.ventureId,
  title: decisions.title,
  rationale: decisions.rationale,
  visibility: decisions.visibility,
  decidedAt: decisions.decidedAt,
  decidedBy: decisions.decidedBy,
  decidedByInitials: users.initials,
  sourceNoteId: decisions.sourceNoteId,
  sourceNoteTitle: notes.title,
};

export async function listDecisions(
  user: InternalUser,
  ventureId: string,
): Promise<PartnerDecision[]>;
export async function listDecisions(
  user: CurrentUser,
  ventureId: string,
): Promise<PartnerDecision[] | FounderDecision[]>;
export async function listDecisions(
  user: CurrentUser,
  ventureId: string,
  executor: Executor = db,
): Promise<PartnerDecision[] | FounderDecision[]> {
  if (!isInternalUser(user)) {
    void ventureId;
    return [];
  }
  return executor
    .select(decisionColumns)
    .from(decisions)
    .leftJoin(users, eq(decisions.decidedBy, users.id))
    .leftJoin(notes, eq(decisions.sourceNoteId, notes.id))
    .where(eq(decisions.ventureId, ventureId))
    .orderBy(desc(decisions.decidedAt));
}

export async function getDecisionById(
  user: InternalUser,
  decisionId: string,
): Promise<PartnerDecision | null>;
export async function getDecisionById(
  user: CurrentUser,
  decisionId: string,
): Promise<PartnerDecision | FounderDecision | null>;
export async function getDecisionById(
  user: CurrentUser,
  decisionId: string,
  executor: Executor = db,
): Promise<PartnerDecision | FounderDecision | null> {
  if (!isInternalUser(user)) {
    void decisionId;
    return null;
  }
  const [row] = await executor
    .select(decisionColumns)
    .from(decisions)
    .leftJoin(users, eq(decisions.decidedBy, users.id))
    .leftJoin(notes, eq(decisions.sourceNoteId, notes.id))
    .where(eq(decisions.id, decisionId))
    .limit(1);
  return row ?? null;
}

export async function countDecisions(
  user: CurrentUser,
  ventureId: string,
): Promise<number> {
  if (!isInternalUser(user)) return 0;
  const [row] = await db
    .select({ n: count() })
    .from(decisions)
    .where(eq(decisions.ventureId, ventureId));
  return row?.n ?? 0;
}

export type InsertDecisionValues = {
  ventureId: string | null;
  title: string;
  rationale?: string | null;
  decidedBy: string;
  sourceNoteId?: string | null;
};

export async function insertDecision(
  values: InsertDecisionValues,
  executor: Executor = db,
) {
  const [row] = await executor
    .insert(decisions)
    .values({
      ventureId: values.ventureId,
      title: values.title,
      rationale: values.rationale ?? null,
      decidedBy: values.decidedBy,
      sourceNoteId: values.sourceNoteId ?? null,
    })
    .returning();
  if (!row) throw new Error("decision insert returned no row");
  return row;
}

export async function updateDecisionTitle(
  decisionId: string,
  title: string,
  executor: Executor = db,
) {
  const trimmed = title.trim() || "Untitled";
  const [row] = await executor
    .update(decisions)
    .set({ title: trimmed })
    .where(eq(decisions.id, decisionId))
    .returning();
  if (!row) throw new Error("decision update returned no row");
  return row;
}
