/**
 * Partner-only gate clearing. Sets or clears done_at / done_by.
 * Founders never see gates (CONTEXT.md).
 */
import { isInternalUser, type CurrentUser } from "@/lib/auth/resolve";
import { recordActivity } from "@/lib/data/activity";
import {
  getGateItem,
  setGateCleared,
  type Executor,
} from "@/lib/data/ventures";

export async function toggleGate(
  gateItemId: string,
  currentUser: CurrentUser,
  executor?: Executor,
) {
  if (!isInternalUser(currentUser)) {
    throw new Error("gate not found");
  }

  const item = await getGateItem(gateItemId, executor);
  if (!item) throw new Error("gate not found");

  const clearing = item.doneAt == null;
  const doneAt = clearing ? new Date() : null;
  const doneBy = clearing ? currentUser.id : null;

  const updated = await setGateCleared(
    gateItemId,
    { doneAt, doneBy },
    executor,
  );
  if (!updated) throw new Error("gate not found");

  await recordActivity(
    {
      verb: clearing ? "cleared" : "updated",
      entity: "venture",
      entityId: item.ventureId,
      ventureId: item.ventureId,
      actorId: currentUser.id,
      payload: {
        gateItemId,
        label: item.label,
        done: clearing,
      },
    },
    executor,
  );

  return updated;
}
