import content from "./kitchen-essentials.json";
export const essentials = content as ((typeof content)[number] & {
  relatedNote?: string;
  relatedNoteEn?: string;
})[];
export function essentialsForRecipe(recipeId: string) {
  return essentials.filter((entry) => entry.recipeIds.includes(recipeId));
}
