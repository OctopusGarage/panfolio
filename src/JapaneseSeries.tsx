import type { Locale } from "./types";

export function JapaneseSeries({
  expanded = false,
  locale,
}: {
  expanded?: boolean;
  locale: Locale;
}) {
  const s = (zh: string, en: string) => (locale === "en" ? en : zh);
  return (
    <section
      className={`chef-series${expanded ? " chef-series-expanded" : ""}`}
      aria-labelledby="chef-series-title"
    >
      <div>
        <p className="eyebrow">SAMUKICHI · JAPAN FOOD STUDIO</p>
        <h2 id="chef-series-title">{s("日厨系列", "Japanese chef series")}</h2>
        <p>
          {s(
            "把火候与细节，变成日常的拿手菜。",
            "Small details. Better heat control. Everyday dishes worth mastering.",
          )}
        </p>
        {expanded && (
          <p className="hint">
            {s(
              "从家常食材开始，一起练好厨房基本功。跟着步骤掌握火候，在小贴士里了解做法背后的原因，再试试不同风味。",
              "Build everyday kitchen skills, one ingredient at a time. Follow the steps, learn the reasons behind each technique in the tips, then explore the variations.",
            )}
          </p>
        )}
      </div>
      {expanded ? (
        <a href="#library">{s("浏览全部菜谱", "Browse all recipes")} ↗</a>
      ) : (
        <a href="#japanese-chef">
          {s("探索日厨系列", "Explore the chef series")} ↗
        </a>
      )}
    </section>
  );
}
