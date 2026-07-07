import type { ComposerSuggestion, SpaceConfig } from "@/types/space";
import { INITIAL_USER_MESSAGE } from "@/lib/mocks/shoppingScript";

const LAPTOP_SHOPPING_SUGGESTION: ComposerSuggestion = {
  id: "laptop",
  label: INITIAL_USER_MESSAGE,
  icon: "shopping",
  prompt: INITIAL_USER_MESSAGE,
  href: "/spaces/kharid/conversations/laptop-shopping",
};

export const homeComposerSuggestions: ComposerSuggestion[] = [
  LAPTOP_SHOPPING_SUGGESTION,
  { id: "today", label: "برنامه امروزمو بررسی کن", icon: "daily", prompt: "برنامه امروزمو بررسی کن" },
  { id: "trip", label: "برای سفرم برنامه بچین", icon: "travel", prompt: "برای سفرم برنامه بچین" },
];

export const spaces: SpaceConfig[] = [
  {
    id: "ravan",
    label: "روان",
    iconSrc: "/images/spaces/new-icons-symbol-130/mind.png",
    hasNotification: false,
    composerSuggestions: [
      { id: "mood", label: "حالم رو بررسی کن", icon: "health", prompt: "حالم رو بررسی کن" },
      { id: "journal", label: "یه یادداشت کوتاه بنویسیم", icon: "daily", prompt: "یه یادداشت کوتاه بنویسیم" },
      { id: "sleep-stress", label: "برای آرامش قبل خواب کمکم کن", icon: "sleep", prompt: "برای آرامش قبل خواب کمکم کن" },
    ],
  },
  {
    id: "badan",
    label: "بدن",
    iconSrc: "/images/spaces/new-icons-symbol-130/health.png",
    hasNotification: false,
    composerSuggestions: [
      { id: "today-workout", label: "برنامه تمرین امروز رو باز کن", icon: "workout", prompt: "برنامه تمرین امروز رو باز کن" },
      { id: "sleep", label: "خواب دیشبم رو تحلیل کن", icon: "sleep", prompt: "خواب دیشبم رو تحلیل کن" },
      { id: "blood-test", label: "نتیجه آزمایشم رو بررسی کن", icon: "health", prompt: "نتیجه آزمایشم رو بررسی کن" },
    ],
  },
  {
    id: "modiriat-mali",
    label: "مدیریت مالی",
    iconSrc: "/images/spaces/new-icons-symbol-130/finance.png",
    hasNotification: false,
    composerSuggestions: [
      { id: "expenses", label: "خرج‌های این هفته رو بررسی کن", icon: "finance", prompt: "خرج‌های این هفته رو بررسی کن" },
      { id: "budget", label: "یه بودجه اقتصادی بچین", icon: "finance", prompt: "یه بودجه اقتصادی بچین" },
      { id: "installments", label: "قسط‌های پیش روم رو ببین", icon: "daily", prompt: "قسط‌های پیش روم رو ببین" },
    ],
  },
  {
    id: "kharid",
    label: "خرید",
    iconSrc: "/images/spaces/new-icons-symbol-130/shopping.png",
    hasNotification: true,
    composerSuggestions: [
      LAPTOP_SHOPPING_SUGGESTION,
      { id: "saved-prices", label: "قیمت‌های ذخیره‌شده رو بررسی کن", icon: "shopping", prompt: "قیمت‌های ذخیره‌شده رو بررسی کن" },
      { id: "budget-cart", label: "یه سبد خرید اقتصادی بساز", icon: "finance", prompt: "یه سبد خرید اقتصادی بساز" },
    ],
  },
  {
    id: "baghie",
    label: "بقیه",
    iconSrc: "/images/spaces/new-icons-symbol-130/more.png",
    hasNotification: false,
    composerSuggestions: [
      { id: "today", label: "برنامه امروزمو مرتب کن", icon: "daily", prompt: "برنامه امروزمو مرتب کن" },
      { id: "reminders", label: "کارهای عقب‌افتاده رو ببین", icon: "daily", prompt: "کارهای عقب‌افتاده رو ببین" },
      { id: "quick-note", label: "یه یادداشت سریع ثبت کن", icon: "learning", prompt: "یه یادداشت سریع ثبت کن" },
    ],
  },
  {
    id: "gasht-o-gozar",
    label: "گشت و گذار",
    iconSrc: "/images/spaces/new-icons-symbol-130/trip.png",
    hasNotification: false,
    composerSuggestions: [
      { id: "trip", label: "برای سفرم برنامه بچین", icon: "travel", prompt: "برای سفرم برنامه بچین" },
      { id: "weekend", label: "آخر هفته کجا بریم؟", icon: "travel", prompt: "آخر هفته کجا بریم؟" },
      { id: "route", label: "یه مسیر کوتاه پیشنهاد بده", icon: "travel", prompt: "یه مسیر کوتاه پیشنهاد بده" },
    ],
  },
  {
    id: "sargarmi",
    label: "سرگرمی",
    iconSrc: "/images/spaces/new-icons-symbol-130/popcorn.png",
    hasNotification: false,
    composerSuggestions: [
      { id: "movie", label: "امشب چی ببینم؟", icon: "daily", prompt: "امشب چی ببینم؟" },
      { id: "game", label: "یه بازی سبک پیشنهاد بده", icon: "learning", prompt: "یه بازی سبک پیشنهاد بده" },
      { id: "playlist", label: "برای تمرکز پلی‌لیست بساز", icon: "daily", prompt: "برای تمرکز پلی‌لیست بساز" },
    ],
  },
  {
    id: "yadgiri",
    label: "یادگیری",
    iconSrc: "/images/spaces/new-icons-symbol-130/education.png",
    hasNotification: false,
    composerSuggestions: [
      { id: "lesson", label: "درس قبلی رو ادامه بده", icon: "learning", prompt: "درس قبلی رو ادامه بده" },
      { id: "practice", label: "یه تمرین کوتاه بده", icon: "learning", prompt: "یه تمرین کوتاه بده" },
      { id: "summary", label: "یادداشت‌هام رو خلاصه کن", icon: "daily", prompt: "یادداشت‌هام رو خلاصه کن" },
    ],
  },
];
