import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createMarkdownCookbook } from "./markdown-content";
const files = createMarkdownCookbook();
const check = process.argv.includes("--check");
if (check) {
  const actual = (await readdir("content", { recursive: true }))
    .filter((path) => path.endsWith(".md"))
    .sort();
  if (JSON.stringify(actual) !== JSON.stringify(Object.keys(files).sort()))
    throw Error("Stale Markdown file inventory; run pnpm content:build");
}
for (const [path, body] of Object.entries(files)) {
  const target = join("content", path);
  if (check) {
    if ((await readFile(target, "utf8")) !== body)
      throw Error(`Stale ${target}; run pnpm content:build`);
  } else {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, body);
  }
}
console.log(
  `${check ? "Verified" : "Generated"} ${Object.keys(files).length} repository Markdown files.`,
);
