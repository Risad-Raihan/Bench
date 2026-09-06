import type { UserRole } from "@/lib/auth/resolve";

declare module "next-auth" {
  interface Session {
    userId: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: UserRole;
  }
}
