import recipes from "../src/recipes.json";
import { validateRecipes } from "../src/recipe-validation";
validateRecipes(recipes);
console.log(
  `${recipes.length} recipes validated: unique IDs, content and optional metadata.`,
);
