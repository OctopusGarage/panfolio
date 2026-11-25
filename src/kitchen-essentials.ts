import content from "./kitchen-essentials.json";
export const essentials = content;
export const essentialCategories = [
  { id: "prep", zh: "食材处理", en: "Ingredient preparation" },
  { id: "heat", zh: "火候与熟度", en: "Heat & doneness" },
  { id: "season", zh: "调味与增香", en: "Seasoning & aroma" },
  { id: "storage", zh: "保存与备餐", en: "Storage & meal preparation" },
] as const;
export function essentialsForRecipe(recipeId: string) {
  return essentials.filter((entry) => entry.recipeIds.includes(recipeId));
}
