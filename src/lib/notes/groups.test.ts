import { describe, expect, test } from "vitest";
import { groupVentureNotes } from "./groups";

describe("groupVentureNotes", () => {
  test("keeps owned notes separate from mentioned notes", () => {
    expect(
      groupVentureNotes({
        owned: [{ id: "n-own", title: "Call with Tunde" }],
        mentioned: [{ id: "n-other", title: "Studio weekly" }],
      }),
    ).toEqual({
      owned: [{ id: "n-own", title: "Call with Tunde" }],
      mentioned: [{ id: "n-other", title: "Studio weekly" }],
    });
  });

  test("drops a self-mention from Mentioned so the note is not listed twice", () => {
    expect(
      groupVentureNotes({
        owned: [{ id: "n-own", title: "Call with Tunde" }],
        mentioned: [
          { id: "n-own", title: "Call with Tunde" },
          { id: "n-other", title: "Studio weekly" },
        ],
      }),
    ).toEqual({
      owned: [{ id: "n-own", title: "Call with Tunde" }],
      mentioned: [{ id: "n-other", title: "Studio weekly" }],
    });
  });
});
