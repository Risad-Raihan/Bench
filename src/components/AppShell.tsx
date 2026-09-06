"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AppBar } from "../../design-system/components/chrome/AppBar.jsx";
import { NewVentureProvider, useNewVenture } from "./NewVentureModal";
import { NotificationInbox } from "./NotificationInbox";
import type { ActivityRowView } from "@/lib/activity/view";

const NAV_ROUTES: Record<string, string> = {
  Pipeline: "/",
  "My work": "/my-work",
  Notes: "/notes",
  Docs: "/docs",
  Calendar: "/calendar",
  Decisions: "/decisions",
  Activity: "/activity",
};

const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(NAV_ROUTES).map(([label, route]) => [route, label]),
);

export function AppShell({
  children,
  unreadCount,
  notifications,
}: {
  children: React.ReactNode;
  unreadCount: number;
  notifications: ActivityRowView[];
}) {
  return (
    <NewVentureProvider>
      <AppShellChrome unreadCount={unreadCount} notifications={notifications}>
        {children}
      </AppShellChrome>
    </NewVentureProvider>
  );
}

function AppShellChrome({
  children,
  unreadCount,
  notifications,
}: {
  children: React.ReactNode;
  unreadCount: number;
  notifications: ActivityRowView[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useNewVenture();
  const inVenture = pathname.startsWith("/v/");
  const active = ROUTE_LABELS[pathname] ?? "Pipeline";

  return (
    <div
      style={{
        maxWidth: "var(--w-doc)",
        margin: "0 auto",
        background: "var(--bg)",
        border: "1px solid var(--line)",
        borderRadius: 3,
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      <AppBar
        items={Object.keys(NAV_ROUTES)}
        active={active}
        dimmed={inVenture}
        onNavigate={(item) => router.push(NAV_ROUTES[item])}
        onNewVenture={open}
        onJump={() => {}}
        unreadCount={unreadCount}
        unreadMenu={
          <NotificationInbox items={notifications} unread={unreadCount} />
        }
        onMenuSelect={(item) => {
          if (item === "Log out") void signOut({ redirectTo: "/signin" });
        }}
      />
      {children}
    </div>
  );
}
