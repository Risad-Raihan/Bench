/**
 * Promote an inbound website application to a venture in the Meet stage.
 *
 * Called by POST /api/intake right after the application row is written, and
 * safe for a partner to call manually later (e.g. a "create venture" button on
 * the intake inbox). This is the ONLY code path that creates a venture from an
 * application — it must not be bypassed, because it also writes the immutable
 * stage event, seeds the gate checklist and logs activity, exactly as a normal
 * new-venture creation does.
 *
 * Transactions: the Neon HTTP driver has no interactive transaction support
 * (each query is its own round-trip), so the writes below run sequentially
 * rather than atomically. If the driver is swapped for a WebSocket/pg pool
 * later, pass the tx as `executor` and it will be used as-is.
 */
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  activity,
  applications,
  docs,
  gateItems,
  stageTemplates,
  ventures,
  ventureStageEvents,
} from "@/db/schema";
import { nextAvailableVentureColor } from "@/lib/venture-colors";

type Executor = typeof db;

const MAX_ONE_LINER = 200;
const MAX_MARKET = 200;

function slugify(input: string): string {
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

function truncate(value: string | null | undefined, max: number): string | null {
  const v = value?.trim();
  if (!v) return null;
  return v.length > max ? v.slice(0, max) : v;
}

async function uniqueSlug(executor: Executor, base: string): Promise<string> {
  let slug = base;
  for (let i = 0; i < 20; i++) {
    const existing = await executor
      .select({ id: ventures.id })
      .from(ventures)
      .where(eq(ventures.slug, slug))
      .limit(1);
    if (existing.length === 0) return slug;
    slug = `${base}-${randomSuffix()}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function createVentureFromApplication(
  applicationId: string,
  executor: Executor = db,
) {
  const [application] = await executor
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!application) {
    throw new Error(`Application ${applicationId} not found`);
  }
  if (application.ventureId) {
    const [existing] = await executor
      .select()
      .from(ventures)
      .where(eq(ventures.id, application.ventureId))
      .limit(1);
    if (existing) return existing;
  }

  // Identity colour: same rule as the New Venture flow — first palette colour
  // not already carried by an active venture.
  const activeVentures = await executor
    .select({ color: ventures.color })
    .from(ventures)
    .where(eq(ventures.status, "active"));
  const color = nextAvailableVentureColor(activeVentures.map((v) => v.color));

  const slug = await uniqueSlug(executor, slugify(application.companyName));

  const [venture] = await executor
    .insert(ventures)
    .values({
      slug,
      name: application.companyName,
      oneLiner: truncate(application.problem, MAX_ONE_LINER),
      market: truncate(application.marketSize, MAX_MARKET),
      stage: "meet",
      status: "active",
      color,
      founderName: application.founderName,
      founderEmail: application.founderEmail,
      // The site's Apply form has no phone field today.
      founderPhone: null,
      // System-created: there is no real session yet (see current-user.ts).
      createdBy: null,
    })
    .returning();

  // Immutable stage trail — venture is born in Meet.
  await executor.insert(ventureStageEvents).values({
    ventureId: venture.id,
    fromStage: null,
    toStage: "meet",
    actorId: null,
    reason: "Created from website application",
  });

  // Seed the Meet gate checklist from stage_templates, the same source a
  // normal new-venture creation uses.
  const gateTemplates = await executor
    .select()
    .from(stageTemplates)
    .where(
      and(
        eq(stageTemplates.stage, "meet"),
        eq(stageTemplates.kind, "gate"),
        eq(stageTemplates.isActive, true),
      ),
    );
  if (gateTemplates.length > 0) {
    await executor.insert(gateItems).values(
      gateTemplates
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((t) => ({
          ventureId: venture.id,
          stage: "meet" as const,
          label: t.label,
          sortOrder: t.sortOrder,
        })),
    );
  }

  // Attach the pitch deck as a doc, if the upload landed.
  if (application.deckStorageKey && application.deckName) {
    await executor.insert(docs).values({
      ventureId: venture.id,
      name: application.deckName,
      mimeType: application.deckMimeType ?? "application/octet-stream",
      sizeBytes: application.deckSizeBytes ?? 0,
      storageKey: application.deckStorageKey,
      folder: "Application",
      uploadedBy: null,
      visibility: "studio",
    });
  }

  await executor.insert(activity).values({
    actorId: null,
    verb: "created",
    entity: "venture",
    entityId: venture.id,
    ventureId: venture.id,
    payload: { source: "application", applicationId: application.id },
  });

  await executor
    .update(applications)
    .set({ ventureId: venture.id, status: "reviewing" })
    .where(eq(applications.id, application.id));

  return venture;
}
