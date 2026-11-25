export const recipeCategories = [
  { id: "all", zh: "全部", en: "All" },
  { id: "chinese", zh: "中餐", en: "Chinese" },
  { id: "japanese", zh: "日式", en: "Japanese" },
  { id: "dessert", zh: "甜品", en: "Desserts" },
] as const;
export type RecipeFilter = (typeof recipeCategories)[number]["id"];
