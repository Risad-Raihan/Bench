"use client";

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
      <PipelineBoard>
        {stages.map((col) => (
          <StageColumn
            key={col.stage}
            stage={col.label}
            count={col.count}
            progress={col.progress}
            color={col.color}
          >
            {col.ventures.map((v, i) => (
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
            ))}
            {col.ventures.length === 0 && <AddButton>Nothing here yet</AddButton>}
          </StageColumn>
        ))}
      </PipelineBoard>
      <StatStrip stats={stats} />
    </>
  );
}
