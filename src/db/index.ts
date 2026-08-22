import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import https from "node:https";
import * as schema from "./schema";

/* Some local/sandboxed networks have no outbound IPv6 route, which makes the
   Neon driver's dual-stack fetch hang until it times out. Forcing IPv4 fixes
   it there and is a no-op anywhere with normal (e.g. Vercel) networking, but
   it's opt-in via env so production behaviour never changes silently. */
if (process.env.DATABASE_FORCE_IPV4 === "1") {
  neonConfig.fetchFunction = (url: string | URL, opts: RequestInit = {}) =>
    new Promise((resolve, reject) => {
      const target = new URL(String(url));
      const req = https.request(
        {
          hostname: target.hostname,
          port: 443,
          path: target.pathname + target.search,
          method: opts.method ?? "GET",
          family: 4,
          headers: opts.headers as Record<string, string> | undefined,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => {
            const body = Buffer.concat(chunks);
            resolve(
              new Response(body, {
                status: res.statusCode ?? 500,
                headers: res.headers as Record<string, string>,
              }),
            );
          });
        },
      );
      req.on("error", reject);
      if (opts.body) req.write(opts.body as string);
      req.end();
    });
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
