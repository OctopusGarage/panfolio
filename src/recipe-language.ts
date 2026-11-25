import type { Recipe } from "./recipe-validation";
import type { Locale } from "./types";
export function recipeBody(recipe: Recipe, locale: Locale) {
  return locale === "en" && recipe.bodyEn ? recipe.bodyEn : recipe.body;
}
export function recipeDescription(recipe: Recipe, locale: Locale) {
  return locale === "en"
    ? recipe.descriptionEn || "Ingredients, clear steps and cooking notes."
    : recipe.description || "";
}
