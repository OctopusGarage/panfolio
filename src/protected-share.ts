import { encryptLink } from "@octopusgarage/s";

export function createShareUrl(recipeId?: string): Promise<string> {
  const target = new URL("https://octopusgarage.github.io/panfolio/");
  if (recipeId) target.hash = encodeURIComponent(recipeId);
  return encryptLink(target);
}
