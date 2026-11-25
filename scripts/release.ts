import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { releaseDecision, type ReleaseIdentity } from "./release-policy";
import config from "../distribution/config.json";
import { createHash } from "node:crypto";
const operation = process.argv[2];
if (!["preflight", "publish"].includes(operation))
  throw Error("Use release:preflight or release:publish");
const current = JSON.parse(
  await readFile("public/downloads/release-manifest.json", "utf8"),
) as ReleaseIdentity;
const artifactManifest = JSON.parse(
  await readFile("public/downloads/release-manifest.json", "utf8"),
) as { assets: Record<string, { sha256: string }> };
for (const name of [
  "panfolio-skill.zip",
  "panfolio-chatgpt-plugin.zip",
  "panfolio-mcp-icon.png",
]) {
  const bytes = await readFile(
    name.endsWith(".png") ? config.icon : `public/downloads/${name}`,
  );
  if (
    createHash("sha256").update(bytes).digest("hex") !==
    artifactManifest.assets[name]?.sha256
  )
    throw Error(`Artifact checksum mismatch: ${name}`);
}
const tag = `panfolio-ai-v${current.version}`;
const repo = "OctopusGarage/panfolio";
const gh = (args: string[]) =>
  execFileSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
const folder = await mkdtemp(join(tmpdir(), "panfolio-release-"));
try {
  let release: {
    draft: boolean;
    target_commitish: string;
    assets: { name: string }[];
  } | null = null;
  try {
    release = JSON.parse(gh(["api", `repos/${repo}/releases/tags/${tag}`]));
  } catch (error) {
    const failure = error as { stderr?: Buffer | string };
    if (!/HTTP 404|release not found/.test(String(failure.stderr))) throw error;
  }
  let existing: ReleaseIdentity | null = null;
  if (release) {
    if (release.assets.some((a) => a.name === "release-manifest.json")) {
      gh([
        "release",
        "download",
        tag,
        "--repo",
        repo,
        "--pattern",
        "release-manifest.json",
        "--dir",
        folder,
      ]);
      existing = JSON.parse(
        await readFile(join(folder, "release-manifest.json"), "utf8"),
      );
    } else if (
      release.draft &&
      release.target_commitish === current.sourceRevision
    )
      existing = current;
    else
      throw Error(
        "Existing release has no verifiable manifest; choose a new distribution version.",
      );
  }
  const decision = releaseDecision(current, existing, release?.draft);
  console.log(`${tag}: ${decision}`);
  if (operation === "preflight" || decision === "skip") process.exitCode = 0;
  else {
    const notes = join(folder, "notes.md");
    await writeFile(
      notes,
      `Panfolio Skill, plugin and MCP distribution ${current.version}.\n\nBuilt and validated from commit ${current.sourceRevision}. The shared cooking guidance and Markdown cookbook use the same content identity in both ZIPs and the deployed MCP.\n\n- panfolio-skill.zip: portable skill / eligible ChatGPT Skills upload.\n- panfolio-chatgpt-plugin.zip: complete plugin ZIP for the separate OpenAI portal.\n- panfolio-mcp-icon.png: configuration icon.\n- release-manifest.json and SHA256SUMS: versions, source revision and integrity evidence.\n\nMCP: ${config.mcpEndpoint}\n\nInstructions: https://github.com/${repo}/blob/${current.sourceRevision}/docs/distribution-maintenance.md\n\nArchived cookbook links are pinned to this commit. Repository installs track main; installed packages do not update automatically. No terminal or Python is required by consumers. Public HTTPS reading is required for the standalone skill; MCP returns complete text through its two tools.\n\nAutomated deployments and the expected MCP content/guidance identities passed before publication. Actual third-party account installation remains a separate test. Recipe content/media are excluded from the software MIT license.\n`,
    );
    const assets = [
      "public/downloads/panfolio-skill.zip",
      "public/downloads/panfolio-chatgpt-plugin.zip",
      config.icon,
      "public/downloads/release-manifest.json",
      "public/downloads/SHA256SUMS",
    ];
    if (decision === "create")
      gh([
        "release",
        "create",
        tag,
        ...assets,
        "--repo",
        repo,
        "--target",
        current.sourceRevision,
        "--title",
        `Panfolio AI distribution v${current.version}`,
        "--notes-file",
        notes,
        "--draft",
      ]);
    else {
      gh(["release", "upload", tag, ...assets, "--repo", repo, "--clobber"]);
      gh(["release", "edit", tag, "--repo", repo, "--notes-file", notes]);
    }
    gh(["release", "edit", tag, "--repo", repo, "--draft=false", "--latest"]);
    console.log(`Published https://github.com/${repo}/releases/tag/${tag}`);
  }
} finally {
  await rm(folder, { recursive: true, force: true });
}
