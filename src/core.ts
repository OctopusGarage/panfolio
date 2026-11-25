export interface Backup {
  version: 1;
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
    favorites: [...new Set<string>(v.favorites)],
    notes: Object.fromEntries(Object.entries(v.notes)) as Record<
      string,
      string
    >,
  };
}
