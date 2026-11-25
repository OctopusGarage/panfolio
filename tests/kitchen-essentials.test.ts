import { test } from "node:test";
import assert from "node:assert/strict";
import {
  essentials,
  essentialCategories,
  essentialsForRecipe,
} from "../src/kitchen-essentials";
import recipes from "../src/recipes.json";

test("kitchen references have complete bilingual content and valid recipe associations", () => {
  assert.equal(
    new Set(essentials.map((item) => item.id)).size,
    essentials.length,
  );
  for (const entry of essentials) {
    assert.ok(
      essentialCategories.some((category) => category.id === entry.category),
    );
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
          entry.scope,
          ...entry.steps,
          ...entry.reasons,
          ...entry.mistakes,
          entry.boundary,
        ].join(" "),
      ),
      numbers(
        [
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
