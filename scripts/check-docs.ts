import { access, readFile, readdir } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
const files = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  ...(await readdir("docs", { recursive: true }))
    .filter((p) => p.endsWith(".md"))
    .map((p) => join("docs", p)),
  "assets/branding/panfolio-mcp/README.md",
];
const failures: string[] = [];
for (const path of files) {
  const body = (await readFile(path, "utf8")).replace(/```[^]*?```/g, "");
  for (const match of body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^(?:[a-z]+:|\/\/)/i.test(target)) continue;
    try {
      await access(resolve(dirname(path), decodeURIComponent(target)));
    } catch {
      failures.push(`${path}: ${target}`);
    }
  }
}
if (failures.length)
  throw Error("Broken local documentation links:\n" + failures.join("\n"));
console.log(`Checked local links in ${files.length} documentation files.`);
