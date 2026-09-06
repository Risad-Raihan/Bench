import { cookies } from "next/headers";
import { AppShell } from "@/components/AppShell";
import { isInternalUser, requireUser } from "@/lib/auth/current-user";
import { listNotifications, unreadCount } from "@/lib/data/activity";
import { toActivityRowView } from "@/lib/activity/view";
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
  const [unread, inbox] = partner
    ? await Promise.all([unreadCount(user.id), listNotifications(user)])
    : [0, [] as Awaited<ReturnType<typeof listNotifications>>];
  return (
    <AppShell
      partner={partner}
      theme={theme}
      unreadCount={partner ? unread : undefined}
      notifications={inbox.map((row) =>
        toActivityRowView(row, now, { unread: row.readAt == null }),
      )}
    >
      {children}
    </AppShell>
  );
}
