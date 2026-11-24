export interface Recipe {
  id: string;
  title: string;
  body: string;
  titleEn?: string;
  description?: string;
  image?: string;
  source?: string;
}
export function validateRecipes(recipes: Recipe[]) {
  const ids = new Set<string>();
  for (const recipe of recipes) {
    if (!recipe.id.trim() || ids.has(recipe.id))
      throw new Error("Recipe IDs must be nonempty and unique");
    ids.add(recipe.id);
    if (!recipe.title.trim() || !recipe.body.trim())
      throw new Error(`Missing recipe content: ${recipe.id}`);
    if (recipe.titleEn !== undefined && !recipe.titleEn.trim())
      throw new Error(`Empty English title: ${recipe.id}`);
    if (
      recipe.source &&
      !["http:", "https:"].includes(new URL(recipe.source).protocol)
    )
      throw new Error(`Invalid source URL: ${recipe.id}`);
    if (/<script\b|javascript:/i.test(recipe.body))
      throw new Error(`Unsafe content: ${recipe.id}`);
  }
}
