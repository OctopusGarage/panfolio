import test from "node:test";
import assert from "node:assert/strict";
import { readDocument, getGuide } from "../src/server";

test("guide provides bilingual entry paths and needs no external browsing", () => {
  assert.match(getGuide("zh"), /zh\/recipes\.md/);
  assert.match(getGuide("en"), /en\/references\.md/);
  assert.match(getGuide("en"), /read_document/);
});
test("two reported dishes are available with their scoped methods and original sources", () => {
  const rolls = readDocument(
    "en/preparations/samukichi-asparagus/pork-rolls.md",
  );
  assert.match(rolls, /3 asparagus spears/);
  assert.match(rolls, /balsamic vinegar/);
  assert.ok(!rolls.includes("- Basic version:"));
  assert.match(rolls, /4uz0BDXHato/);
  assert.match(
    readDocument("zh/preparations/samukichi-salmon/main.md"),
    /关火/,
  );
  assert.match(
    readDocument("zh/references/soy-sauce-pan.md"),
    /不采用热锅边增香/,
  );
});
test("document reader only accepts exact published paths, never arbitrary URLs", () => {
  for (const path of [
    "../LICENSE",
    "https://example.com",
    "/index.md",
    "zh/../index.md",
    "__proto__",
    "missing.md",
    "zh/recipes.md?x=1",
  ])
    assert.throws(() => readDocument(path), /Unknown cookbook document/);
});

test("MCP guidance is generated from the same bilingual rules as the portable skill", async () => {
  const { readFile } = await import("node:fs/promises");
  const rules = JSON.parse(
    await readFile("../distribution/guidance.json", "utf8"),
  ) as { en: string; zh: string }[];
  for (const lang of ["zh", "en"] as const)
    for (const rule of rules) assert.ok(getGuide(lang).includes(rule[lang]));
});
