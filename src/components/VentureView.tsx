"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BackStrip } from "../../design-system/components/chrome/BackStrip.jsx";
import {
  GateRail,
  VentureHeader,
  VentureTabs,
} from "../../design-system/components/venture/VentureHeader.jsx";
import {
  KanbanColumn,
  Lane,
  TaskCard,
} from "../../design-system/components/kanban/TaskCard.jsx";
import { EmptyState } from "../../design-system/components/layout/Panel.jsx";
import { PageContainer } from "@/components/PageContainer";

export interface VentureTaskCardData {
  id: string;
  title: string;
  who: string;
  due?: string;
  note?: string;
  fromNote?: boolean;
  done?: boolean;
}

export interface VentureLaneData {
  key: string;
  label: string;
  color: string;
  count: number;
  columns: { key: string; label: string; tasks: VentureTaskCardData[] }[];
}

export interface VentureSwitchTarget {
  slug: string;
  name: string;
  color: string;
}

export interface VentureGate {
  stage: string;
  label: string;
  state?: "done" | "now";
}

export interface VentureTabData {
  label: string;
  count?: number;
}

const EMPTY_STATE_COPY: Record<string, { label: string; hint: string }> = {
  Overview: {
    label: "Nothing here yet",
    hint: "Facts, links and recent activity for the venture will appear here.",
  },
  Docs: {
    label: "No docs yet",
    hint: "Drop a file above, or connect the venture's Drive folder.",
  },
  Notes: {
    label: "No notes yet",
    hint: "Notes mentioning this venture will appear here.",
  },
  Calendar: {
    label: "No events yet",
    hint: "Meetings synced from Google Calendar will appear here.",
  },
  Decisions: {
    label: "No decisions yet",
    hint: "Decisions made for this venture will appear here.",
  },
};

export function VentureView({
  slug,
  name,
  color,
  sub,
  tags,
  stageLabel,
  stageMeta,
  gates,
  tabs,
  switchTargets,
  lanes,
}: {
  slug: string;
  name: string;
  color: string;
  sub: string;
  tags: { label: string; hot?: boolean }[];
  stageLabel: string;
  stageMeta: string;
  gates: VentureGate[];
  tabs: VentureTabData[];
  switchTargets: VentureSwitchTarget[];
  lanes: VentureLaneData[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState("Overview");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!switcherOpen) return;
    const away = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSwitcherOpen(false);
    };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [switcherOpen]);

  const emptyCopy = EMPTY_STATE_COPY[tab];

  return (
    <>
      <div ref={switcherRef} style={{ position: "relative" }}>
        <BackStrip
          current={name}
          color={color}
          onBack={() => router.push("/")}
          onSwitch={() => setSwitcherOpen((o) => !o)}
        />
        {switcherOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 16,
              minWidth: 200,
              background: "var(--bg2)",
              border: "1px solid var(--line)",
              borderRadius: 3,
              boxShadow: "0 12px 28px rgba(0,0,0,.55)",
              padding: "4px 0",
              zIndex: 60,
            }}
          >
            {switchTargets.length === 0 && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  padding: "8px 13px",
                  color: "var(--faint)",
                  whiteSpace: "nowrap",
                }}
              >
                No other ventures
              </div>
            )}
            {switchTargets.map((v) => (
              <SwitcherRow
                key={v.slug}
                venture={v}
                onSelect={() => {
                  setSwitcherOpen(false);
                  router.push(`/v/${v.slug}`);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <VentureHeader
        name={name}
        color={color}
        sub={sub}
        tags={tags}
        stage={stageLabel}
        stageMeta={stageMeta}
      />
      <GateRail gates={gates} />
      <VentureTabs
        tabs={tabs}
        active={tab}
        onSelect={setTab}
        scope={`${name} only`}
        accent={color}
      />
      {tab === "Tasks" ? (
        <div style={{ padding: 14 }}>
          {lanes.map((lane, i) => (
            <Lane key={lane.key} name={lane.label} color={lane.color} count={lane.count} rise={i}>
              {lane.columns.map((col) => (
                <KanbanColumn key={col.key} label={col.label}>
                  {col.tasks.map((t) => (
                    <TaskCard
                      key={t.id}
                      title={t.title}
                      who={t.who}
                      due={t.due}
                      note={t.note}
                      fromNote={t.fromNote}
                      done={t.done}
                      color={lane.color}
                    />
                  ))}
                </KanbanColumn>
              ))}
            </Lane>
          ))}
        </div>
      ) : (
        <PageContainer>
          <EmptyState hint={emptyCopy.hint}>{emptyCopy.label}</EmptyState>
        </PageContainer>
      )}
    </>
  );
}

function SwitcherRow({
  venture,
  onSelect,
}: {
  venture: VentureSwitchTarget;
  onSelect: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        padding: "8px 13px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        color: hov ? "var(--ink)" : "var(--faint)",
        background: hov ? "var(--copper-wash)" : "transparent",
        transition: "color var(--dur-fast),background var(--dur-fast)",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 2,
          background: venture.color,
          flex: "none",
        }}
      />
      {venture.name}
    </div>
  );
}
