import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  createMarkdownCookbook,
  RAW_CONTENT,
} from "../scripts/markdown-content";
import recipes from "../src/recipes.json";
import { recipeDiscovery } from "../src/discovery";
import { essentials } from "../src/kitchen-essentials";
import { bodyForPreparation } from "../src/preparation-content";

test("Markdown cookbook preserves all reviewed bilingual bodies and scoped preparations", () => {
  const files = createMarkdownCookbook();
  assert.deepEqual(files, createMarkdownCookbook());
  assert.equal(
    Object.keys(files).length,
    1 +
      2 *
        (3 +
          recipes.length +
          essentials.length +
          recipeDiscovery.reduce(
            (count, recipe) => count + recipe.preparations.length,
            0,
          )),
  );
  for (const lang of ["zh", "en"] as const) {
    for (const recipe of recipes) {
      assert.ok(
        files[`${lang}/recipes/${recipe.id}.md`].includes(
          lang === "zh" ? recipe.body : recipe.bodyEn,
        ),
      );
      const discovery = recipeDiscovery.find((r) => r.id === recipe.id)!;
      for (const prep of discovery.preparations) {
        const path = `${lang}/preparations/${recipe.id}/${prep.id}.md`;
        assert.ok(files[path].includes(bodyForPreparation(recipe, prep, lang)));
        assert.ok(files[`${lang}/recipes.md`].includes(RAW_CONTENT + path));
      }
    }
    for (const entry of essentials) {
      const body = files[`${lang}/references/${entry.id}.md`];
      for (const field of [
        "scope",
        "steps",
        "reasons",
        "mistakes",
        "boundary",
      ] as const) {
        const value =
          entry[`${field}${lang === "en" ? "En" : ""}` as keyof typeof entry];
        for (const text of Array.isArray(value) ? value : [value])
          assert.ok(
            body.includes(String(text)),
            `${lang}/${entry.id}/${field}`,
          );
      }
      if (entry.relatedNote)
        assert.ok(
          body.includes(
            lang === "zh" ? entry.relatedNote : entry.relatedNoteEn!,
          ),
        );
      for (const url of entry.sources) assert.ok(body.includes(url));
    }
  }
  const rolls = files["en/preparations/samukichi-asparagus/pork-rolls.md"];
  assert.ok(rolls.includes("3 asparagus spears"));
  assert.ok(rolls.includes("https://www.youtube.com/watch?v=4uz0BDXHato"));
  assert.ok(!rolls.includes("- Basic version:"));
});

test("all public Markdown links resolve to stable generated records", () => {
  const files = createMarkdownCookbook();
  for (const body of Object.values(files)) {
    for (const match of body.matchAll(
      /\]\((https:\/\/raw\.githubusercontent\.com\/OctopusGarage\/panfolio\/main\/content\/[^)]+)\)/g,
    )) {
      assert.ok(files[match[1].slice(RAW_CONTENT.length)], match[1]);
    }
  }
  for (const path of Object.keys(files))
    assert.ok(!path.includes("..") && path.endsWith(".md"));
});

test("checked-in cookbook is current and skill has no consumer execution path", async () => {
  for (const [path, body] of Object.entries(createMarkdownCookbook()))
    assert.equal(await readFile("content/" + path, "utf8"), body, path);
  const skill = await readFile("skills/panfolio/SKILL.md", "utf8");
  assert.ok(skill.includes(RAW_CONTENT + "zh/guide.md"));
  assert.ok(skill.includes(RAW_CONTENT + "en/guide.md"));
  assert.ok(
    !/python3|curl |manifest\.json|octopusgarage\.github\.io|panfolio\.py/.test(
      skill,
    ),
  );
});
