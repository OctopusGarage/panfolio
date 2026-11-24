import assert from "node:assert/strict";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import recipes from "../src/recipes.json";
import { validateRecipes } from "../src/recipe-validation";
import { evaluateTranslation } from "../src/recipe-eval";
validateRecipes(recipes);
const cases = recipes.map((recipe) => ({
  id: recipe.id,
  title: recipe.title,
  issues: evaluateTranslation(recipe),
}));
for (const item of cases) assert.deepEqual(item.issues, [], item.id);
console.log(
  `${recipes.length} recipes validated: bilingual sections, steps, numeric quantities, measured units, reference links and source-specific translation terminology.`,
);
if (process.argv.includes("--report")) {
  const review = readFileSync("docs/english-ai-review.md", "utf8");
  const sha = (text: string) => createHash("sha256").update(text).digest("hex");
  const report = {
    sourceSha256: sha(readFileSync("src/recipes.json", "utf8")),
    independentAiReview: {
      path: "docs/english-ai-review.md",
      sha256: sha(review),
      reviewedSnapshotSha256: review.match(/SHA256: `([a-f0-9]+)`/)?.[1],
      kind: "Independent native AI-agent review; corrections subsequently applied by implementing agent; no live API benchmark claimed",
    },
    checks: [
      "bilingual completeness",
      "section parity",
      "step numbering",
      "numeric parity",
      "measured-unit parity",
      "reference parity",
      "English-only body",
      "source-specific terminology regressions",
    ],
    cases,
  };
  mkdirSync("evals", { recursive: true });
  writeFileSync(
    "evals/recipe-translations.json",
    JSON.stringify(report, null, 2) + "\n",
  );
}
