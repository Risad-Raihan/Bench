import { describe, expect, test } from "vitest";
import { deriveAccessStatus } from "./status";

const now = new Date("2026-09-05T12:00:00.000Z");

describe("deriveAccessStatus", () => {
  test("invited — row exists, never signed in, not disabled", () => {
    expect(deriveAccessStatus({ lastSignInAt: null, disabledAt: null })).toBe(
      "invited",
    );
  });

  test("active — has signed in and is not disabled", () => {
    expect(deriveAccessStatus({ lastSignInAt: now, disabledAt: null })).toBe(
      "active",
    );
  });

  test("disabled — disabled_at is set, even if they have signed in", () => {
    expect(deriveAccessStatus({ lastSignInAt: now, disabledAt: now })).toBe(
      "disabled",
    );
    expect(deriveAccessStatus({ lastSignInAt: null, disabledAt: now })).toBe(
      "disabled",
    );
  });
});
