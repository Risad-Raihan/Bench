import { describe, expect, test } from "vitest";
import { isInternalUser, resolveCurrentUser } from "./resolve";

const partner = { userId: "u-partner", role: "partner" as const };
const founder = { userId: "u-founder", role: "founder" as const };
const memberships = [
  { ventureId: "v-a" },
  { ventureId: "v-b" },
];

describe("resolveCurrentUser", () => {
  test("partners bypass scoping — ventureIds is empty regardless of memberships", () => {
    expect(resolveCurrentUser(partner, memberships)).toEqual({
      id: "u-partner",
      role: "partner",
      ventureIds: [],
    });
    expect(resolveCurrentUser(partner, [])).toEqual({
      id: "u-partner",
      role: "partner",
      ventureIds: [],
    });
  });

  test("admin and viewer are internal roles and also bypass scoping", () => {
    expect(
      resolveCurrentUser({ userId: "u-admin", role: "admin" }, memberships)
        .ventureIds,
    ).toEqual([]);
    expect(
      resolveCurrentUser({ userId: "u-viewer", role: "viewer" }, memberships)
        .ventureIds,
    ).toEqual([]);
  });

  test("founders are restricted to their venture_members rows", () => {
    expect(resolveCurrentUser(founder, memberships)).toEqual({
      id: "u-founder",
      role: "founder",
      ventureIds: ["v-a", "v-b"],
    });
    expect(resolveCurrentUser(founder, [])).toEqual({
      id: "u-founder",
      role: "founder",
      ventureIds: [],
    });
  });
});

describe("isInternalUser", () => {
  test("partners, admins and viewers are internal", () => {
    expect(isInternalUser({ id: "u", role: "partner", ventureIds: [] })).toBe(
      true,
    );
    expect(isInternalUser({ id: "u", role: "admin", ventureIds: [] })).toBe(
      true,
    );
    expect(isInternalUser({ id: "u", role: "viewer", ventureIds: [] })).toBe(
      true,
    );
  });

  test("founders are not internal", () => {
    expect(
      isInternalUser({ id: "u", role: "founder", ventureIds: ["v-a"] }),
    ).toBe(false);
  });
});
