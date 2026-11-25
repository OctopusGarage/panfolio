import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import Markdown from "react-markdown";
import { recipeBody, recipeDescription } from "./recipe-language";
import { usePwaGestures } from "./usePwaGestures";
import { RecipeImage } from "./RecipeImage";
import { JapaneseSeries } from "./JapaneseSeries";
import { RecipeContent } from "./RecipeContent";
import { cookingSections } from "./recipe-content";
import recipeData from "./recipes.json";
import type { Recipe } from "./recipe-validation";
const recipes: Recipe[] = recipeData;
import { matches, parseBackup } from "./core";
import { useLocale } from "./i18n";
import { useSavedRecipes } from "./useSavedRecipes";
import { useAppUpdate } from "./useAppUpdate";
import { UpdateBanner } from "./UpdateBanner";
import { useAppFrame } from "./useAppFrame";
import { useRightEdgeBack } from "./useRightEdgeBack";
import { createClipboardWriter } from "./clipboard-writer";
import { createShareUrl } from "./protected-share";
import { ShareInbox } from "./ShareInbox";
import { AppShare } from "./AppShare";
import { Settings } from "./Settings";
import { InfoDialog } from "./InfoDialog";
import { Icon, type IconName } from "./Icon";
interface InstallEvent extends Event {
  prompt: () => Promise<void>;
}
const categories = ["all", "staples", "vegetables", "eggs", "meat"] as const;
type Category = (typeof categories)[number];
function group(title: string): Category {
  return /饭|米粉|泡面|粉丝/.test(title)
    ? "staples"
    : /鸡蛋|滑蛋/.test(title)
      ? "eggs"
      : /菜|茄子|黄瓜|耳根|芦笋/.test(title)
        ? "vegetables"
        : "meat";
}
function readRecent() {
  try {
    const v: unknown = JSON.parse(
      localStorage.getItem("panfolio:recent") || "[]",
    );
    return Array.isArray(v)
      ? v
          .filter(
            (id): id is string =>
              typeof id === "string" && recipes.some((r) => r.id === id),
          )
          .slice(0, 12)
      : [];
  } catch {
    return [];
  }
}
function readHash() {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch {
    return "";
  }
}
export default function App() {
  const { locale, setLocale, s } = useLocale();
  const [hash, setHash] = useState(readHash),
    [message, setMessage] = useState(""),
    [cooking, setCooking] = useState(false),
    [step, setStep] = useState(0),
    [recent, setRecent] = useState(readRecent),
    [showAllRecent, setShowAllRecent] = useState(false),
    [guideDismissed, setGuideDismissed] = useState(() => {
      try {
        return localStorage.getItem("panfolio:guide-dismissed") === "yes";
      } catch {
        return false;
      }
    }),
    [online, setOnline] = useState(navigator.onLine),
    [installed, setInstalled] = useState(
      matchMedia("(display-mode: standalone)").matches ||
        !!(navigator as Navigator & { standalone?: boolean }).standalone,
    ),
    [checking, setChecking] = useState(false),
    [copying, setCopying] = useState(false),
    [recipeShare, setRecipeShare] = useState<{
      id: string;
      url: string;
    } | null>(null),
    [searchActive, setSearchActive] = useState(false),
    [showTop, setShowTop] = useState(false);
  const [filters, setFilters] = useState({
    library: { query: "", category: "all" as Category },
    series: { query: "", category: "all" as Category },
    saved: { query: "", category: "all" as Category },
  });
  const install = useRef<InstallEvent | null>(null),
    file = useRef<HTMLInputElement>(null),
    lastList = useRef("library"),
    detailTrigger = useRef<HTMLElement | null>(null);
  const saved = useSavedRecipes(() =>
    setMessage(
      s(
        "保存未完成，当前改动仍在此窗口。请导出备份并稍后重试。",
        "Saving did not finish. Changes remain in this window. Export a backup and try again later.",
      ),
    ),
  );
  const { data } = saved;
  const update = useAppUpdate();
  const recipe = recipes.find((r) => r.id === hash);
  const series = hash === "japanese-chef";
  const page =
    hash === "settings"
      ? "settings"
      : hash === "guides"
        ? "guides"
        : hash === "saved"
          ? "saved"
          : "library";
  const dialog = hash.endsWith("?info=install")
    ? "install"
    : hash.endsWith("?info=about")
      ? "about"
      : null;
  const frame = useAppFrame(
    recipe ? `recipe:${recipe.id}` : series ? "japanese-chef" : page,
  );
  usePwaGestures(installed);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchScroll = useRef(0);
  const searching = useRef(false);
  const searchOrigin = useRef<HTMLElement | null>(null);
  const topFrame = useRef(0);
  function closeSearch() {
    if (!searching.current) return;
    searching.current = false;
    setSearchActive(false);
    searchInput.current?.blur();
    requestAnimationFrame(() => {
      if (frame.scrollRef.current)
        frame.scrollRef.current.scrollTop = searchScroll.current;
      searchOrigin.current?.focus({ preventScroll: true });
    });
  }
  function cancelSearch() {
    if (history.state?.panfolioSearch) history.back();
    else closeSearch();
  }
  function beginSearch() {
    if (searching.current) return;
    searching.current = true;
    setSearchActive(true);
    searchScroll.current = frame.scrollRef.current?.scrollTop || 0;
    searchOrigin.current = document.getElementById("content-heading");
    history.pushState(
      { ...history.state, panfolioSearch: true },
      "",
      location.href,
    );
    requestAnimationFrame(() =>
      frame.scrollRef.current?.scrollTo({
        top: 0,
        behavior: "instant" as ScrollBehavior,
      }),
    );
  }
  useEffect(() => {
    const pop = () => {
      if (history.state?.panfolioSearch) {
        searching.current = true;
        setSearchActive(true);
      } else closeSearch();
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    if (recipe || dialog || page === "settings" || page === "guides") {
      searching.current = false;
      setSearchActive(false);
      searchInput.current?.blur();
    }
    setShowTop(false);
  }, [hash]);
  useEffect(() => {
    if (!searchActive) return;
    const escape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !event.defaultPrevented &&
        !document.querySelector("dialog[open]")
      ) {
        event.preventDefault();
        cancelSearch();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [searchActive]);
  function onPageScroll() {
    frame.onScroll();
    cancelAnimationFrame(topFrame.current);
    topFrame.current = requestAnimationFrame(() =>
      setShowTop((frame.scrollRef.current?.scrollTop || 0) > 500),
    );
  }
  useEffect(() => () => cancelAnimationFrame(topFrame.current), []);

  const context = useRef("");
  context.current = hash + ":" + locale;
  const writer = useMemo(
    () =>
      createClipboardWriter(
        (text) => navigator.clipboard.writeText(text),
        () => context.current,
        setCopying,
      ),
    [],
  );
  const title = (r: (typeof recipes)[number]) =>
    locale === "en" ? r.titleEn || r.title : r.title;
  const categoryLabel = (c: Category) =>
    ({
      all: s("全部", "All"),
      staples: s("主食", "Rice & noodles"),
      vegetables: s("蔬菜", "Vegetables"),
      eggs: s("蛋类", "Eggs"),
      meat: s("肉与海鲜", "Meat & seafood"),
    })[c];
  const listKey = series ? "series" : page === "saved" ? "saved" : "library";
  const filter = filters[listKey];
  const list = recipes.filter(
    (r) =>
      matches(
        {
          ...r,
          title: r.title + " " + (r.titleEn || ""),
          body: r.body + " " + (r.bodyEn || ""),
        },
        filter.query,
      ) &&
      (!series || r.collection === "japanese-chef") &&
      (page !== "saved" || data.favorites.includes(r.id)) &&
      (filter.category === "all" || group(r.title) === filter.category),
  );
  const steps = recipe ? cookingSections(recipeBody(recipe, locale)) : [];
  useEffect(() => {
    const fn = () => {
      const next = readHash();
      setHash(next);
      setCooking(false);
      setStep(0);
      setMessage("");
      writer.invalidate();
    };
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, [writer]);
  useEffect(() => {
    if (!recipe && !dialog && (page === "library" || page === "saved"))
      lastList.current = series ? "japanese-chef" : page;
  }, [recipe, dialog, page, series]);
  useEffect(() => {
    if (!recipe) return;
    const next = [
      recipe.id,
      ...readRecent().filter((id) => id !== recipe.id),
    ].slice(0, 12);
    setRecent(next);
    try {
      localStorage.setItem("panfolio:recent", JSON.stringify(next));
    } catch {}
  }, [recipe?.id]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === "panfolio:recent" || e.key === null)
        setRecent(readRecent());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (recipe || dialog) return;
    const trigger = detailTrigger.current;
    if (trigger) {
      const href = trigger.getAttribute("href");
      const restored = trigger.isConnected
        ? trigger
        : Array.from(
            document.querySelectorAll<HTMLElement>(
              trigger.closest(".card")
                ? trigger.closest("h3")
                  ? ".card h3 a"
                  : trigger.classList.contains("card-image")
                    ? ".card-image"
                    : ".card .read"
                : ".recent-links a",
            ),
          ).find((element) => element.getAttribute("href") === href);
      restored?.focus({ preventScroll: true });
      detailTrigger.current = null;
    }
  }, [hash]);
  useLayoutEffect(() => {
    if (!recipe) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) {
        e.preventDefault();
        back();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [recipe]);
  useEffect(() => {
    const connection = () => setOnline(navigator.onLine);
    const prompt = (e: Event) => {
      e.preventDefault();
      install.current = e as InstallEvent;
    };
    const added = () => {
      setInstalled(true);
      install.current = null;
    };
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    window.addEventListener("beforeinstallprompt", prompt);
    window.addEventListener("appinstalled", added);
    return () => {
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
      window.removeEventListener("beforeinstallprompt", prompt);
      window.removeEventListener("appinstalled", added);
    };
  }, []);
  function back() {
    if (
      history.state?.panfolioRecipe === recipe?.id ||
      history.state?.panfolioInfo === dialog
    )
      history.back();
    else location.hash = lastList.current;
  }
  useRightEdgeBack(recipe || dialog ? back : null, hash);
  function openRecipe(r: (typeof recipes)[number], trigger: HTMLElement) {
    detailTrigger.current = trigger;
    history.replaceState(history.state, "", location.href);
    location.hash = encodeURIComponent(r.id);
    history.replaceState({ panfolioRecipe: r.id }, "", location.href);
  }
  function info(kind: "install" | "about") {
    location.hash = `${page}?info=${kind}`;
    history.replaceState({ panfolioInfo: kind }, "", location.href);
  }
  async function doInstall() {
    if (install.current) {
      try {
        await install.current.prompt();
        install.current = null;
      } catch {
        info("install");
      }
    } else info("install");
  }
  async function check() {
    if (checking) return;
    setChecking(true);
    try {
      const available = await update.checkForUpdates();
      setMessage(
        available
          ? s(
              "新版本已就绪，请选择立即更新。",
              "An update is ready. Select Update now.",
            )
          : s(
              "检查完成，目前没有可用的新版本。",
              "Check complete. No new version is available.",
            ),
      );
    } catch {
      setMessage(
        s(
          "暂时无法检查更新，请联网后重试。",
          "Could not check for updates. Connect and try again.",
        ),
      );
    } finally {
      setChecking(false);
    }
  }
  async function exportData() {
    const latest = await saved.settled();
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(latest, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "panfolio-backup.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importData(f: File) {
    try {
      if (f.size > 2_000_000) throw Error();
      const next = parseBackup(await f.text());
      const ids = new Set(recipes.map((r) => r.id));
      if (
        next.favorites.some((x) => !ids.has(x)) ||
        Object.keys(next.notes).some((x) => !ids.has(x))
      )
        throw Error();
      saved.merge(next);
      await saved.settled();
      setMessage(
        s(
          "备份已合并，现有笔记优先保留。",
          "Backup merged. Existing notes were preserved.",
        ),
      );
    } catch {
      setMessage(
        s(
          "无法导入：请选择有效的 Panfolio JSON 备份。",
          "Could not import. Choose a valid Panfolio JSON backup.",
        ),
      );
    }
  }
  async function shareRecipe() {
    if (!recipe) return;
    const id = recipe.id;
    const pageUrl = location.href;
    let url: string;
    try {
      url = recipeShare?.id === id ? recipeShare.url : await createShareUrl(id);
    } catch {
      if (location.href === pageUrl)
        setMessage(s("无法生成分享链接。", "Could not create the share link."));
      return;
    }
    if (location.href !== pageUrl) return;
    setRecipeShare({ id, url });
    void writer.write({
      text: url,
      onSuccess: () =>
        setMessage(
          s(
            "菜谱链接已复制，不包含个人笔记。",
            "Recipe link copied. Personal notes are excluded.",
          ),
        ),
      onFailure: () =>
        setMessage(
          s(
            "请手动复制下方菜谱链接。",
            "Select and copy the recipe link below.",
          ),
        ),
    });
  }
  const share = (placement: "header" | "settings") => (
    <AppShare
      locale={locale}
      writer={writer}
      copying={copying}
      onMessage={setMessage}
      placement={placement}
    />
  );
  const heading = recipe
    ? title(recipe)
    : page === "settings"
      ? s("设置", "Settings")
      : page === "guides"
        ? s("厨房指南", "Kitchen guides")
        : page === "saved"
          ? s("我的收藏", "Saved recipes")
          : series
            ? s("日厨系列", "Japanese chef series")
            : s("全部菜谱", "Recipes");
  return (
    <div
      className={`app-shell${frame.keyboardOpen ? " keyboard-open" : ""}${searchActive ? " search-active" : ""}`}
    >
      <a
        className="skip"
        href="#content-heading"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("content-heading")?.focus();
        }}
      >
        {s("跳到内容", "Skip to content")}
      </a>
      <aside className="app-sidebar">
        <a className="brand" href="#library">
          Panfolio<span>{s("厨房手记", "KITCHEN NOTES")}</span>
        </a>
        <nav className="app-nav" aria-label={s("主导航", "Primary navigation")}>
          {(
            [
              { key: "library", icon: "book", label: s("全部菜谱", "Recipes") },
              {
                key: "saved",
                icon: "heart",
                label: s("我的收藏", "Saved recipes"),
              },
              {
                key: "guides",
                icon: "help",
                label: s("厨房指南", "Kitchen guides"),
              },
              {
                key: "settings",
                icon: "settings",
                label: s("设置", "Settings"),
              },
            ] as { key: string; icon: IconName; label: string }[]
          ).map((item) => (
            <a
              href={"#" + item.key}
              key={item.key}
              aria-current={page === item.key ? "page" : undefined}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <p className="sidebar-note">
          {s("慢慢做饭，好好吃饭。", "Good recipes, made your own.")}
        </p>
      </aside>
      <div className="app-main">
        <header className="app-header">
          <div>
            <p className="eyebrow">PANFOLIO</p>
            <h1 id="content-heading" tabIndex={-1}>
              {heading}
            </h1>
          </div>
          <span className="connection">
            {online
              ? s("随时翻开你的菜谱", "Your kitchen, close at hand")
              : s("离线模式", "Offline mode")}
          </span>
          <ShareInbox
            installed={installed}
            locale={locale}
            recipes={recipes}
            onMessage={setMessage}
            onOpen={(id) => {
              if (!id) {
                location.hash = "library";
                return;
              }
              if (recipe?.id === id) return;
              location.hash = encodeURIComponent(id);
              history.replaceState({ panfolioRecipe: id }, "", location.href);
            }}
          />
          {share("header")}
          <button
            className="icon-button"
            aria-label={locale === "en" ? "中文" : "English"}
            onClick={() => {
              setLocale(locale === "en" ? "zh" : "en");
              setMessage("");
            }}
          >
            <Icon name="language" />
          </button>
        </header>
        <UpdateBanner
          snapshot={update.snapshot}
          completed={update.completed}
          locale={locale}
          onUpdate={update.requestUpdate}
        />
        <main
          className="page-scroll"
          data-testid="page-scroll"
          ref={frame.scrollRef}
          onScroll={onPageScroll}
          aria-label={s("页面内容", "Page content")}
          tabIndex={0}
        >
          <div className="workspace">
            {hash &&
            !recipe &&
            !dialog &&
            ![
              "library",
              "saved",
              "guides",
              "settings",
              "japanese-chef",
            ].includes(hash) ? (
              <section>
                <h2>{s("没有找到这道菜", "Recipe not found")}</h2>
                <a href="#library">{s("返回菜谱", "Back to recipes")}</a>
              </section>
            ) : recipe ? (
              <article>
                <button className="back" onClick={back}>
                  ← {s("返回菜谱", "Back to recipes")}
                </button>
                {recipe.image && (
                  <figure className="recipe-cover">
                    <RecipeImage src={recipe.image} kind="cover" />
                    <figcaption>
                      {categoryLabel(group(recipe.title))}
                    </figcaption>
                  </figure>
                )}
                {recipe.collection === "japanese-chef" && (
                  <a className="series-breadcrumb" href="#japanese-chef">
                    {s("日厨系列", "Japanese chef series")} · SAMUKICHI ↗
                  </a>
                )}
                <div className="detail-title">
                  <div>
                    <p className="eyebrow">
                      {categoryLabel(group(recipe.title))}
                    </p>
                    <h2>{title(recipe)}</h2>
                    <p className="recipe-description">
                      {recipeDescription(recipe, locale)}
                    </p>
                  </div>
                  <button
                    onClick={() => saved.favorite(recipe.id)}
                    aria-pressed={data.favorites.includes(recipe.id)}
                  >
                    {data.favorites.includes(recipe.id)
                      ? s("★ 已收藏", "★ Saved")
                      : s("☆ 收藏", "☆ Save")}
                  </button>
                </div>
                <div className="actions">
                  <button
                    className="primary"
                    onClick={() => {
                      setCooking(!cooking);
                      setStep(0);
                    }}
                  >
                    {cooking
                      ? s("退出烹饪模式", "Exit cooking mode")
                      : s("开始做这道菜 →", "Start cooking →")}
                  </button>
                  <button disabled={copying} onClick={shareRecipe}>
                    {s("分享菜谱链接", "Copy recipe link")}
                  </button>
                </div>
                {recipeShare?.id === recipe.id && (
                  <div className="recipe-share">
                    <input
                      readOnly
                      aria-label={s("菜谱链接", "Recipe link")}
                      value={recipeShare.url}
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                )}
                {cooking ? (
                  <section className="cooking">
                    <p className="eyebrow">
                      {s("烹饪阅读", "COOKING READER")} · {step + 1} /{" "}
                      {steps.length}
                    </p>
                    <div lang={locale === "en" ? "en" : "zh-CN"}>
                      <Markdown>{steps[step]}</Markdown>
                    </div>
                    <div className="actions">
                      <button
                        disabled={step === 0}
                        onClick={() => setStep(step - 1)}
                      >
                        {s("上一段", "Previous section")}
                      </button>
                      <button
                        disabled={step === steps.length - 1}
                        onClick={() => setStep(step + 1)}
                      >
                        {s("下一段 →", "Next section →")}
                      </button>
                    </div>
                    <p className="hint">
                      {s(
                        "按步骤完成，再继续下一步。",
                        "Finish each section before moving on.",
                      )}
                    </p>
                  </section>
                ) : (
                  <div
                    className="recipe-body"
                    lang={locale === "en" ? "en" : "zh-CN"}
                  >
                    <RecipeContent body={recipeBody(recipe, locale)} />
                  </div>
                )}
                <section className="notes">
                  <h2>{s("我的厨房笔记", "My cooking notes")}</h2>
                  <label htmlFor="note">
                    {s(
                      "这次的调整，下次的灵感",
                      "What to change or try next time",
                    )}
                  </label>
                  <textarea
                    id="note"
                    placeholder={s(
                      "比如：下次少放一点盐，土豆切大块……",
                      "For example: less salt next time; cut larger potato pieces…",
                    )}
                    value={data.notes[recipe.id] || ""}
                    onChange={(e) => saved.note(recipe.id, e.target.value)}
                  />
                  <p className="hint">
                    {s(
                      "自动保存在此设备。清除浏览器数据会删除笔记，请定期导出。",
                      "Saved on this device. Export backups before clearing browser data.",
                    )}
                  </p>
                </section>
              </article>
            ) : page === "settings" ? (
              <Settings
                locale={locale}
                onLocale={setLocale}
                online={online}
                installed={installed}
                offlineStatus={update.offlineStatus}
                onInstall={() => void doInstall()}
                onAbout={() => info("about")}
                onCheck={() => void check()}
                checking={checking}
                shareAction={share("settings")}
                onExport={() => void exportData()}
                onImport={() => file.current?.click()}
              />
            ) : page === "guides" ? (
              <section className="guides">
                <h2>{s("从收藏到上桌", "From saved recipe to dinner")}</h2>
                <details open>
                  <summary>{s("找到想做的菜", "Find a recipe")}</summary>
                  <p>
                    {s(
                      "搜索菜名或食材，使用分类缩小范围。点星标收藏，打开菜谱后进入烹饪阅读。",
                      "Search names or ingredients and filter by category. Save recipes with the star and open cooking mode for section-by-section reading.",
                    )}
                  </p>
                </details>
                <details>
                  <summary>{s("做出自己的版本", "Make it your own")}</summary>
                  <p>
                    {s(
                      "用厨房笔记记录实际用量、口味调整和下次想试的做法。原始菜谱不会被修改。",
                      "Use notes for quantities you used, seasoning changes and ideas for next time. The original recipe stays intact.",
                    )}
                  </p>
                </details>
                <details>
                  <summary>
                    {s("离线、安装与更新", "Offline, installation and updates")}
                  </summary>
                  <p>
                    {s(
                      "在设置查看离线就绪状态，按设备指引安装。联网回到应用时会检查更新，也可手动检查；新版本需要确认后才启用。",
                      "Check offline readiness in Settings and follow installation instructions. Returning online checks for updates; you can also check manually. Confirm an available update to activate it.",
                    )}
                  </p>
                  <button onClick={() => info("install")}>
                    {s("安装指引", "Installation help")}
                  </button>
                </details>
                <details>
                  <summary>{s("备份你的记录", "Back up your notes")}</summary>
                  <p>
                    {s(
                      "定期在设置导出 JSON。换设备时导入备份，收藏会合并，已有笔记优先保留。没有云同步。",
                      "Export JSON regularly in Settings. Import on another device to merge favorites while preserving existing notes. There is no cloud sync.",
                    )}
                  </p>
                </details>
              </section>
            ) : (
              <>
                {series ? (
                  <JapaneseSeries expanded />
                ) : (
                  <section className="intro">
                    <p className="eyebrow">THE EVERYDAY COOKBOOK</p>
                    <h2>
                      {s("今天想吃什么？", "Something good")}
                      <br />
                      {s("从这里开始。", "is on the menu.")}
                    </h2>
                    <p>
                      {s(
                        "收藏喜欢的菜，记下每一次做饭的灵感。",
                        "Start with a favorite dish. Build a collection that feels like home.",
                      )}
                    </p>
                  </section>
                )}
                {page === "library" && !series && <JapaneseSeries />}
                {!guideDismissed && !series && (
                  <section className="first-guide">
                    <h2>
                      {s("你的第一道拿手菜", "Your first signature dish")}
                    </h2>
                    <p>
                      {s(
                        "找一道想做的菜 → 点星标收藏 → 开始烹饪 → 记下自己的调整。",
                        "Find a recipe → save it → start cooking → note your own adjustments.",
                      )}
                    </p>
                    <button
                      onClick={() => {
                        setGuideDismissed(true);
                        try {
                          localStorage.setItem(
                            "panfolio:guide-dismissed",
                            "yes",
                          );
                        } catch {}
                      }}
                    >
                      {s("知道了", "Got it")}
                    </button>
                  </section>
                )}
                {page === "library" && !series && recent.length > 0 && (
                  <section className="recent">
                    <h2>{s("最近浏览", "Recently viewed")}</h2>
                    <div className="recent-links">
                      {recent.slice(0, showAllRecent ? 12 : 3).map((id) => {
                        const r = recipes.find((r) => r.id === id)!;
                        return (
                          <a
                            key={id}
                            href={"#" + encodeURIComponent(id)}
                            onClick={(e) => {
                              e.preventDefault();
                              openRecipe(r, e.currentTarget);
                            }}
                          >
                            {title(r)}
                          </a>
                        );
                      })}
                    </div>
                    {recent.length > 3 && (
                      <button onClick={() => setShowAllRecent(!showAllRecent)}>
                        {showAllRecent
                          ? s("收起", "Show less")
                          : s("展开全部", "Show all")}
                      </button>
                    )}
                  </section>
                )}
                <section className="library">
                  <div className="library-heading">
                    <h2>
                      {page === "saved"
                        ? s("我的收藏", "Saved recipes")
                        : series
                          ? s("四堂厨房练习", "Four kitchen lessons")
                          : s("菜谱一览", "Recipe collection")}
                    </h2>
                    <span>
                      {list.length} {s("篇", "recipes")}
                    </span>
                  </div>
                  <div className="search-toolbar">
                    <label className="search">
                      <span>
                        {s("搜索菜名或食材", "Search names or ingredients")}
                      </span>
                      <input
                        type="search"
                        aria-label={s(
                          "搜索菜名或食材",
                          "Search names or ingredients",
                        )}
                        ref={searchInput}
                        onFocus={beginSearch}
                        enterKeyHint="search"
                        onKeyDown={(e) => {
                          if (
                            e.key === "Escape" &&
                            !document.querySelector("dialog[open]")
                          ) {
                            e.preventDefault();
                            cancelSearch();
                          }
                          if (e.key === "Enter") e.currentTarget.blur();
                        }}
                        placeholder={s(
                          "试试：虾仁、土豆、炒饭…",
                          "Try: shrimp, potato, fried rice…",
                        )}
                        value={filter.query}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            [listKey]: { ...filter, query: e.target.value },
                          })
                        }
                      />
                    </label>
                    {searchActive && (
                      <button className="search-cancel" onClick={cancelSearch}>
                        {s("取消", "Cancel")}
                      </button>
                    )}
                  </div>
                  {searchActive && (
                    <p className="search-results-count" role="status">
                      {filter.query
                        ? s(
                            `找到 ${list.length} 篇菜谱`,
                            `${list.length} recipes found`,
                          )
                        : s(
                            "输入菜名或食材",
                            "Type a recipe name or ingredient",
                          )}
                    </p>
                  )}
                  <div className="filters">
                    {categories.map((c) => (
                      <button
                        key={c}
                        aria-pressed={c === filter.category}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            [listKey]: { ...filter, category: c },
                          })
                        }
                      >
                        {categoryLabel(c)}
                      </button>
                    ))}
                  </div>
                  <div className="grid">
                    {list.map((r) => (
                      <section className="card" key={r.id}>
                        {r.image && (
                          <a
                            className="card-image"
                            tabIndex={-1}
                            aria-hidden="true"
                            href={"#" + encodeURIComponent(r.id)}
                            onClick={(e) => {
                              e.preventDefault();
                              openRecipe(r, e.currentTarget);
                            }}
                          >
                            <RecipeImage src={r.image} kind="card" />
                          </a>
                        )}
                        <div className="card-top">
                          <span>
                            {r.collection === "japanese-chef"
                              ? s("日厨系列", "Japanese chef series")
                              : categoryLabel(group(r.title))}
                          </span>
                          <button
                            aria-label={`${data.favorites.includes(r.id) ? s("取消收藏", "Unsave") : s("收藏", "Save")} ${title(r)}`}
                            aria-pressed={data.favorites.includes(r.id)}
                            onClick={() => saved.favorite(r.id)}
                          >
                            {data.favorites.includes(r.id) ? "★" : "☆"}
                          </button>
                        </div>
                        <h3>
                          <a
                            href={"#" + encodeURIComponent(r.id)}
                            onClick={(e) => {
                              e.preventDefault();
                              openRecipe(r, e.currentTarget);
                            }}
                          >
                            {title(r)}
                          </a>
                        </h3>
                        <p>
                          {/10\s*种/.test(r.title)
                            ? s("多种做法合集", "A collection of preparations")
                            : recipeDescription(r, locale)}
                        </p>
                        <a
                          className="read"
                          href={"#" + encodeURIComponent(r.id)}
                          onClick={(e) => {
                            e.preventDefault();
                            openRecipe(r, e.currentTarget);
                          }}
                        >
                          {s("翻开菜谱", "Open recipe")} <span>↗</span>
                        </a>
                      </section>
                    ))}
                  </div>
                  {list.length === 0 && (
                    <p className="empty">
                      {page === "saved"
                        ? s(
                            "还没有匹配的收藏，去发现喜欢的菜吧。",
                            "No matching saved recipes yet. Find a dish you love.",
                          )
                        : s(
                            "没有找到匹配的菜谱，换个关键词试试。",
                            "No recipes found. Try another keyword.",
                          )}
                    </p>
                  )}
                </section>
              </>
            )}
            <footer>
              <strong>Panfolio</strong>
              <span>
                {s(
                  "不需要账号 · 数据留在你的设备",
                  "No account · Data stays on your device",
                )}
              </span>
            </footer>
          </div>
        </main>
      </div>
      <input
        hidden
        ref={file}
        type="file"
        accept="application/json,.json"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void importData(f);
          e.target.value = "";
        }}
      />
      {showTop && !dialog && !frame.keyboardOpen && (
        <button
          className="back-to-top"
          aria-label={s("回到顶部", "Back to top")}
          onClick={() => {
            frame.scrollRef.current?.scrollTo({
              top: 0,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth",
            });
          }}
        >
          <span aria-hidden="true">↑</span>
          <span>{s("顶部", "Top")}</span>
        </button>
      )}
      {message && (
        <div className="toast" role="status">
          {message}
          <button onClick={() => setMessage("")}>{s("关闭", "Close")}</button>
        </div>
      )}
      {dialog && (
        <InfoDialog
          title={
            dialog === "install"
              ? s("随身带着你的厨房", "Take your kitchen with you")
              : s("使用说明", "Instructions")
          }
          closeLabel={s("关闭", "Close")}
          onClose={back}
        >
          {dialog === "install" ? (
            <>
              <p>
                {s(
                  "iPhone 和 iPad：在 Safari 点“分享”，选择“添加到主屏幕”。",
                  "iPhone and iPad: in Safari, choose Share → Add to Home Screen.",
                )}
              </p>
              <p>
                {s(
                  "Android：浏览器菜单选择“安装应用”或“添加到主屏幕”。桌面：使用地址栏的安装图标。",
                  "Android: choose Install app or Add to Home Screen in the browser menu. Desktop: use the install icon in the address bar.",
                )}
              </p>
              <p>
                {s(
                  "首次完整联网加载并确认缓存就绪后，可离线查看菜谱正文。",
                  "After a full online visit and confirmed caching, recipe text works offline.",
                )}
              </p>
            </>
          ) : (
            <>
              <p>
                {s(
                  "浏览菜谱 → 收藏喜欢的菜 → 开始烹饪 → 留下个人笔记。",
                  "Browse recipes → save favorites → start cooking → keep personal notes.",
                )}
              </p>
              <p>
                {s(
                  "菜谱与操作界面支持中英文，可随时切换。",
                  "Recipes and the interface support Chinese and English. Switch languages at any time.",
                )}
              </p>
              <p>
                {s(
                  "收藏和笔记保存在此设备，分享链接不包含笔记。请定期在设置导出备份。",
                  "Favorites and notes stay on this device. Shared links exclude notes. Export backups regularly in Settings.",
                )}
              </p>
            </>
          )}
        </InfoDialog>
      )}
    </div>
  );
}
