import { describe, expect, test } from "vitest";
import { initialsFromName } from "./initials";

describe("initialsFromName", () => {
  test("uses the first letter of a single-word name", () => {
    expect(initialsFromName("Jane")).toBe("J");
  });

  test("uses the first letter of the first two words", () => {
    expect(initialsFromName("Jane Q. Public")).toBe("JQ");
  });

  test("falls back to ? when the name is empty", () => {
    expect(initialsFromName("")).toBe("?");
    expect(initialsFromName("   ")).toBe("?");
  });
});
