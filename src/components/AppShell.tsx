"use client";

import { usePathname, useRouter } from "next/navigation";
import { AppBar } from "../../design-system/components/chrome/AppBar.jsx";

const NAV_ROUTES: Record<string, string> = {
  Pipeline: "/",
  "My work": "/my-work",
  Notes: "/notes",
  Docs: "/docs",
  Calendar: "/calendar",
  Decisions: "/decisions",
};

const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(NAV_ROUTES).map(([label, route]) => [route, label]),
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
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
        onNavigate={(item) => router.push(NAV_ROUTES[item])}
        onNewVenture={() => {}}
        onJump={() => {}}
      />
      {children}
    </div>
  );
}
