import { describe, expect, test } from "vitest";
import { flattenToPlainText, shouldSnapshot } from "./save";

const MIN = 60_000;

const doc = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "What we agreed" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Talked with " },
        { type: "mention", attrs: { id: "v-immi", label: "ImmiClaw" } },
        { type: "text", text: " about exclusivity." },
      ],
    },
    { type: "task", attrs: { taskId: "t-1" } },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The exclusivity ask is the real negotiation.",
            },
          ],
        },
      ],
    },
  ],
};

describe("flattenToPlainText", () => {
  test("joins headings, mention labels, and quotes; skips task nodes", () => {
    expect(flattenToPlainText(doc)).toBe(
      [
        "What we agreed",
        "Talked with ImmiClaw about exclusivity.",
        "The exclusivity ask is the real negotiation.",
      ].join("\n\n"),
    );
  });

  test("empty or unknown docs flatten to an empty string", () => {
    expect(flattenToPlainText(null)).toBe("");
    expect(flattenToPlainText({})).toBe("");
    expect(flattenToPlainText({ type: "doc", content: [] })).toBe("");
  });
});

describe("shouldSnapshot", () => {
  const now = new Date("2026-09-06T12:00:00.000Z");

  test("true on blur when the doc has changes", () => {
    expect(
      shouldSnapshot({
        reason: "blur",
        hasChanges: true,
        since: new Date("2026-09-06T11:59:50.000Z"),
        now,
      }),
    ).toBe(true);
  });

  test("false on blur when nothing changed", () => {
    expect(
      shouldSnapshot({
        reason: "blur",
        hasChanges: false,
        since: new Date("2026-09-06T11:00:00.000Z"),
        now,
      }),
    ).toBe(false);
  });

  test("true on the 5-minute continuous-editing threshold", () => {
    expect(
      shouldSnapshot({
        reason: "interval",
        hasChanges: true,
        since: new Date(now.getTime() - 5 * MIN),
        now,
      }),
    ).toBe(true);
  });

  test("false before the 5-minute threshold", () => {
    expect(
      shouldSnapshot({
        reason: "interval",
        hasChanges: true,
        since: new Date(now.getTime() - 5 * MIN + 1),
        now,
      }),
    ).toBe(false);
  });

  test("false on interval when nothing changed, even after 5 minutes", () => {
    expect(
      shouldSnapshot({
        reason: "interval",
        hasChanges: false,
        since: new Date(now.getTime() - 10 * MIN),
        now,
      }),
    ).toBe(false);
  });
});
