import { SourceVideo } from "./SourceVideo";
import { videosForReference } from "./recipe-videos";
import { useState } from "react";
import type { Locale } from "./types";
import { essentials, essentialCategories } from "./kitchen-essentials";
import recipeData from "./recipes.json";

export function KitchenEssentials({
  id,
  locale,
  onBack,
}: {
  id?: string;
  locale: Locale;
  onBack?: () => void;
}) {
  const s = (zh: string, en: string) => (locale === "en" ? en : zh);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const entry = essentials.find((item) => item.id === id);
  const localized = (zh: string, en: string) => (locale === "en" ? en : zh);
  if (id && !entry)
    return (
      <section>
        <h2>{s("没有找到这篇厨房基础", "Kitchen reference not found")}</h2>
        <a href="#essentials">
          {s("返回厨房基础", "Back to kitchen essentials")}
        </a>
      </section>
    );
  if (entry) {
    const blocks = [
      {
        title: s("适用场景", "When to use it"),
        values: [localized(entry.scope, entry.scopeEn)],
      },
      {
        title: s("具体做法", "How to do it"),
        values: locale === "en" ? entry.stepsEn : entry.steps,
        ordered: true,
      },
      {
        title: s("为什么这样做", "Why it works"),
        values: locale === "en" ? entry.reasonsEn : entry.reasons,
      },
      {
        title: s("常见错误", "Common mistakes"),
        values: locale === "en" ? entry.mistakesEn : entry.mistakes,
      },
      {
        title: s("适用边界", "Where it applies"),
        values: [localized(entry.boundary, entry.boundaryEn)],
      },
    ];
    return (
      <article
        className="essential-detail"
        lang={locale === "en" ? "en" : "zh-CN"}
      >
        <a
          className="back"
          href="#essentials"
          onClick={(event) => {
            if (onBack) {
              event.preventDefault();
              onBack();
            }
          }}
        >
          ← {s("返回厨房基础", "Back to kitchen essentials")}
        </a>
        <p className="eyebrow">{s("厨房基础", "Kitchen essentials")}</p>
        <h2>{localized(entry.title, entry.titleEn)}</h2>
        <p className="essential-lead">
          {localized(entry.summary, entry.summaryEn)}
        </p>
        <SourceVideo
          key={entry.id}
          videos={videosForReference(entry.recipeIds, entry.sources)}
          locale={locale}
        />
        <div className="essential-sections">
          {blocks.map((block) => (
            <section key={block.title}>
              <h3>{block.title}</h3>
              {block.ordered ? (
                <ol>
                  {block.values.map((value) => (
                    <li key={value}>{value}</li>
                  ))}
                </ol>
              ) : block.values.length === 1 ? (
                <p>{block.values[0]}</p>
              ) : (
                <ul>
                  {block.values.map((value) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        {entry.recipeIds.length > 0 && (
          <section className="essential-related">
            <h3>{s("用到这些技巧的菜谱", "Recipes using these techniques")}</h3>
            <div className="recent-links">
              {entry.recipeIds.map((recipeId) => {
                const recipe = recipeData.find((item) => item.id === recipeId)!;
                return (
                  <a key={recipeId} href={`#${encodeURIComponent(recipeId)}`}>
                    {localized(recipe.title, recipe.titleEn)}
                  </a>
                );
              })}
            </div>
          </section>
        )}
        <section>
          <h3>{s("参考链接", "References")}</h3>
          <ul>
            {entry.sources.map((url) => (
              <li key={url}>
                <a href={url}>
                  YouTube ·{" "}
                  {localized(
                    recipeData.find((r) => r.body.includes(url))?.title ||
                      entry.title,
                    recipeData.find((r) => r.body.includes(url))?.titleEn ||
                      entry.titleEn,
                  )}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    );
  }
  const normalized = query.trim().toLocaleLowerCase();
  const visible = essentials.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      JSON.stringify(item).toLocaleLowerCase().includes(normalized),
  );
  return (
    <section className="essentials-index">
      <div className="essentials-intro">
        <p className="eyebrow">
          {s("随手查，慢慢学", "LOOK IT UP. MAKE IT YOUR OWN.")}
        </p>
        <h2>{s("厨房基础", "Kitchen essentials")}</h2>
        <p>
          {s(
            "从食材处理到火候调味，了解怎么做，也知道为什么。",
            "From preparation to heat and seasoning: learn what to do, and why.",
          )}
        </p>
        <a href="#guides">
          {s(
            "使用指南：收藏、离线与备份",
            "User guide: saving, offline use and backups",
          )}{" "}
          ↗
        </a>
      </div>
      <label className="search">
        <span>{s("搜索厨房基础", "Search kitchen essentials")}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={s(
            "试试：酱油、粘锅、西兰花…",
            "Try: soy sauce, sticking, broccoli…",
          )}
        />
      </label>
      <div
        className="filters"
        aria-label={s("厨房基础分类", "Kitchen reference categories")}
      >
        {[{ id: "all", zh: "全部", en: "All" }, ...essentialCategories].map(
          (item) => (
            <button
              key={item.id}
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              {localized(item.zh, item.en)}
            </button>
          ),
        )}
      </div>
      <p className="hint" role="status">
        {visible.length
          ? s(`${visible.length} 篇参考`, `${visible.length} references`)
          : s(
              "没有找到相关内容，试试其他食材或技巧。",
              "No matching references. Try another ingredient or technique.",
            )}
      </p>
      <div className="essential-grid">
        {visible.map((item) => (
          <article className="essential-card" key={item.id}>
            <p className="eyebrow">
              {localized(
                essentialCategories.find((c) => c.id === item.category)!.zh,
                essentialCategories.find((c) => c.id === item.category)!.en,
              )}
            </p>
            <h3>
              <a href={`#essentials/${item.id}`}>
                {localized(item.title, item.titleEn)}
              </a>
            </h3>
            <p>{localized(item.summary, item.summaryEn)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
