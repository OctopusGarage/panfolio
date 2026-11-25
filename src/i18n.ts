import { useEffect, useState } from "react";
import type { Locale } from "./types";
export function useLocale() {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const v = localStorage.getItem("panfolio:locale");
      if (v === "zh" || v === "en") return v;
    } catch {}
    return /^zh/i.test(navigator.language) ? "zh" : "en";
  });
  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
    document.title =
      locale === "en"
        ? "Panfolio · Your kitchen notebook"
        : "Panfolio · 我的厨房手记";
    try {
      localStorage.setItem("panfolio:locale", locale);
    } catch {}
  }, [locale]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (
        e.key === "panfolio:locale" &&
        (e.newValue === "zh" || e.newValue === "en")
      )
        setLocale(e.newValue);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return {
    locale,
    setLocale,
    s: (zh: string, en: string) => (locale === "en" ? en : zh),
  };
}
