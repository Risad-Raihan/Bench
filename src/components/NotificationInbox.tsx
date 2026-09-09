"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ActionButton } from "../../design-system/components/decisions/DecisionRow.jsx";
import { CheckCheck } from "lucide-react";
import { ActivityFeed } from "@/components/ActivityFeed";
import {
  markAllReadAction,
  markReadAction,
} from "@/lib/activity/actions";
import type { ActivityRowView } from "@/lib/activity/view";

export function NotificationInbox({
  items,
  unread,
}: {
  items: ActivityRowView[];
  unread: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        width: 360,
        maxHeight: 420,
        overflow: "auto",
        background: "var(--bg2)",
        border: "1px solid var(--line)",
        borderRadius: 3,
        boxShadow: "var(--shadow-menu)",
        zIndex: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "11px 13px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "var(--faint)",
          }}
        >
          Notifications
        </span>
        {unread > 0 ? (
          <ActionButton
            icon={CheckCheck}
            accent={false}
            onClick={() => {
              if (pending) return;
              startTransition(async () => {
                await markAllReadAction();
                router.refresh();
              });
            }}
          >
            Mark all read
          </ActionButton>
        ) : null}
      </div>
      <ActivityFeed
        items={items}
        compact
        emptyLabel="Nothing directed at you"
        emptyHint="Assigned work, mentions and screening calls land here."
        onSelect={(item) => {
          if (pending) return;
          startTransition(async () => {
            if (item.unread) await markReadAction(item.id);
            router.refresh();
            if (item.href) router.push(item.href);
          });
        }}
      />
    </div>
  );
}
