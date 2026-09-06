import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "design-system/**",
  ]),
  {
    // ADR-0006: founder-reachable entities go through src/lib/data/*.
    // System context keeps a direct db client: data module, db/schema,
    // drizzle, intake, seed, and auth (session resolution — not a founder
    // entity). Pages and components must not import @/db.
    name: "bench/no-direct-db-client",
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "src/lib/data/**",
      "src/db/**",
      "drizzle/**",
      "src/app/api/intake/**",
      "src/lib/intake/**",
      "src/lib/auth/**",
      "src/auth.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/db",
              message:
                "Import the DB client only from src/lib/data/** (ADR-0006). Pages and components must not touch db directly.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
