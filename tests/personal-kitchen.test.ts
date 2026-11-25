import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyKitchen, mergeKitchen, parseBackup } from "../src/core";
test("kitchen merge unions statuses and private tags and preserves searches", () => {
  const local = {
    ...emptyKitchen(),
    tried: ["one"],
    tags: { one: ["weekday"] },
    searches: [
      {
        id: "s",
        name: "Dinner",
        state: {
          query: "rice",
          selected: {},
          ingredientMode: "any" as const,
          scope: "recipes" as const,
        },
      },
    ],
  };
  const incoming = {
    ...emptyKitchen(),
    tried: ["two"],
    repeat: ["one"],
    tags: { one: ["weekday", "quick"] },
  };
  assert.deepEqual(mergeKitchen(local, incoming), {
    ...local,
    tried: ["one", "two"],
    repeat: ["one"],
    tags: { one: ["weekday", "quick"] },
  });
  assert.deepEqual(mergeKitchen(local), local);
});
test("malformed saved search is rejected and special tag keys remain data", () => {
  assert.throws(() =>
    parseBackup(
      JSON.stringify({
        version: 1,
        favorites: [],
        notes: {},
        kitchen: {
          ...emptyKitchen(),
          searches: [
            {
              id: "s",
              name: "bad",
              state: {
                query: "",
                scope: "recipes",
                ingredientMode: "any",
                selected: { unknown: ["x"] },
              },
            },
          ],
        },
      }),
    ),
  );
  const result = parseBackup(
    '{"version":1,"favorites":[],"notes":{},"kitchen":{"tried":[],"repeat":[],"searches":[],"tags":{"__proto__":["private"]}}}',
  );
  assert.deepEqual(Object.entries(result.kitchen!.tags), [
    ["__proto__", ["private"]],
  ]);
});

test("saved searches preserve supported collection context and reject malformed context", () => {
  const backup = {
    version: 1,
    favorites: [],
    notes: {},
    kitchen: {
      ...emptyKitchen(),
      searches: [
        {
          id: "chef",
          name: "Chef recipes",
          collection: "japanese-chef",
          state: {
            query: "chicken",
            selected: {},
            ingredientMode: "any",
            scope: "recipes",
          },
        },
      ],
    },
  };
  assert.equal(
    parseBackup(JSON.stringify(backup)).kitchen?.searches[0].collection,
    "japanese-chef",
  );
  assert.throws(() =>
    parseBackup(
      JSON.stringify({
        ...backup,
        kitchen: {
          ...backup.kitchen,
          searches: [{ ...backup.kitchen.searches[0], collection: 42 }],
        },
      }),
    ),
  );
});
