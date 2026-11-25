import { useEffect, useRef, useState } from "react";
import { decryptLink } from "@octopusgarage/s";
import { Icon } from "./Icon";
import type { Locale } from "./types";
import "./share-inbox.css";

type Recipe = { id: string; title: string; titleEn?: string };
type Props = {
  installed: boolean;
  locale: Locale;
  recipes: readonly Recipe[];
  onMessage: (message: string) => void;
  onOpen: (id: string) => void;
};

export function ShareInbox({
  installed,
  locale,
  recipes,
  onOpen,
  onMessage,
}: Props) {
  const s = (zh: string, en: string) => (locale === "en" ? en : zh);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const seen = useRef(new Set<string>());
  const inspection = useRef(0);
  const [candidate, setCandidate] = useState<Recipe | null>(null);
  const reading = useRef(false);

  useEffect(() => {
    if (candidate && !dialog.current?.open) dialog.current?.showModal();
  }, [candidate]);

  function close() {
    inspection.current++;
    dialog.current?.close();
    setCandidate(null);
    trigger.current?.focus({ preventScroll: true });
  }

  async function inspect(
    value: string,
    automatic: boolean,
    request = ++inspection.current,
  ) {
    const link = value.trim();
    if (
      automatic &&
      (!link.startsWith("https://octopusgarage.github.io/s/#") ||
        link.length > 2900 ||
        seen.current.has(link))
    )
      return;
    try {
      if (link.length > 2900) throw new Error("Invalid link");
      const destination = await decryptLink(link);
      const id = decodeURIComponent(destination.hash.slice(1));
      const recipe = id
        ? recipes.find((entry) => entry.id === id)
        : { id: "", title: "Panfolio", titleEn: "Panfolio" };
      if (
        destination.pathname !== "/panfolio/" ||
        destination.search ||
        !recipe
      )
        throw new Error("Invalid recipe");
      if (
        request !== inspection.current ||
        (automatic && document.visibilityState !== "visible")
      )
        return;
      seen.current.add(link);
      setCandidate(recipe);
    } catch {
      if (!automatic && request === inspection.current) {
        onMessage(
          s(
            "剪贴板中没有有效的 Panfolio 分享链接。",
            "The clipboard does not contain a valid Panfolio share link.",
          ),
        );
      }
    }
  }

  useEffect(() => {
    if (
      !installed ||
      !navigator.clipboard?.readText ||
      !navigator.permissions?.query
    )
      return;
    let disposed = false;
    let busy = false;
    async function check() {
      if (
        busy ||
        reading.current ||
        disposed ||
        dialog.current?.open ||
        document.visibilityState !== "visible" ||
        !document.hasFocus()
      )
        return;
      busy = true;
      const request = ++inspection.current;
      try {
        const permission = await navigator.permissions.query({
          name: "clipboard-read" as PermissionName,
        });
        if (
          permission.state !== "granted" ||
          disposed ||
          request !== inspection.current
        )
          return;
        const value = await navigator.clipboard.readText();
        if (!disposed && request === inspection.current && document.hasFocus())
          await inspect(value, true, request);
      } catch {
        // Browsers can refuse automatic reads. The paste button remains available.
      } finally {
        busy = false;
      }
    }
    void check();
    window.addEventListener("focus", check);
    window.addEventListener("pageshow", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      disposed = true;
      inspection.current++;
      window.removeEventListener("focus", check);
      window.removeEventListener("pageshow", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [installed, recipes]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="icon-button"
        aria-label={s("粘贴链接", "Paste link")}
        title={s("粘贴链接", "Paste link")}
        onClick={async () => {
          if (reading.current) return;
          reading.current = true;
          const request = ++inspection.current;
          onMessage("");
          try {
            const value = await navigator.clipboard.readText();
            if (request === inspection.current)
              await inspect(value, false, request);
          } catch {
            if (request === inspection.current)
              onMessage(
                s(
                  "无法读取剪贴板。请允许粘贴后重试。",
                  "Could not read the clipboard. Allow pasting and try again.",
                ),
              );
          } finally {
            reading.current = false;
          }
        }}
      >
        <Icon name="paste" />
      </button>
      <dialog
        ref={dialog}
        className="app-share-dialog share-inbox"
        aria-labelledby="share-inbox-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        {candidate && (
          <>
            <h2 id="share-inbox-title">
              {candidate.id
                ? s("打开分享的菜谱？", "Open shared recipe?")
                : s("打开 Panfolio 首页？", "Open Panfolio home?")}
            </h2>
            <p className="share-inbox-title">
              {locale === "en"
                ? candidate.titleEn || candidate.title
                : candidate.title}
            </p>
            <div className="share-inbox-actions">
              <button
                type="button"
                className="app-share-secondary"
                onClick={close}
              >
                {s("取消", "Cancel")}
              </button>
              <button
                type="button"
                className="app-share-primary"
                onClick={() => {
                  close();
                  onOpen(candidate.id);
                }}
              >
                {candidate.id
                  ? s("打开菜谱", "Open recipe")
                  : s("打开首页", "Open home")}
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
