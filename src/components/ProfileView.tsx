"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../design-system/components/chrome/PageHeader.jsx";
import { Panel } from "../../design-system/components/layout/Panel.jsx";
import { FactRow } from "../../design-system/components/data/FactRow.jsx";
import { TextField } from "../../design-system/components/forms/TextField.jsx";
import { Avatar } from "../../design-system/components/media/Avatar.jsx";
import { ActionButton } from "../../design-system/components/decisions/DecisionRow.jsx";
import { Check } from "lucide-react";
import { AVATAR_KEYS } from "@/lib/avatars";
import { updateProfileAction } from "@/lib/profile/actions";
import type { Profile } from "@/lib/data/profile";

const ROLE_LABEL: Record<string, string> = {
  partner: "Partner",
  admin: "Admin",
  viewer: "Viewer",
  founder: "Founder",
};

export function ProfileView({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const role = ROLE_LABEL[profile.role] ?? profile.role;
  const dirty = name.trim() !== profile.name || avatar !== profile.avatar;

  const save = () => {
    if (pending || !dirty) return;
    setError(null);
    setSaved(null);
    startTransition(async () => {
      const result = await updateProfileAction({ name: name.trim(), avatar });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved("Saved");
      router.refresh();
    });
  };

  return (
    <>
      <PageHeader title="Profile" meta={profile.email.toUpperCase()} />
      <div
        style={{
          maxWidth: 620,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* Hero — the avatar, big, centred */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Avatar avatar={avatar} name={name} size={104} />
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-.02em",
              marginTop: 16,
            }}
          >
            {name || "—"}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "var(--faint)",
              marginTop: 7,
            }}
          >
            {role}
          </div>
        </div>

        <Panel label="Details" pad={18}>
          <TextField label="Display name" value={name} onChange={setName} />
          <FactRow k="Email" v={profile.email} />
          <FactRow k="Role" v={role} />
        </Panel>

        <Panel label="Avatar" pad={18}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
              gap: 10,
            }}
          >
            {AVATAR_KEYS.map((key) => {
              const on = key === avatar;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAvatar(key)}
                  aria-pressed={on}
                  style={{
                    aspectRatio: "1 / 1",
                    width: "100%",
                    padding: 5,
                    borderRadius: 4,
                    cursor: "pointer",
                    background: "var(--panel)",
                    border:
                      "1px solid " + (on ? "var(--copper)" : "var(--line)"),
                    boxShadow: on ? "0 0 0 2px var(--copper-wash)" : "none",
                    transition:
                      "border-color var(--dur-fast), box-shadow var(--dur-fast)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Avatar avatar={key} size={44} />
                </button>
              );
            })}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-ghost3)",
              marginTop: 12,
            }}
          >
            Shows on the pipeline board, the app bar, and anywhere your name
            appears.
          </div>
        </Panel>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
          }}
        >
          <ActionButton icon={Check} onClick={save}>
            {pending ? "Saving…" : "Save changes"}
          </ActionButton>
          <span
            style={{
              fontSize: 12,
              color: error
                ? "var(--amber)"
                : saved
                  ? "var(--teal-label)"
                  : "var(--faint)",
            }}
          >
            {error ?? saved ?? (dirty ? "Unsaved changes" : "Up to date")}
          </span>
        </div>
      </div>
    </>
  );
}
