/**
 * Founder-reachable decision reads. Partner path returns studio + shared.
 * Founder visibility filter (`shared` only) lands in S14.
 */
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { decisions, type visibility } from "@/db/schema";
import {
  isInternalUser,
  type CurrentUser,
  type InternalUser,
} from "@/lib/auth/resolve";

type Visibility = (typeof visibility.enumValues)[number];

export type PartnerDecision = {
  id: string;
  ventureId: string | null;
  title: string;
  rationale: string | null;
  visibility: Visibility;
  decidedAt: Date;
};

export type FounderDecision = PartnerDecision;

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
): Promise<PartnerDecision[] | FounderDecision[]> {
  if (!isInternalUser(user)) {
    void ventureId;
    return [];
  }
  return db
    .select({
      id: decisions.id,
      ventureId: decisions.ventureId,
      title: decisions.title,
      rationale: decisions.rationale,
      visibility: decisions.visibility,
      decidedAt: decisions.decidedAt,
    })
    .from(decisions)
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
): Promise<PartnerDecision | FounderDecision | null> {
  if (!isInternalUser(user)) {
    void decisionId;
    return null;
  }
  const [row] = await db
    .select({
      id: decisions.id,
      ventureId: decisions.ventureId,
      title: decisions.title,
      rationale: decisions.rationale,
      visibility: decisions.visibility,
      decidedAt: decisions.decidedAt,
    })
    .from(decisions)
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
