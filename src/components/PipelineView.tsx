"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../design-system/components/chrome/PageHeader.jsx";
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
import { isStage, stageLabel, type Stage } from "@/lib/pipeline-stages";
import { reasonRequired } from "@/lib/stages/reason";
import { moveStageAction } from "@/lib/stages/actions";
import { MoveStageModal } from "@/components/MoveStageModal";
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
  stage?: Stage;
  openGates?: number;
}

export interface PipelineStageColumn {
  stage: string;
  label: string;
  color: string;
  count: string;
  progress: number;
  ventures: PipelineVentureCard[];
}

const DRAG_TYPE = "text/plain";

export function PipelineView({
  stages,
}: {
  stages: PipelineStageColumn[];
}) {
  const router = useRouter();
  const { open } = useNewVenture();
  const dragged = useRef(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);
  const [pending, setPending] = useState<{
    ventureId: string;
    slug: string;
    name: string;
    toStage: Stage;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  const cards = stages.flatMap((col) => col.ventures);

  const runMove = (
    input: { ventureId: string; slug: string; toStage: Stage },
    reason: string | null,
  ) => {
    if (busy) return;
    setError(null);
    startTransition(async () => {
      const result = await moveStageAction({
        ventureId: input.ventureId,
        slug: input.slug,
        toStage: input.toStage,
        reason,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPending(null);
      router.refresh();
    });
  };

  const engageFromBoard = (applicationId: string) => {
    if (busy) return;
    setError(null);
    startTransition(async () => {
      const result = await engageApplicationAction(applicationId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const requestMove = (card: PipelineVentureCard, toStage: string) => {
    if (!isStage(toStage)) return;
    if (card.kind === "application") {
      // Dragging an application onto any real stage column engages it —
      // the venture is always born in Meet (ADR-0002).
      engageFromBoard(card.id);
      return;
    }
    if (!card.stage || card.stage === toStage) return;
    if (reasonRequired(card.stage, toStage, card.openGates ?? 0)) {
      setError(null);
      setPending({
        ventureId: card.id,
        slug: card.slug,
        name: card.name,
        toStage,
      });
      return;
    }
    runMove(
      { ventureId: card.id, slug: card.slug, toStage },
      null,
    );
  };

  return (
    <>
      <PageHeader
        title="Pipeline"
        right={<ActionButton onClick={open}>+ New venture</ActionButton>}
      />
      <PipelineBoard columns={6}>
        {stages.map((col) => (
          <div
            key={col.stage}
            onDragOver={(e) => {
              if (!isStage(col.stage)) return;
              e.preventDefault();
              setOverStage(col.stage);
            }}
            onDragLeave={() => {
              if (overStage === col.stage) setOverStage(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setOverStage(null);
              const id = e.dataTransfer.getData(DRAG_TYPE) || draggingId;
              const card = cards.find((v) => v.id === id);
              if (card) requestMove(card, col.stage);
            }}
            style={{
              // Paint the column so a stretched empty grid cell reads as the
              // column surface, not the board's hairline-coloured backdrop
              // showing through (the "shadow" that grew with the tallest column).
              background: "var(--bg2)",
              outline:
                overStage === col.stage
                  ? "1px solid var(--line2)"
                  : "1px solid transparent",
              outlineOffset: -1,
              transition: "outline-color var(--dur-fast)",
            }}
          >
            <StageColumn
              stage={col.label}
              count={col.count}
              progress={col.progress}
              color={col.color}
            >
              {col.ventures.map((v, i) =>
                v.kind === "application" ? (
                  <div
                    key={v.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(DRAG_TYPE, v.id);
                      e.dataTransfer.effectAllowed = "move";
                      dragged.current = true;
                      setDraggingId(v.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setOverStage(null);
                      window.setTimeout(() => {
                        dragged.current = false;
                      }, 0);
                    }}
                    style={{ opacity: draggingId === v.id ? 0.45 : 1 }}
                  >
                    <ApplicationCard card={v} rise={i} />
                  </div>
                ) : (
                  <div
                    key={v.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(DRAG_TYPE, v.id);
                      e.dataTransfer.effectAllowed = "move";
                      dragged.current = true;
                      setDraggingId(v.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setOverStage(null);
                      window.setTimeout(() => {
                        dragged.current = false;
                      }, 0);
                    }}
                    style={{ opacity: draggingId === v.id ? 0.45 : 1 }}
                  >
                    <VentureCard
                      name={v.name}
                      caption={v.caption}
                      color={v.color}
                      gates={v.gates}
                      gateTotal={v.gateTotal}
                      who={v.who}
                      founder={v.founder}
                      flag={v.flag}
                      rise={i}
                      onClick={() => {
                        if (dragged.current) return;
                        router.push(`/v/${v.slug}`);
                      }}
                    />
                  </div>
                ),
              )}
              {col.ventures.length === 0 && (
                <AddButton>Nothing here yet</AddButton>
              )}
            </StageColumn>
          </div>
        ))}
      </PipelineBoard>
      {error && !pending ? (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".06em",
            color: "var(--amber)",
            padding: "var(--sp-8) var(--sp-22)",
          }}
        >
          {error}
        </div>
      ) : null}
      {pending ? (
        <MoveStageModal
          name={pending.name}
          toLabel={stageLabel(pending.toStage)}
          pending={busy}
          error={error}
          onConfirm={(reason) =>
            runMove(
              {
                ventureId: pending.ventureId,
                slug: pending.slug,
                toStage: pending.toStage,
              },
              reason,
            )
          }
          onClose={() => {
            setPending(null);
            setError(null);
          }}
        />
      ) : null}
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
