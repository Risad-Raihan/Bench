import { describe, expect, test } from "vitest";
import {
  canSupersede,
  chainHead,
  isSuperseded,
  resolveVersionChain,
  type DocVersion,
} from "./versions";

function row(
  id: string,
  supersedesId: string | null,
  archivedAt: Date | null = null,
): DocVersion {
  return { id, supersedesId, archivedAt };
}

describe("resolveVersionChain", () => {
  test("orders a 3-deep chain newest to oldest regardless of input order", () => {
    const v1 = row("v1", null);
    const v2 = row("v2", "v1");
    const v3 = row("v3", "v2");

    expect(resolveVersionChain([v1, v3, v2]).map((d) => d.id)).toEqual([
      "v3",
      "v2",
      "v1",
    ]);
  });
});

describe("chainHead", () => {
  test("returns the live tip of the chain", () => {
    const rows = [row("v1", null), row("v2", "v1"), row("v3", "v2")];
    expect(chainHead(rows)?.id).toBe("v3");
  });

  test("ignores archived supersessors so the prior version resurfaces", () => {
    const rows = [
      row("v1", null),
      row("v2", "v1"),
      row("v3", "v2", new Date("2026-09-06T12:00:00.000Z")),
    ];
    expect(chainHead(rows)?.id).toBe("v2");
    expect(isSuperseded(rows[1]!, rows)).toBe(false);
  });
});

describe("linearity guard", () => {
  test("rejects a second supersessor of the same parent", () => {
    const v1 = row("v1", null);
    const v2 = row("v2", "v1");
    expect(canSupersede("v1", [v1, v2])).toBe(false);
    expect(canSupersede("v2", [v1, v2])).toBe(true);
  });

  test("archived supersessor does not block a new version of that parent", () => {
    const v1 = row("v1", null);
    const v2 = row("v2", "v1", new Date("2026-09-06T12:00:00.000Z"));
    expect(canSupersede("v1", [v1, v2])).toBe(true);
  });
});
