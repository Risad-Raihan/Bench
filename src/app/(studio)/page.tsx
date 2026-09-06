import { requirePartner } from "@/lib/auth/current-user";
import { listGateItems, listPipelineTasks, listVentures } from "@/lib/data/ventures";
import { daysSince, isStale, STAGES } from "@/lib/pipeline-stages";
import { ventureColor } from "@/lib/venture-colors";
import {
  PipelineView,
  type PipelineStageColumn,
  type PipelineStat,
} from "@/components/PipelineView";

export default async function PipelinePage() {
  const user = await requirePartner();
  const now = new Date();

  const ventureRows = await listVentures(user);
  const ventureIds = ventureRows.map((v) => v.id);

  const [gateRows, taskRows] = await Promise.all([
    listGateItems(user, ventureIds),
    listPipelineTasks(user, ventureIds),
  ]);

  const gatesByVenture = new Map<string, { total: number; done: number }>();
  for (const g of gateRows) {
    const v = ventureRows.find((v) => v.id === g.ventureId);
    if (!v || g.stage !== v.stage) continue; // gate rail shows the current stage only
    const acc = gatesByVenture.get(g.ventureId) ?? { total: 0, done: 0 };
    acc.total += 1;
    if (g.doneAt) acc.done += 1;
    gatesByVenture.set(g.ventureId, acc);
  }

  const staleVentures = ventureRows.filter((v) => isStale(v.stageEnteredAt, now));
  const stakes = ventureRows
    .map((v) => v.equityPct)
    .filter((v): v is number => v != null);
  const avgStakePct =
    stakes.length > 0
      ? ((stakes.reduce((a, b) => a + b, 0) / stakes.length) * 100).toFixed(1)
      : "—";
  const avgDaysInStage =
    ventureRows.length > 0
      ? Math.round(
          ventureRows.reduce((sum, v) => sum + daysSince(v.stageEnteredAt, now), 0) /
            ventureRows.length,
        ).toString()
      : "—";

  const openTasks = taskRows.filter((t) => t.status !== "done");
  const weekFromNow = new Date(now.getTime() + 7 * 86_400_000);
  const dueThisWeek = openTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) <= weekFromNow && new Date(t.dueDate) >= now,
  );

  const stages: PipelineStageColumn[] = STAGES.map(({ stage, label, color }, index) => {
    const stageVentures = ventureRows
      .filter((v) => v.stage === stage)
      .sort((a, b) => a.boardPosition - b.boardPosition)
      .map((v) => {
        const gates = gatesByVenture.get(v.id) ?? { total: 6, done: 0 };
        const stale = isStale(v.stageEnteredAt, now);
        return {
          id: v.id,
          slug: v.slug,
          name: v.name,
          caption: v.oneLiner ?? "",
          color: ventureColor(v.color),
          gates: gates.done,
          gateTotal: gates.total,
          who: v.ownerInitials ?? "—",
          founder: v.founderName ?? "",
          flag: stale ? `STALE ${daysSince(v.stageEnteredAt, now)}D` : undefined,
        };
      });
    return {
      stage,
      label,
      color,
      count: String(stageVentures.length).padStart(2, "0"),
      progress: stageVentures.length > 0 ? index + 1 : 0,
      ventures: stageVentures,
    };
  });

  const stats: PipelineStat[] = [
    { value: ventureRows.length, label: "active ventures" },
    { value: openTasks.length, label: "open tasks" },
    { value: dueThisWeek.length, label: "due this week" },
    { value: staleVentures.length, label: "stalled" },
  ];

  return (
    <PipelineView
      stages={stages}
      kpis={{
        needAttention: staleVentures.length,
        avgStakePct,
        avgDaysInStage,
      }}
      stats={stats}
    />
  );
}
