import { describe, expect, test } from "vitest";
import { groupByDueDate, type MyWorkTask } from "./my-work";

const NOW = new Date(2026, 8, 6, 12, 0, 0); // 6 Sep 2026

function task(partial: Partial<MyWorkTask> & Pick<MyWorkTask, "id">): MyWorkTask {
  return {
    title: partial.id,
    status: "todo",
    dueDate: null,
    position: 1000,
    ventureId: "v-immi",
    ventureName: "ImmiClaw",
    ventureColor: "var(--magenta)",
    ventureSlug: "immiclaw",
    lane: "tech",
    ...partial,
  };
}

function idsIn(
  groups: ReturnType<typeof groupByDueDate>,
  label: string,
): string[] {
  return groups.find((g) => g.label === label)?.items.map((t) => t.id) ?? [];
}

describe("groupByDueDate", () => {
  test("places boundary dates in Overdue / Today / This week / Later / No due date", () => {
    const groups = groupByDueDate(
      [
        task({ id: "overdue", dueDate: "2026-09-05" }),
        task({ id: "today", dueDate: "2026-09-06" }),
        task({ id: "week", dueDate: "2026-09-13" }),
        task({ id: "later", dueDate: "2026-09-14" }),
        task({ id: "none", dueDate: null }),
      ],
      NOW,
    );

    expect(groups.map((g) => g.label)).toEqual([
      "Overdue",
      "Today",
      "This week",
      "Later",
      "No due date",
    ]);
    expect(idsIn(groups, "Overdue")).toEqual(["overdue"]);
    expect(idsIn(groups, "Today")).toEqual(["today"]);
    expect(idsIn(groups, "This week")).toEqual(["week"]);
    expect(idsIn(groups, "Later")).toEqual(["later"]);
    expect(idsIn(groups, "No due date")).toEqual(["none"]);
  });

  test("within a group, doing then blocked then todo, then due date, then position", () => {
    const groups = groupByDueDate(
      [
        task({ id: "todo-late", status: "todo", dueDate: "2026-09-06", position: 1000 }),
        task({ id: "blocked", status: "blocked", dueDate: "2026-09-06", position: 2000 }),
        task({ id: "doing", status: "doing", dueDate: "2026-09-06", position: 3000 }),
        task({ id: "todo-earlier-due", status: "todo", dueDate: "2026-09-04", position: 4000 }),
        task({ id: "todo-later-pos", status: "todo", dueDate: "2026-09-04", position: 5000 }),
      ],
      NOW,
    );

    expect(idsIn(groups, "Today")).toEqual(["doing", "blocked", "todo-late"]);
    expect(idsIn(groups, "Overdue")).toEqual([
      "todo-earlier-due",
      "todo-later-pos",
    ]);
  });

  test("done tasks are excluded from every group", () => {
    const groups = groupByDueDate(
      [
        task({ id: "open", dueDate: "2026-09-06" }),
        task({ id: "done-today", status: "done", dueDate: "2026-09-06" }),
        task({ id: "done-none", status: "done", dueDate: null }),
      ],
      NOW,
    );

    expect(groups.flatMap((g) => g.items.map((t) => t.id))).toEqual(["open"]);
  });

  test("unfiled tasks are labelled Personal; ventured tasks keep the venture name", () => {
    const groups = groupByDueDate(
      [
        task({
          id: "filed",
          dueDate: "2026-09-06",
          ventureId: "v-immi",
          ventureName: "ImmiClaw",
        }),
        task({
          id: "unfiled",
          dueDate: "2026-09-06",
          ventureId: null,
          ventureName: null,
        }),
      ],
      NOW,
    );

    const items = groups.find((g) => g.label === "Today")?.items ?? [];
    expect(items.find((t) => t.id === "filed")?.ventureLabel).toBe("ImmiClaw");
    expect(items.find((t) => t.id === "unfiled")?.ventureLabel).toBe("Personal");
  });
});
