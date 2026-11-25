import { test } from "node:test";
import assert from "node:assert/strict";
import recipes from "../src/recipes.json";
import { validateRecipes } from "../src/recipe-validation";

test("every curated recipe has one of the four explicit browse categories", () => {
  const allowed = ["chinese", "japanese", "dessert", "drinks"];
  for (const recipe of recipes) {
    assert.ok(
      allowed.includes((recipe as { category?: string }).category || ""),
      recipe.id,
    );
  }
  assert.equal((recipes[0] as { category?: string }).category, "japanese");
  assert.ok(
    recipes
      .filter((recipe) => recipe.collection === "japanese-chef")
      .every(
        (recipe) => (recipe as { category?: string }).category === "japanese",
      ),
  );
});

test("recipe validation rejects unsupported explicit categories", () => {
  const recipe = {
    id: "example",
    title: "Dish",
    body: "Method",
    category: "staples",
  };
  assert.throws(() => validateRecipes([recipe]), /category/i);
});
