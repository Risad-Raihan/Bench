"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "../../design-system/components/decisions/DecisionRow.jsx";
import { TextField } from "../../design-system/components/forms/TextField.jsx";
import { Panel } from "../../design-system/components/layout/Panel.jsx";
import { Modal } from "../../design-system/components/overlay/Modal.jsx";
import { Send, UserPlus } from "lucide-react";
import { formatDueDate } from "@/lib/format";
import {
  disableMemberAction,
  inviteMemberAction,
  resendMemberLinkAction,
} from "@/lib/members/actions";

export type AccessMember = {
  userId: string;
  name: string;
  email: string;
  initials: string;
  memberRole: "founder" | "collaborator";
  status: "invited" | "active" | "disabled";
  lastSignInAt: string | null;
};

const STATUS_COLOR: Record<AccessMember["status"], string> = {
  invited: "var(--copper)",
  active: "var(--teal)",
  disabled: "var(--faint)",
};

export function AccessPanel({
  slug,
  ventureId,
  members,
}: {
  slug: string;
  ventureId: string;
  members: AccessMember[];
}) {
  const router = useRouter();
  const [inviteRole, setInviteRole] = useState<
    "founder" | "collaborator" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (
    action: () => Promise<{ ok: true } | { ok: false; error: string }>,
  ) => {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <Panel label="Access">
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: members.length > 0 ? 8 : 0,
        }}
      >
        <ActionButton
          icon={UserPlus}
          onClick={() => {
            setError(null);
            setInviteRole("founder");
          }}
        >
          Invite founder
        </ActionButton>
        <ActionButton
          icon={UserPlus}
          accent={false}
          onClick={() => {
            setError(null);
            setInviteRole("collaborator");
          }}
        >
          Add collaborator
        </ActionButton>
      </div>
      {members.length === 0 ? (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--ink-ghost)",
            padding: "8px 0",
          }}
        >
          No one invited yet
        </div>
      ) : (
        members.map((m) => (
          <AccessRow
            key={m.userId}
            member={m}
            onResend={() =>
              run(() =>
                resendMemberLinkAction({
                  ventureId,
                  slug,
                  userId: m.userId,
                }),
              )
            }
            onDisable={() =>
              run(() =>
                disableMemberAction({
                  ventureId,
                  slug,
                  userId: m.userId,
                }),
              )
            }
          />
        ))
      )}
      {error ? (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".06em",
            color: "var(--amber)",
            marginTop: 8,
          }}
        >
          {error}
        </div>
      ) : null}
      {inviteRole ? (
        <InviteMemberModal
          role={inviteRole}
          pending={pending}
          error={error}
          onClose={() => setInviteRole(null)}
          onSubmit={(name, email) => {
            run(async () => {
              const result = await inviteMemberAction({
                ventureId,
                slug,
                name,
                email,
                memberRole: inviteRole,
              });
              if (result.ok) setInviteRole(null);
              return result;
            });
          }}
        />
      ) : null}
    </Panel>
  );
}

function AccessRow({
  member,
  onResend,
  onDisable,
}: {
  member: AccessMember;
  onResend: () => void;
  onDisable: () => void;
}) {
  const [h, setH] = useState(false);
  const last = member.lastSignInAt
    ? formatDueDate(new Date(member.lastSignInAt))
    : "—";
  const live = member.status !== "disabled";

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 110px 80px 70px 150px",
        gap: 12,
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid var(--divider)",
        background: h ? "var(--hover-row)" : undefined,
        transition: "background var(--dur-instant)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {member.name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".08em",
            color: "var(--faint)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {member.email}
        </div>
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--dim)",
        }}
      >
        {member.memberRole}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: STATUS_COLOR[member.status],
        }}
      >
        {member.status}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--faint)",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {last}
      </span>
      <span
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          opacity: h && live ? 1 : 0,
          pointerEvents: h && live ? "auto" : "none",
          transition: "opacity var(--dur-fast)",
        }}
      >
        <span
          onClick={onResend}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--copper)",
            cursor: "pointer",
          }}
        >
          Resend link
        </span>
        <span
          onClick={onDisable}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--dim)",
            cursor: "pointer",
          }}
        >
          Disable
        </span>
      </span>
    </div>
  );
}

function InviteMemberModal({
  role,
  pending,
  error,
  onClose,
  onSubmit,
}: {
  role: "founder" | "collaborator";
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (name: string, email: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const founder = role === "founder";

  return (
    <Modal
      eyebrow={founder ? "Invite founder" : "Add collaborator"}
      title={founder ? "Give them the venture page" : "Add someone to this venture"}
      onClose={onClose}
      width={420}
      footer={
        <>
          <ActionButton
            icon={Send}
            onClick={() => {
              if (pending) return;
              onSubmit(name, email);
            }}
          >
            {founder ? "Send invite" : "Add and invite"}
          </ActionButton>
          <span
            style={{
              fontSize: 11.5,
              color: error ? "var(--amber)" : "var(--faint)",
            }}
          >
            {error ?? "They get a sign-in link. No password."}
          </span>
        </>
      }
    >
      <TextField
        label="Name"
        value={name}
        onChange={setName}
        placeholder={founder ? "Tunde Adeyemi" : "Ada Okonkwo"}
        autoFocus
      />
      <TextField
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="founder@example.com"
      />
    </Modal>
  );
}
