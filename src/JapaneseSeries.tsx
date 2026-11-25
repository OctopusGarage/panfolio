import { useLocale } from "./i18n";

export function JapaneseSeries({ expanded = false }: { expanded?: boolean }) {
  const { s } = useLocale();
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
              "四支视频，四堂厨房练习。按食材阅读基础技巧，再选择附赠风味；步骤附原片时间链接，未说明的用量保留注明。",
              "Four videos, four kitchen lessons. Learn the core technique, then explore the variations. Timestamped sources accompany each recipe; unspecified quantities stay clearly marked.",
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
