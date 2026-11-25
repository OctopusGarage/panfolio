import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createMarkdownCookbook } from "./markdown-content";
import { config, cookingGuidance, distributionIdentity } from "./distribution";
const files = createMarkdownCookbook();
for (const [path, body] of Object.entries(files)) {
  if ((await readFile(`content/${path}`, "utf8")) !== body)
    throw Error(`Stale content/${path}; run pnpm content:build`);
}
const identity = await distributionIdentity();
if (
  !Buffer.from(JSON.stringify(identity, null, 2) + "\n").equals(
    await readFile("distribution/identity.json"),
  )
)
  throw Error("Stale distribution identity; run pnpm distribution:sync");
const sourceRevision =
  process.env.GITHUB_SHA ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
await mkdir("mcp/generated", { recursive: true });
await writeFile(
  "mcp/generated/cookbook.json",
  JSON.stringify({
    ...identity,
    sourceRevision,
    files,
    guidance: { zh: cookingGuidance("zh"), en: cookingGuidance("en") },
    endpoint: config.mcpEndpoint,
    iconBase64: (await readFile(config.icon)).toString("base64"),
  }),
);
console.log(
  `Prepared ${Object.keys(files).length} documents, shared guidance and icon for distribution ${identity.version}.`,
);
