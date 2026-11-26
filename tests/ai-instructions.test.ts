import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("the installed skill delegates current guidance to bilingual remote entry points", async () => {
  const skill = await readFile("skills/panfolio/SKILL.md", "utf8");
  assert.match(skill, /each new task/i);
  for (const lang of ["en", "zh"]) {
    assert.ok(skill.includes(`main/content/${lang}/guide.md`));
    const guide = await readFile(`content/${lang}/guide.md`, "utf8");
    assert.ok(guide.includes(`/${lang}/recipes.md`));
    assert.ok(guide.includes(`/${lang}/references.md`));
  }
});

test("skill can use already connected Panfolio tools without requiring web access", async () => {
  const skill = await readFile("skills/panfolio/SKILL.md", "utf8");
  assert.match(skill, /get_guide/);
  assert.match(skill, /read_document/);
  assert.match(skill, /one retrieval route/i);
});
