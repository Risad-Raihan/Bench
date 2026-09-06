import { describe, expect, expectTypeOf, test } from "vitest";
import type { FounderActivity, FounderActivityVerb, PartnerActivity, RecordActivityInput } from "./activity";
import { FOUNDER_ACTIVITY_VERBS } from "@/lib/activity/founder-verbs";
import type { ActivityVerb } from "@/lib/activity/recipients";
import type { FounderApplication, PartnerApplication } from "./applications";
import type {
  FounderStageEvent,
  FounderVenture,
  FounderVentureTask,
  PartnerStageEvent,
  PartnerVenture,
  PartnerVentureTask,
} from "./ventures";

describe("founder-shaped return types omit partner-only fields", () => {
  test("venture", () => {
    expectTypeOf<PartnerVenture>().toHaveProperty("equityPct");
    expectTypeOf<PartnerVenture>().toHaveProperty("potential");
    expectTypeOf<PartnerVenture>().toHaveProperty("ownerId");
    expectTypeOf<FounderVenture>().not.toHaveProperty("equityPct");
    expectTypeOf<FounderVenture>().not.toHaveProperty("potential");
    expectTypeOf<FounderVenture>().not.toHaveProperty("ownerId");
    expectTypeOf<FounderVenture>().not.toHaveProperty("ownerName");
    expectTypeOf<FounderVenture>().toHaveProperty("name");
    expectTypeOf<FounderVenture>().toHaveProperty("slug");
  });

  test("stage event reason and task lane", () => {
    expectTypeOf<PartnerStageEvent>().toHaveProperty("reason");
    expectTypeOf<FounderStageEvent>().not.toHaveProperty("reason");
    expectTypeOf<PartnerVentureTask>().toHaveProperty("lane");
    expectTypeOf<FounderVentureTask>().not.toHaveProperty("lane");
  });

  test("application raw intake and activity payload", () => {
    expectTypeOf<PartnerApplication>().toHaveProperty("rawPayload");
    expectTypeOf<FounderApplication>().not.toHaveProperty("rawPayload");
    expectTypeOf<PartnerActivity>().toHaveProperty("payload");
    expectTypeOf<PartnerActivity>().toHaveProperty("actorInitials");
    expectTypeOf<PartnerActivity>().toHaveProperty("ventureName");
    expectTypeOf<FounderActivity>().not.toHaveProperty("payload");
    expectTypeOf<FounderActivity>().toHaveProperty("actorInitials");
  });
});

describe("recordActivity input", () => {
  test("verb is the ActivityVerb union", () => {
    expectTypeOf<RecordActivityInput["verb"]>().toEqualTypeOf<ActivityVerb>();
    expectTypeOf<"not-a-verb">().not.toExtend<RecordActivityInput["verb"]>();
  });
});

describe("founder activity allow-list", () => {
  test("excludes pass, engage, gates, tasks, and internal-note verbs", () => {
    const verbs = new Set<string>(FOUNDER_ACTIVITY_VERBS);
    expect(verbs.has("passed")).toBe(false);
    expect(verbs.has("engaged")).toBe(false);
    expect(verbs.has("cleared")).toBe(false);
    expect(verbs.has("assigned")).toBe(false);
    expect(verbs.has("mentioned")).toBe(false);
    expect(verbs.has("stale")).toBe(false);
    expect(verbs.has("uploaded")).toBe(true);
    expect(verbs.has("created")).toBe(true);
    expectTypeOf<FounderActivityVerb>().toExtend<ActivityVerb>();
  });
});
