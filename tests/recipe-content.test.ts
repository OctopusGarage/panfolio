import { test } from "node:test";
import assert from "node:assert/strict";
import recipes from "../src/recipes.json";
import { recipeSections, cookingSections } from "../src/recipe-content";
test("every recipe uses consistent sections and sequential steps", () => {
  for (const recipe of recipes) {
    const sections = recipeSections(recipe.body);
    const method = sections.find((s) => s.title === "做法");
    assert.ok(method, recipe.id);
    const headings = Array.from(
      method.content.matchAll(/^### (\d+)\. /gm),
      (m) => Number(m[1]),
    );
    assert.ok(headings.length > 1);
    assert.deepEqual(
      headings,
      headings.map((_, i) => i + 1),
    );
    assert.ok(!/####|\\\n|是否需要|以下是|可以总结/.test(recipe.body));
    assert.ok(!/[馬鈴燉飯蝦雞蔥燒醬鹹製準備]/.test(recipe.title + recipe.body));
    assert.ok(cookingSections(recipe.body).length > 1);
  }
});
test("cooking excludes reference links and keeps ingredient preparation", () => {
  const recipe = recipes[0];
  const steps = cookingSections(recipe.body);
  assert.match(steps[0], /^## 食材/);
  assert.ok(!steps.some((step) => step.includes("参考链接")));
  assert.equal(steps.length, 6);
});
