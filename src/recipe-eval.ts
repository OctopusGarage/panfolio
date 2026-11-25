import type { Recipe } from "./recipe-validation";
import { recipeSections, cookingSections } from "./recipe-content";
function numbers(body: string) {
  return (
    body
      .replace(/^## References[\s\S]*|^## 参考链接[\s\S]*/m, "")
      .replace(/^#{1,3} .*$/gm, "")
      .replace(/^\d+\. /gm, "")
      .match(/\d+(?:\.\d+)?(?:\/\d+)?/g)
      ?.sort() || []
  );
}
export function evaluateTranslation(recipe: Recipe) {
  const issues: string[] = [];
  if (!recipe.bodyEn || !recipe.titleEn || !recipe.descriptionEn)
    return ["English content is incomplete"];
  const zh = recipeSections(recipe.body),
    en = recipeSections(recipe.bodyEn);
  const headings: Record<string, string> = {
    食材: "Ingredients",
    做法: "Method",
    小贴士: "Tips",
    参考链接: "References",
  };
  if (
    JSON.stringify(zh.map((s) => headings[s.title])) !==
    JSON.stringify(en.map((s) => s.title))
  )
    issues.push("Section structure differs");
  if (
    cookingSections(recipe.body).length !==
    cookingSections(recipe.bodyEn).length
  )
    issues.push("Cooking section count differs");
  const zsteps = recipe.body.match(/^### \d+\./gm) || [],
    esteps = recipe.bodyEn.match(/^### \d+\./gm) || [];
  if (JSON.stringify(zsteps) !== JSON.stringify(esteps))
    issues.push("Step numbering differs");
  if (
    JSON.stringify(numbers(recipe.body)) !==
    JSON.stringify(numbers(recipe.bodyEn))
  )
    issues.push("Numeric quantities or timings differ");
  const links = (body: string) =>
    Array.from(body.matchAll(/\]\((https:\/\/[^)]+)\)/g), (m) => m[1]);
  if (
    JSON.stringify(links(recipe.body)) !== JSON.stringify(links(recipe.bodyEn))
  )
    issues.push("Reference URLs differ");
  if (/[\u3400-\u9fff]/.test(recipe.bodyEn))
    issues.push("Untranslated Chinese in English body");
  const regressions: [RegExp, RegExp][] = [
    [/八成熟|八分熟/, /80%/],
    [/沙茶/, /satay sauce/i],
    [/陈醋/, /mature vinegar/i],
    [/辣椒面/, /chili flakes/i],
  ];
  if (
    regressions.some(
      ([source, target]) =>
        source.test(recipe.body) && target.test(recipe.bodyEn!),
    )
  )
    issues.push("Known translation regression");
  const unitFacts = (body: string, english: boolean) => {
    const units = english
      ? /(\d+(?:\.\d+)?(?:\/\d+)?(?:[–～-]\d+)?)\s*(teaspoons?|tablespoons?|spoonfuls?|minutes?|seconds?|cm|g)\b/gi
      : /(\d+(?:\.\d+)?(?:\/\d+)?(?:[–～-]\d+)?)\s*(茶匙|汤匙|汤勺|勺|匙|分钟|分|秒|厘米|克)/g;
    const map: Record<string, string> = {
      茶匙: "teaspoon",
      汤匙: "tablespoon",
      汤勺: "tablespoon",
      勺: "spoonful",
      匙: "spoonful",
      分钟: "minute",
      分: "minute",
      秒: "second",
      厘米: "cm",
      克: "g",
    };
    return Array.from(
      body.matchAll(units),
      (m) =>
        m[1].replace(/[–～]/g, "-") +
        ":" +
        (english ? m[2].toLowerCase().replace(/s$/, " ").trim() : map[m[2]]),
    ).sort();
  };
  if (
    JSON.stringify(unitFacts(recipe.body, false)) !==
    JSON.stringify(unitFacts(recipe.bodyEn, true))
  )
    issues.push("Measured units or timings differ");
  return issues;
}
