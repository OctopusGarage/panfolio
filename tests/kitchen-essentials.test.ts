import { test } from "node:test";
import assert from "node:assert/strict";
import { essentials, essentialsForRecipe } from "../src/kitchen-essentials";
import recipes from "../src/recipes.json";

test("kitchen references have complete bilingual content and valid recipe associations", () => {
  assert.equal(
    new Set(essentials.map((item) => item.id)).size,
    essentials.length,
  );
  for (const entry of essentials) {
    assert.equal("category" in entry, false);
    assert.equal("tags" in entry, false);
    if (entry.relatedNote) assert.ok(entry.relatedNoteEn?.trim());
    for (const field of ["title", "summary", "scope", "boundary"] as const) {
      assert.ok(entry[field].trim());
      assert.ok(entry[`${field}En`].trim());
    }
    for (const field of ["steps", "reasons", "mistakes"] as const) {
      assert.ok(entry[field].length);
      assert.equal(entry[field].length, entry[`${field}En`].length);
      assert.doesNotMatch(entry[`${field}En`].join(" "), /[\u3400-\u9fff]/);
    }
    const numbers = (text: string) =>
      (text.match(/\d+(?:\.\d+)?/g) || []).sort();
    assert.deepEqual(
      numbers(
        [
          entry.summary,
          entry.scope,
          ...entry.steps,
          ...entry.reasons,
          ...entry.mistakes,
          entry.boundary,
        ].join(" "),
      ),
      numbers(
        [
          entry.summaryEn,
          entry.scopeEn,
          ...entry.stepsEn,
          ...entry.reasonsEn,
          ...entry.mistakesEn,
          entry.boundaryEn,
        ].join(" "),
      ),
    );
    for (const id of entry.recipeIds) {
      assert.ok(recipes.some((recipe) => recipe.id === id));
      assert.ok(essentialsForRecipe(id).includes(entry));
    }
    assert.ok(entry.sources.length);
    for (const source of entry.sources)
      assert.equal(new URL(source).hostname, "www.youtube.com");
  }
});

test("conditional references retain explicit comparison and ingredient boundaries", () => {
  const soy = essentials.find((entry) => entry.id === "soy-sauce-pan")!;
  assert.match(soy.relatedNote || "", /三文鱼.*对照/);
  assert.match(soy.relatedNoteEn || "", /comparison/i);
  const rice = essentials.find(
    (entry) => entry.id === "loosen-and-sear-fried-rice",
  )!;
  assert.match(rice.steps.join(" "), /充分炒熟的肉/);
  assert.match(rice.steps.join(" "), /不要.*生肉/);
  assert.match(rice.stepsEn.join(" "), /fully cooked meat/i);
  assert.match(rice.stepsEn.join(" "), /do not add raw meat/i);
});
