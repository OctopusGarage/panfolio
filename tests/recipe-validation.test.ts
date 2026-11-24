import { test } from "node:test";
import assert from "node:assert/strict";
import { validateRecipes } from "../src/recipe-validation";
test("collection accepts more than twenty recipes without external sources or translations", () => {
  assert.doesNotThrow(() =>
    validateRecipes(
      Array.from({ length: 75 }, (_, i) => ({
        id: `recipe-${i}`,
        title: `Dish ${i}`,
        body: "My cooking instructions",
      })),
    ),
  );
});
test("empty collection and reordered independent translations remain valid", () => {
  assert.doesNotThrow(() => validateRecipes([]));
  assert.doesNotThrow(() =>
    validateRecipes([
      { id: "b", title: "乙", titleEn: "B", body: "Instructions" },
      { id: "a", title: "甲", titleEn: "A", body: "Instructions" },
    ]),
  );
});
test("duplicate IDs and unsafe sources are rejected", () => {
  const r = { id: "a", title: "Dish", body: "Instructions" };
  assert.throws(() => validateRecipes([r, r]));
  assert.throws(() =>
    validateRecipes([{ ...r, source: "javascript:alert(1)" }]),
  );
});
