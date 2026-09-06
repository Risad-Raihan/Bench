import { describe, expect, expectTypeOf, test } from "vitest";
import { recipientsFor, type ActivityVerb } from "./recipients";

const actor = "u-actor";
const assignee = "u-assignee";
const creator = "u-creator";
const owner = "u-owner";
const partners = ["u-actor", "u-p2", "u-p3", "u-p4"];

describe("recipientsFor", () => {
  test("assigned notifies the new assignee, never the actor", () => {
    expect(
      recipientsFor("assigned", { actorId: actor, assigneeId: assignee }),
    ).toEqual([assignee]);
    expect(
      recipientsFor("assigned", { actorId: actor, assigneeId: actor }),
    ).toEqual([]);
  });

  test("task moved, completed and commented notify assignee and creator, minus the actor", () => {
    for (const verb of ["moved", "completed", "commented"] as const) {
      expect(
        recipientsFor(verb, {
          actorId: actor,
          assigneeId: assignee,
          creatorId: creator,
        }),
      ).toEqual([assignee, creator]);
      expect(
        recipientsFor(verb, {
          actorId: actor,
          assigneeId: actor,
          creatorId: creator,
        }),
      ).toEqual([creator]);
      expect(
        recipientsFor(verb, {
          actorId: actor,
          assigneeId: assignee,
          creatorId: assignee,
        }),
      ).toEqual([assignee]);
    }
  });

  test("mentioned, decided, cleared and uploaded notify the venture owner, never the actor", () => {
    for (const verb of ["mentioned", "decided", "cleared", "uploaded"] as const) {
      expect(
        recipientsFor(verb, { actorId: actor, ownerId: owner }),
      ).toEqual([owner]);
      expect(
        recipientsFor(verb, { actorId: actor, ownerId: actor }),
      ).toEqual([]);
    }
  });

  test("engaged and passed notify every partner except the actor", () => {
    expect(
      recipientsFor("engaged", { actorId: actor, partnerIds: partners }),
    ).toEqual(["u-p2", "u-p3", "u-p4"]);
    expect(
      recipientsFor("passed", { actorId: actor, partnerIds: partners }),
    ).toEqual(["u-p2", "u-p3", "u-p4"]);
  });

  test("unknown and system verbs write no notification", () => {
    expect(recipientsFor("stale", { actorId: actor, ownerId: owner })).toEqual(
      [],
    );
    expect(
      recipientsFor("created", { actorId: actor, ownerId: owner }),
    ).toEqual([]);
    expect(
      recipientsFor("updated", { actorId: actor, assigneeId: assignee }),
    ).toEqual([]);
    expect(
      recipientsFor("not-a-verb", { actorId: actor, assigneeId: assignee }),
    ).toEqual([]);
  });
});

describe("ActivityVerb", () => {
  test("rejects an unknown verb at compile time", () => {
    expectTypeOf<"assigned">().toExtend<ActivityVerb>();
    expectTypeOf<"engaged">().toExtend<ActivityVerb>();
    expectTypeOf<"stale">().toExtend<ActivityVerb>();
    expectTypeOf<"updated">().toExtend<ActivityVerb>();
    expectTypeOf<"not-a-verb">().not.toExtend<ActivityVerb>();
  });
});
