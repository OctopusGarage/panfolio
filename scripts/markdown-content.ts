import { createAiFeed } from "./ai-content";
import { recipeCategories } from "../src/recipe-categories";

import config from "../distribution/config.json";
import rules from "../distribution/guidance.json";

export const RAW_CONTENT = config.contentBase;
export function cookingGuidance(language: "zh" | "en") {
  const ids = new Set<string>();
  for (const rule of rules) {
    if (ids.has(rule.id) || !rule.en || !rule.zh)
      throw Error("Invalid bilingual cooking guidance");
    ids.add(rule.id);
  }
  return rules.map((rule) => `- ${rule[language]}`).join("\n");
}

type Language = "zh" | "en";
type Localized = Record<Language, string>;
type Pointer = { path: string };
type Preparation = {
  id: string;
  title: Localized;
  kind: string;
  searchTerms: string[];
  resource: Pointer;
};
type Entry = {
  kind: string;
  id: string;
  title: Localized;
  summary: Localized;
  category?: string;
  searchTerms: string[];
  preparations?: Preparation[];
  resource: Pointer;
};
type RecordData = {
  sourceRecord?: string;
  content: Record<Language, string | ReferenceBody>;
  sources: string[];
  related: { kind: string; id: string; title: Localized }[];
};
type ReferenceBody = {
  scope: string;
  steps: string[];
  reasons: string[];
  mistakes: string[];
  boundary: string;
  relatedNote?: string;
};
const link = (name: string, path: string) => `[${name}](${RAW_CONTENT}${path})`;
const categoryName = (id: string | undefined, lang: Language) => {
  const category = recipeCategories.find((c) => c.id === id);
  if (!category) throw Error(`Unknown recipe category: ${id}`);
  return category[lang];
};
const sources = (urls: string[], lang: Language) =>
  `## ${lang === "zh" ? "原始来源" : "Original sources"}\n\n${urls.map((url) => `- [${new URL(url).hostname}](${url})`).join("\n")}`;
const extraSources = (urls: string[], text: string, lang: Language) => {
  const missing = urls.filter((url) => !text.includes(url));
  return missing.length ? sources(missing, lang) : "";
};
const kindName = (kind: string, lang: Language) =>
  lang === "en"
    ? kind
    : { dish: "菜肴", component: "配料或组成部分", finish: "收尾处理" }[kind] ||
      kind;
const aliasesFor = (terms: string[], lang: Language) => {
  const seen = new Set<string>();
  return terms.filter((term) => {
    const key = term.toLowerCase();
    const matchesLanguage =
      lang === "zh"
        ? /\p{Script=Han}/u.test(term)
        : !/\p{Script=Han}/u.test(term);
    if (!matchesLanguage || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
/** Readable views of the same reviewed data; no second editorial cookbook. */
export function createMarkdownCookbook(): Record<string, string> {
  const feed = createAiFeed();
  const manifest = JSON.parse(feed["manifest.json"]);
  const entries = JSON.parse(feed[manifest.catalog.path]).entries as Entry[];
  const files: Record<string, string> = {};
  files["index.md"] =
    "# Panfolio cookbook\n\nRead complete recipes and kitchen references directly from this public repository. Chinese and English content is provided separately.\n\n" +
    ["zh", "en"]
      .map(
        (lang) =>
          `- ${link(lang === "zh" ? "中文菜谱" : "English recipes", `${lang}/recipes.md`)} · ${link(lang === "zh" ? "厨房基础" : "Kitchen references", `${lang}/references.md`)}`,
      )
      .join("\n") +
    "\n\nGenerated from the reviewed application content. Edit the source records and run `pnpm content:build`; do not edit these generated files manually. Recipe content and external media retain their original ownership; the software MIT license does not relicense them.\n";
  for (const lang of ["zh", "en"] as const) {
    const zh = lang === "zh";
    let recipeIndex = `# ${zh ? "Panfolio 菜谱目录" : "Panfolio recipe index"}\n\n${zh ? "按名称、食材别名查找，打开对应做法的正文。同一道菜的不同做法各自独立；配料或收尾做法不能当作完整菜谱。" : "Find a title or ingredient alias and open that preparation directly. Alternative preparations are separate; a component or finish is not a complete dish."}\n\n`;
    for (const category of recipeCategories) {
      recipeIndex += `## ${category[lang]}\n\n`;
      for (const entry of entries.filter(
        (e) => e.kind === "recipe" && e.category === category.id,
      )) {
        recipeIndex += `### ${entry.title[lang]}\n\n${entry.summary[lang]}\n\n`;
        for (const prep of entry.preparations || []) {
          const aliases = aliasesFor(prep.searchTerms, lang);
          recipeIndex += `- ${link(prep.title[lang], `${lang}/preparations/${entry.id}/${prep.id}.md`)}${prep.kind === "dish" ? "" : ` (${kindName(prep.kind, lang)})`}${aliases.length ? ` — ${aliases.join(", ")}` : ""}\n`;
        }
        recipeIndex += "\n";
      }
    }
    recipeIndex += `${link(zh ? "厨房基础" : "Kitchen references", `${lang}/references.md`)}\n`;
    files[`${lang}/recipes.md`] = recipeIndex;
    let referenceIndex = `# ${zh ? "Panfolio 厨房基础目录" : "Panfolio kitchen reference index"}\n\n${zh ? "食材处理、保存、刀工、火候与调味。阅读适用范围、步骤和易错点，不把某道菜的条件推广到所有菜。" : "Ingredient handling, storage, knife work, heat and seasoning. Read each method’s scope and limits; do not generalize one dish’s conditions to all dishes."}\n\n`;
    for (const entry of entries) {
      const record = JSON.parse(feed[entry.resource.path]) as RecordData;
      if (entry.kind === "recipe") {
        const choices = (entry.preparations || [])
          .map(
            (prep) =>
              `- ${link(prep.title[lang], `${lang}/preparations/${entry.id}/${prep.id}.md`)}`,
          )
          .join("\n");
        files[`${lang}/recipes/${entry.id}.md`] =
          `# ${entry.title[lang]}\n\n${categoryName(entry.category, lang)} · ID: ${entry.id}\n\n## ${zh ? "选择做法" : "Choose a preparation"}\n\n${choices}\n\n${record.content[lang]}\n\n${extraSources(record.sources, record.content[lang] as string, lang)}\n`;
        for (const prep of entry.preparations || []) {
          const detail = JSON.parse(feed[prep.resource.path]) as RecordData;
          const related = detail.related
            .map(
              (r) =>
                `- ${link(r.title[lang], `${lang}/references/${r.id}.md`)}`,
            )
            .join("\n");
          files[`${lang}/preparations/${entry.id}/${prep.id}.md`] =
            `# ${prep.title[lang]}\n\n${categoryName(entry.category, lang)} · ${zh ? "做法类型" : "Preparation type"}: ${kindName(prep.kind, lang)}\n\nID: ${entry.id} / ${prep.id}\n\n${zh ? "以下仅对应当前做法；共用小贴士只在食材和操作条件相符时适用。" : "Use the selected ingredients and method below. Shared tips apply only when their food and conditions match this preparation."}\n\n${detail.content[lang]}\n\n${extraSources(detail.sources, detail.content[lang] as string, lang)}${related ? `\n\n## ${zh ? "相关厨房基础" : "Related kitchen references"}\n\n${zh ? "关联条目可能是对比说明，请先阅读适用范围。" : "Related entries may be comparisons; read their applicability first."}\n\n${related}` : ""}\n`;
        }
      } else {
        const body = record.content[lang] as ReferenceBody;
        referenceIndex += `- ${link(entry.title[lang], `${lang}/references/${entry.id}.md`)} — ${entry.summary[lang]}${aliasesFor(entry.searchTerms, lang).length ? ` (${aliasesFor(entry.searchTerms, lang).join(", ")})` : ""}\n\n`;
        const section = (
          name: string,
          value: string | string[],
          ordered = false,
        ) =>
          `## ${name}\n\n${Array.isArray(value) ? value.map((v, i) => `${ordered ? `${i + 1}.` : "-"} ${v}`).join("\n") : value}`;
        const related = record.related
          .map((r) => `- ${link(r.title[lang], `${lang}/recipes/${r.id}.md`)}`)
          .join("\n");
        files[`${lang}/references/${entry.id}.md`] =
          `# ${entry.title[lang]}\n\n${entry.summary[lang]}\n\n` +
          [
            section(zh ? "适用范围" : "Scope", body.scope),
            section(zh ? "操作步骤" : "Steps", body.steps, true),
            section(zh ? "原因与原理" : "Reasons", body.reasons),
            section(zh ? "常见错误" : "Common mistakes", body.mistakes),
            section(zh ? "适用边界" : "Limits", body.boundary),
            ...(body.relatedNote
              ? [section(zh ? "补充说明" : "Comparison note", body.relatedNote)]
              : []),
            record.sourceRecord
              ? section(
                  zh ? "相关视频" : "Related videos",
                  record.sources.map((url) => `- [YouTube](${url})`).join("\n"),
                ) +
                `\n\n[${zh ? "说明依据与来源记录" : "Explanation evidence and source record"}](${record.sourceRecord})`
              : sources(record.sources, lang),
            ...(related
              ? [section(zh ? "关联菜谱" : "Related recipes", related)]
              : []),
          ].join("\n\n") +
          "\n";
      }
    }
    files[`${lang}/references.md`] =
      referenceIndex +
      `${link(zh ? "菜谱目录" : "Recipe index", `${lang}/recipes.md`)}\n`;
  }
  files["zh/guide.md"] =
    `# Panfolio 使用指南\n\n按任务打开[菜谱目录](${RAW_CONTENT}zh/recipes.md)或[厨房基础目录](${RAW_CONTENT}zh/references.md)，然后读取相关条目的完整 Markdown。\n\n${cookingGuidance("zh")}\n`;
  files["en/guide.md"] =
    `# Panfolio guide\n\nOpen the [recipe index](${RAW_CONTENT}en/recipes.md) or [kitchen reference index](${RAW_CONTENT}en/references.md), then read the full Markdown for the relevant entry.\n\n${cookingGuidance("en")}\n`;
  return files;
}
