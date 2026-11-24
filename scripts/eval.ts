import assert from "node:assert/strict";
import recipes from "../src/recipes.json";
import { englishTitles } from "../src/i18n";
assert.equal(recipes.length, 20);
assert.equal(englishTitles.length, recipes.length);
assert.equal(new Set(recipes.map((r) => r.id)).size, recipes.length);
for (const [i, r] of recipes.entries()) {
  assert.ok(r.title && englishTitles[i] && r.body.length > 50);
  assert.equal(
    new URL(r.source).hostname,
    "codefarmer2024s-organization.gitbook.io",
  );
  assert.ok(
    r.body.includes("# " + r.title),
    `Original heading missing: ${r.id}`,
  );
  assert.ok(!/<script\b|javascript:/i.test(r.body), `Unsafe source: ${r.id}`);
}
console.log(
  "20 recipe sources, stable IDs, original headings and English titles validated. No live model evaluation is required.",
);
