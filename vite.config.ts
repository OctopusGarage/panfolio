import { createServiceWorker } from "./scripts/service-worker";
import { execFileSync } from "node:child_process";
import distribution from "./distribution/config.json";
import { projectAiDistribution } from "./src/ai-onboarding";
import react from "@vitejs/plugin-react";
import { defineConfig, type ResolvedConfig } from "vite";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
let config: ResolvedConfig;
export default defineConfig({
  define: {
    __AI_DISTRIBUTION__: JSON.stringify(
      projectAiDistribution(
        distribution,
        process.env.GITHUB_SHA ||
          execFileSync("git", ["rev-parse", "HEAD"], {
            encoding: "utf8",
          }).trim(),
      ),
    ),
    __APP_VERSION__: JSON.stringify(
      JSON.parse(readFileSync("package.json", "utf8")).version,
    ),
    __BUILD_ID__: JSON.stringify(
      process.env.GITHUB_SHA?.slice(0, 7) || "local",
    ),
  },
  base: process.env.BASE_PATH || "./",
  plugins: [
    react(),
    {
      name: "offline-worker",
      configResolved(resolved) {
        config = resolved;
      },
      generateBundle(_, bundle) {
        const publicFiles = [
          "./recover.html",
          "./apple-touch-icon.png",
          "./manifest.webmanifest",
          "./icon.svg",
          "./icon-192.png",
          "./icon-512.png",
        ];
        const imageFiles = readdirSync(resolve(config.publicDir, "recipes"))
          .sort()
          .map((name) => "./recipes/" + name);
        const files = [
          "./",
          ...publicFiles,
          ...Object.keys(bundle).map((p) => "./" + p),
        ];
        const entries: [string, Uint8Array][] = [
          ...Object.entries(bundle).map(
            ([name, asset]): [string, Uint8Array] => {
              const source = asset.type === "chunk" ? asset.code : asset.source;
              return [
                "./" + name,
                typeof source === "string" ? Buffer.from(source) : source,
              ];
            },
          ),
          ...[...publicFiles, ...imageFiles].map(
            (name): [string, Uint8Array] => [
              name,
              readFileSync(resolve(config.publicDir, name)),
            ],
          ),
        ];
        const digest = createHash("sha256");
        digest.update(createServiceWorker("build-identity", files));
        for (const [name, bytes] of entries.sort(([a], [b]) =>
          a.localeCompare(b),
        )) {
          digest.update(JSON.stringify([name, bytes.byteLength]) + "\n");
          digest.update(bytes);
        }
        const version = digest.digest("hex").slice(0, 12);
        this.emitFile({
          type: "asset",
          fileName: "sw.js",
          source: createServiceWorker(version, files),
        });
      },
    },
  ],
});
