/**
 * Pass an application: the row stays forever, the card leaves the intake
 * column, and every other partner is notified (ADR-0002, ADR-0005).
 */
import { recordActivity } from "@/lib/data/activity";
import {
  findApplicationById,
  markApplicationPassed,
} from "@/lib/data/applications";
import type { Executor } from "@/lib/data/ventures";

const INBOX = new Set(["new", "reviewing"]);

export async function passApplication(
  applicationId: string,
  opts: { actorId: string; executor?: Executor },
) {
  const { actorId, executor } = opts;

  const application = await findApplicationById(applicationId, executor);
  if (!application) {
    throw new Error(`Application ${applicationId} not found`);
  }
  if (application.status === "passed") return application;
  if (!INBOX.has(application.status)) {
    throw new Error(
      `Application ${applicationId} cannot be passed from status ${application.status}`,
    );
  }

  await markApplicationPassed(application.id, {
    reviewedBy: actorId,
    executor,
  });

  await recordActivity(
    {
      // entity_type has no "application" value; payload carries the row id.
      verb: "passed",
      entity: "venture",
      entityId: application.id,
      actorId,
      payload: {
        applicationId: application.id,
        companyName: application.companyName,
      },
    },
    executor,
  );

  return { ...application, status: "passed" as const };
}
