import { SourceVideo } from "./SourceVideo";
import { videosForReference } from "./recipe-videos";
import type { Locale } from "./types";
import { essentials } from "./kitchen-essentials";
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
        title: s("不要直接套用的情况", "When not to copy it directly"),
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
        <SourceVideo
          key={entry.id}
          videos={videosForReference(entry.recipeIds, entry.sources)}
          locale={locale}
        />
        {entry.recipeIds.length > 0 && (
          <section className="essential-related">
            <h3>{s("相关菜谱", "Related recipes")}</h3>
            {entry.relatedNote && (
              <p>
                {localized(
                  entry.relatedNote,
                  entry.relatedNoteEn || entry.relatedNote,
                )}
              </p>
            )}
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
  return null;
}
