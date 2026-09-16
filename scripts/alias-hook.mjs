/**
 * Resolves the `@/*` path alias from tsconfig.json for plain Node runs, so a
 * script can import the same TypeScript modules the app imports.
 *
 * Registered by scripts/validate-seo.mjs; not used by the Next build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = pathToFileURL(path.join(path.dirname(fileURLToPath(import.meta.url)), "..") + path.sep);

/** Aliased imports are extensionless, the way TypeScript writes them. */
const CANDIDATES = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) return nextResolve(specifier, context);

  const base = new URL(specifier.slice(2), ROOT);
  for (const suffix of CANDIDATES) {
    const candidate = new URL(base.href + suffix);
    if (fs.existsSync(fileURLToPath(candidate)) && fs.statSync(fileURLToPath(candidate)).isFile()) {
      return nextResolve(candidate.href, context);
    }
  }
  return nextResolve(base.href, context);
}
