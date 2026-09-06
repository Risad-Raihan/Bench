import { describe, expectTypeOf, test } from "vitest";
import type { FounderActivity, PartnerActivity } from "./activity";
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
    expectTypeOf<FounderActivity>().not.toHaveProperty("payload");
  });
});
