"use client";

import { ActivityRow } from "../../design-system/components/data/FactRow.jsx";
import { EmptyState } from "../../design-system/components/layout/Panel.jsx";
import type { ActivityRowView } from "@/lib/activity/view";

export function ActivityFeed({
  items,
  compact = false,
  emptyLabel = "No activity yet",
  emptyHint = "Actions on this venture will appear here.",
  onSelect,
}: {
  items: ActivityRowView[];
  compact?: boolean;
  emptyLabel?: string;
  emptyHint?: string;
  onSelect?: (item: ActivityRowView) => void;
}) {
  if (items.length === 0) {
    return <EmptyState hint={emptyHint}>{emptyLabel}</EmptyState>;
  }

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={onSelect ? () => onSelect(item) : undefined}
          style={{ cursor: onSelect ? "pointer" : undefined }}
        >
          <ActivityRow
            who={item.who}
            text={item.text}
            when={item.when}
            color={item.color}
            compact={compact}
          />
        </div>
      ))}
    </>
  );
}
