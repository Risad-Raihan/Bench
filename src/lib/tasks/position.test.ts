import { describe, expect, test } from "vitest";
import {
  needsRebalance,
  positionBetween,
  rebalance,
} from "./position";

describe("positionBetween", () => {
  test("empty cell uses the default gap", () => {
    expect(positionBetween()).toBe(1000);
    expect(positionBetween(undefined, undefined)).toBe(1000);
  });

  test("one neighbour at the top of a cell sits halfway before it", () => {
    expect(positionBetween(undefined, 1000)).toBe(500);
    expect(positionBetween(undefined, 2000)).toBe(1000);
  });

  test("one neighbour at the bottom of a cell sits a full gap after it", () => {
    expect(positionBetween(1000)).toBe(2000);
    expect(positionBetween(2500, undefined)).toBe(3500);
  });

  test("two neighbours average to the midpoint", () => {
    expect(positionBetween(1000, 2000)).toBe(1500);
    expect(positionBetween(1000, 1000.5)).toBe(1000.25);
  });
});

describe("needsRebalance", () => {
  test("false when every gap is at or above 0.0001", () => {
    expect(needsRebalance([])).toBe(false);
    expect(needsRebalance([1000])).toBe(false);
    expect(needsRebalance([1000, 2000, 3000])).toBe(false);
    // 0 + 0.0001 is bit-identical to the threshold, so this is "at" not below.
    expect(needsRebalance([0, 0.0001])).toBe(false);
  });

  test("true when any consecutive gap drops below 0.0001", () => {
    expect(needsRebalance([1, 1.00009])).toBe(true);
    expect(needsRebalance([1000, 1000.00005, 2000])).toBe(true);
    expect(needsRebalance([1, 1])).toBe(true);
  });
});

describe("rebalance", () => {
  test("returns evenly spaced, strictly increasing positions and keeps order", () => {
    const input = [
      { id: "c", position: 3.2 },
      { id: "a", position: 1 },
      { id: "b", position: 1.00005 },
    ];
    const out = rebalance(input);
    expect(out.map((t) => t.id)).toEqual(["a", "b", "c"]);
    expect(out.map((t) => t.position)).toEqual([1000, 2000, 3000]);
    for (let i = 1; i < out.length; i++) {
      expect(out[i].position).toBeGreaterThan(out[i - 1].position);
      expect(out[i].position - out[i - 1].position).toBe(1000);
    }
  });

  test("empty and single-item cells stay well-formed", () => {
    expect(rebalance([])).toEqual([]);
    expect(rebalance([{ id: "a", position: 12 }])).toEqual([
      { id: "a", position: 1000 },
    ]);
  });

  test("equal positions keep original order", () => {
    const out = rebalance([
      { id: "first", position: 5 },
      { id: "second", position: 5 },
    ]);
    expect(out.map((t) => t.id)).toEqual(["first", "second"]);
    expect(out[0].position).toBeLessThan(out[1].position);
  });
});
