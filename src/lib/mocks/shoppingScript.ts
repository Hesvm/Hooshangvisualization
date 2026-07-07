/**
 * Scripted copy, timing, and question data for the laptop shopping demo flow.
 * Kept out of the components so the conversation UI just renders state and
 * never hardcodes Persian strings or durations inline.
 */

export const BUDGET_MILLION_TOMAN = 80;

export const INITIAL_USER_MESSAGE = `تا ${budgetFa()} میلیون چه لپ‌تاپی برام خوبه؟`;

function budgetFa() {
  const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(BUDGET_MILLION_TOMAN).replace(/[0-9]/g, (d) => FA[Number(d)]);
}

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

  loanChipFeedback: 200,
  loanChipToMessage: 350,
  loanIntroThinking: 1500,
  loanQ2Thinking: 1500,
  loanResultThinking: 1600,

  hesitationAfterResult: 500,
  dealThinking: 1600,

  handoffThinking: 1500,
  postPurchaseAfterHandoff: 500,
} as const;

/* Short, single-line status phrases for the shimmering thinking line — each cycles
   smoothly within its beat. Kept concise so they never clip or wrap (the module
   reserves one stable line); still contextual per beat rather than generic. */
export const THINKING_TEXT = {
  initial: ["دارم نیازت رو بررسی می‌کنم", "دارم جمع‌بندی می‌کنم"],
  search: ["دارم گزینه‌ها رو پیدا می‌کنم", "دارم مقایسه‌شون می‌کنم"],
  recommendation: ["دارم بهترین گزینه رو پیدا می‌کنم"],
  loanIntro: ["دارم شرایط پرداخت رو می‌بینم"],
  loanQ2: ["دارم اقساط رو حساب می‌کنم"],
  loanResult: ["دارم قسط رو تخمین می‌زنم"],
  deal: ["دارم دنبال تخفیف می‌گردم", "دارم پیشنهاد بهتر پیدا می‌کنم"],
  handoff: ["دارم خریدت رو آماده می‌کنم"],
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

export const LOAN_INTRO_PREFIX = "قیمت این مدل حدود";
export const LOAN_INTRO_SUFFIX =
  "میلیون تومنه. می‌تونم برات بررسی کنم با چه پیش‌پرداخت و قسطی می‌تونی بخریش.";

export const DOWN_PAYMENT_OPTIONS = [
  { id: "min", label: "کمترین پیش‌پرداخت" },
  { id: "10", label: "۱۰ میلیون تومان", value: 10 },
  { id: "20", label: "۲۰ میلیون تومان", value: 20 },
  { id: "custom", label: "خودم وارد می‌کنم" },
] as const;

export const MONTHS_OPTIONS = [
  { id: "6", label: "۶ ماهه", value: 6 },
  { id: "9", label: "۹ ماهه", value: 9 },
  { id: "12", label: "۱۲ ماهه", value: 12 },
] as const;

export const LOAN_DOWN_PAYMENT_QUESTION = "حدوداً چقدر می‌خوای اول پرداخت کنی؟";
export const LOAN_MONTHS_QUESTION = "دوست داری بازپرداختت چند ماهه باشه؟";
export const LOAN_DISCLAIMER =
  "این فقط یک برآورد اولیه‌ست و شرایط نهایی بعد از بررسی اعتبار مشخص می‌شه.";
export const LOAN_PRIMARY_CTA = "بررسی شرایط دریافت اعتبار";
export const LOAN_SECONDARY_CTA = "سناریوی دیگه‌ای حساب کن";

export const HESITATION_QUESTION = "با این شرایط، خرید برات منطقیه یا هنوز برات گرونه؟";
export const HESITATION_OPTIONS = [
  { id: "good", label: "شرایطش خوبه" },
  { id: "expensive", label: "هنوز یکم گرونه" },
  { id: "thinking", label: "بذار فکر کنم" },
] as const;
export const HESITATION_THINKING_REPLY = "باشه، عجله‌ای نیست. هر وقت آماده بودی دوباره باهام صحبت کن.";

export const DEAL_ACTIVATED_TITLE = "برای همین انتخاب، ۲٪ تخفیف اختصاصی دیجی‌کالا برات فعال شده.";
export const DEAL_ACTIVATED_SUBTITLE = "این پیشنهاد تا ۱۰ دقیقه قابل استفاده‌ست.";
export const DEAL_CTA = "خرید با تخفیف اختصاصی";
export const DEAL_EXPIRED_TEXT = "این پیشنهاد به پایان رسیده";

export const HANDOFF_TEXT =
  "انتخابت، فروشنده و شرایط پرداخت آماده‌ست. برای نهایی کردن خرید وارد دیجی‌کالا می‌شی.";
export const HANDOFF_CTA = "ادامه خرید در دیجی‌کالا";
export const POST_PURCHASE_TEXT =
  "خریدت ثبت شد. از اینجا به بعد وضعیت سفارش رو برات پیگیری می‌کنم.";
