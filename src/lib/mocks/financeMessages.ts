/**
 * Mock "پیام امروز" / "پیام‌های هوشنگ" cards. The Dashboard tab shows the first
 * two (matching the reference screenshot); the Messages tab shows the full
 * list grouped by category.
 */

import type { FinanceMessage } from "@/types/finance";

export const FINANCE_MESSAGES: FinanceMessage[] = [
  {
    id: "btc-support",
    category: "warning",
    title: "بیت‌کوین روی سطح حمایت محکمه",
    body: "بیت‌کوینی که داری از سطح حمایت برگشت. پیشنهاد میشه فعلاً نگهش داری و منتظر سیگنال قوی‌تر برای خرید باشی.",
    ctaLabel: "بیشتر",
  },
  {
    id: "cash-buffer",
    category: "suggestion",
    title: "نقدینگی سبد",
    body: "نقدینگی بالای سبدت امنیته، ولی تورم رو فراموش نکن.",
    ctaLabel: "بیشتر",
  },
  {
    id: "gold-news",
    category: "news",
    title: "نوسان بازار طلا و دلار",
    body: "امروز خبرهای مهمی درباره طلا و دلار داریم که مستقیم به پرتفوی مرتبطه.",
    ctaLabel: "بیشتر",
  },
  {
    id: "diversification-analysis",
    category: "analysis",
    title: "تمرکز روی دو دارایی",
    body: "بیشتر ارزش پرتفوت روی دو دارایی متمرکزه. تنوع بیشتر می‌تونه ریسکت رو پایین بیاره.",
    ctaLabel: "بیشتر",
  },
];
