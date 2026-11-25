export const recipeCategories = [
  { id: "chinese", zh: "中餐", en: "Chinese" },
  { id: "japanese", zh: "日厨系列", en: "Japanese chef series" },
  { id: "dessert", zh: "甜品", en: "Desserts" },
] as const;
export type RecipeCategory = (typeof recipeCategories)[number]["id"];
