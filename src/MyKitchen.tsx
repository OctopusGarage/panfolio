import { useState } from "react";
import recipes from "./recipes.json";
import type { useSavedRecipes } from "./useSavedRecipes";
import "./my-kitchen.css";
import { RecipeImage } from "./RecipeImage";
export function MyKitchen({
  locale,
  saved,
  onOpenRecipe,
  recentIds = [],
  query,
  onQueryChange,
}: {
  locale: string;
  saved: ReturnType<typeof useSavedRecipes>;
  onOpenRecipe: (id: string, trigger: HTMLElement) => void;
  recentIds?: string[];
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const en = locale === "en";
  const [tab, setTab] = useState(() => {
    try {
      const stored = sessionStorage.getItem("panfolio:kitchen-tab");
      return ["saved", "tried", "repeat", "notes", "recent"].includes(
        stored || "",
      )
        ? stored!
        : "saved";
    } catch {
      return "saved";
    }
  });
  function chooseTab(value: string) {
    setTab(value);
    try {
      sessionStorage.setItem("panfolio:kitchen-tab", value);
    } catch {
      /* Storage may be unavailable. */
    }
  }
  const t = (zh: string, english: string) => (en ? english : zh);
  const kitchen = saved.data.kitchen;
  const tabs = [
    ["saved", t("收藏", "Saved")],
    ["tried", t("做过", "Tried")],
    ["repeat", t("常做", "On repeat")],
    ["notes", t("笔记", "Notes")],
    ["recent", t("最近", "Recent")],
  ];
  const ids =
    tab === "saved"
      ? saved.data.favorites
      : tab === "notes"
        ? Object.keys(saved.data.notes).filter((id) =>
            saved.data.notes[id].trim(),
          )
        : tab === "recent"
          ? recentIds
          : tab === "tried"
            ? (kitchen?.tried ?? [])
            : (kitchen?.repeat ?? []);
  const visibleIds = ids.filter((id) => {
    const recipe = recipes.find((r) => r.id === id);
    return (
      !query.trim() ||
      [recipe?.title, recipe?.titleEn, saved.data.notes[id]]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase())
    );
  });
  return (
    <section className="my-kitchen">
      <h2>{t("我的厨房", "My kitchen")}</h2>
      <p>
        {t(
          "收藏和笔记保存在此设备。",
          "Saved recipes and notes stay on this device.",
        )}
      </p>
      <nav aria-label={t("厨房视图", "Kitchen views")}>
        {tabs.map(([id, label]) => (
          <button
            key={id}
            aria-pressed={tab === id}
            onClick={() => chooseTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <input
        type="search"
        aria-label={t("搜索我的厨房", "Search my kitchen")}
        placeholder={t("搜索菜名或笔记", "Search names or notes")}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <div className="grid">
        {!visibleIds.length && (
          <p>
            {query.trim()
              ? t("没有匹配的记录。", "No matching records.")
              : t("这里还没有记录。", "Nothing here yet.")}
          </p>
        )}
        {visibleIds.map((id) => {
          const recipe = recipes.find((r) => r.id === id);
          if (!recipe) return null;
          return (
            <article className="card" data-recipe-id={id} key={id}>
              <button onClick={(e) => onOpenRecipe(id, e.currentTarget)}>
                <div className="card-image">
                  <RecipeImage src={recipe.image} kind="card" />
                </div>
                <h3>{en ? recipe.titleEn : recipe.title}</h3>
              </button>
              {saved.data.notes[id] && (
                <p className="kitchen-note">{saved.data.notes[id]}</p>
              )}
            </article>
          );
        })}
      </div>
      <footer>
        <a href="#settings" aria-label={t("偏好设置", "Preferences")}>
          {t("偏好设置", "Preferences")}
        </a>
        <a href="#guides">{t("厨房指南", "Kitchen guides")}</a>
      </footer>
    </section>
  );
}
