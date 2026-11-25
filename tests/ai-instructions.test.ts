import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("native-reading instructions preserve a release revision across linked documents", async () => {
  const skill = await readFile("skills/panfolio/SKILL.md", "utf8");
  assert.match(skill, /rewrite.*cookbook.*links.*content base/i);
  assert.match(skill, /same revision/i);
});

test("skill can use already connected Panfolio tools without requiring web access", async () => {
  const skill = await readFile("skills/panfolio/SKILL.md", "utf8");
  assert.match(skill, /get_guide/);
  assert.match(skill, /read_document/);
  assert.match(skill, /one retrieval route/i);
});
