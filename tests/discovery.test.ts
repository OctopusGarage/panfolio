import test from "node:test";
import assert from "node:assert/strict";
import recipes from "../src/recipes.json";
import { essentials } from "../src/kitchen-essentials";
import {
  discoveryTags,
  recipeDiscovery,
  referenceDiscovery,
  emptyDiscoveryState,
  findRecipes,
  findReferences,
  facetOptions,
} from "../src/discovery";
test("reviewed discovery covers every entry with valid canonical tags", () => {
  assert.deepEqual(
    recipeDiscovery.map((r) => r.id).sort(),
    recipes.map((r) => r.id).sort(),
  );
  assert.deepEqual(
    referenceDiscovery.map((r) => r.id).sort(),
    essentials.map((r) => r.id).sort(),
  );
  const ids = new Set(discoveryTags.map((t) => t.id));
  assert.equal(ids.size, discoveryTags.length);
  for (const record of [
    ...recipeDiscovery.flatMap((r) => r.preparations),
    ...referenceDiscovery,
  ]) {
    for (const [facet, values] of Object.entries(record.facets))
      for (const id of values ?? []) {
        assert.ok(ids.has(id), `Unknown tag ${id}`);
        assert.equal(discoveryTags.find((t) => t.id === id)?.facet, facet);
      }
  }
});
test("all ingredients must occur within one rice-cooker preparation", () => {
  const state = emptyDiscoveryState();
  state.ingredientMode = "all";
  state.selected.ingredient = ["ingredient:egg", "ingredient:potato"];
  assert.ok(
    !findRecipes(state).some((r) => r.recipe.id === "awei-one-pot-rice"),
  );
});
test("potato aliases find recipes and standalone knife guidance", () => {
  const state = { ...emptyDiscoveryState(), query: "马铃薯" };
  assert.ok(findRecipes(state).length > 0);
  assert.ok(
    findReferences(state).some((r) => r.entry.id === "potato-julienne"),
  );
});
test("references do not index counterexamples as positive search evidence", () => {
  const state = { ...emptyDiscoveryState("references"), query: "salmon" };
  assert.ok(!findReferences(state).some((r) => r.entry.id === "soy-sauce-pan"));
});
test("facet counts deduplicate parent collections", () => {
  const state = emptyDiscoveryState();
  for (const option of facetOptions(state, "ingredient", "recipes")) {
    const selected = { ...state, selected: { ingredient: [option.tag.id] } };
    const matches = findRecipes(selected);
    assert.equal(option.count, new Set(matches.map((r) => r.recipe.id)).size);
  }
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

test("breakfast tuna locates only its two suitable preparations", () => {
  const state = emptyDiscoveryState();
  state.selected = {
    occasion: ["occasion:breakfast"],
    ingredient: ["ingredient:tuna"],
  };
  const tuna = findRecipes(state).find(
    (match) => match.recipe.id === "samukichi-tuna",
  );
  assert.equal(tuna?.preparationIds.length, 2);
});

test("optional complete cheese finish can be found without combining alternative meats", () => {
  const state = emptyDiscoveryState();
  state.selected.ingredient = ["ingredient:cheese"];
  assert.ok(
    findRecipes(state).some(
      (match) => match.recipe.id === "samukichi-cauliflower",
    ),
  );
  state.ingredientMode = "all";
  state.selected.ingredient = ["ingredient:pork", "ingredient:beef"];
  assert.ok(
    !findRecipes(state).some(
      (match) => match.recipe.id === "ali-scallion-meat-pancakes",
    ),
  );
});

test("All-ingredients facet counts include the existing ingredient intersection", () => {
  const state = emptyDiscoveryState();
  state.ingredientMode = "all";
  state.selected.ingredient = ["ingredient:potato"];
  const egg = facetOptions(state, "ingredient", "recipes").find(
    (option) => option.tag.id === "ingredient:egg",
  )!;
  assert.equal(
    egg.count,
    findRecipes({
      ...state,
      selected: { ingredient: ["ingredient:potato", "ingredient:egg"] },
    }).length,
  );
});
