/**
 * Scripted copy, timing, and question data for the laptop shopping demo flow.
 * Kept out of the components so the conversation UI just renders state and
 * never hardcodes Persian strings or durations inline.
 */

import { faNum, formatPersianNumber } from "@/lib/faNum";

export const BUDGET_MILLION_TOMAN = 80;

export const INITIAL_USER_MESSAGE = `تا ${faNum(BUDGET_MILLION_TOMAN)} میلیون چه لپ‌تاپی برام خوبه؟`;

/** Every duration below is a fixed pick within the range the product spec calls for. */
export const TIMING = {
  tapFeedback: 180,
  suggestionCollapse: 260,
  chipToMessage: 320,
  settleScroll: 400,

  initialThinking: 1500,
  introAfterThinking: 400,
  q1AfterIntro: 650,

  /* Question-batch continuation gap. NOT a thinking beat — just a brief settle
     so the next question card can cross-fade in. Kept short so the batch feels
     like one uninterrupted form (see handleQuestionAnswer). */
  betweenQuestions: 300,

  searchThinking: 2400,
  searchThinkingTextSwitch: 1600,
  shortlistAfterSearch: 400,

  recommendationThinking: 1600,
  reasoningAfterThinking: 400,

  loanEntryThinking: 900,
  loanIntroAfterThinking: 400,
  preferenceAfterIntro: 500,

  offerSearchThinking: 2600,
  offerSearchTextSwitch: 1500,
  offersAfterIntro: 400,

  offerPrepThinking: 1100,
  validationIntroAfterThinking: 500,

  invoicePrepThinking: 1400,
  invoiceAfterThinking: 500,

  orderPrepThinking: 900,
  orderAfterThinking: 400,

  addressPrepThinking: 900,
  addressAfterThinking: 400,

  deliveryPrepThinking: 900,
  deliveryAfterThinking: 400,

  paymentProcessing: 1400,
} as const;

/* Short, single-line status phrases for the shimmering thinking line — each cycles
   smoothly within its beat. Kept concise so they never clip or wrap (the module
   reserves one stable line); still contextual per beat rather than generic. */
export const THINKING_TEXT = {
  initial: ["دارم نیازت رو بررسی می‌کنم", "دارم جمع‌بندی می‌کنم"],
  search: ["دارم گزینه‌ها رو پیدا می‌کنم", "دارم مقایسه‌شون می‌کنم"],
  recommendation: ["دارم بهترین گزینه رو پیدا می‌کنم"],
  loanEntry: ["دارم شرایط خرید قسطی این مدل رو بررسی می‌کنم..."],
  offerSearch: [
    "دارم پیشنهادهای وام مناسب رو بررسی می‌کنم...",
    "دارم مبلغ قسط و هزینه نهایی رو بین ارائه‌دهنده‌ها مقایسه می‌کنم...",
    "دارم شرایط ضمانت و اعتبارسنجی رو بررسی می‌کنم...",
    "دارم بهترین گزینه‌ها رو برات مرتب می‌کنم...",
  ],
  offerPrep: ["دارم اطلاعات لازم برای اعتبارسنجی رو آماده می‌کنم..."],
  invoicePrep: [
    "دارم فاکتور خرید و شرایط پرداخت رو آماده می‌کنم...",
    "دارم اطلاعات دیجی‌کالا و دیجی‌پی رو با پیشنهاد وام هماهنگ می‌کنم...",
  ],
  orderPrep: ["دارم سبد سفارش رو آماده می‌کنم..."],
  addressPrep: ["دارم آدرس‌های ثبت‌شده‌ات رو می‌آرم..."],
  deliveryPrep: ["دارم زمان‌های ارسال ممکن رو بررسی می‌کنم..."],
  paymentProcessing: ["در حال ثبت پرداخت و نهایی‌کردن سفارش..."],
} as const;

export const ASSISTANT_INTRO =
  "حتماً. برای اینکه گزینه‌ای پیشنهاد بدم که واقعاً به کارت بیاد، چندتا سؤال کوتاه ازت می‌پرسم و بعد بهترین انتخاب‌ها رو نشونت می‌دم.";

export type QuestionOption = { id: string; icon: string; label: string };
export type QuestionDef = {
  question: string;
  options: QuestionOption[];
  allowCustom: boolean;
  customPlaceholder?: string;
};

export const QUESTIONS: QuestionDef[] = [
  {
    question: "بیشتر با چه برنامه‌هایی کار می‌کنی؟",
    options: [
      { id: "office", icon: "office", label: "کار اداری" },
      { id: "video", icon: "video", label: "تدوین ویدئو" },
      { id: "study", icon: "study", label: "دانشگاه و مطالعه" },
      { id: "dev", icon: "dev", label: "طراحی و برنامه‌نویسی" },
      { id: "game", icon: "game", label: "بازی" },
    ],
    allowCustom: true,
    customPlaceholder: "شما بنویسید...",
  },
  {
    question: "بین اینا کدوم برات مهم‌تره؟",
    options: [
      { id: "power", icon: "power", label: "قدرت و سرعت" },
      { id: "portability", icon: "portability", label: "سبک بودن و باتری" },
      { id: "value", icon: "value", label: "ارزش خرید" },
      { id: "longevity", icon: "longevity", label: "استفاده چندساله" },
    ],
    allowCustom: false,
  },
  {
    question: "سیستم‌عامل یا برند خاصی مدنظرته؟",
    options: [
      { id: "mac", icon: "mac", label: "مک رو ترجیح می‌دم" },
      { id: "windows", icon: "windows", label: "ویندوز رو ترجیح می‌دم" },
      { id: "any", icon: "any", label: "فرقی نداره" },
      { id: "no-apple", icon: "no-apple", label: "اپل نمی‌خوام" },
    ],
    allowCustom: false,
  },
];

/** Scripted demo path — picked so the balanced laptop is the clear personalized winner. */
export const SCRIPTED_ANSWER_IDS = ["dev", "longevity", "any"];

export const SHORTLIST_INTRO =
  "با توجه به بودجه، نوع استفاده و اولویت‌هایی که گفتی، سه گزینه منطقی برات پیدا کردم.";

export const RECOMMENDATION_REASONING =
  "بین این سه گزینه، این مدل بیشترین تطابق رو با بودجه، نوع استفاده و اولویت‌هایی که گفتی داره.";

export const DECISION_CHIPS = [
  { id: "loan", label: "چقدرش رو می‌تونم با وام پرداخت کنم؟" },
  { id: "timing", label: "الان بخرم یا صبر کنم؟" },
  { id: "why-not-others", label: "چرا گزینه‌های دیگه نه؟" },
  { id: "best-seller", label: "بهترین فروشنده رو نشون بده" },
  { id: "track-price", label: "قیمتش رو برام دنبال کن" },
] as const;

export const TIMING_RESPONSES: Record<string, string> = {
  timing: "با توجه به قیمت فعلی و رضایت بالای خریدارها، الان زمان مناسبیه — نشونه‌ای از افت قیمت در آینده نزدیک نمی‌بینم.",
  "why-not-others": "دو گزینه دیگه هم بد نبودن؛ یکی برای بودجه محدودتر مناسب‌تره و اون یکی برای کارهای خیلی سنگین. اما با اولویت‌هایی که گفتی، این گزینه بیشترین تطابق رو داشت.",
  "best-seller": "فروشنده انتخاب‌شده برای همین محصول از نظر رضایت مشتری، اصالت کالا و سرعت ارسال بهترین گزینه بین فروشنده‌های موجوده.",
  "track-price": "قیمتش رو برات دنبال می‌کنم و اگه ارزون‌تر شد بهت خبر می‌دم.",
};

export const LOAN_INTRO_TEXT =
  "مبلغ وام و مدت بازپرداختی که می‌خوای رو مشخص کن تا بهترین پیشنهادها رو برات پیدا کنم.";

export const LOAN_OFFER_INTRO =
  "با توجه به مبلغ و مدت بازپرداختی که انتخاب کردی، این گزینه‌ها شرایط مناسب‌تری دارن.";
export const LOAN_OFFER_INTRO_SUPPORT =
  "مبلغ قسط، هزینه نهایی، ضمانت و شرایط دریافت هرکدوم رو مقایسه کردم.";
export const LOAN_OFFER_CONTINUE_CTA = "ادامه اعتبارسنجی";

export const LOAN_VALIDATION_INTRO =
  "اطلاعاتت رو گرفتم. حالا باید چند استعلام و اعتبارسنجی انجام بدیم تا نتیجه نهایی مشخص بشه.";
export const LOAN_VALIDATION_INTRO_SUPPORT =
  "این فرایند مرحله‌به‌مرحله انجام می‌شه و وضعیت هر بخش رو همین‌جا می‌بینی.";

export const LOAN_VALIDATION_SUCCESS = "نتیجه آزمایشی اعتبارسنجی با موفقیت تکمیل شد.";
export const LOAN_VALIDATION_SUCCESS_SUPPORT = "شرایط دریافت این وام برای ادامه فرایند آماده‌ست.";

export const LOAN_INVOICE_INTRO =
  "فاکتور نهایی آماده‌ست. قبل از تایید پرداخت، جزئیاتش رو یک‌بار بررسی کن.";
export const LOAN_INVOICE_CTA = "وارد کردن اطلاعات تحویل";

export const ORDER_SUMMARY_INTRO = "بریم سراغ اطلاعات تحویل. اول یه‌بار سبد سفارش رو با هم چک کنیم.";
export const ORDER_SUMMARY_NEXT_CTA = "مرحله بعد";

export const ADDRESS_SELECTION_INTRO = "حالا آدرس تحویل رو انتخاب کن.";
export const ADDRESS_SELECTION_CTA = "ادامه";

export const DELIVERY_SELECTION_INTRO = "در نهایت، یه زمان مناسب برای ارسال انتخاب کن.";
export const DELIVERY_SELECTION_CTA = "پرداخت و ثبت نهایی";

export const LOAN_PAYMENT_SUCCESS = "پرداخت با موفقیت تایید شد.";
export const LOAN_PAYMENT_SUCCESS_SUPPORT = "سفارش لپ‌تاپت ثبت شد و شرایط اقساط هم برات فعال شد.";

export function buildOrderCode(): string {
  const raw = Math.floor(100000 + Math.random() * 900000);
  return faNum(raw);
}

export function buildLoanRequestMessage(amount: number, months: number): string {
  return `برای این لپ‌تاپ ${formatPersianNumber(amount)} تومان وام با بازپرداخت ${faNum(months)} ماهه می‌خوام.`;
}

export function buildOfferSelectionMessage(providerName: string): string {
  return `پیشنهاد ${providerName} رو انتخاب می‌کنم.`;
}
