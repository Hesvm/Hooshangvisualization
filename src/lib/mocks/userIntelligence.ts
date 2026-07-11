import type {
  AIInsight,
  ConfidenceLevel,
  IntelligenceCategory,
  IntelligenceEdge,
  IntelligenceNode,
  UserProfile,
} from "@/types/intelligence";
import { CATEGORY_LABELS } from "@/config/intelligenceColors";

type LeafSpec = {
  slug: string;
  label: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  summary: string;
  evidence: string[];
  lastUpdated: string;
  strength: number;
  aiRecommendation?: string;
  relatedNodeIds?: string[];
};

type CategorySpec = {
  category: IntelligenceCategory;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  summary: string;
  lastUpdated: string;
  centerStrength: number;
  leaves: LeafSpec[];
};

function buildUser(
  id: string,
  name: string,
  isVip: boolean,
  statusLine: string,
  categories: CategorySpec[],
  insights: AIInsight[]
): UserProfile {
  const nodes: IntelligenceNode[] = [];
  const edges: IntelligenceEdge[] = [];
  const centerId = `${id}-center`;

  categories.forEach((cat) => {
    const categoryId = `${id}-cat-${cat.category}`;
    nodes.push({
      id: categoryId,
      kind: "category",
      category: cat.category,
      label: CATEGORY_LABELS[cat.category],
      confidence: cat.confidence,
      confidenceScore: cat.confidenceScore,
      summary: cat.summary,
      evidence: [],
      lastUpdated: cat.lastUpdated,
    });
    edges.push({
      id: `${id}-edge-${cat.category}`,
      source: centerId,
      target: categoryId,
      strength: cat.centerStrength,
    });

    cat.leaves.forEach((leaf) => {
      const leafId = `${id}-leaf-${cat.category}-${leaf.slug}`;
      nodes.push({
        id: leafId,
        kind: "leaf",
        category: cat.category,
        label: leaf.label,
        confidence: leaf.confidence,
        confidenceScore: leaf.confidenceScore,
        summary: leaf.summary,
        evidence: leaf.evidence,
        lastUpdated: leaf.lastUpdated,
        aiRecommendation: leaf.aiRecommendation,
        relatedNodeIds: leaf.relatedNodeIds,
      });
      edges.push({
        id: `${id}-edge-${cat.category}-${leaf.slug}`,
        source: categoryId,
        target: leafId,
        strength: leaf.strength,
      });
    });
  });

  return { id, name, isVip, statusLine, nodes, edges, insights };
}

const u1: UserProfile = buildUser(
  "u1",
  "سارا احمدی",
  true,
  "۳ گفتگوی فعال",
  [
    {
      category: "kharid",
      confidence: "confirmed",
      confidenceScore: 92,
      summary: "کاربر خریدار فعال با تمرکز بر کالای دیجیتال و خواروبار است.",
      lastUpdated: "۲ روز پیش",
      centerStrength: 0.9,
      leaves: [
        { slug: "supermarket", label: "خرید هفتگی سوپرمارکت", confidence: "confirmed", confidenceScore: 90, summary: "الگوی خرید منظم هفتگی از سوپرمارکت آنلاین.", evidence: ["گفتگوی خرید هفتگی - ۱۲ تیر"], lastUpdated: "۲ روز پیش", strength: 0.8, aiRecommendation: "پیشنهاد فعال‌سازی سبد خرید هوشمند هفتگی." },
        { slug: "digital", label: "علاقه به محصولات دیجیتال", confidence: "inferred", confidenceScore: 68, summary: "بازدید مکرر از صفحات موبایل و لپ‌تاپ بدون خرید نهایی.", evidence: ["مشاهده ۱۴ محصول موبایل در یک هفته"], lastUpdated: "۵ روز پیش", strength: 0.6 },
        { slug: "seasonal", label: "تخفیف‌های فصلی", confidence: "weak", confidenceScore: 40, summary: "واکنش نامشخص به کمپین‌های تخفیف فصلی.", evidence: ["کلیک روی بنر حراج تابستانه"], lastUpdated: "۱۲ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "mali",
      confidence: "confirmed",
      confidenceScore: 88,
      summary: "پرتفوی مالی متنوع شامل طلا و صندوق درآمد ثابت.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.85,
      leaves: [
        { slug: "gold", label: "دارای حساب طلا", confidence: "confirmed", confidenceScore: 95, summary: "موجودی فعال در حساب طلای دیجیتال.", evidence: ["اتصال کیف پول طلا"], lastUpdated: "۱ روز پیش", strength: 0.9, aiRecommendation: "پیشنهاد نمایش نمودار رشد طلا.", relatedNodeIds: ["u1-leaf-risk-moderate-risk", "u1-leaf-ahdaf-abroad-trip"] },
        { slug: "mortgage", label: "بدهی وام مسکن", confidence: "confirmed", confidenceScore: 85, summary: "اقساط ماهانه وام مسکن در حال پرداخت است.", evidence: ["گفتگوی محاسبه اقساط وام"], lastUpdated: "۱ هفته پیش", strength: 0.7 },
        { slug: "fixed-income", label: "سرمایه‌گذاری در صندوق درآمد ثابت", confidence: "inferred", confidenceScore: 60, summary: "الگوی رفتاری نشان‌دهنده تمایل به ریسک پایین است.", evidence: ["پرسش درباره صندوق‌های کم‌ریسک"], lastUpdated: "۳ هفته پیش", strength: 0.5 },
      ],
    },
    {
      category: "salamat",
      confidence: "inferred",
      confidenceScore: 55,
      summary: "نشانه‌هایی از افت کیفیت خواب مشاهده شده است.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "steps", label: "پیگیری منظم قدم‌شمار", confidence: "confirmed", confidenceScore: 80, summary: "ثبت روزانه تعداد قدم از طریق ساعت هوشمند.", evidence: ["همگام‌سازی داده ساعت هوشمند"], lastUpdated: "۱ روز پیش", strength: 0.7 },
        { slug: "sleep", label: "کاهش کیفیت خواب اخیر", confidence: "weak", confidenceScore: 35, summary: "افت میانگین ساعت خواب در دو هفته اخیر.", evidence: ["گزارش خواب ساعت هوشمند"], lastUpdated: "۴ روز پیش", strength: 0.4, aiRecommendation: "پیشنهاد یادآور خواب منظم." },
      ],
    },
    {
      category: "sabkeZendegi",
      confidence: "inferred",
      confidenceScore: 62,
      summary: "علاقه‌مند به سبک زندگی سالم و فعال.",
      lastUpdated: "۴ روز پیش",
      centerStrength: 0.6,
      leaves: [
        { slug: "morning-exercise", label: "علاقه به ورزش صبحگاهی", confidence: "confirmed", confidenceScore: 75, summary: "ثبت فعالیت ورزشی در بازه صبح.", evidence: ["داده فعالیت صبحگاهی"], lastUpdated: "۲ روز پیش", strength: 0.65 },
        { slug: "plant-diet", label: "رژیم غذایی گیاه‌محور", confidence: "weak", confidenceScore: 38, summary: "افزایش خرید محصولات گیاهی در ماه اخیر.", evidence: ["افزایش خرید سبزیجات"], lastUpdated: "۱۰ روز پیش", strength: 0.35 },
      ],
    },
    {
      category: "makanha",
      confidence: "confirmed",
      confidenceScore: 80,
      summary: "ساکن تهران با سفرهای مکرر به شمال کشور.",
      lastUpdated: "۲ روز پیش",
      centerStrength: 0.75,
      leaves: [
        { slug: "tehran-2", label: "سکونت در منطقه ۲ تهران", confidence: "confirmed", confidenceScore: 90, summary: "آدرس ثبت‌شده در منطقه ۲ تهران.", evidence: ["آدرس تحویل سفارش"], lastUpdated: "۱ ماه پیش", strength: 0.85 },
        { slug: "north-trip", label: "سفر مکرر به شمال", confidence: "inferred", confidenceScore: 65, summary: "رزرو اقامتگاه در شمال در سه ماه اخیر.", evidence: ["دو رزرو اقامتگاه در شمال"], lastUpdated: "۲ هفته پیش", strength: 0.55, relatedNodeIds: ["u1-leaf-ravabet-married"] },
        { slug: "cafe", label: "بازدید مکرر از کافه‌های محله", confidence: "weak", confidenceScore: 30, summary: "چک‌این مکرر در کافه‌های نزدیک محل سکونت.", evidence: ["سه چک‌این کافه در هفته"], lastUpdated: "۶ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "amoozesh",
      confidence: "inferred",
      confidenceScore: 58,
      summary: "در حال گسترش مهارت‌های زبانی و فنی.",
      lastUpdated: "۱ هفته پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "english", label: "ثبت‌نام دوره زبان انگلیسی", confidence: "confirmed", confidenceScore: 82, summary: "ثبت‌نام تایید شده در دوره آنلاین زبان.", evidence: ["رسید پرداخت دوره زبان"], lastUpdated: "۵ روز پیش", strength: 0.7 },
        { slug: "coding", label: "علاقه به یادگیری برنامه‌نویسی", confidence: "weak", confidenceScore: 32, summary: "جستجوی چندباره درباره دوره‌های برنامه‌نویسی.", evidence: ["جستجوی دوره پایتون"], lastUpdated: "۹ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "dastgahha",
      confidence: "confirmed",
      confidenceScore: 85,
      summary: "کاربر دستگاه‌های اپل با به‌روزرسانی منظم است.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.8,
      leaves: [
        { slug: "iphone", label: "استفاده از آیفون ۱۵", confidence: "confirmed", confidenceScore: 95, summary: "دستگاه اصلی ثبت‌شده در پروفایل، آیفون ۱۵.", evidence: ["اطلاعات دستگاه ورود"], lastUpdated: "۱ روز پیش", strength: 0.9 },
        { slug: "watch", label: "مالک ساعت هوشمند اپل", confidence: "confirmed", confidenceScore: 88, summary: "همگام‌سازی مداوم داده سلامت از ساعت هوشمند.", evidence: ["اتصال اپل هلث"], lastUpdated: "۳ روز پیش", strength: 0.75 },
      ],
    },
    {
      category: "appHayeMotasel",
      confidence: "confirmed",
      confidenceScore: 90,
      summary: "چند سرویس مالی و خدماتی به حساب متصل است.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.85,
      leaves: [
        { slug: "digikala", label: "اتصال به دیجی‌کالا", confidence: "confirmed", confidenceScore: 95, summary: "حساب دیجی‌کالا به‌طور کامل متصل و فعال است.", evidence: ["اتصال حساب دیجی‌کالا"], lastUpdated: "۱ روز پیش", strength: 0.9 },
        { slug: "snapp", label: "اتصال به اسنپ", confidence: "confirmed", confidenceScore: 85, summary: "استفاده منظم از سرویس اسنپ برای جابجایی.", evidence: ["ورود با اسنپ"], lastUpdated: "۴ روز پیش", strength: 0.7 },
        { slug: "exchange", label: "اتصال به صرافی رمزارز", confidence: "inferred", confidenceScore: 60, summary: "اتصال به یک کیف پول رمزارز خارجی شناسایی شد.", evidence: ["تراکنش ورودی از صرافی"], lastUpdated: "۲ هفته پیش", strength: 0.5 },
      ],
    },
    {
      category: "servisha",
      confidence: "confirmed",
      confidenceScore: 70,
      summary: "مشترک چند سرویس استریم است.",
      lastUpdated: "۵ روز پیش",
      centerStrength: 0.65,
      leaves: [
        { slug: "filimo", label: "اشتراک فیلیمو فعال", confidence: "confirmed", confidenceScore: 80, summary: "اشتراک ماهانه فیلیمو در حال تمدید خودکار.", evidence: ["رسید تمدید اشتراک"], lastUpdated: "۵ روز پیش", strength: 0.65 },
        { slug: "spotify", label: "اشتراک اسپاتیفای", confidence: "confirmed", confidenceScore: 75, summary: "پرداخت منظم اشتراک اسپاتیفای.", evidence: ["پرداخت ماهانه اسپاتیفای"], lastUpdated: "۱ هفته پیش", strength: 0.6 },
      ],
    },
    {
      category: "ravabet",
      confidence: "inferred",
      confidenceScore: 50,
      summary: "نشانه‌هایی از وضعیت خانوادگی در گفتگوها یافت شده.",
      lastUpdated: "۲ هفته پیش",
      centerStrength: 0.5,
      leaves: [
        { slug: "married", label: "متاهل", confidence: "inferred", confidenceScore: 60, summary: "اشاره به همسر در چند گفتگوی خرید.", evidence: ["اشاره به «همسرم» در گفتگو"], lastUpdated: "۲ هفته پیش", strength: 0.5 },
        { slug: "one-child", label: "دارای یک فرزند", confidence: "weak", confidenceScore: 35, summary: "خرید محصولات کودک در دو نوبت اخیر.", evidence: ["خرید پوشک و اسباب‌بازی"], lastUpdated: "۳ هفته پیش", strength: 0.35 },
      ],
    },
    {
      category: "goftogooha",
      confidence: "confirmed",
      confidenceScore: 78,
      summary: "گفتگوهای فعال حول محور سرمایه‌گذاری و مقایسه محصول.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.75,
      leaves: [
        { slug: "investment-q", label: "پرسش مکرر درباره سرمایه‌گذاری", confidence: "confirmed", confidenceScore: 80, summary: "بیش از ده پرسش درباره گزینه‌های سرمایه‌گذاری.", evidence: ["گفتگوهای سرمایه‌گذاری"], lastUpdated: "۱ روز پیش", strength: 0.75, relatedNodeIds: ["u1-leaf-mali-gold", "u1-leaf-risk-moderate-risk"] },
        { slug: "health-talk", label: "علاقه به گفتگو درباره سلامت", confidence: "weak", confidenceScore: 40, summary: "چند گفتگوی کوتاه درباره وضعیت خواب.", evidence: ["گفتگوی کوتاه سلامت"], lastUpdated: "۴ روز پیش", strength: 0.35 },
        { slug: "compare", label: "درخواست مکرر مقایسه محصول", confidence: "inferred", confidenceScore: 62, summary: "درخواست مقایسه قیمت در چند دسته کالا.", evidence: ["درخواست مقایسه گوشی"], lastUpdated: "۳ روز پیش", strength: 0.55 },
      ],
    },
    {
      category: "tarjihat",
      confidence: "confirmed",
      confidenceScore: 72,
      summary: "ترجیحات پرداخت و برند مشخصی دارد.",
      lastUpdated: "۶ روز پیش",
      centerStrength: 0.65,
      leaves: [
        { slug: "installment", label: "ترجیح پرداخت اقساطی", confidence: "confirmed", confidenceScore: 80, summary: "انتخاب مکرر گزینه پرداخت اقساطی در خرید.", evidence: ["انتخاب اقساط در سه خرید"], lastUpdated: "۶ روز پیش", strength: 0.7 },
        { slug: "iranian-brand", label: "ترجیح برند‌های ایرانی", confidence: "weak", confidenceScore: 38, summary: "خرید مکرر از برندهای داخلی در دسته پوشاک.", evidence: ["خرید از برند داخلی"], lastUpdated: "۱۲ روز پیش", strength: 0.35 },
      ],
    },
    {
      category: "risk",
      confidence: "inferred",
      confidenceScore: 55,
      summary: "سطح ریسک‌پذیری متوسط با یک سابقه تاخیر جزئی.",
      lastUpdated: "۱ هفته پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "moderate-risk", label: "ریسک‌پذیری متوسط در سرمایه‌گذاری", confidence: "inferred", confidenceScore: 60, summary: "انتخاب گزینه‌های سرمایه‌گذاری با ریسک متوسط.", evidence: ["انتخاب پرتفوی متعادل"], lastUpdated: "۱ هفته پیش", strength: 0.55 },
        { slug: "late-payment", label: "سابقه تاخیر در پرداخت قسط", confidence: "weak", confidenceScore: 30, summary: "یک مورد تاخیر جزئی در پرداخت قسط وام مسکن.", evidence: ["یادآور تاخیر پرداخت"], lastUpdated: "۱ ماه پیش", strength: 0.3 },
      ],
    },
    {
      category: "ahdaf",
      confidence: "inferred",
      confidenceScore: 58,
      summary: "اهداف مالی و سفر در افق کوتاه‌مدت.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "new-house", label: "هدف خرید خانه جدید", confidence: "inferred", confidenceScore: 65, summary: "جستجوی مکرر آگهی مسکن در منطقه جدید.", evidence: ["جستجوی خانه در دو منطقه"], lastUpdated: "۳ روز پیش", strength: 0.6, aiRecommendation: "پیشنهاد نمایش راهنمای وام مسکن." },
        { slug: "abroad-trip", label: "هدف پس‌انداز برای سفر خارجی", confidence: "weak", confidenceScore: 35, summary: "پرس‌وجو درباره نرخ ارز و بلیط خارجی.", evidence: ["پرسش نرخ ارز"], lastUpdated: "۹ روز پیش", strength: 0.3 },
      ],
    },
  ],
  [
    { id: "u1-insight-1", text: "کاربر احتمالاً ظرف ۳ ماه آینده قصد جابجایی منزل دارد." },
    { id: "u1-insight-2", text: "علاقه به طلا ۴۲٪ در یک ماه اخیر افزایش یافته است.", trendDelta: "+۴۲٪" },
    { id: "u1-insight-3", text: "گفتگوهای مرتبط با سلامت به‌طور محسوسی کاهش یافته است.", trendDelta: "-۲۸٪" },
  ]
);

const u2: UserProfile = buildUser(
  "u2",
  "رضا کریمی",
  false,
  "۱ گفتگوی فعال",
  [
    {
      category: "kharid",
      confidence: "confirmed",
      confidenceScore: 75,
      summary: "خریدهای عمدتاً مرتبط با لوازم ورزشی.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.7,
      leaves: [
        { slug: "sportswear", label: "خرید مکرر پوشاک ورزشی", confidence: "confirmed", confidenceScore: 78, summary: "سه خرید پوشاک ورزشی در ماه اخیر.", evidence: ["سه سفارش پوشاک ورزشی"], lastUpdated: "۳ روز پیش", strength: 0.7 },
        { slug: "supplements", label: "علاقه به مکمل‌های ورزشی", confidence: "weak", confidenceScore: 35, summary: "بازدید از صفحات مکمل بدون خرید.", evidence: ["مشاهده صفحه مکمل"], lastUpdated: "۱ هفته پیش", strength: 0.3 },
      ],
    },
    {
      category: "mali",
      confidence: "inferred",
      confidenceScore: 50,
      summary: "وضعیت مالی محافظه‌کارانه با تمرکز بر پس‌انداز.",
      lastUpdated: "۵ روز پیش",
      centerStrength: 0.5,
      leaves: [
        { slug: "savings", label: "تمایل به پس‌انداز بلندمدت", confidence: "inferred", confidenceScore: 58, summary: "انتقال منظم بخشی از درآمد به حساب پس‌انداز.", evidence: ["تراکنش پس‌انداز ماهانه"], lastUpdated: "۵ روز پیش", strength: 0.5 },
        { slug: "no-debt", label: "بدون بدهی فعال", confidence: "confirmed", confidenceScore: 70, summary: "هیچ وام یا قسط فعالی در پروفایل ثبت نشده.", evidence: ["عدم وجود قسط فعال"], lastUpdated: "۲ هفته پیش", strength: 0.6 },
      ],
    },
    {
      category: "salamat",
      confidence: "confirmed",
      confidenceScore: 82,
      summary: "کاربر با فعالیت ورزشی منظم و پایدار.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.8,
      leaves: [
        { slug: "gym", label: "حضور منظم در باشگاه", confidence: "confirmed", confidenceScore: 85, summary: "چک‌این منظم باشگاه سه بار در هفته.", evidence: ["چک‌این باشگاه"], lastUpdated: "۱ روز پیش", strength: 0.8 },
        { slug: "good-sleep", label: "کیفیت خواب پایدار", confidence: "confirmed", confidenceScore: 75, summary: "میانگین خواب باثبات در ماه اخیر.", evidence: ["گزارش خواب پایدار"], lastUpdated: "۴ روز پیش", strength: 0.65 },
      ],
    },
    {
      category: "dastgahha",
      confidence: "confirmed",
      confidenceScore: 70,
      summary: "استفاده از دستگاه‌های اندروید.",
      lastUpdated: "۲ روز پیش",
      centerStrength: 0.65,
      leaves: [
        { slug: "android", label: "استفاده از گوشی اندروید", confidence: "confirmed", confidenceScore: 80, summary: "دستگاه ثبت‌شده اندروید با به‌روزرسانی منظم.", evidence: ["اطلاعات دستگاه ورود"], lastUpdated: "۲ روز پیش", strength: 0.7 },
        { slug: "smartband", label: "مالک مچ‌بند هوشمند", confidence: "inferred", confidenceScore: 55, summary: "همگام‌سازی داده گام از مچ‌بند هوشمند.", evidence: ["داده مچ‌بند هوشمند"], lastUpdated: "۱ هفته پیش", strength: 0.5 },
      ],
    },
    {
      category: "appHayeMotasel",
      confidence: "confirmed",
      confidenceScore: 68,
      summary: "اتصال به سرویس‌های محدود اما فعال.",
      lastUpdated: "۴ روز پیش",
      centerStrength: 0.6,
      leaves: [
        { slug: "digikala2", label: "اتصال به دیجی‌کالا", confidence: "confirmed", confidenceScore: 75, summary: "حساب دیجی‌کالا فعال با خریدهای منظم.", evidence: ["اتصال حساب دیجی‌کالا"], lastUpdated: "۴ روز پیش", strength: 0.65 },
        { slug: "tapsi", label: "اتصال به تپسی", confidence: "inferred", confidenceScore: 50, summary: "استفاده گاه‌به‌گاه از سرویس تپسی.", evidence: ["دو سفر ثبت‌شده تپسی"], lastUpdated: "۲ هفته پیش", strength: 0.4 },
      ],
    },
    {
      category: "goftogooha",
      confidence: "inferred",
      confidenceScore: 55,
      summary: "گفتگوهای پراکنده درباره ورزش و تجهیزات.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.5,
      leaves: [
        { slug: "gear-q", label: "پرسش درباره تجهیزات ورزشی", confidence: "inferred", confidenceScore: 58, summary: "چند پرسش درباره کفش دویدن.", evidence: ["گفتگوی کفش دویدن"], lastUpdated: "۳ روز پیش", strength: 0.5 },
        { slug: "diet-q", label: "پرسش درباره برنامه غذایی", confidence: "weak", confidenceScore: 32, summary: "یک گفتگوی کوتاه درباره رژیم پروتئین.", evidence: ["گفتگوی رژیم پروتئین"], lastUpdated: "۱۰ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "risk",
      confidence: "inferred",
      confidenceScore: 45,
      summary: "ریسک‌پذیری پایین در تصمیمات مالی.",
      lastUpdated: "۱ هفته پیش",
      centerStrength: 0.45,
      leaves: [
        { slug: "low-risk", label: "ترجیح گزینه‌های کم‌ریسک", confidence: "inferred", confidenceScore: 55, summary: "عدم تمایل به سرمایه‌گذاری در دارایی‌های پرنوسان.", evidence: ["رد پیشنهاد رمزارز"], lastUpdated: "۱ هفته پیش", strength: 0.45 },
        { slug: "on-time", label: "سابقه پرداخت به‌موقع", confidence: "confirmed", confidenceScore: 80, summary: "بدون سابقه تاخیر در پرداخت‌ها.", evidence: ["گزارش پرداخت به‌موقع"], lastUpdated: "۳ هفته پیش", strength: 0.65 },
      ],
    },
    {
      category: "ahdaf",
      confidence: "weak",
      confidenceScore: 40,
      summary: "هدف مشخصی هنوز به‌طور واضح شناسایی نشده.",
      lastUpdated: "۲ هفته پیش",
      centerStrength: 0.4,
      leaves: [
        { slug: "marathon", label: "هدف شرکت در مسابقه دو", confidence: "weak", confidenceScore: 42, summary: "جستجوی اطلاعات مسابقات دو در شهر.", evidence: ["جستجوی مسابقه دو"], lastUpdated: "۲ هفته پیش", strength: 0.4 },
        { slug: "fitness-goal", label: "هدف بهبود آمادگی جسمانی", confidence: "inferred", confidenceScore: 55, summary: "افزایش تدریجی شدت تمرینات ثبت‌شده.", evidence: ["افزایش شدت تمرین"], lastUpdated: "۱۰ روز پیش", strength: 0.5 },
      ],
    },
  ],
  [
    { id: "u2-insight-1", text: "الگوی ورزشی کاربر در یک ماه اخیر باثبات بوده است." },
    { id: "u2-insight-2", text: "بازدید از محصولات مکمل ورزشی افزایش یافته است.", trendDelta: "+۱۸٪" },
  ]
);

const u3: UserProfile = buildUser(
  "u3",
  "نیلوفر حسینی",
  false,
  "بدون گفتگوی فعال",
  [
    {
      category: "kharid",
      confidence: "inferred",
      confidenceScore: 52,
      summary: "خریدهای پراکنده در دسته زیبایی و مد.",
      lastUpdated: "۴ روز پیش",
      centerStrength: 0.5,
      leaves: [
        { slug: "beauty", label: "خرید مکرر محصولات زیبایی", confidence: "inferred", confidenceScore: 60, summary: "دو خرید محصولات آرایشی در ماه اخیر.", evidence: ["دو سفارش لوازم آرایشی"], lastUpdated: "۴ روز پیش", strength: 0.5 },
        { slug: "fashion", label: "علاقه به مد فصلی", confidence: "weak", confidenceScore: 34, summary: "بازدید از کالکشن فصلی پوشاک.", evidence: ["مشاهده کالکشن جدید"], lastUpdated: "۹ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "sabkeZendegi",
      confidence: "confirmed",
      confidenceScore: 70,
      summary: "سبک زندگی متمرکز بر هنر و خلاقیت.",
      lastUpdated: "۲ روز پیش",
      centerStrength: 0.65,
      leaves: [
        { slug: "art", label: "علاقه به کلاس‌های هنری", confidence: "confirmed", confidenceScore: 78, summary: "ثبت‌نام در کلاس نقاشی آنلاین.", evidence: ["رسید ثبت‌نام کلاس نقاشی"], lastUpdated: "۲ روز پیش", strength: 0.7 },
        { slug: "reading", label: "علاقه به مطالعه رمان", confidence: "inferred", confidenceScore: 55, summary: "خرید چند جلد رمان در سه ماه اخیر.", evidence: ["خرید کتاب رمان"], lastUpdated: "۲ هفته پیش", strength: 0.5 },
      ],
    },
    {
      category: "makanha",
      confidence: "inferred",
      confidenceScore: 58,
      summary: "ساکن شیراز با سفرهای کوتاه داخلی.",
      lastUpdated: "۵ روز پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "shiraz", label: "سکونت در شیراز", confidence: "confirmed", confidenceScore: 85, summary: "آدرس ثبت‌شده در شیراز.", evidence: ["آدرس تحویل سفارش"], lastUpdated: "۱ ماه پیش", strength: 0.75 },
        { slug: "isfahan-trip", label: "سفر کوتاه به اصفهان", confidence: "weak", confidenceScore: 35, summary: "یک رزرو اقامتگاه در اصفهان.", evidence: ["رزرو اقامتگاه اصفهان"], lastUpdated: "۳ هفته پیش", strength: 0.3 },
      ],
    },
    {
      category: "amoozesh",
      confidence: "confirmed",
      confidenceScore: 75,
      summary: "در حال گذراندن دوره‌های خلاقانه.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.7,
      leaves: [
        { slug: "painting-course", label: "ثبت‌نام دوره نقاشی پیشرفته", confidence: "confirmed", confidenceScore: 80, summary: "پرداخت شهریه دوره نقاشی پیشرفته.", evidence: ["رسید پرداخت دوره"], lastUpdated: "۳ روز پیش", strength: 0.7 },
        { slug: "design-interest", label: "علاقه به یادگیری طراحی گرافیک", confidence: "weak", confidenceScore: 36, summary: "جستجوی چندباره درباره دوره طراحی.", evidence: ["جستجوی دوره گرافیک"], lastUpdated: "۱ هفته پیش", strength: 0.35 },
      ],
    },
    {
      category: "ravabet",
      confidence: "weak",
      confidenceScore: 38,
      summary: "اطلاعات محدود درباره روابط خانوادگی.",
      lastUpdated: "۳ هفته پیش",
      centerStrength: 0.4,
      leaves: [
        { slug: "single", label: "مجرد", confidence: "weak", confidenceScore: 40, summary: "عدم اشاره به همسر یا فرزند در گفتگوها.", evidence: ["فقدان اشاره به خانواده"], lastUpdated: "۳ هفته پیش", strength: 0.4 },
        { slug: "roommate", label: "زندگی مشترک با هم‌خانه", confidence: "weak", confidenceScore: 32, summary: "اشاره به «هم‌خانه‌ام» در یک گفتگو.", evidence: ["اشاره به هم‌خانه"], lastUpdated: "۱ ماه پیش", strength: 0.3 },
      ],
    },
    {
      category: "tarjihat",
      confidence: "inferred",
      confidenceScore: 60,
      summary: "ترجیح محصولات دست‌ساز و هنری.",
      lastUpdated: "۶ روز پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "handmade", label: "ترجیح محصولات دست‌ساز", confidence: "inferred", confidenceScore: 62, summary: "خرید مکرر از فروشندگان صنایع‌دستی.", evidence: ["دو خرید صنایع‌دستی"], lastUpdated: "۶ روز پیش", strength: 0.55 },
        { slug: "eco", label: "ترجیح بسته‌بندی سازگار با محیط‌زیست", confidence: "weak", confidenceScore: 34, summary: "انتخاب گزینه بسته‌بندی سبز در سفارش.", evidence: ["انتخاب بسته‌بندی سبز"], lastUpdated: "۲ هفته پیش", strength: 0.3 },
      ],
    },
  ],
  [
    { id: "u3-insight-1", text: "کاربر به دنبال دوره‌های آموزشی خلاقانه جدید است." },
    { id: "u3-insight-2", text: "علاقه به محصولات صنایع‌دستی رو به افزایش است.", trendDelta: "+۲۲٪" },
  ]
);

export const intelligenceUsers: UserProfile[] = [u1, u2, u3];
