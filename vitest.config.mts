import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

/** Minimal .env.local reader so TEST_DATABASE_URL / DATABASE_FORCE_IPV4
 *  reach the DB integration tests. KEY=VALUE, optional quotes, # comments. */
function readEnvLocal(): Record<string, string> {
  const file = path.join(root, ".env.local");
  if (!fs.existsSync(file)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    env: readEnvLocal(),
    // DB integration tests do many sequential Neon HTTP round-trips against a
    // branch whose compute may be cold; pure tests are unaffected.
    testTimeout: 30_000,
    // The DB tests share one Neon branch and each TRUNCATEs at the start, so
    // test files must not run in parallel or they stomp on each other.
    fileParallelism: false,
  },
});
