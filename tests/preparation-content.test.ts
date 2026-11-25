import { test } from "node:test";
import assert from "node:assert/strict";
import recipes from "../src/recipes.json";
import { bodyForPreparation } from "../src/preparation-content";
import type { DiscoveryPreparation } from "../src/discovery-types";

test("choosing a preparation keeps shared operations but excludes sibling ingredients and steps", () => {
  const recipe = recipes.find((r) => r.id === "samukichi-asparagus")!;
  const preparation: DiscoveryPreparation = {
    id: "rolls",
    title: "肉卷",
    titleEn: "Rolls",
    kind: "dish",
    methodSteps: [1, 6, 7, 8],
    ingredientLines: [1, 2, 3],
  };
  const body = bodyForPreparation(recipe, preparation, "zh");
  assert.match(body, /五花肉薄片/);
  assert.doesNotMatch(body.split("## 小贴士")[0], /基础版：斜切|短蒸约 10 秒/);
  assert.match(body, /### 2\. 肉卷版/);
  assert.match(body, /## 小贴士/);
  const english = bodyForPreparation(recipe, preparation, "en");
  assert.doesNotMatch(english, /[\u3400-\u9fff]/);
});
test("the original body stays intact when no preparation is selected", () => {
  assert.equal(
    bodyForPreparation(recipes[0], undefined, "zh"),
    recipes[0].body,
  );
});

test("a component can select prose ingredients without including its soup sibling", () => {
  const recipe = recipes.find((r) => r.id === "samukichi-caramelized-onions")!;
  const preparation: DiscoveryPreparation = {
    id: "component",
    title: "洋葱",
    titleEn: "Onions",
    kind: "component",
    ingredientParagraphs: [0],
    methodSteps: [1, 2, 3, 4, 5, 7],
  };
  for (const locale of ["zh", "en"] as const) {
    const ingredients = bodyForPreparation(recipe, preparation, locale).split(
      locale === "zh" ? "## 做法" : "## Method",
    )[0];
    assert.doesNotMatch(ingredients, /400|大蒜|garlic/);
    assert.match(ingredients, /5/);
  }
});
