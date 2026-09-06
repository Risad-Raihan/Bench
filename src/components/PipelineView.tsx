"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Kpi,
  PageHeader,
  StatStrip,
} from "../../design-system/components/chrome/PageHeader.jsx";
import {
  AddButton,
  PipelineBoard,
  StageColumn,
  VentureCard,
} from "../../design-system/components/pipeline/VentureCard.jsx";
import { ActionButton } from "../../design-system/components/decisions/DecisionRow.jsx";
import {
  engageApplicationAction,
  passApplicationAction,
} from "@/lib/intake/actions";
import { useNewVenture } from "./NewVentureModal";

export interface PipelineVentureCard {
  id: string;
  slug: string;
  name: string;
  caption: string;
  color: string;
  gates: number;
  gateTotal: number;
  who: string;
  founder: string;
  flag?: string;
  kind?: "venture" | "application";
}

export interface PipelineStageColumn {
  stage: string;
  label: string;
  color: string;
  count: string;
  progress: number;
  ventures: PipelineVentureCard[];
}

export interface PipelineKpis {
  needAttention: number;
  avgStakePct: string;
  avgDaysInStage: string;
}

export interface PipelineStat {
  value: string | number;
  label: string;
}

export function PipelineView({
  stages,
  kpis,
  stats,
}: {
  stages: PipelineStageColumn[];
  kpis: PipelineKpis;
  stats: PipelineStat[];
}) {
  const router = useRouter();
  const { open } = useNewVenture();
  return (
    <>
      <PageHeader
        title="Pipeline"
        right={
          <>
            <Kpi value={kpis.needAttention} label="need you" hot />
            <Kpi value={kpis.avgStakePct} label="avg stake %" />
            <Kpi value={kpis.avgDaysInStage} label="avg days in stage" />
            <ActionButton onClick={open}>+ New venture</ActionButton>
          </>
        }
      />
      <PipelineBoard columns={6}>
        {stages.map((col) => (
          <StageColumn
            key={col.stage}
            stage={col.label}
            count={col.count}
            progress={col.progress}
            color={col.color}
          >
            {col.ventures.map((v, i) =>
              v.kind === "application" ? (
                <ApplicationCard key={v.id} card={v} rise={i} />
              ) : (
                <VentureCard
                  key={v.id}
                  name={v.name}
                  caption={v.caption}
                  color={v.color}
                  gates={v.gates}
                  gateTotal={v.gateTotal}
                  who={v.who}
                  founder={v.founder}
                  flag={v.flag}
                  rise={i}
                  onClick={() => router.push(`/v/${v.slug}`)}
                />
              ),
            )}
            {col.ventures.length === 0 && (
              <AddButton>Nothing here yet</AddButton>
            )}
          </StageColumn>
        ))}
      </PipelineBoard>
      <StatStrip stats={stats} />
    </>
  );
}

function ApplicationCard({
  card,
  rise,
}: {
  card: PipelineVentureCard;
  rise: number;
}) {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (action: "engage" | "pass") => {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result =
        action === "engage"
          ? await engageApplicationAction(card.id)
          : await passApplicationAction(card.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative" }}
    >
      <VentureCard
        name={card.name}
        caption={card.caption}
        color={card.color}
        who={card.who}
        founder={card.founder}
        flag={card.flag}
        rise={rise}
        showGates={false}
      />
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 5,
          opacity: hover || pending ? 1 : 0,
          pointerEvents: hover || pending ? "auto" : "none",
          transition: "opacity var(--dur-fast)",
        }}
      >
        <ActionButton onClick={() => run("engage")}>Engage</ActionButton>
        <ActionButton accent={false} onClick={() => run("pass")}>
          Pass
        </ActionButton>
      </div>
      {error ? (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".06em",
            color: "var(--amber)",
            margin: "-4px 0 8px",
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
