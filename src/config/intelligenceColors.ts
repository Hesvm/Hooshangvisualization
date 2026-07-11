import type { IntelligenceCategory } from "@/types/intelligence";

/**
 * Display order for the category ring around the center node and for the
 * filter-chip row. Mirrors the domain list from the approved spec.
 */
export const CATEGORY_ORDER: IntelligenceCategory[] = [
  "kharid",
  "mali",
  "salamat",
  "sabkeZendegi",
  "makanha",
  "amoozesh",
  "dastgahha",
  "appHayeMotasel",
  "servisha",
  "ravabet",
  "goftogooha",
  "tarjihat",
  "risk",
  "ahdaf",
];

export const CATEGORY_LABELS: Record<IntelligenceCategory, string> = {
  kharid: "خرید",
  mali: "مالی",
  salamat: "سلامت",
  sabkeZendegi: "سبک زندگی",
  makanha: "مکان‌ها",
  amoozesh: "آموزش",
  dastgahha: "دستگاه‌ها",
  appHayeMotasel: "اپ‌های متصل",
  servisha: "سرویس‌ها",
  ravabet: "روابط",
  goftogooha: "گفتگوها",
  tarjihat: "ترجیحات",
  risk: "ریسک",
  ahdaf: "اهداف",
};

/**
 * RGB channels (no `rgb()` wrapper) so callers can compose `rgba(${accent}, alpha)`,
 * matching the existing SPACE_ACCENT_RGB convention in src/config/spaceColors.ts.
 */
export const CATEGORY_ACCENT_RGB: Record<IntelligenceCategory, string> = {
  kharid: "80, 130, 220",
  mali: "26, 158, 107",
  salamat: "232, 56, 79",
  sabkeZendegi: "154, 111, 224",
  makanha: "196, 130, 74",
  amoozesh: "214, 158, 46",
  dastgahha: "20, 165, 180",
  appHayeMotasel: "245, 112, 34",
  servisha: "91, 146, 166",
  ravabet: "214, 101, 144",
  goftogooha: "99, 110, 125",
  tarjihat: "176, 141, 87",
  risk: "197, 84, 60",
  ahdaf: "122, 163, 95",
};
