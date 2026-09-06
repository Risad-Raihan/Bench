import { describe, expect, test } from "vitest";
import { formatActivityText } from "./text";
import { toActivityRowView } from "./view";

describe("formatActivityText", () => {
  test("renders a stage move from payload stages", () => {
    expect(
      formatActivityText({
        verb: "updated",
        entity: "venture",
        ventureName: "ImmiClaw",
        payload: { fromStage: "meet", toStage: "validate" },
      }),
    ).toBe("Moved ImmiClaw from Meet to Validate");
  });

  test("renders directed verbs with actor-facing entity copy", () => {
    expect(
      formatActivityText({
        verb: "assigned",
        entity: "task",
        ventureName: "ImmiClaw",
        payload: {},
      }),
    ).toBe("Assigned a task");
    expect(
      formatActivityText({
        verb: "cleared",
        entity: "venture",
        ventureName: "ImmiClaw",
        payload: { label: "Founder call logged" },
      }),
    ).toBe("Cleared gate Founder call logged");
    expect(
      formatActivityText({
        verb: "passed",
        entity: "venture",
        ventureName: null,
        payload: { companyName: "Northwind" },
      }),
    ).toBe("Passed Northwind");
  });
});

describe("toActivityRowView", () => {
  test("uses actor initials, venture colour, and activity copy", () => {
    const row = toActivityRowView(
      {
        id: "a1",
        verb: "assigned",
        entity: "task",
        actorInitials: "AA",
        ventureName: "ImmiClaw",
        ventureColor: "var(--magenta)",
        ventureSlug: "immi",
        payload: {},
        createdAt: new Date("2026-09-06T12:00:00Z"),
      },
      new Date("2026-09-06T14:00:00Z"),
    );
    expect(row.who).toBe("AA");
    expect(row.text).toBe("Assigned a task");
    expect(row.when).toBe("2H");
    expect(row.color).toBe("var(--magenta)");
    expect(row.href).toBe("/v/immi");
  });

  test("unread rows use amber so the inbox marks what still needs a look", () => {
    const row = toActivityRowView(
      {
        id: "n1",
        verb: "uploaded",
        entity: "doc",
        actorInitials: "AA",
        ventureName: "ImmiClaw",
        ventureColor: "var(--magenta)",
        ventureSlug: "immi",
        payload: { name: "deck.pdf" },
        createdAt: new Date("2026-09-06T12:00:00Z"),
      },
      new Date("2026-09-06T12:00:30Z"),
      { unread: true },
    );
    expect(row.unread).toBe(true);
    expect(row.color).toBe("var(--amber)");
    expect(row.text).toBe("Uploaded deck.pdf");
    expect(row.when).toBe("NOW");
  });
});
