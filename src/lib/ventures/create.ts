/**
 * Shared venture-birth path. Manual "New Venture" and intake promotion both
 * call createVenture so colour, slug, meet entry, gates and activity cannot
 * drift apart.
 */
import { recordActivity } from "@/lib/data/activity";
import {
  insertBirthStageEvent,
  insertVenture,
  isSlugTaken,
  listUsedVentureColors,
  type Executor,
} from "@/lib/data/ventures";
import { resolveAvatar } from "@/lib/avatars";
import { seedGatesForStage } from "@/lib/stages/move";
import {
  nextAvailableVentureColor,
  VENTURE_COLOR_PALETTE,
} from "@/lib/venture-colors";
import type { potential } from "@/db/schema";

type Potential = (typeof potential.enumValues)[number];

const MAX_ONE_LINER = 200;
const MAX_MARKET = 200;
const PALETTE = VENTURE_COLOR_PALETTE as readonly string[];

export type CreateVentureInput = {
  name: string;
  oneLiner?: string | null;
  market?: string | null;
  founderName?: string | null;
  founderEmail?: string | null;
  founderAvatar?: string | null;
  potential?: Potential | null;
  ownerId?: string | null;
  color?: string | null;
};

export type CreateVentureOpts = {
  actorId?: string | null;
  executor?: Executor;
  payload?: Record<string, unknown>;
};

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "venture"
  );
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

function truncate(
  value: string | null | undefined,
  max: number,
): string | null {
  const v = value?.trim();
  if (!v) return null;
  return v.length > max ? v.slice(0, max) : v;
}

async function uniqueSlug(executor: Executor | undefined, base: string) {
  let slug = base;
  for (let i = 0; i < 20; i++) {
    if (!(await isSlugTaken(slug, executor))) return slug;
    slug = `${base}-${randomSuffix()}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

function resolveColor(
  requested: string | null | undefined,
  used: readonly (string | null | undefined)[],
): string {
  if (requested && PALETTE.includes(requested)) return requested;
  return nextAvailableVentureColor(used);
}

export async function createVenture(
  input: CreateVentureInput,
  opts: CreateVentureOpts = {},
) {
  const actorId = opts.actorId ?? null;
  const executor = opts.executor;
  const name = input.name.trim();
  if (!name) throw new Error("name is required");

  const usedColors = await listUsedVentureColors(executor);
  const color = resolveColor(input.color, usedColors);
  const slug = await uniqueSlug(executor, slugify(name));

  const venture = await insertVenture(
    {
      slug,
      name,
      oneLiner: truncate(input.oneLiner, MAX_ONE_LINER),
      market: truncate(input.market, MAX_MARKET),
      stage: "meet",
      status: "active",
      color,
      founderName: truncate(input.founderName, 200),
      founderEmail: truncate(input.founderEmail, 200),
      founderAvatar: resolveAvatar(input.founderAvatar),
      potential: input.potential ?? null,
      ownerId: input.ownerId ?? null,
      createdBy: actorId,
    },
    executor,
  );

  await insertBirthStageEvent(
    { ventureId: venture.id, actorId },
    executor,
  );

  await seedGatesForStage(venture.id, "meet", executor);

  await recordActivity(
    {
      verb: "created",
      entity: "venture",
      entityId: venture.id,
      ventureId: venture.id,
      actorId,
      payload: opts.payload ?? { source: "manual" },
    },
    executor,
  );

  return venture;
}
