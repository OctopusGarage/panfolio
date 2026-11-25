import type { DiscoveryState } from "./discovery-types";
export interface SavedSearch {
  id: string;
  name: string;
  collection?: "japanese-chef";
  state: DiscoveryState;
}
export interface KitchenData {
  tried: string[];
  repeat: string[];
  tags: Record<string, string[]>;
  searches: SavedSearch[];
}
export const emptyKitchen = (): KitchenData => ({
  tried: [],
  repeat: [],
  tags: {},
  searches: [],
});
export interface Backup {
  version: 1;
  kitchen?: KitchenData;
  favorites: string[];
  notes: Record<string, string>;
}
export function matches(
  recipe: { title: string; body: string },
  query: string,
) {
  return (recipe.title + " " + recipe.body)
    .toLocaleLowerCase()
    .includes(query.trim().toLocaleLowerCase());
}
export function parseBackup(text: string): Backup {
  const v = JSON.parse(text);
  if (
    !v ||
    v.version !== 1 ||
    !Array.isArray(v.favorites) ||
    !v.favorites.every((x: unknown) => typeof x === "string") ||
    !v.notes ||
    typeof v.notes !== "object" ||
    Array.isArray(v.notes) ||
    !Object.values(v.notes).every((x) => typeof x === "string")
  )
    throw new Error("Invalid Panfolio backup");
  return {
    version: 1,
    ...(v.kitchen === undefined ? {} : { kitchen: validateKitchen(v.kitchen) }),
    favorites: [...new Set<string>(v.favorites)],
    notes: Object.fromEntries(Object.entries(v.notes)) as Record<
      string,
      string
    >,
  };
}

function validateKitchen(value: unknown): KitchenData {
  const strings = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every((x) => typeof x === "string");
  const object = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === "object" && !Array.isArray(v);
  const facets = new Set([
    "occasion",
    "ingredient",
    "method",
    "season",
    "style",
    "equipment",
    "source",
    "topic",
    "stage",
    "task",
  ]);
  if (
    !object(value) ||
    !strings(value.tried) ||
    !strings(value.repeat) ||
    !object(value.tags) ||
    !Object.values(value.tags).every(strings) ||
    !Array.isArray(value.searches)
  )
    throw Error("Invalid kitchen metadata");
  for (const search of value.searches) {
    if (
      !object(search) ||
      typeof search.id !== "string" ||
      typeof search.name !== "string" ||
      (search.collection !== undefined &&
        search.collection !== "japanese-chef") ||
      !object(search.state)
    )
      throw Error("Invalid saved search");
    const state = search.state;
    if (
      typeof state.query !== "string" ||
      (state.category !== undefined &&
        !["chinese", "japanese", "dessert"].includes(String(state.category))) ||
      !["any", "all"].includes(String(state.ingredientMode)) ||
      !["recipes", "references", "all"].includes(String(state.scope)) ||
      !object(state.selected) ||
      !Object.entries(state.selected).every(
        ([key, v]) => facets.has(key) && strings(v),
      )
    )
      throw Error("Invalid saved search state");
  }
  return JSON.parse(JSON.stringify(value)) as KitchenData;
}
export function mergeKitchen(
  a: KitchenData = emptyKitchen(),
  b: KitchenData = emptyKitchen(),
): KitchenData {
  return {
    tried: [...new Set([...a.tried, ...b.tried])],
    repeat: [...new Set([...a.repeat, ...b.repeat])],
    tags: Object.fromEntries(
      [...new Set([...Object.keys(a.tags), ...Object.keys(b.tags)])].map(
        (id) => [
          id,
          [
            ...new Set([
              ...(Object.hasOwn(a.tags, id) ? a.tags[id] : []),
              ...(Object.hasOwn(b.tags, id) ? b.tags[id] : []),
            ]),
          ],
        ],
      ),
    ),
    searches: [
      ...a.searches,
      ...b.searches.filter((s) => !a.searches.some((x) => x.id === s.id)),
    ],
  };
}
