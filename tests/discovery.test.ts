import test from "node:test";
import assert from "node:assert/strict";
import recipes from "../src/recipes.json";
import { essentials } from "../src/kitchen-essentials";
import {
  recipeDiscovery,
  referenceDiscovery,
  emptyDiscoveryState,
  findRecipes,
  findReferences,
} from "../src/discovery";
import { recipeCategories } from "../src/recipe-categories";

test("only three exhaustive exclusive recipe categories remain", () => {
  assert.deepEqual(
    recipeCategories.map((category) => category.zh),
    ["中餐", "日厨系列", "甜品", "饮品"],
  );
  const seen = new Set<string>();
  for (const category of recipeCategories) {
    const state = { ...emptyDiscoveryState(), category: category.id };
    const expected = recipes
      .filter((recipe) => recipe.category === category.id)
      .map((recipe) => recipe.id)
      .sort();
    const matches = findRecipes(state);
    assert.deepEqual(matches.map((match) => match.recipe.id).sort(), expected);
    for (const match of matches) {
      assert.ok(!seen.has(match.recipe.id));
      seen.add(match.recipe.id);
    }
  }
  assert.equal(seen.size, recipes.length);
});
test("chef category retains all thirteen SAMUKICHI recipes and every preparation", () => {
  const matches = findRecipes({
    ...emptyDiscoveryState(),
    category: "japanese",
  });
  assert.equal(matches.length, 14);
  for (const recipe of recipes.filter(
    (recipe) => recipe.collection === "japanese-chef",
  )) {
    const match = matches.find((match) => match.recipe.id === recipe.id)!;
    assert.ok(match, recipe.id);
    assert.deepEqual(
      match.preparationIds,
      recipeDiscovery
        .find((record) => record.id === recipe.id)!
        .preparations.map((preparation) => preparation.id),
    );
  }
});
test("removed legacy facets do not silently hide recipes or kitchen references", () => {
  const state = emptyDiscoveryState();
  state.selected = {
    season: ["season:winter"],
    ingredient: ["ingredient:potato"],
  };
  state.ingredientMode = "all";
  assert.equal(findRecipes(state).length, recipes.length);
  assert.equal(
    findReferences({ ...state, scope: "references" }).length,
    essentials.length,
  );
});
test("search remains within the chosen category and preserves ingredient aliases", () => {
  assert.equal(
    findRecipes({
      ...emptyDiscoveryState(),
      category: "dessert",
      query: "beef",
    }).length,
    0,
  );
  assert.ok(
    findRecipes({ ...emptyDiscoveryState(), query: "马铃薯" }).length > 0,
  );
  assert.ok(
    findReferences({
      ...emptyDiscoveryState("references"),
      query: "马铃薯",
    }).some((match) => match.entry.id === "potato-julienne"),
  );
});
test("references index positive guidance and metadata covers every entry", () => {
  assert.deepEqual(
    recipeDiscovery.map((record) => record.id).sort(),
    recipes.map((recipe) => recipe.id).sort(),
  );
  assert.deepEqual(
    referenceDiscovery.map((record) => record.id).sort(),
    essentials.map((entry) => entry.id).sort(),
  );
  assert.ok(
    !findReferences({
      ...emptyDiscoveryState("references"),
      query: "salmon",
    }).some((match) => match.entry.id === "soy-sauce-pan"),
  );
});
test("preparation selectors resolve bilingual source sections", () => {
  for (const record of recipeDiscovery) {
    const recipe = recipes.find((entry) => entry.id === record.id)!;
    assert.equal(
      new Set(record.preparations.map((p) => p.id)).size,
      record.preparations.length,
    );
    for (const preparation of record.preparations) {
      for (const body of [recipe.body, recipe.bodyEn]) {
        const headings = [...body.matchAll(/^### (\d+)\./gm)].map((match) =>
          Number(match[1]),
        );
        for (const step of preparation.methodSteps ?? []) {
          assert.ok(
            headings.includes(step),
            `${record.id}/${preparation.id}: missing step ${step}`,
          );
        }
        const ingredients = body.split(/^## (?:做法|Method)\s*$/m)[0];
        const lines = ingredients
          .split("\n")
          .filter((line) => /^- /.test(line));
        for (const index of preparation.ingredientLines ?? []) {
          assert.ok(
            Number.isInteger(index) && index >= 0 && index < lines.length,
            `${record.id}/${preparation.id}: missing ingredient ${index}`,
          );
        }
      }
    }
  }
});

test("component onions exclude soup ingredient paragraphs", () => {
  const onions = recipeDiscovery.find(
    (entry) => entry.id === "samukichi-caramelized-onions",
  )!;
  assert.deepEqual(
    onions.preparations.find((entry) => entry.id === "onions")
      ?.ingredientParagraphs,
    [0],
  );
  const rice = recipeDiscovery.find(
    (entry) => entry.id === "magic-lamb-pilaf",
  )!;
  assert.deepEqual(
    rice.preparations.find((entry) => entry.id === "white-rice")
      ?.ingredientLines,
    [0],
  );
  assert.deepEqual(
    rice.preparations.find((entry) => entry.id === "lamb-pilaf")
      ?.ingredientLines,
    [1],
  );
});
