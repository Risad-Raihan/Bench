import { requirePartner } from "@/lib/auth/current-user";
import { listInboxApplications } from "@/lib/data/applications";
import { listGateItems, listVentures } from "@/lib/data/ventures";
import { daysSince, isStale, STAGES } from "@/lib/pipeline-stages";
import { ventureColor } from "@/lib/venture-colors";
import { resolveAvatar } from "@/lib/avatars";
import {
  PipelineView,
  type PipelineStageColumn,
} from "@/components/PipelineView";

export default async function PipelinePage() {
  const user = await requirePartner();
  const now = new Date();

  const [ventureRows, inbox] = await Promise.all([
    listVentures(user),
    listInboxApplications(user),
  ]);
  const ventureIds = ventureRows.map((v) => v.id);

  const gateRows = await listGateItems(user, ventureIds);

  const gatesByVenture = new Map<string, { total: number; done: number }>();
  for (const g of gateRows) {
    const v = ventureRows.find((v) => v.id === g.ventureId);
    if (!v || g.stage !== v.stage) continue; // gate rail shows the current stage only
    const acc = gatesByVenture.get(g.ventureId) ?? { total: 0, done: 0 };
    acc.total += 1;
    if (g.doneAt) acc.done += 1;
    gatesByVenture.set(g.ventureId, acc);
  }

  const applicationColumn: PipelineStageColumn = {
    stage: "application",
    label: "Application",
    color: "var(--ash)",
    count: String(inbox.length).padStart(2, "0"),
    progress: 0,
    ventures: inbox.map((a) => {
      const stale = isStale(a.createdAt, now);
      return {
        id: a.id,
        slug: "",
        name: a.companyName,
        // problem is a free-text questionnaire answer (up to 5000 chars); the
        // card shows a one-line teaser.
        caption: a.problem ? `${a.problem.slice(0, 120).trimEnd()}${a.problem.length > 120 ? "…" : ""}` : "",
        color: "var(--ash)",
        gates: 0,
        gateTotal: 0,
        who: "—",
        founderAvatar: resolveAvatar(a.founderAvatar),
        founder: a.founderName ?? "",
        flag: stale ? `STALE ${daysSince(a.createdAt, now)}D` : undefined,
        kind: "application" as const,
      };
    }),
  };

  const stageColumns: PipelineStageColumn[] = STAGES.map(({ stage, label, color }, index) => {
    const stageVentures = ventureRows
      .filter((v) => v.stage === stage)
      .sort((a, b) => a.boardPosition - b.boardPosition)
      .map((v) => {
        const gates = gatesByVenture.get(v.id) ?? { total: 0, done: 0 };
        const stale = isStale(v.stageEnteredAt, now);
        return {
          id: v.id,
          slug: v.slug,
          name: v.name,
          caption: v.oneLiner ?? "",
          color: ventureColor(v.color),
          gates: gates.done,
          gateTotal: gates.total || 6,
          openGates: gates.total - gates.done,
          stage,
          who: v.ownerInitials ?? "—",
          ownerAvatar: v.ownerAvatar,
          founderAvatar: resolveAvatar(v.founderAvatar),
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

  const stages: PipelineStageColumn[] = [applicationColumn, ...stageColumns];

  return <PipelineView stages={stages} />;
}
