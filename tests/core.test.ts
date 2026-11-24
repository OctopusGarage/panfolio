import { test } from "node:test";
import assert from "node:assert/strict";
import { parseBackup, matches } from "../src/core";
import recipes from "../src/recipes.json";
import { validateRecipes } from "../src/recipe-validation";
test("recipe collection has unique IDs and valid content", () => {
  assert.doesNotThrow(() => validateRecipes(recipes));
});
test("search finds ingredient text", () => {
  assert.ok(matches({ title: "Dinner", body: "potato and beef" }, " potato "));
  assert.ok(!matches({ title: "Dinner", body: "beef" }, "fish"));
});
test("backup rejects malformed data before changing storage", () => {
  assert.throws(() => parseBackup('{"version":1,"favorites":[3],"notes":{}}'));
  assert.throws(() => parseBackup('{"version":2,"favorites":[],"notes":{}}'));
  assert.deepEqual(
    parseBackup(
      '{"version":1,"favorites":["one"],"notes":{"one":"less salt"}}',
    ),
    { version: 1, favorites: ["one"], notes: { one: "less salt" } },
  );
});
