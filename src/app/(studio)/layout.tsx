import { AppShell } from "@/components/AppShell";
import { requirePartner } from "@/lib/auth/current-user";
import { unreadCount } from "@/lib/data/activity";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePartner();
  const unread = await unreadCount(user.id);
  return <AppShell unreadCount={unread}>{children}</AppShell>;
}
