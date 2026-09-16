// @ts-check
const { defineConfig } = require("@playwright/test");

/**
 * Runs the audit specs against the static export in ./out, served the way
 * Vercel serves it (clean URLs, query strings ignored, hashes native).
 *
 *   npm run build && npx playwright test
 */
module.exports = defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    // The repo does not vendor a Playwright browser build; drive the installed Chrome.
    channel: "chrome",
    headless: true,
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: "npx serve out -l 4173 --no-clipboard --no-port-switching",
    url: "http://127.0.0.1:4173/",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
