import { useEffect, useRef, useState } from "react";
import { decryptLink } from "@octopusgarage/s";
import { Icon } from "./Icon";
import type { Locale } from "./types";

type Recipe = { id: string; title: string; titleEn?: string };
type Props = {
  installed: boolean;
  locale: Locale;
  recipes: readonly Recipe[];
  onOpen: (id: string) => void;
};

export function ShareInbox({ installed, locale, recipes, onOpen }: Props) {
  const s = (zh: string, en: string) => (locale === "en" ? en : zh);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const seen = useRef(new Set<string>());
  const inspection = useRef(0);
  const [text, setText] = useState("");
  const [candidate, setCandidate] = useState<Recipe | null>(null);
  const [error, setError] = useState(false);

  function close() {
    inspection.current++;
    dialog.current?.close();
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
      setError(false);
      if (!dialog.current?.open) dialog.current?.showModal();
    } catch {
      if (!automatic && request === inspection.current) {
        setCandidate(null);
        setError(true);
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
        // Browsers can refuse automatic reads. The paste form remains available.
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
        onClick={() => {
          inspection.current++;
          setText("");
          setCandidate(null);
          setError(false);
          dialog.current?.showModal();
        }}
      >
        <Icon name="paste" />
      </button>
      <dialog
        ref={dialog}
        className="app-share-dialog"
        aria-labelledby="share-inbox-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <h2 id="share-inbox-title">
          {candidate
            ? candidate.id
              ? s("打开分享的菜谱？", "Open shared recipe?")
              : s("打开 Panfolio 首页？", "Open Panfolio home?")
            : s("粘贴分享链接", "Paste a share link")}
        </h2>
        {candidate ? (
          <>
            <p>
              {locale === "en"
                ? candidate.titleEn || candidate.title
                : candidate.title}
            </p>
            <button
              type="button"
              onClick={() => {
                close();
                onOpen(candidate.id);
              }}
            >
              {candidate.id
                ? s("打开菜谱", "Open recipe")
                : s("打开首页", "Open home")}
            </button>
          </>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void inspect(text, false);
            }}
          >
            <label htmlFor="share-inbox-link">
              {s("分享链接", "Share link")}
            </label>
            <input
              id="share-inbox-link"
              value={text}
              required
              maxLength={2900}
              onPaste={(event) => {
                event.preventDefault();
                const value = event.clipboardData.getData("text/plain");
                setText(value.slice(0, 2900));
                void inspect(value, false);
              }}
              onChange={(event) => {
                inspection.current++;
                setText(event.target.value);
                setError(false);
              }}
            />
            {typeof navigator.clipboard?.readText === "function" && (
              <button
                type="button"
                onClick={() => {
                  const request = ++inspection.current;
                  void navigator.clipboard
                    .readText()
                    .then((value) => {
                      if (request !== inspection.current) return;
                      setText(value.slice(0, 2900));
                      void inspect(value, false, request);
                    })
                    .catch(() => {
                      if (request === inspection.current)
                        document.getElementById("share-inbox-link")?.focus();
                    });
                }}
              >
                {s("从剪贴板粘贴", "Paste from clipboard")}
              </button>
            )}
            <button type="submit">{s("识别链接", "Check link")}</button>
            {error && (
              <p role="status">
                {s(
                  "这不是可打开的 Panfolio 分享链接。",
                  "This is not a valid Panfolio share link.",
                )}
              </p>
            )}
          </form>
        )}
        <button type="button" onClick={close}>
          {s("取消", "Cancel")}
        </button>
      </dialog>
    </>
  );
}
