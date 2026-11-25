import { useEffect, useRef, useState, type RefObject } from "react";
import type { Locale } from "./types";
import type { DiscoveryFacet, DiscoveryState } from "./discovery-types";
import {
  discoveryTags,
  recipeDiscovery,
  emptyDiscoveryState,
  facetOptions,
  findRecipes,
  findReferences,
  preparationFor,
} from "./discovery";
import { RecipeImage } from "./RecipeImage";
import "./discovery.css";
interface Props {
  locale: Locale;
  state: DiscoveryState;
  defaultScope?: "recipes" | "references";
  onChange: (next: DiscoveryState) => void;
  recipeIds?: string[];
  favorites: string[];
  onFavorite: (id: string) => void;
  onOpenRecipe: (
    id: string,
    preparationId: string | undefined,
    trigger: HTMLElement,
  ) => void;
  onOpenReference?: (id: string, trigger: HTMLElement) => void;
  onSaveSearch?: (state: DiscoveryState) => void;
  onSearchFocus?: () => void;
  onSearchCancel?: () => void;
  searchActive?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}
const labels: Record<DiscoveryFacet, [string, string]> = {
  occasion: ["用餐场景", "Occasion"],
  ingredient: ["主要食材", "Ingredients"],
  season: ["季节偏好", "Season"],
  method: ["烹饪方法", "Method"],
  style: ["风格", "Style"],
  equipment: ["设备", "Equipment"],
  source: ["来源", "Source"],
  topic: ["主题", "Topic"],
  stage: ["烹饪阶段", "Cooking stage"],
  task: ["任务", "Task"],
};
export function DiscoveryBrowser(p: Props) {
  const { state, locale, onChange } = p;
  const s = (zh: string, en: string) => (locale === "zh" ? zh : en);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const marked = useRef(false);
  const [draft, setDraft] = useState(state);
  const [open, setOpen] = useState(false);
  const [facetQuery, setFacetQuery] = useState<
    Partial<Record<DiscoveryFacet, string>>
  >({});
  const [expanded, setExpanded] = useState<
    Partial<Record<DiscoveryFacet, boolean>>
  >({});
  const baseScope = useRef<"recipes" | "references">(
    p.defaultScope || (state.scope === "references" ? "references" : "recipes"),
  );
  const scoped = (scope: DiscoveryState["scope"]): DiscoveryState => ({
    ...state,
    scope,
    selected: Object.fromEntries(
      Object.entries(state.selected).filter(([facet]) =>
        (scope === "references"
          ? ["task", "topic", "stage", "ingredient"]
          : [
              "occasion",
              "ingredient",
              "season",
              "method",
              "style",
              "equipment",
              "source",
            ]
        ).includes(facet),
      ),
    ),
  });
  const options = { recipeIds: p.recipeIds, favorites: p.favorites };
  const recipes =
    state.scope === "references" ? [] : findRecipes(state, options);
  const refs = state.scope === "recipes" ? [] : findReferences(state);
  const toggle = (
    value: DiscoveryState,
    facet: DiscoveryFacet,
    id: string,
  ): DiscoveryState => ({
    ...value,
    selected: {
      ...value.selected,
      [facet]: (value.selected[facet] || []).includes(id)
        ? value.selected[facet]!.filter((x) => x !== id)
        : [...(value.selected[facet] || []), id],
    },
  });
  const close = () => {
    dialog.current?.close();
    setOpen(false);
    opener.current?.focus();
    if (marked.current) {
      marked.current = false;
      history.back();
    }
  };
  useEffect(() => {
    const back = () => {
      if (marked.current) {
        marked.current = false;
        dialog.current?.close();
        setOpen(false);
        opener.current?.focus();
      }
    };
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  const facets = (
    value: DiscoveryState,
    change: (v: DiscoveryState) => void,
  ) => {
    const groups: DiscoveryFacet[] =
      value.scope === "references"
        ? ["task", "topic", "stage", "ingredient"]
        : [
            "occasion",
            "ingredient",
            "season",
            "method",
            "style",
            "equipment",
            "source",
          ];
    return groups.map((facet, index) => {
      const available = new Set(
        facetOptions(
          emptyDiscoveryState(value.scope),
          facet,
          value.scope === "references" ? "references" : "recipes",
          options,
        )
          .filter((option) => option.count > 0)
          .map((option) => option.tag.id),
      );
      const all = facetOptions(
        value,
        facet,
        value.scope === "references" ? "references" : "recipes",
        options,
      ).filter(
        (option) =>
          available.has(option.tag.id) ||
          value.selected[facet]?.includes(option.tag.id),
      );
      if (!all.length) return null;
      const query = (facetQuery[facet] || "").toLocaleLowerCase();
      const filtered = all.filter(
        ({ tag }) =>
          !query ||
          [tag.label, tag.labelEn, ...(tag.aliases || [])]
            .join(" ")
            .toLocaleLowerCase()
            .includes(query),
      );
      const visible =
        expanded[facet] || query
          ? filtered
          : filtered.filter(
              ({ tag }, i) => i < 8 || value.selected[facet]?.includes(tag.id),
            );
      return (
        <details key={facet} open={index < 2}>
          <summary>{s(...labels[facet])}</summary>
          <fieldset>
            <legend className="discovery-sr">{s(...labels[facet])}</legend>
            {all.length > 10 && (
              <input
                className="facet-search"
                type="text"
                aria-label={s("查找", "Find ") + s(...labels[facet])}
                placeholder={s("查找选项…", "Find an option…")}
                value={facetQuery[facet] || ""}
                onChange={(event) =>
                  setFacetQuery((previous) => ({
                    ...previous,
                    [facet]: event.target.value,
                  }))
                }
              />
            )}
            {facet === "ingredient" && (
              <label className="discovery-mode">
                {s("匹配食材", "Match ingredients")}
                <select
                  value={value.ingredientMode}
                  onChange={(event) =>
                    change({
                      ...value,
                      ingredientMode: event.target.value as "any" | "all",
                    })
                  }
                >
                  <option value="any">{s("任意一种", "Any of these")}</option>
                  <option value="all">{s("全部包含", "All of these")}</option>
                </select>
              </label>
            )}
            {visible.map(({ tag, count }) => (
              <label className="discovery-option" key={tag.id}>
                <input
                  type="checkbox"
                  checked={(value.selected[facet] || []).includes(tag.id)}
                  onChange={() => change(toggle(value, facet, tag.id))}
                />
                <span>{locale === "zh" ? tag.label : tag.labelEn}</span>
                <span className="discovery-count">{count}</span>
              </label>
            ))}
            {!query && all.length > 8 && (
              <button
                className="facet-more"
                onClick={() =>
                  setExpanded((previous) => ({
                    ...previous,
                    [facet]: !previous[facet],
                  }))
                }
              >
                {expanded[facet]
                  ? s("收起", "Show less")
                  : s(
                      `更多选项（${all.length}）`,
                      `More options (${all.length})`,
                    )}
              </button>
            )}
          </fieldset>
        </details>
      );
    });
  };
  return (
    <div className="discovery-browser">
      <div className="discovery-search">
        <input
          ref={p.inputRef}
          type="search"
          aria-label={
            baseScope.current === "references"
              ? s("搜索厨房基础", "Search kitchen essentials")
              : s("搜索菜名或食材", "Search names or ingredients")
          }
          placeholder={s(
            "搜索菜名、食材或技巧",
            "Search names, ingredients or techniques",
          )}
          value={state.query}
          onFocus={p.onSearchFocus}
          onChange={(e) =>
            onChange({
              ...state,
              query: e.target.value,
              scope: !e.target.value
                ? baseScope.current
                : !state.query
                  ? "all"
                  : state.scope,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              p.onSearchCancel?.();
            }
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
        {p.searchActive && (
          <button onClick={p.onSearchCancel}>{s("取消", "Cancel")}</button>
        )}
        <button
          ref={opener}
          className="discovery-mobile-filter"
          onClick={() => {
            setDraft(state);
            setOpen(true);
            dialog.current?.showModal();
            history.pushState({ ...history.state, panfolioFilters: true }, "");
            marked.current = true;
          }}
        >
          {s("筛选", "Filters")}
        </button>
      </div>
      <div className="discovery-presets">
        {state.scope !== "references" &&
          [
            ["style:chinese", "中餐", "Chinese"],
            ["style:japanese", "日式", "Japanese"],
            ["occasion:dessert", "甜品", "Desserts"],
            ["occasion:breakfast", "早餐", "Breakfast"],
          ].map(([id, zh, en]) => {
            const tag = discoveryTags.find((tag) => tag.id === id);
            return tag ? (
              <button
                key={id}
                aria-pressed={(state.selected[tag.facet] || []).includes(id)}
                onClick={() => onChange(toggle(state, tag.facet, id))}
              >
                {s(zh, en)}
              </button>
            ) : null;
          })}
        {state.scope !== "references" && (
          <a href="#japanese-chef">
            {s("探索日厨系列", "Explore the chef series")}
          </a>
        )}
      </div>
      {(state.query || state.scope === "all") && (
        <div
          className="discovery-scopes"
          aria-label={s("搜索范围", "Search scope")}
        >
          {(["all", "recipes", "references"] as const).map((scope) => (
            <button
              key={scope}
              aria-pressed={scope === state.scope}
              onClick={() => onChange(scoped(scope))}
            >
              {scope === "all"
                ? s("全部", "All")
                : scope === "recipes"
                  ? s("菜谱", "Recipes")
                  : s("厨房基础", "Kitchen essentials")}{" "}
              (
              {scope === "recipes"
                ? findRecipes(scoped(scope), options).length
                : scope === "references"
                  ? findReferences(scoped(scope)).length
                  : findRecipes(scoped(scope), options).length +
                    findReferences({ ...state, scope: "all" }).length}
              )
            </button>
          ))}
        </div>
      )}
      {(state.query ||
        Object.values(state.selected).some((ids) => ids?.length)) && (
        <div className="discovery-applied">
          {Object.entries(state.selected).flatMap(([facet, ids]) =>
            (ids || []).map((id) => {
              const tag = discoveryTags.find((t) => t.id === id);
              return (
                <button
                  key={id}
                  onClick={() =>
                    onChange(toggle(state, facet as DiscoveryFacet, id))
                  }
                  aria-label={
                    s("移除", "Remove") +
                    " " +
                    (locale === "zh" ? tag?.label : tag?.labelEn)
                  }
                >
                  {(locale === "zh" ? tag?.label : tag?.labelEn) || id} ×
                </button>
              );
            }),
          )}
          <button
            onClick={() => onChange(emptyDiscoveryState(baseScope.current))}
          >
            {s("清除全部", "Clear all")}
          </button>
          {p.onSaveSearch && (
            <button onClick={() => p.onSaveSearch?.(state)}>
              {s("保存搜索", "Save search")}
            </button>
          )}
        </div>
      )}
      <div className="discovery-layout">
        <aside className="discovery-sidebar" aria-label={s("筛选", "Filters")}>
          {facets(state, onChange)}
        </aside>
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
                "没有符合条件的结果。请移除一个筛选条件，或清除全部后重试。",
                "No results match. Remove a filter or clear all to try again.",
              )}
            </p>
          )}
          {state.scope === "all" && <h2>{s("食谱", "Recipes")}</h2>}
          <div className="grid">
            {recipes.map(({ recipe: r, preparationIds }) => (
              <section className="card" data-recipe-id={r.id} key={r.id}>
                {r.image && (
                  <a
                    className="card-image"
                    href={"#" + r.id}
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={(e) => {
                      e.preventDefault();
                      p.onOpenRecipe(
                        r.id,
                        preparationIds.length === 1
                          ? preparationIds[0]
                          : undefined,
                        e.currentTarget,
                      );
                    }}
                  >
                    <RecipeImage src={r.image} kind="card" />
                  </a>
                )}
                <div className="card-top">
                  <span>{s("食谱", "Recipe")}</span>
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
                    onClick={(e) => {
                      e.preventDefault();
                      p.onOpenRecipe(
                        r.id,
                        preparationIds.length === 1
                          ? preparationIds[0]
                          : undefined,
                        e.currentTarget,
                      );
                    }}
                  >
                    {locale === "zh" ? r.title : r.titleEn || r.title}
                  </a>
                </h3>
                <p>{locale === "zh" ? r.description : r.descriptionEn}</p>
                <div className="discovery-card-tags">
                  {Array.from(
                    new Set(
                      recipeDiscovery
                        .find((entry) => entry.id === r.id)
                        ?.preparations.filter((prep) =>
                          preparationIds.includes(prep.id),
                        )
                        .flatMap((prep) => [
                          ...(prep.facets.method || []),
                          ...(prep.facets.style || []),
                        ]) || [],
                    ),
                  )
                    .slice(0, 2)
                    .map((id) => {
                      const tag = discoveryTags.find((tag) => tag.id === id);
                      return (
                        tag && <span key={id}>{s(tag.label, tag.labelEn)}</span>
                      );
                    })}
                </div>
                {preparationIds.length > 0 &&
                  (recipeDiscovery.find((entry) => entry.id === r.id)
                    ?.preparations.length || 0) > 1 && (
                    <div className="discovery-preparations">
                      {preparationIds.slice(0, 2).map((id) => {
                        const prep = preparationFor(r.id, id);
                        return (
                          <a
                            key={id}
                            href={"#" + r.id}
                            onClick={(e) => {
                              e.preventDefault();
                              p.onOpenRecipe(r.id, id, e.currentTarget);
                            }}
                          >
                            {locale === "zh" ? prep?.title : prep?.titleEn}
                          </a>
                        );
                      })}
                    </div>
                  )}
              </section>
            ))}
          </div>
          {state.scope === "all" && (
            <div className="discovery-related-heading">
              <h2>{s("相关厨房基础", "Related kitchen essentials")}</h2>
              <p>
                {s(
                  "按搜索词查找，不受菜谱场景筛选影响。",
                  "Matched to your search, independently of recipe occasion filters.",
                )}
              </p>
            </div>
          )}
          <div className="essential-grid">
            {refs.map(({ entry }) => (
              <article className="essential-card" key={entry.id}>
                <h3>
                  <a
                    href={"#essentials/" + entry.id}
                    onClick={(e) => {
                      if (p.onOpenReference) {
                        e.preventDefault();
                        p.onOpenReference(entry.id, e.currentTarget);
                      }
                    }}
                  >
                    {locale === "zh" ? entry.title : entry.titleEn}
                  </a>
                </h3>
                <p>{locale === "zh" ? entry.summary : entry.summaryEn}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="discovery-filter-dialog"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        aria-label={s("筛选", "Filters")}
      >
        <div className="discovery-dialog-heading">
          <h2>{s("筛选", "Filters")}</h2>
          <button onClick={close}>{s("取消", "Cancel")}</button>
        </div>
        {open && facets(draft, setDraft)}
        <div className="discovery-dialog-actions">
          <button
            onClick={() => setDraft(emptyDiscoveryState(baseScope.current))}
          >
            {s("清除全部", "Clear all")}
          </button>
          <button
            onClick={() => {
              onChange(draft);
              close();
            }}
          >
            {s("显示结果", "Show results")} (
            {(draft.scope === "references"
              ? 0
              : findRecipes(draft, options).length) +
              (draft.scope === "recipes" ? 0 : findReferences(draft).length)}
            )
          </button>
        </div>
      </dialog>
    </div>
  );
}
