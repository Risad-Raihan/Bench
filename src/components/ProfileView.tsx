"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../design-system/components/chrome/PageHeader.jsx";
import { Panel } from "../../design-system/components/layout/Panel.jsx";
import { FactRow } from "../../design-system/components/data/FactRow.jsx";
import { TextField } from "../../design-system/components/forms/TextField.jsx";
import {
  Avatar,
  AvatarPicker,
} from "../../design-system/components/media/Avatar.jsx";
import { ActionButton } from "../../design-system/components/decisions/DecisionRow.jsx";
import { PageContainer } from "@/components/PageContainer";
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
      <PageContainer>
        <div style={{ maxWidth: 560 }}>
          <Panel label="You" pad={16}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <Avatar avatar={avatar} name={name} size={52} />
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "-.015em",
                  }}
                >
                  {name || "—"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--faint)",
                    marginTop: 4,
                  }}
                >
                  {ROLE_LABEL[profile.role] ?? profile.role}
                </div>
              </div>
            </div>

            <TextField label="Display name" value={name} onChange={setName} />

            <FactRow k="Email" v={profile.email} />
            <FactRow k="Role" v={ROLE_LABEL[profile.role] ?? profile.role} />
          </Panel>

          <Panel label="Avatar" pad={16}>
            <AvatarPicker
              label=""
              keys={AVATAR_KEYS}
              value={avatar}
              onChange={setAvatar}
            />
            <div style={{ fontSize: 11.5, color: "var(--ink-ghost3)" }}>
              Shows on the pipeline board and across the app.
            </div>
          </Panel>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 4,
            }}
          >
            <ActionButton onClick={save}>
              {pending ? "Saving…" : "Save changes"}
            </ActionButton>
            <span
              style={{
                fontSize: 11.5,
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
      </PageContainer>
    </>
  );
}
