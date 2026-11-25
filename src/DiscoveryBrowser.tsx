import type { RefObject } from "react";
import type { Locale } from "./types";
import type { DiscoveryState } from "./discovery-types";
import {
  emptyDiscoveryState,
  findRecipes,
  findReferences,
  recipeDiscovery,
  preparationFor,
} from "./discovery";
import { recipeCategories, type RecipeCategory } from "./recipe-categories";
import { RecipeImage } from "./RecipeImage";
import "./discovery.css";
interface Props {
  locale: Locale;
  state: DiscoveryState;
  defaultScope?: "recipes" | "references";
  defaultCategory?: RecipeCategory;
  onChange: (next: DiscoveryState) => void;
  favorites: string[];
  onFavorite: (id: string) => void;
  onOpenRecipe: (
    id: string,
    preparationId: string | undefined,
    trigger: HTMLElement,
  ) => void;
  onOpenReference?: (id: string, trigger: HTMLElement) => void;
  onSearchFocus?: () => void;
  onSearchCancel?: () => void;
  searchActive?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}
export function DiscoveryBrowser(p: Props) {
  const { state, locale, onChange } = p;
  const s = (zh: string, en: string) => (locale === "zh" ? zh : en);
  const references = p.defaultScope === "references";
  const category = state.category || p.defaultCategory;
  const current = {
    ...emptyDiscoveryState(references ? "references" : "recipes"),
    query: state.query,
    ...(!references && category ? { category } : {}),
  };
  const recipes = references ? [] : findRecipes(current);
  const refs = references ? findReferences(current) : [];
  return (
    <div className="discovery-browser">
      <div className="discovery-search">
        <input
          ref={p.inputRef}
          type="search"
          aria-label={
            references
              ? s("搜索厨房基础", "Search kitchen essentials")
              : s("搜索菜名或食材", "Search names or ingredients")
          }
          placeholder={
            references
              ? s(
                  "搜索食材处理或烹饪技巧",
                  "Search preparation or cooking techniques",
                )
              : s("搜索菜名或食材", "Search names or ingredients")
          }
          value={state.query}
          onFocus={p.onSearchFocus}
          onChange={(event) =>
            onChange({ ...current, query: event.target.value })
          }
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              p.onSearchCancel?.();
            }
            if (event.key === "Enter") event.currentTarget.blur();
          }}
        />
        {p.searchActive && (
          <button onClick={p.onSearchCancel}>{s("取消", "Cancel")}</button>
        )}
      </div>
      {!references && (
        <nav
          className="discovery-presets"
          aria-label={s("菜谱分类", "Recipe categories")}
        >
          {recipeCategories.map((item) => (
            <button
              key={item.id}
              aria-pressed={category === item.id}
              onClick={() =>
                onChange({
                  ...emptyDiscoveryState(),
                  query: state.query,
                  ...(category === item.id ? {} : { category: item.id }),
                })
              }
            >
              {s(item.zh, item.en)}
            </button>
          ))}
        </nav>
      )}
      <div className="discovery-results">
        <p
          className="search-results-count"
          aria-live="polite"
          aria-atomic="true"
        >
          {s("找到", "Found")} {recipes.length + refs.length}{" "}
          {s("项结果", "results")}
        </p>
        {!recipes.length && !refs.length && (
          <p>
            {s(
              "没有符合条件的结果。请更换关键词或分类。",
              "No results match. Try another search or category.",
            )}
          </p>
        )}
        <div className="grid">
          {recipes.map(({ recipe: r, preparationIds }) => {
            const open = (trigger: HTMLElement, preparation?: string) =>
              p.onOpenRecipe(
                r.id,
                preparation ??
                  (preparationIds.length === 1 ? preparationIds[0] : undefined),
                trigger,
              );
            const label = recipeCategories.find(
              (item) => item.id === r.category,
            );
            return (
              <section className="card" data-recipe-id={r.id} key={r.id}>
                {r.image && (
                  <a
                    className="card-image"
                    href={"#" + r.id}
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={(event) => {
                      event.preventDefault();
                      open(event.currentTarget);
                    }}
                  >
                    <RecipeImage src={r.image} kind="card" />
                  </a>
                )}
                <div className="card-top">
                  <span>
                    {label ? s(label.zh, label.en) : s("食谱", "Recipe")}
                  </span>
                  <button
                    aria-label={
                      (p.favorites.includes(r.id)
                        ? s("取消收藏", "Unsave")
                        : s("收藏", "Save")) +
                      " " +
                      (locale === "zh" ? r.title : r.titleEn || r.title)
                    }
                    aria-pressed={p.favorites.includes(r.id)}
                    onClick={() => p.onFavorite(r.id)}
                  >
                    {p.favorites.includes(r.id) ? "★" : "☆"}
                  </button>
                </div>
                <h3>
                  <a
                    href={"#" + r.id}
                    onClick={(event) => {
                      event.preventDefault();
                      open(event.currentTarget);
                    }}
                  >
                    {locale === "zh" ? r.title : r.titleEn || r.title}
                  </a>
                </h3>
                <p>{locale === "zh" ? r.description : r.descriptionEn}</p>
                {(recipeDiscovery.find((entry) => entry.id === r.id)
                  ?.preparations.length || 0) > 1 && (
                  <div className="discovery-preparations">
                    {preparationIds.slice(0, 2).map((id) => {
                      const prep = preparationFor(r.id, id);
                      return (
                        <a
                          key={id}
                          href={"#" + r.id}
                          onClick={(event) => {
                            event.preventDefault();
                            open(event.currentTarget, id);
                          }}
                        >
                          {locale === "zh" ? prep?.title : prep?.titleEn}
                        </a>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
        <div className="essential-grid">
          {refs.map(({ entry }) => (
            <article className="essential-card" key={entry.id}>
              <h3>
                <a
                  href={"#essentials/" + entry.id}
                  onClick={(event) => {
                    if (p.onOpenReference) {
                      event.preventDefault();
                      p.onOpenReference(entry.id, event.currentTarget);
                    }
                  }}
                >
                  {s(entry.title, entry.titleEn)}
                </a>
              </h3>
              <p>{s(entry.summary, entry.summaryEn)}</p>
              <p className="essential-card-preview">
                <strong>{s("先做这一步：", "Start here: ")}</strong>
                {s(entry.steps[0], entry.stepsEn[0])}
              </p>
              <a
                className="essential-read"
                href={"#essentials/" + entry.id}
                onClick={(event) => {
                  if (p.onOpenReference) {
                    event.preventDefault();
                    p.onOpenReference(entry.id, event.currentTarget);
                  }
                }}
              >
                {s("查看完整步骤与要点", "Read steps and key points")} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
