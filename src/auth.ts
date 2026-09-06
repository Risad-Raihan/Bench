import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { GoogleProfile } from "next-auth/providers/google";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createAuthAdapter } from "@/lib/auth/adapter";
import {
  isPartnerGoogleSignIn,
  normalizeEmail,
} from "@/lib/auth/partners";
import {
  interimAuthEnabled,
  interimCredentialsProvider,
} from "@/lib/auth/interim";
import type { UserRole } from "@/lib/auth/resolve";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: createAuthAdapter(),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          hd: "aponvlab.io",
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
        },
      },
    }),
    // INTERIM: partner email+password, until the Google OAuth client lands (S2).
    ...(interimAuthEnabled() ? [interimCredentialsProvider()] : []),
  ],
  callbacks: {
    authorized({ request, auth: session }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/api/intake")) return true;
      if (pathname.startsWith("/api/auth")) return true;
      if (pathname === "/signin") return true;
      if (session) return true;
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
      return false;
    },
    async signIn({ account, profile }) {
      // INTERIM: interimCredentialsProvider.authorize() has already checked the
      // allowlist and the disabled flag.
      if (account?.provider === "interim") return true;
      if (account?.provider !== "google") return false;
      const google = profile as GoogleProfile | undefined;
      if (
        !isPartnerGoogleSignIn({
          email: google?.email,
          emailVerified: google?.email_verified,
          hd: google?.hd,
        })
      ) {
        return false;
      }
      const [existing] = await db
        .select({ disabledAt: users.disabledAt })
        .from(users)
        .where(eq(users.email, normalizeEmail(google!.email)))
        .limit(1);
      if (existing?.disabledAt) return false;
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.id) {
        token.userId = user.id;
        const [row] = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);
        token.role = row?.role ?? "partner";
      }
      if (account?.provider === "google" && typeof token.userId === "string") {
        const patch: {
          lastSignInAt: Date;
          googleRefreshToken?: string;
        } = { lastSignInAt: new Date() };
        if (typeof account.refresh_token === "string") {
          patch.googleRefreshToken = account.refresh_token;
        }
        await db.update(users).set(patch).where(eq(users.id, token.userId));
      }
      return token;
    },
    async session({ session, token }) {
      session.userId = typeof token.userId === "string" ? token.userId : "";
      session.role = (
        typeof token.role === "string" ? token.role : "partner"
      ) as UserRole;
      return session;
    },
  },
});
