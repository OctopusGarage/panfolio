import type { ReactNode } from "react";
import type { Locale } from "./types";
import type { OfflineStatus } from "./offline-readiness";
export function Settings({
  locale,
  onLocale,
  online,
  installed,
  offlineStatus,
  onInstall,
  onAbout,
  onCheck,
  checking,
  shareAction,
  onExport,
  onImport,
}: {
  locale: Locale;
  onLocale: (v: Locale) => void;
  online: boolean;
  installed: boolean;
  offlineStatus: OfflineStatus;
  onInstall: () => void;
  onAbout: () => void;
  onCheck: () => void;
  checking: boolean;
  shareAction: ReactNode;
  onExport: () => void;
  onImport: () => void;
}) {
  const s = (zh: string, en: string) => (locale === "en" ? en : zh);
  return (
    <section className="settings-page">
      <h2>{s("偏好设置", "Preferences")}</h2>
      <fieldset>
        <legend>{s("界面语言", "Interface language")}</legend>
        {(["zh", "en"] as const).map((v) => (
          <label key={v}>
            <input
              type="radio"
              name="locale"
              checked={locale === v}
              onChange={() => onLocale(v)}
            />
            {v === "zh" ? "中文" : "English"}
          </label>
        ))}
        <p>
          {s(
            "菜谱与操作界面会随语言设置一起切换。",
            "Recipes and the interface follow your selected language.",
          )}
        </p>
      </fieldset>
      <h2>{s("使用 Panfolio", "Using Panfolio")}</h2>
      <div className="settings-actions">
        <button onClick={onInstall}>
          {installed
            ? s("已添加到主屏幕", "Added to Home Screen")
            : s("安装应用", "Install app")}
        </button>
        {shareAction}
        <a className="settings-ai-link" href="#ai">
          {s("在 AI 中使用 Panfolio", "Use Panfolio with your AI")}
        </a>
        <button onClick={onAbout}>{s("使用说明", "Instructions")}</button>
        <button disabled={checking} onClick={onCheck}>
          {checking
            ? s("正在检查…", "Checking…")
            : s("检查新版本", "Check for updates")}
        </button>
      </div>
      <h2>{s("本机与离线", "On this device")}</h2>
      <p>
        {online
          ? s("当前在线", "Currently online")
          : s("当前离线", "Currently offline")}
      </p>
      <p role="status">
        {offlineStatus === "ready"
          ? s(
              "菜谱正文和分享卡片已可离线使用，浏览过的图片会按需缓存。视频需要联网。",
              "Recipe text and sharing cards are ready offline. Viewed images are cached on demand. Videos need a connection.",
            )
          : offlineStatus === "installing"
            ? s(
                "正在准备离线内容，请保持联网。",
                "Preparing offline content. Please stay connected.",
              )
            : offlineStatus === "unavailable"
              ? s(
                  "此浏览器当前无法保存离线内容，请联网使用。",
                  "This browser cannot currently save offline content. Use the app online.",
                )
              : s(
                  "尚未确认离线内容已就绪，请联网打开并等待准备完成。",
                  "Offline readiness is not confirmed yet. Open online and allow preparation to finish.",
                )}
      </p>
      <p>
        {s(
          "无需账号，无分析追踪。收藏和笔记仅保存在本机，清除站点数据会删除它们。",
          "No account or analytics. Favorites and notes stay on this device. Clearing site data removes them.",
        )}
      </p>
      <div className="actions">
        <button onClick={onExport}>
          {s("导出收藏与笔记", "Export favorites and notes")}
        </button>
        <button onClick={onImport}>{s("导入备份", "Import backup")}</button>
      </div>
      <p>
        {s(
          "备份导入会合并收藏，并优先保留已有笔记。",
          "Import merges favorites and preserves existing notes on conflicts.",
        )}
      </p>
      <p>
        <a href="./recover.html">
          {s("加载异常？重新打开应用", "Loading trouble? Reopen app")}
        </a>
      </p>
      <p className="hint">
        Panfolio · OctopusGarage · v{__APP_VERSION__} · {__BUILD_ID__}
      </p>
    </section>
  );
}
