import { cookies } from "next/headers";
import { AppShell } from "@/components/AppShell";
import { isInternalUser, requireUser } from "@/lib/auth/current-user";
import { listNotifications, unreadCount } from "@/lib/data/activity";
import { toActivityRowView } from "@/lib/activity/view";
import { getProfile } from "@/lib/data/profile";
import { DEFAULT_AVATAR } from "@/lib/avatars";
import { resolveTheme } from "@/lib/theme";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const partner = isInternalUser(user);
  const theme = resolveTheme((await cookies()).get("bench-theme")?.value);
  const now = new Date();
  const [profile, [unread, inbox]] = await Promise.all([
    getProfile(user.id),
    partner
      ? Promise.all([unreadCount(user.id), listNotifications(user)])
      : Promise.resolve([
          0,
          [] as Awaited<ReturnType<typeof listNotifications>>,
        ] as const),
  ]);
  return (
    <AppShell
      partner={partner}
      theme={theme}
      viewer={{
        name: profile?.name ?? "",
        avatar: profile?.avatar ?? DEFAULT_AVATAR,
      }}
      unreadCount={partner ? unread : undefined}
      notifications={inbox.map((row) =>
        toActivityRowView(row, now, { unread: row.readAt == null }),
      )}
    >
      {children}
    </AppShell>
  );
}
