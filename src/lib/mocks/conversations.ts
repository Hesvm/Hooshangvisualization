import type { Conversation } from "@/types/conversation";
import { laptopShortlist, RECOMMENDED_PRODUCT_ID } from "@/lib/mocks/shoppingProducts";
import { INITIAL_USER_MESSAGE } from "@/lib/mocks/shoppingScript";
import { MONTHLY_GROCERY_HEADER_ACCENT_RGB, MONTHLY_GROCERY_USER_MESSAGE } from "@/lib/mocks/monthlyGrocery";
import { CRYPTO_ANALYSIS_CONVERSATION_ID, EXCHANGE_STEP_COPY, FINANCE_HEADER_ACCENT_RGB } from "@/lib/mocks/financeCopy";

/**
 * Reference reproductions of the two Health conversation mocks. Note (flagged to
 * product): the workout mock's original chart was an iPhone-price-vs-dollar line
 * chart — clearly a leftover asset — so `weightChart` is a placeholder
 * weight-loss projection instead. The body diagram is a placeholder card since
 * no illustrated muscle asset exists in the repo yet.
 */

const bloodTest: Conversation = {
  id: "blood-test",
  spaceId: "badan",
  blocks: [
    { id: "file", kind: "file", fileName: "آزمایش-خون-۱۴۰۳-۰۲.pdf" },
    {
      id: "u1",
      kind: "userText",
      text: "آزمایش خونم اومده ولی نمی‌فهمم کدوم عددها مهمن.",
    },
    {
      id: "a1",
      kind: "assistantText",
      paragraphs: [
        "نتایجت طبیعی و نسبت به آزمایش قبلی ثابت هستند، اما سه مورد نیاز به توجه دارند:",
        "قند خونت نسبت به ۶ ماه قبل بالاتر رفته. ویتامین D پایین‌تر آمده.",
        "چربی خون، به‌خصوص تری‌گلیسیرید، کمی بدتر شده. این نتایج اورژانسی نیستند، اما بهتره نادیده گرفته نشن.",
      ],
    },
    {
      id: "cmp",
      kind: "comparisonTable",
      title: "مقایسه با آزمایش قبلی",
      columns: { metric: "شاخص", previous: "قبلی", current: "فعلی", status: "وضعیت" },
      rows: [
        { label: "قند ناشتا", previous: "۹۸", current: "۱۰۶", status: "up" },
        { label: "HbA1c", previous: "۵٫۴ ٪", current: "۵٫۸ ٪", status: "borderline" },
        { label: "ویتامین D", previous: "۲۴", current: "۱۸", status: "down" },
        { label: "تری‌گلیسیرید", previous: "۱۶۲", current: "۱۹۸", status: "up" },
      ],
    },
  ],
};

const workout: Conversation = {
  id: "workout",
  spaceId: "badan",
  blocks: [
    {
      id: "u1",
      kind: "userText",
      text: "میخوام وزنم رو کم کنم و درصد چربی بدنم بیاد پایین. میشه یه برنامه ورزشی بهم بدی؟",
    },
    {
      id: "a1",
      kind: "assistantText",
      paragraphs: [
        "حتما. برات برنامه‌ای می‌چینم که هم به کاهش چربی کمک کنه، هم با زمان و شرایطت قابل انجام باشه.",
        "اول چند سؤال کوتاه دارم تا برنامه عمومی و غیرقابل‌استفاده تحویلت ندم.",
      ],
    },
    {
      id: "q1",
      kind: "questionnaire",
      step: 1,
      total: 10,
      question: "کجا می‌خوای تمرین کنی؟",
      options: [
        { id: "home", icon: "home", label: "خونه" },
        { id: "gym", icon: "gym", label: "باشگاه" },
        { id: "uni", icon: "uni", label: "دانشگاه و مطالعه" },
        { id: "3d", icon: "3d", label: "طراحی سه‌بعدی" },
        { id: "game", icon: "game", label: "بازی" },
      ],
      selectedId: "home",
      customPlaceholder: "شما بنویسید...",
    },
    {
      id: "a2",
      kind: "assistantText",
      paragraphs: [
        "از داده‌های سلامتت می‌بینم میانگین فعالیت روزانه‌ات حدود ۶٬۲۰۰ قدم و معمولاً ۶ ساعت و ۴۵ دقیقه می‌خوابی.",
        "می‌تونم این اطلاعات رو برای شخصی‌سازی برنامه استفاده کنم؟",
      ],
    },
    {
      id: "perm",
      kind: "permission",
      primaryLabel: "آره استفاده کن",
      secondaryLabel: "نه خودم بهت میگم",
    },
    {
      id: "a3",
      kind: "assistantText",
      paragraphs: [
        "بر اساس زمانی که داری و سطح فعلی‌ات، یک برنامه ۴ روزه برات ساختم. تمرکز اصلی روی تمرین قدرتی، افزایش فعالیت روزانه و ریکاوریه.",
        "هرجاش فکر کردی باید عوض شه بهم بگو!",
      ],
    },
    {
      id: "plan",
      kind: "workoutPlan",
      exerciseTitle: "حرکات امروز",
      columns: { move: "حرکت", setsReps: "ست × تکرار", rest: "استراحت" },
      days: [
        {
          id: "d1",
          label: "روز ۱ :: سینه",
          muscle: "سینه",
          exercises: [
            { move: "پرس سینه هالتر", setsReps: "۴ × ۸-۱۰", rest: "۹۰ث" },
            { move: "پرس بالا سینه دمبل", setsReps: "۳ × ۱۰-۱۲", rest: "۷۵ث" },
            { move: "فلای دستگاه", setsReps: "۳ × ۱۲-۱۵", rest: "۶۰ث" },
            { move: "قفسه سیم‌کش", setsReps: "۳ × ۱۲-۱۵", rest: "۶۰ث" },
            { move: "شنا سوئدی", setsReps: "۲ تا ناتوانی", rest: "۴۵ث" },
          ],
        },
        {
          id: "d2",
          label: "روز ۲ :: بازو",
          muscle: "بازو",
          exercises: [
            { move: "جلو بازو هالتر", setsReps: "۴ × ۱۰", rest: "۶۰ث" },
            { move: "پشت بازو دیپ", setsReps: "۳ × ۱۲", rest: "۶۰ث" },
            { move: "جلو بازو دمبل چکشی", setsReps: "۳ × ۱۲", rest: "۴۵ث" },
          ],
        },
        {
          id: "d3",
          label: "روز ۳ :: پایین‌تنه",
          muscle: "پایین‌تنه",
          exercises: [
            { move: "اسکات هالتر", setsReps: "۴ × ۸", rest: "۹۰ث" },
            { move: "ددلیفت رومانیایی", setsReps: "۳ × ۱۰", rest: "۹۰ث" },
            { move: "پرس پا دستگاه", setsReps: "۳ × ۱۲", rest: "۶۰ث" },
          ],
        },
        {
          id: "d4",
          label: "روز ۴ :: شکم و هوازی",
          muscle: "شکم",
          exercises: [
            { move: "پلانک", setsReps: "۳ × ۴۵ث", rest: "۳۰ث" },
            { move: "کرانچ", setsReps: "۳ × ۲۰", rest: "۳۰ث" },
            { move: "دویدن سبک", setsReps: "۲۰ دقیقه", rest: "—" },
          ],
        },
      ],
    },
    {
      id: "a4",
      kind: "assistantText",
      paragraphs: [
        "با این برنامه احتمالاً تو ۲ ماه آینده و با رعایت تغذیه مناسب می‌تونی ۷ کیلو وزنت رو کم کنی.",
      ],
    },
    {
      id: "chart",
      kind: "weightChart",
      title: "پیش‌بینی روند وزن",
      unit: "کیلوگرم",
      points: [
        { week: "هفته ۰", weight: 84 },
        { week: "هفته ۱", weight: 83.2 },
        { week: "هفته ۲", weight: 82.1 },
        { week: "هفته ۳", weight: 81.3 },
        { week: "هفته ۴", weight: 80.2 },
        { week: "هفته ۵", weight: 79.4 },
        { week: "هفته ۶", weight: 78.5 },
        { week: "هفته ۷", weight: 77.7 },
        { week: "هفته ۸", weight: 77 },
      ],
      note: "نمودار پیش‌بینی موقت است؛ تا وقتی داده و طراحی واقعی این بخش آماده بشه جای‌گذاری شده.",
    },
  ],
};

const laptopShopping: Conversation = {
  id: "laptop-shopping",
  spaceId: "kharid",
  blocks: [
    { id: "u1", kind: "userText", text: INITIAL_USER_MESSAGE },
    {
      id: "shopping",
      kind: "shoppingRecommendation",
      products: laptopShortlist,
      recommendedProductId: RECOMMENDED_PRODUCT_ID,
    },
  ],
};

const monthlyGroceryShopping: Conversation = {
  id: "monthly-grocery-shopping",
  spaceId: "kharid-supermarketi",
  headerAccentRgb: MONTHLY_GROCERY_HEADER_ACCENT_RGB,
  blocks: [
    { id: "u1", kind: "userText", text: MONTHLY_GROCERY_USER_MESSAGE },
    { id: "monthly-grocery", kind: "monthlyGroceryShopping" },
  ],
};

const cryptoPortfolioAnalysis: Conversation = {
  id: CRYPTO_ANALYSIS_CONVERSATION_ID,
  spaceId: "modiriat-mali",
  headerAccentRgb: FINANCE_HEADER_ACCENT_RGB,
  blocks: [
    { id: "u1", kind: "userText", text: EXCHANGE_STEP_COPY.userMessage },
    { id: "crypto-analysis", kind: "financeCryptoAnalysis" },
  ],
};

export const conversations: Record<string, Conversation> = {
  "blood-test": bloodTest,
  workout,
  "laptop-shopping": laptopShopping,
  "monthly-grocery-shopping": monthlyGroceryShopping,
  [CRYPTO_ANALYSIS_CONVERSATION_ID]: cryptoPortfolioAnalysis,
};
