import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { distributionFiles } from "./distribution";
const check = process.argv.includes("--check");
for (const [path, body] of Object.entries(await distributionFiles())) {
  if (check) {
    if (!Buffer.from(body).equals(await readFile(path)))
      throw Error(`Stale ${path}; run pnpm distribution:sync`);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, body);
  }
}
console.log(
  check
    ? "Shared distribution outputs verified."
    : "Synchronized Skill, plugin, MCP version and icon.",
);
