import { createHash } from "node:crypto";
import recipes from "../src/recipes.json";
import { essentials } from "../src/kitchen-essentials";
import { recipeDiscovery, referenceDiscovery } from "../src/discovery";
import { recipeCategories } from "../src/recipe-categories";
import { bodyForPreparation } from "../src/preparation-content";
import { videosForRecipe, videoPageUrl } from "../src/recipe-videos";

export const APP_URL = "https://octopusgarage.github.io/panfolio/";
const digest = (text: string) =>
  createHash("sha256").update(text).digest("hex");
const serialize = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
const title = (zh: string, en: string | undefined) => ({ zh, en: en || zh });
const unique = (items: string[]) => [...new Set(items)];
const appLink = (id: string, reference = false) =>
  `${APP_URL}#${reference ? "essentials/" : ""}${encodeURIComponent(id)}`;
function sourcesFor(recipe: (typeof recipes)[number]) {
  const links = unique(
    [...recipe.body.matchAll(/https?:\/\/[^\s)\]]+/g)].map((match) => match[0]),
  );
  const youtube = links.filter((url) =>
    /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/.test(url),
  );
  return youtube.length
    ? youtube
    : links.length
      ? links
      : recipe.source
        ? [recipe.source]
        : [];
}
/** Public allowlisted content only: browser state and backups are never inputs. */
export function createAiFeed(sourceCommit = "local"): Record<string, string> {
  if (sourceCommit !== "local" && !/^[a-f0-9]{40}$/.test(sourceCommit))
    throw Error("Invalid public source commit");
  const contentVersion = digest(
    serialize({
      recipes,
      essentials,
      recipeDiscovery,
      referenceDiscovery,
      videos: recipes.map((recipe) => videosForRecipe(recipe.id)),
    }),
  );
  const files: Record<string, string> = {};
  const resource = (
    directory: string,
    id: string,
    record: Record<string, unknown>,
  ) => {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(id) || id.includes(".."))
      throw Error(`Unsafe public ID: ${id}`);
    const body = serialize({ schemaVersion: 1, contentVersion, ...record });
    const sha256 = digest(body);
    const path = `${directory ? directory + "/" : ""}${id}.${sha256.slice(0, 16)}.json`;
    files[path] = body;
    return { path, sha256 };
  };
  const entries: Record<string, unknown>[] = [];
  for (const recipe of recipes) {
    const metadata = recipeDiscovery.find((record) => record.id === recipe.id);
    if (!metadata?.preparations.length)
      throw Error(`Missing preparation: ${recipe.id}`);
    const sources = sourcesFor(recipe);
    const related = essentials
      .filter((entry) => entry.recipeIds.includes(recipe.id))
      .map((entry) => ({
        kind: "reference",
        id: entry.id,
        title: title(entry.title, entry.titleEn),
        appUrl: appLink(entry.id, true),
      }));
    const preparations = metadata.preparations.map((preparation) => ({
      id: preparation.id,
      title: title(preparation.title, preparation.titleEn),
      kind: preparation.kind,
      searchTerms: preparation.searchTerms || [],
      resource: resource("preparations", `${recipe.id}--${preparation.id}`, {
        kind: "preparation",
        id: `${recipe.id}--${preparation.id}`,
        parentId: recipe.id,
        preparationId: preparation.id,
        preparationKind: preparation.kind,
        title: title(preparation.title, preparation.titleEn),
        category: recipe.category,
        content: {
          zh: bodyForPreparation(recipe, preparation, "zh"),
          en: bodyForPreparation(recipe, preparation, "en"),
        },
        sources,
        appUrl: appLink(recipe.id),
        related,
      }),
    }));
    entries.push({
      kind: "recipe",
      id: recipe.id,
      title: title(recipe.title, recipe.titleEn),
      summary: title(recipe.description || "", recipe.descriptionEn),
      category: recipe.category,
      searchTerms:
        metadata.preparations.length === 1
          ? metadata.preparations[0].searchTerms || []
          : [],
      preparations,
      resource: resource("recipes", recipe.id, {
        kind: "recipe",
        id: recipe.id,
        title: title(recipe.title, recipe.titleEn),
        category: recipe.category,
        content: { zh: recipe.body, en: recipe.bodyEn },
        sources,
        appUrl: appLink(recipe.id),
        related,
        preparations,
        videos: videosForRecipe(recipe.id).map((video) => ({
          ...video,
          url: videoPageUrl(video),
        })),
      }),
    });
  }
  for (const entry of essentials) {
    const localized = (language: "zh" | "en") => {
      const en = language === "en";
      return {
        scope: en ? entry.scopeEn : entry.scope,
        steps: en ? entry.stepsEn : entry.steps,
        reasons: en ? entry.reasonsEn : entry.reasons,
        mistakes: en ? entry.mistakesEn : entry.mistakes,
        boundary: en ? entry.boundaryEn : entry.boundary,
        ...(entry.relatedNote
          ? { relatedNote: en ? entry.relatedNoteEn : entry.relatedNote }
          : {}),
      };
    };
    entries.push({
      kind: "reference",
      id: entry.id,
      title: title(entry.title, entry.titleEn),
      summary: title(entry.summary, entry.summaryEn),
      searchTerms:
        referenceDiscovery.find((record) => record.id === entry.id)?.aliases ||
        [],
      resource: resource("essentials", entry.id, {
        kind: "reference",
        id: entry.id,
        title: title(entry.title, entry.titleEn),
        content: { zh: localized("zh"), en: localized("en") },
        sources: entry.sources,
        appUrl: appLink(entry.id, true),
        related: entry.recipeIds.map((id) => {
          const recipe = recipes.find((recipe) => recipe.id === id);
          if (!recipe) throw Error(`Unknown related recipe ${id}`);
          return {
            kind: "recipe",
            id,
            title: title(recipe.title, recipe.titleEn),
            appUrl: appLink(id),
          };
        }),
      }),
    });
  }
  const catalog = resource("", "catalog", {
    entries,
    categories: recipeCategories.map((category) => ({
      id: category.id,
      label: title(category.zh, category.en),
    })),
  });
  files["manifest.json"] = serialize({
    schemaVersion: 1,
    contentVersion,
    sourceCommit,
    appUrl: APP_URL,
    termsUrl: "https://github.com/OctopusGarage/panfolio/blob/main/LICENSE",
    catalog,
    counts: {
      recipes: recipes.length,
      references: essentials.length,
      preparations: recipeDiscovery.reduce(
        (sum, record) => sum + record.preparations.length,
        0,
      ),
    },
  });
  files["catalog.md"] =
    `# Panfolio cookbook\n\nContent version: ${contentVersion}\n\nCategories: Chinese / 中餐; Japanese chef series / 日厨系列; Desserts / 甜品.\n\nFetch [the manifest](manifest.json) to identify this version. Each linked JSON contains complete bilingual instructions and original sources. Related recipes may include comparisons; preserve conditions and limits.\n\n` +
    entries
      .map((entry) => {
        const name = entry.title as { zh: string; en: string };
        const pointer = entry.resource as { path: string };
        return `- ${entry.kind}: [${name.zh} / ${name.en}](${pointer.path}) — ID: \`${entry.id}\``;
      })
      .join("\n") +
    "\n";
  return files;
}
