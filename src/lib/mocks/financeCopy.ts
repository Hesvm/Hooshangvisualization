/**
 * All Persian copy + pacing constants for the crypto-portfolio-analysis flow
 * and the cross-market allocation editor. Kept separate from the flow
 * components so strings/timings can be tuned without touching JSX, mirroring
 * how `shoppingScript.ts` centralizes the laptop-shopping flow's copy.
 */

import type { QuestionDef } from "@/lib/mocks/shoppingScript";
import type { HistoryItem } from "@/types/history";
import type { ComposerSuggestion } from "@/types/space";

export const CRYPTO_ANALYSIS_CONVERSATION_ID = "crypto-portfolio-analysis";
export const FINANCE_HEADER_ACCENT_RGB = "26, 158, 107";

export const FINANCE_HISTORY: HistoryItem[] = [
  {
    id: CRYPTO_ANALYSIS_CONVERSATION_ID,
    title: "تحلیل پرتفوی کریپتو",
    subtitle: "ترکیب دارایی‌ها، سود و زیان و امتیاز ریسک",
    isUnread: false,
    href: `/spaces/modiriat-mali/conversations/${CRYPTO_ANALYSIS_CONVERSATION_ID}`,
  },
  {
    id: "monthly-budget",
    title: "بودجه اقتصادی این ماه",
    subtitle: "پیشنهاد سقف خرج برای هر دسته",
    isUnread: true,
  },
  {
    id: "weekly-expenses",
    title: "بررسی خرج‌های این هفته",
    subtitle: "مقایسه با میانگین سه ماه اخیر",
    isUnread: false,
  },
];

export const FINANCE_SUGGESTED_PROMPTS: ComposerSuggestion[] = [
  { id: "expenses", label: "خرج‌های این هفته رو بررسی کن", icon: "finance", prompt: "خرج‌های این هفته رو بررسی کن" },
  { id: "budget", label: "یه بودجه اقتصادی بچین", icon: "finance", prompt: "یه بودجه اقتصادی بچین" },
  { id: "rebalance", label: "پیشنهاد بازتوزیع پرتفوی بده", icon: "finance", prompt: "پیشنهاد بازتوزیع پرتفوی بده" },
];

export const TIMING = {
  promptToListMs: 280,
  portfolioIntroDelayMs: 350,
  portfolioResultDelayMs: 350,
  chipFollowupDelayMs: 240,
  allocationUserMessageDelayMs: 210,
  allocationPromptDelayMs: 350,
  questionAdvanceMs: 280,
  allocationEditorDelayMs: 350,
};

export const FINANCE_START_COPY = {
  eyebrow: "شروع کن",
  title: "پرتفوی کریپتوت رو تحلیل کن",
  body: "صرافیت رو وصل کن تا هوشنگ ترکیب دارایی‌هات، سود و زیان و ریسک پرتفوت رو بررسی کنه.",
  cta: "تحلیل پرتفوی کریپتو",
};

export const EXCHANGE_STEP_COPY = {
  userMessage: "می‌خوام پرتفوی کریپتوم رو تحلیل کنی",
  assistantPrompt: "حتماً. اول بگو دارایی‌هات کجاست تا وصل بشیم:",
};

export const EXCHANGE_SHEET_COPY = {
  title: "اتصال به بیت‌پین",
  body: "هوشنگ فقط به اطلاعات موجودی و معاملات دسترسی می‌گیره، بدون امکان برداشت یا انتقال دارایی.",
  confirmLabel: "تأیید و اتصال",
  cancelLabel: "انصراف",
};

export const EXCHANGE_UNAVAILABLE_NOTE =
  "فعلاً فقط اتصال به بیت‌پین در این نسخه فعاله — این گزینه به‌زودی اضافه می‌شه.";

export const PORTFOLIO_RESULT_COPY = {
  intro: "تحلیل پرتفوت آماده شد. این خلاصه‌ای از وضعیت فعلیه:",
};

export const PORTFOLIO_CHIPS = {
  fullSpendingAnalysis: { id: "full-spending-analysis", label: "تحلیل کامل خرج‌ها" },
  crossMarketAllocation: { id: "cross-market-allocation", label: "بررسی تخصیص دارایی بین بازارها" },
  rebalanceTips: { id: "rebalance-tips", label: "پیشنهاد بازتوزیع پرتفوی کریپتو" },
};

export const CHIP_FOLLOWUP_COPY: Record<string, string> = {
  [PORTFOLIO_CHIPS.fullSpendingAnalysis.id]: "تحلیل کامل خرج‌ها هنوز در دسترس نیست — به‌زودی اضافه می‌شه.",
  [PORTFOLIO_CHIPS.rebalanceTips.id]: "پیشنهاد بازتوزیع پرتفوی کریپتو هنوز در دسترس نیست — به‌زودی اضافه می‌شه.",
};

export const ALLOCATION_INTRO_COPY = {
  userMessage: PORTFOLIO_CHIPS.crossMarketAllocation.label,
  assistantPrompt: "برای پیشنهاد یه تخصیص مناسب بین بازارها، دو سؤال کوتاه دارم:",
};

export const RISK_QUESTIONS: QuestionDef[] = [
  {
    question: "افق سرمایه‌گذاریت چقدره؟",
    options: [
      { id: "short", icon: "horizon-short", label: "کمتر از ۱ سال" },
      { id: "medium", icon: "horizon-medium", label: "بین ۱ تا ۳ سال" },
      { id: "long", icon: "horizon-long", label: "بیشتر از ۳ سال" },
    ],
    allowCustom: false,
  },
  {
    question: "چقدر تحمل نوسان قیمت داری؟",
    options: [
      { id: "low", icon: "risk-low", label: "نوسان کم رو ترجیح می‌دم" },
      { id: "medium", icon: "risk-medium", label: "تا حدی نوسان برام قابل قبوله" },
      { id: "high", icon: "risk-high", label: "به امید بازده بیشتر، نوسان بیشتر رو می‌پذیرم" },
    ],
    allowCustom: false,
  },
];

export const ALLOCATION_EDITOR_COPY = {
  title: "پیشنهاد تخصیص دارایی",
  subtitle: "بر اساس پاسخ‌هات، این ترکیب پیشنهاد می‌شه. می‌تونی خودت هم اسلایدرها رو تغییر بدی.",
  presetLabels: {
    conservative: "محافظه‌کارانه",
    balanced: "متعادل",
    aggressive: "تهاجمی",
  },
  totalAmountLabel: "مبلغ قابل سرمایه‌گذاری",
  summaryTitle: "جمع‌بندی ریسک",
  disclaimer:
    "این یه پیشنهاد ترکیبیه، نه توصیه تضمینی. بازده بازارهای سرمایه‌گذاری از جمله بورس و ارز دیجیتال تضمینی نیست و ممکنه با ضرر همراه باشه.",
  secondaryActions: {
    resetToPreset: "برگشت به پیشنهاد اولیه",
    saveAllocation: "ذخیره این ترکیب",
    shareAllocation: "اشتراک‌گذاری با یه مشاور",
  },
};

export const ALLOCATION_SAVED_COPY = "این ترکیب ذخیره شد. هر وقت خواستی می‌تونی بهش برگردی.";

export const ALLOCATION_SHARE_COMING_SOON_COPY = "اشتراک‌گذاری با مشاور به‌زودی اضافه می‌شه.";
