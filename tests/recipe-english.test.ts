import { test } from "node:test";
import assert from "node:assert/strict";
import recipes from "../src/recipes.json";
import { evaluateTranslation } from "../src/recipe-eval";
import { recipeBody } from "../src/recipe-language";
test("all recipes preserve bilingual structure, numbers, links and terminology", () => {
  for (const recipe of recipes)
    assert.deepEqual(evaluateTranslation(recipe), [], recipe.id);
});
test("evaluation detects altered time and missing steps", () => {
  const recipe = recipes[0];
  assert.ok(
    evaluateTranslation({
      ...recipe,
      bodyEn: recipe.bodyEn.replace("25 minutes", "15 minutes"),
    }).includes("Numeric quantities or timings differ"),
  );
  assert.ok(
    evaluateTranslation({
      ...recipe,
      bodyEn: recipe.bodyEn.replace("### 2.", "### 9."),
    }).includes("Step numbering differs"),
  );
});
test("recipe body follows the locale", () => {
  assert.equal(recipeBody(recipes[0], "en"), recipes[0].bodyEn);
  assert.equal(recipeBody(recipes[0], "zh"), recipes[0].body);
});

test("evaluation catches teaspoon/tablespoon swaps and shacha substitution", () => {
  assert.ok(
    evaluateTranslation({
      ...recipes[14],
      bodyEn: recipes[14].bodyEn.replace(
        "2 teaspoons cooking wine",
        "2 tablespoons cooking wine",
      ),
    }).includes("Measured units or timings differ"),
  );
  assert.ok(
    evaluateTranslation({
      ...recipes[9],
      bodyEn: recipes[9].bodyEn.replace(/shacha/g, "satay"),
    }).includes("Known translation regression"),
  );
});
