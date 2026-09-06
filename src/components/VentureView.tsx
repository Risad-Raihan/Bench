"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { BackStrip } from "../../design-system/components/chrome/BackStrip.jsx";
import {
  GateRail,
  VentureHeader,
  VentureTabs,
} from "../../design-system/components/venture/VentureHeader.jsx";
import { EmptyState, Panel } from "../../design-system/components/layout/Panel.jsx";
import { ActionButton, DecisionRow } from "../../design-system/components/decisions/DecisionRow.jsx";
import { ChecklistRow } from "../../design-system/components/data/FactRow.jsx";
import { PageContainer } from "@/components/PageContainer";
import { MoveStageModal } from "@/components/MoveStageModal";
import { ActivityFeed } from "@/components/ActivityFeed";
import {
  TasksBoard,
  type AssignablePartner,
} from "@/components/TasksBoard";
import { DocsView, type DocsTabFile } from "@/components/DocsView";
import { createNoteAction } from "@/lib/notes/actions";
import { toggleGateAction } from "@/lib/gates/actions";
import { moveStageAction } from "@/lib/stages/actions";
import { reasonRequired } from "@/lib/stages/reason";
import { STAGES, stageLabel as labelForStage, type Stage } from "@/lib/pipeline-stages";
import type { Priority } from "@/lib/data/tasks";
import type { Lane, TaskStatus } from "@/lib/lanes";
import type { ActivityRowView } from "@/lib/activity/view";

export interface VentureTaskCardData {
  id: string;
  title: string;
  description: string | null;
  lane: Lane;
  status: TaskStatus;
  priority: Priority;
  who: string;
  assigneeId: string | null;
  dueDate: string | null;
  due?: string;
  note?: string;
  fromNote?: boolean;
  done?: boolean;
}

export interface VentureLaneData {
  key: Lane;
  label: string;
  color: string;
  count: number;
  columns: { key: TaskStatus; label: string; tasks: VentureTaskCardData[] }[];
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

export interface VentureGateItem {
  id: string;
  label: string;
  done: boolean;
  by: string;
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
    hint: "Notes owned by this venture will appear here.",
  },
  Calendar: {
    label: "No events yet",
    hint: "Meetings synced from Google Calendar will appear here.",
  },
  Decisions: {
    label: "No decisions yet",
    hint: "Decisions made for this venture will appear here.",
  },
  Activity: {
    label: "No activity yet",
    hint: "Actions on this venture will appear here.",
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
  currentStage,
  openGateCount,
  gates,
  checklist,
  tabs,
  switchTargets,
  lanes,
  ventureId,
  partners,
  notes,
  mentionedNotes,
  decisions,
  docs,
  activity,
  partner = true,
}: {
  slug: string;
  name: string;
  color: string;
  sub: string;
  tags: { label: string; hot?: boolean }[];
  stageLabel: string;
  stageMeta: string;
  currentStage: Stage;
  openGateCount: number;
  gates: VentureGate[];
  checklist: VentureGateItem[];
  tabs: VentureTabData[];
  switchTargets: VentureSwitchTarget[];
  lanes: VentureLaneData[];
  ventureId: string;
  partners: AssignablePartner[];
  notes: { id: string; title: string }[];
  mentionedNotes?: { id: string; title: string }[];
  decisions?: {
    id: string;
    title: string;
    date: string;
    who: string;
    source?: string;
    rationale?: string | null;
    sourceNoteId?: string | null;
  }[];
  docs?: DocsTabFile[];
  activity?: ActivityRowView[];
  partner?: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState("Overview");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const [pendingMove, setPendingMove] = useState<Stage | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

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

  const runMove = (toStage: Stage, reason: string | null) => {
    if (busy) return;
    setMoveError(null);
    startTransition(async () => {
      const result = await moveStageAction({
        ventureId,
        slug,
        toStage,
        reason,
      });
      if (!result.ok) {
        setMoveError(result.error);
        return;
      }
      setPendingMove(null);
      router.refresh();
    });
  };

  const requestMove = (toStage: Stage) => {
    if (toStage === currentStage) return;
    if (reasonRequired(currentStage, toStage, openGateCount)) {
      setMoveError(null);
      setPendingMove(toStage);
      return;
    }
    runMove(toStage, null);
  };

  return (
    <>
      <div ref={switcherRef} style={{ position: "relative" }}>
        <BackStrip
          current={name}
          color={color}
          onBack={() => router.push(partner ? "/" : `/v/${slug}`)}
          onSwitch={partner ? () => setSwitcherOpen((o) => !o) : undefined}
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
      {partner ? (
        <GateRail
          gates={gates}
          onSelect={(label: string) => {
            const target = STAGES.find((s) => s.label === label);
            if (target) requestMove(target.stage);
          }}
        />
      ) : null}
      <VentureTabs
        tabs={tabs}
        active={tab}
        onSelect={setTab}
        scope={`${name} only`}
        accent={color}
      />
      {tab === "Tasks" && partner ? (
        <TasksBoard
          slug={slug}
          ventureId={ventureId}
          lanes={lanes}
          partners={partners}
        />
      ) : tab === "Notes" ? (
        <VentureNotesList
          slug={slug}
          color={color}
          ventureId={ventureId}
          notes={notes}
          mentioned={mentionedNotes ?? []}
          canCreate={partner}
        />
      ) : tab === "Docs" ? (
        <DocsView
          slug={slug}
          ventureId={ventureId}
          files={docs ?? []}
          sharedOnly={!partner}
        />
      ) : tab === "Decisions" ? (
        <VentureDecisionsList
          decisions={decisions ?? []}
          onOpenSource={(noteId) => router.push(`/notes?n=${noteId}`)}
        />
      ) : tab === "Activity" ? (
        <PageContainer>
          <ActivityFeed
            items={activity ?? []}
            emptyLabel="No activity yet"
            emptyHint="Actions on this venture will appear here."
          />
        </PageContainer>
      ) : tab === "Overview" && partner && checklist.length > 0 ? (
        <OverviewGates
          slug={slug}
          stageLabel={stageLabel}
          checklist={checklist}
        />
      ) : (
        <PageContainer>
          <EmptyState hint={emptyCopy.hint}>{emptyCopy.label}</EmptyState>
        </PageContainer>
      )}
      {moveError && !pendingMove ? (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".06em",
            color: "var(--amber)",
            padding: "var(--sp-8) var(--sp-22)",
          }}
        >
          {moveError}
        </div>
      ) : null}
      {pendingMove ? (
        <MoveStageModal
          name={name}
          toLabel={labelForStage(pendingMove)}
          pending={busy}
          error={moveError}
          onConfirm={(reason) => runMove(pendingMove, reason)}
          onClose={() => {
            setPendingMove(null);
            setMoveError(null);
          }}
        />
      ) : null}
    </>
  );
}

function OverviewGates({
  slug,
  stageLabel,
  checklist,
}: {
  slug: string;
  stageLabel: string;
  checklist: VentureGateItem[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const done = checklist.filter((g) => g.done).length;

  return (
    <div style={{ padding: "var(--sp-14) var(--sp-22) var(--sp-22)" }}>
      <Panel
        label={`${stageLabel} gates`}
        right={`${done}/${checklist.length}`}
      >
        {checklist.map((g) => (
          <ChecklistRow
            key={g.id}
            label={g.label}
            by={g.by}
            done={g.done}
            onToggle={() => {
              if (pending) return;
              setError(null);
              startTransition(async () => {
                const result = await toggleGateAction({
                  gateItemId: g.id,
                  slug,
                });
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                router.refresh();
              });
            }}
          />
        ))}
      </Panel>
      {error ? (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".06em",
            color: "var(--amber)",
            marginTop: "var(--sp-8)",
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
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

function VentureNotesList({
  slug,
  color,
  ventureId,
  notes,
  mentioned,
  canCreate,
}: {
  slug: string;
  color: string;
  ventureId: string;
  notes: { id: string; title: string }[];
  mentioned: { id: string; title: string }[];
  canCreate: boolean;
}) {
  const router = useRouter();

  async function onCreate() {
    const result = await createNoteAction({ ventureId, slug });
    if (result.ok) router.push(`/notes?n=${result.id}`);
  }

  if (notes.length === 0 && mentioned.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          hint="Notes owned by this venture will appear here."
          action={canCreate ? "+ New note" : undefined}
          onAction={canCreate ? () => void onCreate() : undefined}
        >
          No notes yet
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {canCreate ? (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 11 }}>
          <ActionButton onClick={() => void onCreate()}>+ New note</ActionButton>
        </div>
      ) : null}
      {notes.length > 0 && mentioned.length > 0 && (
        <NoteGroupHeader>Owned</NoteGroupHeader>
      )}
      {notes.map((note) => (
        <VentureNoteRow
          key={note.id}
          title={note.title}
          color={color}
          onOpen={() => router.push(`/notes?n=${note.id}`)}
        />
      ))}
      {mentioned.length > 0 && <NoteGroupHeader>Mentioned</NoteGroupHeader>}
      {mentioned.map((note) => (
        <VentureNoteRow
          key={note.id}
          title={note.title}
          color={color}
          onOpen={() => router.push(`/notes?n=${note.id}`)}
        />
      ))}
    </PageContainer>
  );
}

function NoteGroupHeader({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-11)",
        letterSpacing: "var(--ls-mono-caps-wide)",
        textTransform: "uppercase",
        color: "var(--faint)",
        padding: "12px 22px 7px",
      }}
    >
      {children}
    </div>
  );
}

function VentureDecisionsList({
  decisions,
  onOpenSource,
}: {
  decisions: {
    id: string;
    title: string;
    date: string;
    who: string;
    source?: string;
    rationale?: string | null;
    sourceNoteId?: string | null;
  }[];
  onOpenSource: (noteId: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (decisions.length === 0) {
    return (
      <PageContainer>
        <EmptyState hint="Decisions made for this venture will appear here.">
          No decisions yet
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {decisions.map((row) => (
        <DecisionRow
          key={row.id}
          decision={row.title}
          date={row.date}
          who={row.who}
          source={row.source}
          rationale={row.rationale ?? undefined}
          expanded={openId === row.id}
          onToggle={() => setOpenId((id) => (id === row.id ? null : row.id))}
          onOpenSource={
            row.sourceNoteId
              ? () => onOpenSource(row.sourceNoteId as string)
              : undefined
          }
        />
      ))}
    </PageContainer>
  );
}

function VentureNoteRow({
  title,
  color,
  onOpen,
}: {
  title: string;
  color: string;
  onOpen: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "11px 22px",
        borderBottom: "1px solid var(--divider)",
        cursor: "pointer",
        fontSize: 13.5,
        background: hov ? "var(--hover-row)" : undefined,
        transition: "background var(--dur-instant)",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: 1,
          background: color,
          flex: "none",
        }}
      />
      {title || "Untitled"}
    </div>
  );
}
