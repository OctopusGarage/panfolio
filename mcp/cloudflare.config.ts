import { defineConfig } from "cf/config";
import distribution from "../distribution/config.json" with { type: "json" };
export default defineConfig({
  accountId: distribution.cloudflareAccountId,
  worker: {
    name: distribution.workerName,
    entrypoint: "./src/index.ts",
    compatibilityDate: "2026-11-25",
    compatibilityFlags: ["nodejs_compat"],
    observability: { enabled: true, traces: { enabled: true } },
  },
});
