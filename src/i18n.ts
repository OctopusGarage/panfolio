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
export const englishTitles = [
  "Japanese beef and potato stew (Nikujaga)",
  "Ajian-style egg fried rice",
  "Shrimp and egg fried rice",
  "Egg-fried rice vermicelli",
  "Charred pepper and century egg fried rice",
  "Braised eggplant",
  "Singapore-style fried rice vermicelli",
  "Seafood glass noodle casserole",
  "Eggplant and scrambled eggs",
  "Ten ways to upgrade instant noodles",
  "Steamed yellow croaker",
  "Cold houttuynia salad",
  "Steamed pork ribs with black bean sauce",
  "Spinach and scrambled eggs",
  "Silky scrambled eggs with shrimp",
  "Garlic and cumin pork ribs",
  "Stir-fried shrimp and broccoli",
  "Pan-seared sablefish",
  "Smashed cucumber with all-purpose sauce",
  "Water spinach with fermented bean curd and chili",
];
