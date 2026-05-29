/**
 * Loads the monorepo root .env into process.env.
 *
 * Prisma 7 no longer auto-loads .env, and the single source of truth for
 * environment variables lives at the repository root. This module reads that
 * file and populates process.env (without overriding values already set), so
 * both the Prisma CLI (via prisma.config.ts) and the seed script work
 * regardless of the current working directory.
 */
import fs from "node:fs";
import path from "node:path";

// prisma/load-env.ts -> apps/api/prisma -> repo root is three levels up.
const rootEnv = path.resolve(__dirname, "../../../.env");

if (fs.existsSync(rootEnv)) {
  const content = fs.readFileSync(rootEnv, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}
