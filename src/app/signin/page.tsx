import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { getCurrentUser } from "@/lib/auth/current-user";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const session = await auth();
  const { error } = await searchParams;
  const disabled = Boolean(session?.userId);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "var(--sp-22)",
      }}
    >
      <div
        style={{
          width: 360,
          maxWidth: "92vw",
          background: "var(--panel)",
          border: "1px solid var(--line2)",
          borderRadius: 3,
          boxShadow: "var(--shadow-menu)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 18px 14px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: "var(--copper)",
            }}
          >
            Bench
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-.02em",
              marginTop: 7,
            }}
          >
            Sign in
          </div>
        </div>
        <div style={{ padding: 18 }}>
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 13.5,
              lineHeight: 1.7,
              color: "var(--body-ink)",
            }}
          >
            Partners sign in with an aponvlab.io Google account.
          </p>
          {disabled ? (
            <p
              style={{
                margin: "0 0 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "var(--amber)",
              }}
            >
              This account is disabled.
            </p>
          ) : error ? (
            <p
              style={{
                margin: "0 0 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "var(--amber)",
              }}
            >
              {error === "AccessDenied"
                ? "That Google account is not on the partner list."
                : "Sign-in failed. Try again."}
            </p>
          ) : null}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="signin-google"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                padding: "6px 11px",
                cursor: "pointer",
                borderRadius: 2,
                border: "1px solid var(--copper)",
                color: "var(--copper)",
                background: "var(--copper-wash)",
                transition: "background var(--dur-fast)",
              }}
            >
              Continue with Google
            </button>
          </form>
        </div>
      </div>
      <style>{`.signin-google:hover{background:var(--copper-tint)}`}</style>
    </div>
  );
}
