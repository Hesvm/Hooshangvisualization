import type { ThinkingPipeline } from "../types";

/** Brief prep beat before the exchange picker. */
export const FINANCE_INITIAL_PIPELINE: ThinkingPipeline = [
  {
    id: "finance-initial",
    minDuration: 1000,
    maxDuration: 1700,
    messages: ["دارم درخواستت رو بررسی می‌کنم...", "دارم صرافی‌های پشتیبانی‌شده رو آماده می‌کنم..."],
  },
];

/** Main portfolio-analysis investigation after connecting the exchange. Target total: ~8–15s. */
export const FINANCE_CONNECTING_PIPELINE: ThinkingPipeline = [
  {
    id: "finance-connect",
    minDuration: 1250,
    maxDuration: 2100,
    messages: ["در حال اتصال به بیت‌پین...", "دارم به حساب بیت‌پینت وصل می‌شم..."],
  },
  {
    id: "finance-balances",
    minDuration: 1400,
    maxDuration: 2400,
    messages: ["در حال دریافت موجودی و تراکنش‌ها...", "دارم لیست دارایی‌ها و معاملات اخیرت رو می‌خونم..."],
  },
  {
    id: "finance-composition",
    minDuration: 1400,
    maxDuration: 2400,
    messages: ["دارم ترکیب دارایی‌ها رو تحلیل می‌کنم...", "سهم بیت‌کوین از حد پیشنهادی بیشتره..."],
  },
  {
    id: "finance-risk",
    minDuration: 1250,
    maxDuration: 2100,
    messages: ["در حال تحلیل ریسک پرتفوی...", "دارم نوسان پرتفوت رو نسبت به کل بازار می‌سنجم..."],
  },
];

/** Shorter cross-market allocation follow-up. */
export const FINANCE_ALLOCATION_PIPELINE: ThinkingPipeline = [
  {
    id: "finance-allocation-answers",
    minDuration: 1100,
    maxDuration: 1800,
    messages: ["در حال بررسی پاسخ‌ها...", "دارم سطح ریسک‌پذیریت رو با پاسخ‌هات می‌سنجم..."],
  },
  {
    id: "finance-allocation-mix",
    minDuration: 1250,
    maxDuration: 2100,
    messages: ["دارم فرصت‌های متعادل‌سازی رو بررسی می‌کنم...", "در حال پیشنهاد ترکیب دارایی..."],
  },
];
