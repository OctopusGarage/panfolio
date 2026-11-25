import recipes from "./recipes.json";
import { essentials } from "./kitchen-essentials";
import recipeMetadata from "./recipe-discovery.json";
import referenceMetadata from "./reference-discovery.json";
import type {
  RecipeDiscovery,
  ReferenceDiscovery,
  DiscoveryState,
  DiscoveryScope,
  DiscoveryOptions,
  DiscoveryPreparation,
  RecipeMatch,
  ReferenceMatch,
} from "./discovery-types";
export type * from "./discovery-types";
export const recipeDiscovery = recipeMetadata as RecipeDiscovery[];
export const referenceDiscovery = referenceMetadata as ReferenceDiscovery[];
export function emptyDiscoveryState(
  scope: DiscoveryScope = "recipes",
): DiscoveryState {
  return { query: "", selected: {}, ingredientMode: "any", scope };
}
const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
const referenceById = new Map(essentials.map((entry) => [entry.id, entry]));
const normalize = (text: string) =>
  text.toLowerCase().normalize("NFKC").replace(/[’']/g, "").trim();
function queryScore(
  query: string,
  titles: string[],
  metadata: string,
  body: string,
) {
  const q = normalize(query);
  if (!q) return 1;
  const title = normalize(titles.join(" "));
  const meta = normalize(metadata);
  const full = normalize(body);
  const terms = q.split(/\s+/).filter(Boolean);
  if (
    !terms.every(
      (term) =>
        title.includes(term) || meta.includes(term) || full.includes(term),
    )
  )
    return 0;
  if (titles.some((t) => normalize(t) === q)) return 100;
  if (title.includes(q)) return 80;
  if (terms.every((term) => title.includes(term) || meta.includes(term)))
    return 50;
  return 10;
}
/** Restrict fallback body text to a preparation's actual sections, never its siblings. */
function preparationText(
  body: string,
  preparation: DiscoveryPreparation,
  multi: boolean,
) {
  if (!multi) return body;
  const sections = body.split(/(?=^###\s+)/m).slice(1);
  return (
    preparation.methodSteps
      ?.map((index) => sections[index - 1] ?? "")
      .join("\n") ?? ""
  );
}
export function findRecipes(
  state: DiscoveryState,
  options: DiscoveryOptions = {},
): RecipeMatch[] {
  const allowed = options.recipeIds ? new Set(options.recipeIds) : undefined;
  const matches: RecipeMatch[] = [];
  for (const record of recipeDiscovery) {
    const recipe = recipeById.get(record.id);
    if (
      !recipe ||
      (allowed && !allowed.has(recipe.id)) ||
      (state.category && recipe.category !== state.category)
    )
      continue;
    const hits = record.preparations
      .map((p) => ({
        p,
        score: [recipe.title, recipe.titleEn ?? ""].some(
          (title) =>
            normalize(title) === normalize(state.query) && !!state.query.trim(),
        )
          ? 100
          : queryScore(
              state.query,
              [
                p.title,
                p.titleEn,
                ...(record.preparations.length === 1
                  ? [recipe.title, recipe.titleEn ?? ""]
                  : []),
              ],
              (p.searchTerms || []).join(" "),
              [recipe.body, recipe.bodyEn || ""]
                .map((body) =>
                  preparationText(body, p, record.preparations.length > 1),
                )
                .join("\n"),
            ),
      }))
      .filter((hit) => hit.score > 0);
    // A collection title can locate its children, but must not supply ingredient terms across siblings.
    if (hits.length)
      matches.push({
        recipe,
        preparationIds: hits.map((h) => h.p.id),
        score: Math.max(...hits.map((h) => h.score)),
      });
  }
  return matches.sort((a, b) => b.score - a.score);
}
export function findReferences(state: DiscoveryState): ReferenceMatch[] {
  return referenceDiscovery
    .flatMap((record) => {
      const entry = referenceById.get(record.id);
      if (!entry) return [];
      const score = queryScore(
        state.query,
        [entry.title, entry.titleEn],
        (record.aliases || []).join(" "),
        `${entry.summary} ${entry.summaryEn}`,
      );
      return score ? [{ entry, score }] : [];
    })
    .sort((a, b) => b.score - a.score);
}
export function preparationFor(recipeId: string, pid?: string) {
  const record = recipeDiscovery.find((r) => r.id === recipeId);
  return pid
    ? record?.preparations.find((p) => p.id === pid)
    : record?.preparations.find((p) => p.kind !== "finish");
}
