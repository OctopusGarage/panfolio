import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { basename } from "node:path";
import { distributionIdentity, config, hash } from "./distribution";
const identity = await distributionIdentity();
const sourceRevision =
  process.env.GITHUB_SHA ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const snapshot = JSON.parse(
  await readFile("mcp/generated/cookbook.json", "utf8"),
);
for (const [key, value] of Object.entries({ ...identity, sourceRevision }))
  if (snapshot[key] !== value)
    throw Error(
      `MCP build snapshot differs at ${key}; rebuild it before preparing a release`,
    );
const files = [
  "public/downloads/panfolio-skill.zip",
  "public/downloads/panfolio-chatgpt-plugin.zip",
  config.icon,
  "mcp/.cloudflare/output/v1/workers/default/bundle/index.js",
];
const assets: Record<string, { sha256: string; bytes: number }> = {};
for (const path of files) {
  const bytes = await readFile(path);
  assets[basename(path)] = { sha256: hash(bytes), bytes: bytes.length };
}
const manifest = {
  schemaVersion: 1,
  ...identity,
  sourceRevision,
  mcpEndpoint: config.mcpEndpoint,
  assets,
};
await mkdir("public/downloads", { recursive: true });
await writeFile(
  "public/downloads/release-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
const checks = Object.entries(assets)
  .filter(([name]) => name !== "index.js")
  .map(([name, v]) => `${v.sha256}  ${name}`);
checks.push(
  `${hash(await readFile("public/downloads/release-manifest.json"))}  release-manifest.json`,
);
await writeFile("public/downloads/SHA256SUMS", checks.join("\n") + "\n");
console.log(
  `Prepared release manifest ${identity.version} for ${sourceRevision}.`,
);

await mkdir("dist/downloads", { recursive: true });
for (const name of ["release-manifest.json", "SHA256SUMS"])
  await copyFile(`public/downloads/${name}`, `dist/downloads/${name}`);
