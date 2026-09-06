import { AppShell } from "@/components/AppShell";
import { requirePartner } from "@/lib/auth/current-user";
import { listNotifications, unreadCount } from "@/lib/data/activity";
import { toActivityRowView } from "@/lib/activity/view";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePartner();
  const now = new Date();
  const [unread, inbox] = await Promise.all([
    unreadCount(user.id),
    listNotifications(user),
  ]);
  return (
    <AppShell
      unreadCount={unread}
      notifications={inbox.map((row) =>
        toActivityRowView(row, now, { unread: row.readAt == null }),
      )}
    >
      {children}
    </AppShell>
  );
}
