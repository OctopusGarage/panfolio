export interface RecipeSection {
  title: string;
  content: string;
}
export function recipeSections(body: string): RecipeSection[] {
  return body
    .split(/^## /m)
    .filter((part) => part.trim())
    .map((part) => {
      const newline = part.indexOf("\n");
      return {
        title: part.slice(0, newline).trim(),
        content: part.slice(newline + 1).trim(),
      };
    });
}
export function cookingSections(body: string): string[] {
  const sections = recipeSections(body);
  const ingredients = sections.find((section) => section.title === "食材");
  const method = sections.find((section) => section.title === "做法");
  if (!method) return [body];
  const steps = method.content
    .split(/(?=^### )/m)
    .filter((value) => value.trim());
  return [
    ...(ingredients ? ["## 食材\n\n" + ingredients.content] : []),
    ...steps,
  ];
}
