import { neonConfig } from "@neondatabase/serverless";
import https from "node:https";

/**
 * Some local/sandboxed networks have no outbound IPv6 route, which makes the
 * Neon driver's dual-stack fetch hang until it times out. Forcing IPv4 fixes
 * it there and is a no-op anywhere with normal (e.g. Vercel) networking.
 *
 * Opt-in via `DATABASE_FORCE_IPV4=1` so production behaviour never changes
 * silently. Called by both the app db client and the test db client.
 */
export function applyForceIpv4(): void {
  if (process.env.DATABASE_FORCE_IPV4 !== "1") return;
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
            resolve(
              new Response(Buffer.concat(chunks), {
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
