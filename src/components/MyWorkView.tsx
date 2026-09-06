"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../design-system/components/chrome/PageHeader.jsx";
import { EmptyState } from "../../design-system/components/layout/Panel.jsx";
import {
  FilterBar,
  GroupHeader,
  TaskRow,
} from "../../design-system/components/work/TaskRow.jsx";
import type { DueGroupLabel } from "@/lib/my-work";
import type { Lane, TaskStatus } from "@/lib/lanes";

const FILTERS = ["All", "Tech", "Capital", "Blocked", "No date"] as const;
type Filter = (typeof FILTERS)[number];

export type MyWorkRowView = {
  id: string;
  title: string;
  venture: string;
  ventureColor: string;
  ventureSlug: string | null;
  lane: string;
  laneKey: Lane;
  laneColor: string;
  date: string;
  late: boolean;
  status: TaskStatus;
  hasDueDate: boolean;
};

export type MyWorkGroupView = {
  label: DueGroupLabel;
  hot?: boolean;
  items: MyWorkRowView[];
};

function matchesFilter(row: MyWorkRowView, filter: Filter): boolean {
  if (filter === "All") return true;
  if (filter === "Tech") return row.laneKey === "tech";
  if (filter === "Capital") return row.laneKey === "capital";
  if (filter === "Blocked") return row.status === "blocked";
  return !row.hasDueDate;
}

export function MyWorkView({
  title,
  meta,
  groups,
}: {
  title: string;
  meta: string;
  groups: MyWorkGroupView[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
          items: g.items.filter((row) => matchesFilter(row, filter)),
        }))
        .filter((g) => g.items.length > 0),
    [groups, filter],
  );

  const open = groups.reduce((n, g) => n + g.items.length, 0);
  const shown = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <PageHeader
        title={title}
        meta={meta}
        right={
          <FilterBar
            filters={[...FILTERS]}
            active={filter}
            onSelect={(f: string) => setFilter(f as Filter)}
          />
        }
      />
      {shown === 0 && (
        <div style={{ padding: 22 }}>
          <EmptyState
            hint={
              open
                ? `Clear the filter to see the other ${open} open across every venture.`
                : "Nothing is assigned to you right now."
            }
            action={filter === "All" ? undefined : "Show all"}
            onAction={() => setFilter("All")}
          >
            {filter === "All"
              ? "No open tasks"
              : filter === "Blocked"
                ? "Nothing blocked"
                : filter === "No date"
                  ? "Everything you own has a date"
                  : `No ${filter} tasks assigned to you`}
          </EmptyState>
        </div>
      )}
      {filtered.map((g) => (
        <section key={g.label}>
          <GroupHeader label={g.label} count={g.items.length} hot={g.hot} />
          {g.items.map((row) => (
            <TaskRow
              key={row.id}
              title={row.title}
              venture={row.venture}
              ventureColor={row.ventureColor}
              lane={row.lane}
              laneColor={row.laneColor}
              date={row.date}
              late={row.late}
              onClick={() => {
                if (row.ventureSlug) router.push(`/v/${row.ventureSlug}`);
              }}
            />
          ))}
        </section>
      ))}
    </>
  );
}
