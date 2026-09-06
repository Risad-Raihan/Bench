import { notFound } from "next/navigation";
import { requirePartner } from "@/lib/auth/current-user";
import { countDecisions } from "@/lib/data/decisions";
import { countDocs } from "@/lib/data/docs";
import { countNotes } from "@/lib/data/notes";
import {
  countEvents,
  getVenture,
  listGateItems,
  listStageEvents,
  listSwitchTargets,
  listVentureTasks,
} from "@/lib/data/ventures";
import { daysSince, isStale, STAGES } from "@/lib/pipeline-stages";
import { ventureColor } from "@/lib/venture-colors";
import { BOARD_COLUMNS, BOARD_LANES } from "@/lib/lanes";
import { formatDayMonth, formatDueDate } from "@/lib/format";
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
  const user = await requirePartner();
  const { slug } = await params;
  const now = new Date();

  const venture = await getVenture(user, slug);
  if (!venture) notFound();

  const color = ventureColor(venture.color);
  const currentStageIndex = STAGES.findIndex((s) => s.stage === venture.stage);

  const [switchTargets, gateRows, stageEventRows, taskRows, docsCount, notesCount, eventsCount, decisionsCount] =
    await Promise.all([
      listSwitchTargets(user, venture.id),
      listGateItems(user, [venture.id]),
      listStageEvents(user, venture.id),
      listVentureTasks(user, venture.id),
      countDocs(user, venture.id),
      countNotes(user, venture.id),
      countEvents(user, venture.id),
      countDecisions(user, venture.id),
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
  const stakeLabel = venture.equityPct != null ? `${Math.round(venture.equityPct * 100)}% AVL stake` : "AVL venture";

  const lanes: VentureLaneData[] = BOARD_LANES.map((lane) => {
    const laneTasks = taskRows.filter((t) => t.lane === lane.key);
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
              who: t.assigneeInitials ?? "—",
              fromNote,
              done: t.status === "done",
              due: !fromNote && overdue && due ? formatDueDate(due) : undefined,
              note: !fromNote && !overdue && due ? formatDueDate(due) : undefined,
            };
          }),
      })),
    };
  });

  const tabs = [
    { label: "Overview" },
    { label: "Docs", count: docsCount },
    { label: "Notes", count: notesCount },
    { label: "Tasks", count: taskRows.length },
    { label: "Calendar", count: eventsCount },
    { label: "Decisions", count: decisionsCount },
  ];

  return (
    <VentureView
      slug={venture.slug}
      name={venture.name}
      color={color}
      sub={venture.oneLiner ?? ""}
      tags={[
        { label: stakeLabel },
        { label: venture.ownerName ?? "Unassigned" },
        { label: `${daysInStage} days in stage`, hot: stale },
      ]}
      stageLabel={STAGES[currentStageIndex]?.label ?? venture.stage}
      stageMeta={stageMeta}
      gates={gates}
      tabs={tabs}
      switchTargets={switchTargets.map((v) => ({
        slug: v.slug,
        name: v.name,
        color: ventureColor(v.color),
      }))}
      lanes={lanes}
    />
  );
}
