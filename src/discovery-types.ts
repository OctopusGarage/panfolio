import type { RecipeCategory } from "./recipe-categories";
import type { Recipe } from "./recipe-validation";
import type { essentials } from "./kitchen-essentials";
export type DiscoveryFacet =
  | "occasion"
  | "ingredient"
  | "method"
  | "season"
  | "style"
  | "equipment"
  | "source"
  | "topic"
  | "stage"
  | "task";
export type DiscoveryScope = "recipes" | "references" | "all";
export interface DiscoveryState {
  query: string;
  category?: RecipeCategory;
  /** Legacy backup fields; no longer used for discovery. */
  selected: Partial<Record<DiscoveryFacet, string[]>>;
  ingredientMode: "any" | "all";
  scope: DiscoveryScope;
}
export interface DiscoveryPreparation {
  id: string;
  title: string;
  titleEn: string;
  kind: "dish" | "finish" | "component";
  searchTerms?: string[];
  /** One-based source method section indices. Omit to retain all steps. */
  methodSteps?: number[];
  /** Zero-based ingredient bullet indices. Omit to retain the original list. */
  ingredientLines?: number[];
  /** Zero-based ingredient paragraphs for source recipes without bullet lists. */
  ingredientParagraphs?: number[];
}
export interface RecipeDiscovery {
  id: string;
  preparations: DiscoveryPreparation[];
}
export interface ReferenceDiscovery {
  id: string;
  aliases?: string[];
}
export interface RecipeMatch {
  recipe: Recipe;
  preparationIds: string[];
  score: number;
}
export interface ReferenceMatch {
  entry: (typeof essentials)[number];
  score: number;
}
export interface DiscoveryOptions {
  recipeIds?: string[];
}
