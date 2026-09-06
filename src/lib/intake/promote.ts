/**
 * Engage an application: the only path that turns an applications row into a
 * venture. Shared birth (colour, slug, meet, gates, activity) lives in
 * createVenture — this wrapper maps fields, attaches the intake deck, and
 * links the application.
 */
import {
  findApplicationById,
  linkApprovedApplication,
} from "@/lib/data/applications";
import { insertDoc } from "@/lib/data/docs";
import { getVentureById, type Executor } from "@/lib/data/ventures";
import { createVenture } from "@/lib/ventures/create";

export async function createVentureFromApplication(
  applicationId: string,
  opts: { actorId?: string | null; executor?: Executor } = {},
) {
  const actorId = opts.actorId ?? null;
  const executor = opts.executor;

  const application = await findApplicationById(applicationId, executor);
  if (!application) {
    throw new Error(`Application ${applicationId} not found`);
  }
  if (application.ventureId) {
    const existing = await getVentureById(application.ventureId, executor);
    if (existing) return existing;
  }

  const venture = await createVenture(
    {
      name: application.companyName,
      oneLiner: application.problem,
      market: application.marketSize,
      founderName: application.founderName,
      founderEmail: application.founderEmail,
    },
    {
      actorId,
      executor,
      payload: { source: "application", applicationId: application.id },
    },
  );

  if (application.deckStorageKey && application.deckName) {
    await insertDoc(
      {
        ventureId: venture.id,
        name: application.deckName,
        mimeType: application.deckMimeType ?? "application/octet-stream",
        sizeBytes: application.deckSizeBytes ?? 0,
        storageKey: application.deckStorageKey,
        folder: "Application",
        uploadedBy: actorId,
        visibility: "studio",
      },
      executor,
    );
  }

  await linkApprovedApplication(application.id, venture.id, executor);
  return venture;
}
