import { mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createAiFeed } from "./ai-content";
const output = resolve("public/ai");
const feed = createAiFeed(process.env.GITHUB_SHA || "local");
await rm(output, { recursive: true, force: true });
for (const [path, body] of Object.entries(feed)) {
  const target = join(output, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, body);
}
console.log(
  `Exported ${Object.keys(feed).length} public AI resources from the canonical cookbook.`,
);
