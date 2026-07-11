import type { ThinkingPipeline } from "../types";

/** Brief prep beat before the intro/questions. */
export const LAPTOP_INITIAL_PIPELINE: ThinkingPipeline = [
  {
    id: "laptop-initial",
    minDuration: 1100,
    maxDuration: 1800,
    messages: ["دارم نیازت رو بررسی می‌کنم...", "دارم جمع‌بندی می‌کنم چه سؤال‌هایی لازمه بپرسم..."],
  },
];

/** Main comparison after the questionnaire. Target total: ~8–14s. */
export const LAPTOP_SEARCH_PIPELINE: ThinkingPipeline = [
  {
    id: "laptop-shortlist",
    minDuration: 1550,
    maxDuration: 2400,
    messages: ["دارم مشخصات چندتا مدل رو کنار هم می‌ذارم...", "دارم گزینه‌هایی که تو بودجه‌تن رو جدا می‌کنم..."],
  },
  {
    id: "laptop-prices",
    minDuration: 1400,
    maxDuration: 2250,
    messages: ["دارم اختلاف قیمت فروشنده‌ها رو بررسی می‌کنم...", "دارم موجودی و زمان ارسال هرکدوم رو چک می‌کنم..."],
  },
  {
    id: "laptop-reviews",
    minDuration: 1400,
    maxDuration: 2400,
    messages: [
      "دارم نظرات خریدارهایی که بیشتر از ۶ ماه استفاده کردن رو جدا می‌کنم...",
      "به نظر میاد رضایت خریدارها از این مدل‌ها بالاست...",
    ],
  },
  {
    id: "laptop-value",
    minDuration: 1250,
    maxDuration: 1950,
    messages: ["دارم ارزش خرید هر گزینه رو با توجه به بودجه‌ت محاسبه می‌کنم...", "دارم گزینه‌ها رو مرتب می‌کنم..."],
  },
];

/** Picking the single best recommendation from the shortlist. */
export const LAPTOP_RECOMMENDATION_PIPELINE: ThinkingPipeline = [
  {
    id: "laptop-recommendation",
    minDuration: 1400,
    maxDuration: 2250,
    messages: ["دارم بهترین گزینه رو با توجه به اولویت‌هات پیدا می‌کنم...", "دارم می‌بینم کدوم گزینه بیشترین تطابق رو داره..."],
  },
];

export const LAPTOP_LOAN_ENTRY_PIPELINE: ThinkingPipeline = [
  {
    id: "laptop-loan-entry",
    minDuration: 1000,
    maxDuration: 1550,
    messages: ["دارم شرایط خرید قسطی این مدل رو بررسی می‌کنم..."],
  },
];

/** Comparing loan offers across providers. */
export const LAPTOP_OFFER_SEARCH_PIPELINE: ThinkingPipeline = [
  {
    id: "laptop-offer-providers",
    minDuration: 1400,
    maxDuration: 2100,
    messages: ["دارم پیشنهادهای وام مناسب رو بررسی می‌کنم...", "دارم بانک‌ها و اعتباردهنده‌های موجود رو رتبه‌بندی می‌کنم..."],
  },
  {
    id: "laptop-offer-cost",
    minDuration: 1400,
    maxDuration: 2100,
    messages: ["دارم مبلغ قسط و هزینه نهایی رو بین ارائه‌دهنده‌ها مقایسه می‌کنم..."],
  },
  {
    id: "laptop-offer-terms",
    minDuration: 1250,
    maxDuration: 1950,
    messages: ["دارم شرایط ضمانت و اعتبارسنجی رو بررسی می‌کنم..."],
  },
  {
    id: "laptop-offer-rank",
    minDuration: 1100,
    maxDuration: 1800,
    messages: ["دارم بهترین گزینه‌ها رو برات مرتب می‌کنم..."],
  },
];

export const LAPTOP_OFFER_PREP_PIPELINE: ThinkingPipeline = [
  {
    id: "laptop-offer-prep",
    minDuration: 1000,
    maxDuration: 1550,
    messages: ["دارم اطلاعات لازم برای اعتبارسنجی رو آماده می‌کنم..."],
  },
];

export const LAPTOP_INVOICE_PREP_PIPELINE: ThinkingPipeline = [
  {
    id: "laptop-invoice-prep",
    minDuration: 1000,
    maxDuration: 1550,
    messages: ["دارم فاکتور خرید و شرایط پرداخت رو آماده می‌کنم..."],
  },
  {
    id: "laptop-invoice-sync",
    minDuration: 850,
    maxDuration: 1400,
    messages: ["دارم اطلاعات دیجی‌کالا و دیجی‌پی رو با پیشنهاد وام هماهنگ می‌کنم..."],
  },
];

export const LAPTOP_ORDER_PREP_PIPELINE: ThinkingPipeline = [
  { id: "laptop-order-prep", minDuration: 700, maxDuration: 1250, messages: ["دارم سبد سفارش رو آماده می‌کنم..."] },
];

export const LAPTOP_ADDRESS_PREP_PIPELINE: ThinkingPipeline = [
  { id: "laptop-address-prep", minDuration: 700, maxDuration: 1250, messages: ["دارم آدرس‌های ثبت‌شده‌ات رو می‌آرم..."] },
];

export const LAPTOP_DELIVERY_PREP_PIPELINE: ThinkingPipeline = [
  {
    id: "laptop-delivery-prep",
    minDuration: 700,
    maxDuration: 1250,
    messages: ["دارم زمان‌های ارسال ممکن رو بررسی می‌کنم..."],
  },
];

export const LAPTOP_PAYMENT_PROCESSING_PIPELINE: ThinkingPipeline = [
  {
    id: "laptop-payment-processing",
    minDuration: 850,
    maxDuration: 1400,
    messages: ["در حال ثبت پرداخت و نهایی‌کردن سفارش..."],
  },
];
