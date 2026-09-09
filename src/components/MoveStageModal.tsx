"use client";

import { useState } from "react";
import { ActionButton } from "../../design-system/components/decisions/DecisionRow.jsx";
import { TextField } from "../../design-system/components/forms/TextField.jsx";
import { Modal } from "../../design-system/components/overlay/Modal.jsx";
import { ArrowRight } from "lucide-react";

export function MoveStageModal({
  name,
  toLabel,
  pending,
  error,
  onConfirm,
  onClose,
}: {
  name: string;
  toLabel: string;
  pending: boolean;
  error: string | null;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <Modal
      eyebrow="Move stage"
      title={`Move ${name} to ${toLabel}`}
      onClose={onClose}
      width={520}
      footer={
        <>
          <ActionButton icon={ArrowRight} onClick={() => onConfirm(reason)}>
            {pending ? "Moving" : "Move"}
          </ActionButton>
          <span
            style={{
              fontSize: 11.5,
              color: error ? "var(--amber)" : "var(--faint)",
            }}
          >
            {error ??
              "Required when moving backward or leaving gates open."}
          </span>
        </>
      }
    >
      <TextField
        label="Reason"
        value={reason}
        onChange={setReason}
        multiline
        autoFocus
      />
    </Modal>
  );
}
