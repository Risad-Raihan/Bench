import { AppShell } from "@/components/AppShell";
import { requirePartner } from "@/lib/auth/current-user";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePartner();
  return <AppShell>{children}</AppShell>;
}
