import type { ShoppingProduct } from "@/types/shopping";

/**
 * Prices are in million-toman units (e.g. 49 → "۴۹ میلیون تومان") to match the
 * loan-flow copy. Product photos live in public/images/shopping/laptops and are
 * kept here with the rest of the mocked recommendation payload.
 *
 * "bal-macbook-air-m3" is the personalized pick (matchScore/matchBreakdown/
 * recommendationReasons are only surfaced once the assistant reveals it —
 * the shortlist cards never show this data).
 */
export const laptopShortlist: ShoppingProduct[] = [
  {
    id: "eco-vivobook-16",
    name: "لپ‌تاپ ایسوس Vivobook 16",
    configuration: "Core i5-1235U · رم ۱۶ گیگابایت · SSD ۵۱۲ گیگابایت",
    imageSrc: "/images/shopping/laptops/asus-vivobook-16.webp",
    imageAlt: "لپ‌تاپ ایسوس Vivobook 16",
    price: 29,
    role: "economical",
    rating: 4.2,
    reviewCount: 86,
    shortReviewSummary: "بیشتر خریدارها از قیمت و نمایشگر بزرگش راضی بودن.",

    suitableFor:
      "برای کسی مناسبه که کار روزمره، کلاس آنلاین و برنامه‌نویسی سبک انجام می‌ده و صفحه بزرگ می‌خواد.",
    personalizedFitText:
      "برای بودجه محدود گزینه قابل‌قبولیه، اما بدنه بزرگ‌تر و شارژدهی متوسطش برای جابه‌جایی روزانه ایدئال نیست.",
    strengths: ["قیمت پایین‌تر", "رم و حافظه کافی", "نمایشگر ۱۶ اینچی برای کار طولانی"],
    limitations: ["حمل‌پذیری کمتر از مک‌بوک‌ها", "شارژدهی متوسط", "برای کار گرافیکی سنگین مناسب نیست"],
    buyerReviewSummary:
      "بیشتر خریدارها از ارزش خرید و اندازه نمایشگر راضی بودن. انتقادهای پرتکرارتر درباره شارژدهی و کیفیت متوسط بدنه بوده.",

    matchScore: 68,
    matchBreakdown: [
      { label: "بودجه", verdict: "پایین‌ترین قیمت بین سه گزینه" },
      { label: "قدرت موردنیاز", verdict: "برای کار روزمره و برنامه‌نویسی سبک کافیه" },
      { label: "حمل‌پذیری", verdict: "به‌خاطر نمایشگر ۱۶ اینچی از دو گزینه دیگه حجیم‌تره" },
      { label: "دوام انتخاب", verdict: "۱۶ گیگابایت رم و SSD ۵۱۲ گیگابایت کمک می‌کنه دیرتر کم بیاره" },
      { label: "محدودیت‌ها", verdict: "شارژدهی و کیفیت ساختش به مک‌بوک‌ها نمی‌رسه" },
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
    id: "bal-macbook-air-m3",
    name: "مک‌بوک ایر ۱۳ اینچ M3",
    configuration: "Apple M3 · نمایشگر Liquid Retina · شارژدهی تا ۱۸ ساعت",
    imageSrc: "/images/shopping/laptops/macbook-air-m3.webp",
    imageAlt: "مک‌بوک ایر ۱۳ اینچ M3",
    price: 49,
    role: "balanced",
    rating: 4.5,
    reviewCount: 243,
    shortReviewSummary: "اکثر خریدارها از وزن کم، باتری و کیفیت ساختش راضی بودن.",

    suitableFor:
      "برای کسی مناسبه که حمل‌پذیری، باتری خوب، کار روزمره و برنامه‌نویسی تمیز و بی‌دردسر می‌خواد.",
    personalizedFitText:
      "با توجه به بودجه و استفاده‌ای که گفتی، سبک‌تر از ویووبوک و اقتصادی‌تر از مدل M4 است و هنوز برای چند سال انتخاب مطمئنیه.",
    strengths: ["وزن کم", "شارژدهی تا ۱۸ ساعت", "کیفیت ساخت و نمایشگر بهتر"],
    limitations: [
      "برای بازی یا رندر سنگین ساخته نشده",
      "پورت‌های محدودتری دارد",
      "در مقایسه با M4 قدرت و حافظه پایه کمتری دارد",
    ],
    buyerReviewSummary:
      "بیشتر خریدارها از باتری، وزن و کیفیت نمایشگر راضی بودن. انتقادهای رایج بیشتر درباره پورت‌های محدود و قیمت لوازم جانبیه.",

    matchScore: 91,
    matchBreakdown: [
      { label: "بودجه", verdict: "داخل محدوده بودجه‌ایه که گفتی" },
      { label: "قدرت موردنیاز", verdict: "برای برنامه‌نویسی، کار روزمره و چندوظیفگی سبک قدرت کافی داره" },
      { label: "حمل‌پذیری", verdict: "سبک و کم‌مصرفه و برای جابه‌جایی روزانه بهتر از مدل ۱۶ اینچی است" },
      { label: "دوام انتخاب", verdict: "چیپ M3 و باتری قوی هنوز انتخاب مطمئنی برای چند ساله" },
      { label: "محدودیت‌ها", verdict: "اگر کار خیلی سنگین یا حافظه پایه بالاتر می‌خوای، M4 مناسب‌تره" },
    ],
    recommendationReasons: [
      "برای برنامه‌نویسی و کار روزمره قدرت کافی داره",
      "باتری و وزنش برای جابه‌جایی روزانه بهتره",
      "کیفیت ساخت و نمایشگرش از گزینه اقتصادی بالاتره",
      "داخل محدوده بودجه‌ایه که گفتی",
      "نسبت به M4 هزینه کمتری می‌خواد",
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
    id: "pow-macbook-air-m4",
    name: "مک‌بوک ایر ۱۳ اینچ M4",
    configuration: "Apple M4 · رم ۱۶ گیگابایت · SSD ۲۵۶ گیگابایت",
    imageSrc: "/images/shopping/laptops/macbook-air-m4.webp",
    imageAlt: "مک‌بوک ایر ۱۳ اینچ M4",
    price: 68,
    role: "powerful",
    rating: 4.6,
    reviewCount: 150,
    shortReviewSummary: "بیشتر خریدارها از سرعت، سکوت و باتری نسل جدید راضی بودن.",

    suitableFor:
      "برای کسی مناسبه که مک‌بوک سبک می‌خواد اما قدرت جدیدتر، رم پایه بیشتر و عمر انتخاب طولانی‌تر براش مهمه.",
    personalizedFitText:
      "بهترین و آینده‌دارترین گزینه بین این سه تاست، اما برای کارهای روزمره‌ای که گفتی قیمتش بیشتر از نیاز واقعیه.",
    strengths: ["چیپ M4 جدیدتر", "رم پایه ۱۶ گیگابایت", "بدنه سبک و شارژدهی قوی"],
    limitations: ["گران‌ترین گزینه", "SSD پایه ۲۵۶ گیگابایت", "برای کار گرافیکی حرفه‌ای همچنان مدل Pro بهتره"],
    buyerReviewSummary:
      "بیشتر خریدارها از سرعت و شارژدهی راضی بودن. انتقادهای رایج‌تر درباره قیمت بالاتر و محدودیت فضای ذخیره‌سازی پایه است.",

    matchScore: 54,
    matchBreakdown: [
      { label: "بودجه", verdict: "بالاتر از بودجه‌ایه که گفتی" },
      { label: "قدرت موردنیاز", verdict: "از نیاز فعلیت قوی‌تره و برای چند سال آینده خیال‌راحت‌تره" },
      { label: "حمل‌پذیری", verdict: "مثل M3 سبک و مناسب جابه‌جایی روزانه است" },
      { label: "دوام انتخاب", verdict: "چیپ M4 و ۱۶ گیگابایت رم پایه انتخاب آینده‌دارتری می‌سازه" },
      { label: "محدودیت‌ها", verdict: "هزینه بالاتر و SSD پایه ۲۵۶ گیگابایتی ممکنه ارزش خریدش رو کم کنه" },
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

export const RECOMMENDED_PRODUCT_ID = "bal-macbook-air-m3";
