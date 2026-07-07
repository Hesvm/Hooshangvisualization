import type { ShoppingProduct } from "@/types/shopping";

/**
 * Prices are in million-toman units (e.g. 49 → "۴۹ میلیون تومان") to match the
 * loan-flow copy. No real product photos exist yet, so imageGlyph is a
 * placeholder emoji shown on a gradient card instead of a photo.
 *
 * "bal-vivobook" is the personalized pick (matchScore/matchBreakdown/
 * recommendationReasons are only surfaced once the assistant reveals it —
 * the shortlist cards never show this data).
 */
export const laptopShortlist: ShoppingProduct[] = [
  {
    id: "eco-ideapad",
    name: "لپ‌تاپ لنوو IdeaPad 3",
    configuration: "Core i3 · ۸ گیگابایت رم · ۲۵۶ گیگابایت SSD",
    imageGlyph: "💻",
    price: 29,
    role: "economical",
    rating: 4.2,
    reviewCount: 86,
    shortReviewSummary: "بیشتر خریدارها از قیمت و وزنش راضی بودن.",

    suitableFor:
      "برای کسی مناسبه که کار روزمره و برنامه‌نویسی سبک انجام می‌ده و قیمت براش از قدرت پردازشی بالا مهم‌تره.",
    personalizedFitText:
      "برای نیازهای فعلیت گزینه قابل‌قبولیه، اما ۸ گیگابایت رم ممکنه در استفاده چندساله محدودت کنه.",
    strengths: ["قیمت پایین‌تر", "وزن کم", "شارژدهی مناسب"],
    limitations: ["رم کمتر", "حافظه محدود", "عملکرد ضعیف‌تر در چندوظیفگی سنگین"],
    buyerReviewSummary:
      "بیشتر خریدارها از وزن و شارژدهی راضی بودن. پرتکرارترین انتقادها مربوط به حافظه محدود و تعداد کم پورت‌ها بوده.",

    matchScore: 68,
    matchBreakdown: [
      { label: "بودجه", verdict: "پایین‌ترین قیمت بین سه گزینه" },
      { label: "قدرت موردنیاز", verdict: "برای کار روزمره و برنامه‌نویسی سبک کافیه" },
      { label: "حمل‌پذیری", verdict: "سبک‌ترین گزینه برای جابه‌جایی روزانه" },
      { label: "دوام انتخاب", verdict: "۸ گیگابایت رم ممکنه در چند سال آینده محدودت کنه" },
      { label: "محدودیت‌ها", verdict: "رم و فضای ذخیره‌سازی کمتر از دو گزینه دیگه" },
    ],
    recommendationReasons: [],

    seller: "دیجی‌کالا",
    sellerSatisfaction: 91,
    fulfilledByDigikala: true,
    authenticityGuarantee: true,
    returnWindowDays: 7,
    deliveryEstimate: "تحویل ۲ روزه",
    productUrl: null,
  },
  {
    id: "bal-vivobook",
    name: "لپ‌تاپ ایسوس Vivobook 16",
    configuration: "Core i5 · ۱۶ گیگابایت رم · ۵۱۲ گیگابایت SSD",
    imageGlyph: "💻",
    price: 49,
    role: "balanced",
    rating: 4.5,
    reviewCount: 243,
    shortReviewSummary: "اکثر خریدارها از تعادل قیمت و کارایی‌اش راضی بودن.",

    suitableFor:
      "برای کسی مناسبه که هم برنامه‌نویسی و کار روزمره داره، هم گاهی چندتا برنامه سنگین رو همزمان باز نگه می‌داره.",
    personalizedFitText:
      "با توجه به بودجه و نوع استفاده‌ای که گفتی، رم و باتری‌ش دقیقاً همون چیزیه که برای چند سال آینده لازم داری.",
    strengths: ["رم و فضای ذخیره‌سازی کافی", "تعادل خوب قیمت و کارایی", "شارژدهی بهتر از دو گزینه دیگه"],
    limitations: [
      "برای رندر و پردازش خیلی سنگین بهترین گزینه نیست",
      "تعداد پورت‌ها محدوده",
      "بعداً امکان ارتقای رم نداره",
    ],
    buyerReviewSummary:
      "بیشتر خریدارها از تعادل کارایی و قیمتش راضی بودن. کم‌تعداد انتقادها هم درباره تعداد پورت‌ها بوده.",

    matchScore: 91,
    matchBreakdown: [
      { label: "بودجه", verdict: "داخل محدوده بودجه‌ایه که گفتی" },
      { label: "قدرت موردنیاز", verdict: "برای برنامه‌نویسی و کار روزمره قدرت کافی داره" },
      { label: "حمل‌پذیری", verdict: "وزنش برای جابه‌جایی روزانه مناسبه" },
      { label: "دوام انتخاب", verdict: "۱۶ گیگابایت رم برای استفاده چندساله انتخاب مطمئن‌تریه" },
      { label: "محدودیت‌ها", verdict: "تعداد پورت‌ها محدوده و امکان ارتقای رم نداره" },
    ],
    recommendationReasons: [
      "برای برنامه‌نویسی و کار روزمره قدرت کافی داره",
      "۱۶ گیگابایت رم برای استفاده چندساله انتخاب مطمئن‌تریه",
      "وزنش برای جابه‌جایی روزانه مناسبه",
      "داخل محدوده بودجه‌ایه که گفتی",
      "شارژدهیش از دو گزینه دیگه بهتره",
    ],

    seller: "فروشنده منتخب دیجی‌کالا",
    sellerSatisfaction: 96,
    fulfilledByDigikala: true,
    authenticityGuarantee: true,
    returnWindowDays: 7,
    deliveryEstimate: "تحویل فردا",
    productUrl: null,
  },
  {
    id: "pow-tuf",
    name: "لپ‌تاپ ایسوس TUF Gaming F15",
    configuration: "Core i7 · ۱۶ گیگابایت رم · RTX 3050 · ۵۱۲ گیگابایت SSD",
    imageGlyph: "💻",
    price: 68,
    role: "powerful",
    rating: 4.6,
    reviewCount: 150,
    shortReviewSummary: "بیشتر خریدارها از قدرت پردازشی‌اش برای کارای سنگین راضی بودن.",

    suitableFor:
      "برای کسی مناسبه که ویرایش ویدیو، رندر سه‌بعدی یا بازی‌های سنگین انجام می‌ده و قدرت پردازشی براش از قیمت و وزن مهم‌تره.",
    personalizedFitText:
      "قدرتش بیشتر از چیزیه که برای کار روزمره لازم داری و هم وزن، هم قیمتش از بودجه‌ای که گفتی بالاتره.",
    strengths: ["قدرت پردازشی بالا", "مناسب کارهای سنگین و گرافیکی", "صفحه‌نمایش با نرخ تازه‌سازی بالا"],
    limitations: ["وزن بیشتر برای جابه‌جایی روزانه", "شارژدهی کمتر از دو گزینه دیگه", "قیمت بالاتر از بودجه‌ای که گفتی"],
    buyerReviewSummary:
      "بیشتر خریدارها از قدرت پردازشی راضی بودن. پرتکرارترین انتقادها درباره وزن و گرمای دستگاه بوده.",

    matchScore: 54,
    matchBreakdown: [
      { label: "بودجه", verdict: "بالاتر از بودجه‌ایه که گفتی" },
      { label: "قدرت موردنیاز", verdict: "بیشتر از چیزیه که برای کار روزمره لازم داری" },
      { label: "حمل‌پذیری", verdict: "سنگین‌ترین گزینه برای جابه‌جایی روزانه" },
      { label: "دوام انتخاب", verdict: "از نظر قدرت پردازشی برای سال‌های آینده مطمئنه" },
      { label: "محدودیت‌ها", verdict: "وزن و شارژدهی نسبت به دو گزینه دیگه ضعیف‌تره" },
    ],
    recommendationReasons: [],

    seller: "دیجی‌کالا",
    sellerSatisfaction: 93,
    fulfilledByDigikala: true,
    authenticityGuarantee: true,
    returnWindowDays: 7,
    deliveryEstimate: "تحویل ۳ روزه",
    productUrl: null,
  },
];

export const RECOMMENDED_PRODUCT_ID = "bal-vivobook";
