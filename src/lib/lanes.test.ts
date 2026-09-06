import { describe, expect, test } from "vitest";
import { isBoardLane, isBoardStatus } from "./lanes";

describe("isBoardLane", () => {
  test("accepts the four board lanes and refuses ops", () => {
    expect(isBoardLane("thesis")).toBe(true);
    expect(isBoardLane("tech")).toBe(true);
    expect(isBoardLane("gtm")).toBe(true);
    expect(isBoardLane("capital")).toBe(true);
    expect(isBoardLane("ops")).toBe(false);
    expect(isBoardLane("")).toBe(false);
  });
});

describe("isBoardStatus", () => {
  test("accepts the four board columns", () => {
    expect(isBoardStatus("todo")).toBe(true);
    expect(isBoardStatus("done")).toBe(true);
    expect(isBoardStatus("archived")).toBe(false);
  });
});
