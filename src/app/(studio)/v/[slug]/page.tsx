import { notFound } from "next/navigation";
import { isInternalUser, requireUser } from "@/lib/auth/current-user";
import { listDocs } from "@/lib/data/docs";
import { listDecisions } from "@/lib/data/decisions";
import { listMentionedNotes, listNotes } from "@/lib/data/notes";
import {
  countEvents,
  getVenture,
  listGateItems,
  listStageEvents,
  listSwitchTargets,
  listVentureTasks,
  type PartnerVenture,
  type PartnerVentureTask,
} from "@/lib/data/ventures";
import { daysSince, isStale, STAGES } from "@/lib/pipeline-stages";
import { ventureColor } from "@/lib/venture-colors";
import { BOARD_COLUMNS, BOARD_LANES } from "@/lib/lanes";
import { formatBytes, formatDayMonth, formatDueDate, typeGlyph } from "@/lib/format";
import { groupVentureNotes } from "@/lib/notes/groups";
import { listAssignablePartners } from "@/lib/data/tasks";
import { listVentureActivity } from "@/lib/data/activity";
import { listVentureAccess } from "@/lib/data/members";
import { toActivityRowView } from "@/lib/activity/view";
import {
  VentureView,
  type VentureGate,
  type VentureLaneData,
} from "@/components/VentureView";

export default async function VenturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await requireUser();
  const partner = isInternalUser(user);
  const { slug } = await params;
  const now = new Date();

  const venture = await getVenture(user, slug);
  if (!venture) notFound();

  const color = ventureColor(venture.color);
  const currentStageIndex = STAGES.findIndex((s) => s.stage === venture.stage);

  const [switchTargets, gateRows, stageEventRows, taskRows, docRows, noteRows, mentionedRows, eventsCount, decisionRows, partners, activityRows, accessRows] =
    await Promise.all([
      listSwitchTargets(user, venture.id),
      listGateItems(user, [venture.id]),
      listStageEvents(user, venture.id),
      listVentureTasks(user, venture.id),
      listDocs(user, venture.id),
      listNotes(user, venture.id),
      listMentionedNotes(user, venture.id),
      countEvents(user, venture.id),
      listDecisions(user, venture.id),
      listAssignablePartners(user),
      listVentureActivity(user, venture.id),
      partner ? listVentureAccess(user, venture.id) : Promise.resolve([]),
    ]);

  /* Gate rail: cleared stages get the date they were left (the createdAt of
     the stage-event that moved the venture into the following stage). No
     event yet -> just "Cleared", never a fabricated date. */
  const clearedDateForStage = (stage: (typeof STAGES)[number]["stage"], index: number) => {
    const nextStage = STAGES[index + 1]?.stage;
    const event = stageEventRows.find((e) => e.toStage === nextStage);
    return event ? `Cleared ${formatDayMonth(event.createdAt)}` : "Cleared";
  };

  const currentStageGates = gateRows.filter((g) => g.stage === venture.stage);
  const doneGateCount = currentStageGates.filter((g) => g.doneAt).length;
  const nextGate = currentStageGates.find((g) => !g.doneAt);
  const totalGates = currentStageGates.length;
  const currentGateLabel =
    totalGates === 0
      ? "No gates set"
      : nextGate
        ? `${nextGate.label}, ${doneGateCount} of ${totalGates}`
        : "All gates cleared";
  const stageMeta = totalGates === 0 ? "—" : `${doneGateCount} of ${totalGates} gates cleared`;

  const gates: VentureGate[] = STAGES.map(({ stage, label }, index) => {
    if (index < currentStageIndex) {
      return { stage: label, label: clearedDateForStage(stage, index), state: "done" };
    }
    if (index === currentStageIndex) {
      return { stage: label, label: currentGateLabel, state: "now" };
    }
    return { stage: label, label: "Locked" };
  });

  const daysInStage = daysSince(venture.stageEnteredAt, now);
  const stale = isStale(venture.stageEnteredAt, now);
  const partnerVenture = venture as PartnerVenture;
  const stakeLabel =
    partner && partnerVenture.equityPct != null
      ? `${Math.round(partnerVenture.equityPct * 100)}% AVL stake`
      : "AVL venture";

  const lanes: VentureLaneData[] = partner
    ? BOARD_LANES.map((lane) => {
        const laneTasks = (taskRows as PartnerVentureTask[]).filter(
          (t) => t.lane === lane.key,
        );
    return {
      key: lane.key,
      label: lane.label,
      color: lane.color,
      count: laneTasks.length,
      columns: BOARD_COLUMNS.map((col) => ({
        key: col.key,
        label: col.label,
        tasks: laneTasks
          .filter((t) => t.status === col.key)
          .map((t) => {
            const fromNote = t.originNoteId != null;
            const due = t.dueDate ? new Date(`${t.dueDate}T00:00:00`) : null;
            const overdue = due != null && t.status !== "done" && due < now;
            return {
              id: t.id,
              title: t.title,
              description: t.description,
              lane: t.lane,
              status: t.status,
              priority: t.priority,
              who: t.assigneeInitials ?? "—",
              assigneeId: t.assigneeId,
              dueDate: t.dueDate,
              fromNote,
              done: t.status === "done",
              due: !fromNote && overdue && due ? formatDueDate(due) : undefined,
              note: !fromNote && !overdue && due ? formatDueDate(due) : undefined,
            };
          }),
      })),
    };
  })
    : [];

  const groupedNotes = groupVentureNotes({
    owned: noteRows.map((n) => ({ id: n.id, title: n.title })),
    mentioned: mentionedRows.map((n) => ({ id: n.id, title: n.title })),
  });

  const tabs = [
    { label: "Overview" },
    { label: "Docs", count: docRows.length },
    { label: "Notes", count: groupedNotes.owned.length + groupedNotes.mentioned.length },
    ...(partner ? [{ label: "Tasks", count: taskRows.length }] : []),
    { label: "Calendar", count: eventsCount },
    { label: "Decisions", count: decisionRows.length },
    { label: "Activity", count: activityRows.length },
  ];

  return (
    <VentureView
      slug={venture.slug}
      name={venture.name}
      color={color}
      sub={venture.oneLiner ?? ""}
      tags={
        partner
          ? [
              { label: stakeLabel },
              { label: partnerVenture.ownerName ?? "Unassigned" },
              { label: `${daysInStage} days in stage`, hot: stale },
            ]
          : [{ label: `${daysInStage} days in stage`, hot: stale }]
      }
      stageLabel={STAGES[currentStageIndex]?.label ?? venture.stage}
      stageMeta={partner ? stageMeta : "—"}
      currentStage={venture.stage}
      openGateCount={currentStageGates.filter((g) => !g.doneAt).length}
      gates={gates}
      checklist={currentStageGates.map((g) => ({
        id: g.id,
        label: g.label,
        done: g.doneAt != null,
        by: g.doneAt ? (g.doneByInitials ?? "") : "",
      }))}
      tabs={tabs}
      switchTargets={switchTargets.map((v) => ({
        slug: v.slug,
        name: v.name,
        color: ventureColor(v.color),
      }))}
      lanes={lanes}
      ventureId={venture.id}
      partners={partners}
      notes={groupedNotes.owned}
      mentionedNotes={groupedNotes.mentioned}
      decisions={decisionRows.map((d) => ({
        id: d.id,
        title: d.title,
        date: formatDueDate(d.decidedAt),
        who: d.decidedByInitials ?? "—",
        source: d.sourceNoteTitle ?? undefined,
        rationale: d.rationale,
        sourceNoteId: d.sourceNoteId,
      }))}
      docs={docRows.map((d) => ({
        id: d.id,
        name: d.name,
        type: typeGlyph(d.mimeType, d.name),
        mimeType: d.mimeType,
        size: formatBytes(d.sizeBytes),
        who: d.uploadedByInitials ?? "—",
        date: formatDueDate(d.createdAt),
        folder: d.folder,
        visibility: d.visibility,
        versionCount: d.versionCount,
        versions: d.versions.map((v, i) => ({
          id: v.id,
          version: d.versionCount - 1 - i,
          who: v.uploadedByInitials ?? "—",
          date: formatDueDate(v.createdAt),
        })),
      }))}
      activity={activityRows.map((row) =>
        toActivityRowView(
          { ...row, payload: "payload" in row ? row.payload : null },
          now,
        ),
      )}
      members={accessRows.map((m) => ({
        userId: m.userId,
        name: m.name,
        email: m.email,
        initials: m.initials,
        memberRole: m.memberRole,
        status: m.status,
        lastSignInAt: m.lastSignInAt?.toISOString() ?? null,
      }))}
      partner={partner}
    />
  );
}
