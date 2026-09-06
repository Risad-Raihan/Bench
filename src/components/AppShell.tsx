"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AppBar } from "../../design-system/components/chrome/AppBar.jsx";
import { NewVentureProvider, useNewVenture } from "./NewVentureModal";
import { NotificationInbox } from "./NotificationInbox";
import type { ActivityRowView } from "@/lib/activity/view";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

/**
 * The server resolves the theme from the cookie and sets data-theme on <html>,
 * so first paint is correct and this just needs the initial value to render the
 * right menu label. Toggling writes the CSS custom-property layer (instant) and
 * the cookie (carries the choice to the next request).
 */
function useTheme(initial: Theme): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(initial);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      const root = document.documentElement;
      root.dataset.theme = next;
      root.style.colorScheme = next;
      document.cookie = `${THEME_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
      return next;
    });
  }, []);

  return [theme, toggle];
}

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
  partner = true,
  unreadCount,
  notifications,
  theme,
}: {
  children: React.ReactNode;
  partner?: boolean;
  unreadCount?: number;
  notifications: ActivityRowView[];
  theme: Theme;
}) {
  return (
    <NewVentureProvider>
      <AppShellChrome
        partner={partner}
        unreadCount={unreadCount}
        notifications={notifications}
        theme={theme}
      >
        {children}
      </AppShellChrome>
    </NewVentureProvider>
  );
}

function AppShellChrome({
  children,
  partner,
  unreadCount,
  notifications,
  theme,
}: {
  children: React.ReactNode;
  partner: boolean;
  unreadCount?: number;
  notifications: ActivityRowView[];
  theme: Theme;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useNewVenture();
  const [currentTheme, toggleTheme] = useTheme(theme);
  const inVenture = pathname.startsWith("/v/");
  const active = ROUTE_LABELS[pathname] ?? "Pipeline";

  const themeItem =
    currentTheme === "light" ? "Switch to dark" : "Switch to light";

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
      }}
    >
      <AppBar
        items={partner ? Object.keys(NAV_ROUTES) : []}
        active={active}
        dimmed={inVenture || !partner}
        onNavigate={(item) => {
          if (!partner) return;
          router.push(NAV_ROUTES[item]);
        }}
        onNewVenture={partner ? open : undefined}
        onJump={() => {}}
        menuItems={["Profile", "Settings", themeItem, "Log out"]}
        unreadCount={unreadCount}
        unreadMenu={
          partner ? (
            <NotificationInbox items={notifications} unread={unreadCount ?? 0} />
          ) : undefined
        }
        onMenuSelect={(item) => {
          if (item === "Log out") void signOut({ redirectTo: "/signin" });
          else if (item === themeItem) toggleTheme();
        }}
      />
      {children}
    </div>
  );
}
