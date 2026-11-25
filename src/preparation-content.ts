import { recipeSections } from "./recipe-content";
import { recipeBody } from "./recipe-language";
import type { Recipe } from "./recipe-validation";
import type { DiscoveryPreparation } from "./discovery-types";
import type { Locale } from "./types";

/** Select source sections for reading without rewriting the original recipe. */
export function bodyForPreparation(
  recipe: Recipe,
  preparation: DiscoveryPreparation | undefined,
  locale: Locale,
) {
  const original = recipeBody(recipe, locale);
  if (
    !preparation ||
    (!preparation.methodSteps &&
      !preparation.ingredientLines &&
      !preparation.ingredientParagraphs)
  )
    return original;
  return (
    recipeSections(original)
      .map((section) => {
        let content = section.content;
        if (
          ["食材", "Ingredients"].includes(section.title) &&
          preparation.ingredientLines
        ) {
          const bullets = content
            .split(/\n(?=- )/)
            .filter((line) => line.trim().startsWith("- "));
          content = preparation.ingredientLines
            .map((index) => bullets[index])
            .filter(Boolean)
            .join("\n");
        }
        if (
          ["食材", "Ingredients"].includes(section.title) &&
          preparation.ingredientParagraphs
        ) {
          const paragraphs = content.trim().split(/\n\s*\n/);
          content = preparation.ingredientParagraphs
            .map((index) => paragraphs[index])
            .filter(Boolean)
            .join("\n\n");
        }
        if (
          ["做法", "Method"].includes(section.title) &&
          preparation.methodSteps
        ) {
          const blocks = content
            .split(/(?=^### \d+\.)/m)
            .filter((block) => /^### \d+\./.test(block));
          content = preparation.methodSteps
            .map((index, order) =>
              blocks[index - 1]?.replace(/^### \d+\./, `### ${order + 1}.`),
            )
            .filter(Boolean)
            .join("\n\n");
        }
        return `## ${section.title}\n\n${content.trim()}`;
      })
      .join("\n\n") + "\n"
  );
}
