import type {
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
  imageUrl?: string;
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
  avatarUrl: string,
  statusLine: string,
  categories: CategorySpec[]
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
        imageUrl: leaf.imageUrl,
      });
      edges.push({
        id: `${id}-edge-${cat.category}-${leaf.slug}`,
        source: categoryId,
        target: leafId,
        strength: leaf.strength,
      });
    });
  });

  return { id, name, avatarUrl, statusLine, nodes, edges };
}

const u1: UserProfile = buildUser(
  "u1",
  "سارا احمدی",
  "/images/admin/avatars/user-1.png",
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
        { slug: "supermarket", label: "خرید هفتگی سوپرمارکت", confidence: "confirmed", confidenceScore: 90, summary: "الگوی خرید منظم هفتگی از سوپرمارکت آنلاین، معمولاً یکشنبه شب.", evidence: ["گفتگوی خرید هفتگی - ۱۲ تیر", "۹ سفارش متوالی در ۹ هفته اخیر", "میانگین سبد خرید ۴۲۰ هزار تومان"], lastUpdated: "۲ روز پیش", strength: 0.8, aiRecommendation: "پیشنهاد فعال‌سازی سبد خرید هوشمند هفتگی و یادآور قبل از اتمام موجودی معمول." },
        { slug: "digital", label: "علاقه به محصولات دیجیتال", confidence: "inferred", confidenceScore: 68, summary: "بازدید مکرر از صفحات موبایل و لپ‌تاپ بدون خرید نهایی.", evidence: ["مشاهده ۱۴ محصول موبایل در یک هفته", "مقایسه سه مدل لپ‌تاپ اپل"], lastUpdated: "۵ روز پیش", strength: 0.6, aiRecommendation: "پیشنهاد اطلاع‌رسانی افت قیمت روی محصولات بازدیدشده." , relatedNodeIds: ["u1-leaf-dastgahha-iphone", "u1-leaf-amoozesh-coding"] },
        { slug: "seasonal", label: "تخفیف‌های فصلی", confidence: "weak", confidenceScore: 40, summary: "واکنش نامشخص به کمپین‌های تخفیف فصلی.", evidence: ["کلیک روی بنر حراج تابستانه"], lastUpdated: "۱۲ روز پیش", strength: 0.3 },
        { slug: "grocery-brand", label: "وفاداری به برند خواروبار خاص", confidence: "inferred", confidenceScore: 64, summary: "انتخاب مکرر یک برند لبنیات مشخص در سفارش‌های اخیر.", evidence: ["۶ سفارش متوالی با همان برند لبنیات"], lastUpdated: "۱ هفته پیش", strength: 0.55 },
        { slug: "electronics-accessories", label: "خرید لوازم جانبی الکترونیک", confidence: "inferred", confidenceScore: 58, summary: "خرید مکرر قاب و شارژر همراه با گوشی.", evidence: ["سه سفارش لوازم جانبی موبایل"], lastUpdated: "۴ روز پیش", strength: 0.45 , relatedNodeIds: ["u1-leaf-dastgahha-iphone"] },
        { slug: "home-decor", label: "علاقه به دکوراسیون خانه", confidence: "weak", confidenceScore: 36, summary: "بازدید از دسته دکوراسیون در چند نوبت اخیر.", evidence: ["بازدید از صفحه لوازم دکوری"], lastUpdated: "۱ هفته پیش", strength: 0.3 },
        { slug: "book-buyer", label: "خرید مکرر کتاب", confidence: "confirmed", confidenceScore: 70, summary: "خرید کتاب به‌صورت ماهانه در چند ماه اخیر.", evidence: ["چهار سفارش کتاب متوالی"], lastUpdated: "۶ روز پیش", strength: 0.6 , relatedNodeIds: ["u1-leaf-sabkeZendegi-reading-habit"] },
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
        { slug: "mortgage", label: "بدهی وام مسکن", confidence: "confirmed", confidenceScore: 85, summary: "اقساط ماهانه وام مسکن در حال پرداخت است.", evidence: ["گفتگوی محاسبه اقساط وام"], lastUpdated: "۱ هفته پیش", strength: 0.7 , relatedNodeIds: ["u1-leaf-risk-late-payment", "u1-leaf-makanha-tehran-2"] },
        { slug: "fixed-income", label: "سرمایه‌گذاری در صندوق درآمد ثابت", confidence: "inferred", confidenceScore: 60, summary: "الگوی رفتاری نشان‌دهنده تمایل به ریسک پایین است.", evidence: ["پرسش درباره صندوق‌های کم‌ریسک"], lastUpdated: "۳ هفته پیش", strength: 0.5 , relatedNodeIds: ["u1-leaf-risk-moderate-risk", "u1-leaf-ahdaf-retirement-saving"] },
        { slug: "salary-account", label: "حساب دریافت حقوق", confidence: "confirmed", confidenceScore: 88, summary: "واریز منظم حقوق در اول هر ماه شمسی.", evidence: ["واریز منظم ۶ ماه متوالی"], lastUpdated: "۱ ماه پیش", strength: 0.75 , relatedNodeIds: ["u1-leaf-ahdaf-new-house"] },
        { slug: "credit-card", label: "استفاده فعال از کارت اعتباری", confidence: "confirmed", confidenceScore: 78, summary: "استفاده منظم از کارت اعتباری برای خریدهای آنلاین.", evidence: ["پرداخت با کارت اعتباری در ۸ سفارش اخیر"], lastUpdated: "۳ روز پیش", strength: 0.65 , relatedNodeIds: ["u1-leaf-tarjihat-installment"] },
        { slug: "crypto-investment", label: "سرمایه‌گذاری کوچک در رمزارز", confidence: "weak", confidenceScore: 32, summary: "یک تراکنش کوچک به کیف پول رمزارز.", evidence: ["تراکنش خروجی به صرافی"], lastUpdated: "۳ هفته پیش", strength: 0.3 , relatedNodeIds: ["u1-leaf-appHayeMotasel-exchange", "u1-leaf-kalaha-omega-moonswatch"] },
        { slug: "insurance", label: "دارای بیمه عمر", confidence: "inferred", confidenceScore: 55, summary: "پرداخت منظم حق بیمه ماهانه شناسایی شده.", evidence: ["تراکنش تکراری با عنوان بیمه"], lastUpdated: "۱ ماه پیش", strength: 0.45 , relatedNodeIds: ["u1-leaf-ravabet-married"] },
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
        { slug: "sleep", label: "کاهش کیفیت خواب اخیر", confidence: "weak", confidenceScore: 35, summary: "افت میانگین ساعت خواب در دو هفته اخیر.", evidence: ["گزارش خواب ساعت هوشمند"], lastUpdated: "۴ روز پیش", strength: 0.4, aiRecommendation: "پیشنهاد یادآور خواب منظم." , relatedNodeIds: ["u1-leaf-goftogooha-health-talk"] },
        { slug: "medical-checkup", label: "چکاپ سالانه پزشکی", confidence: "confirmed", confidenceScore: 72, summary: "رزرو نوبت چکاپ سالانه در ماه اخیر.", evidence: ["رزرو نوبت چکاپ عمومی"], lastUpdated: "۲ هفته پیش", strength: 0.6 , relatedNodeIds: ["u1-leaf-dastgahha-watch"] },
        { slug: "diet-app", label: "استفاده از اپلیکیشن رژیم غذایی", confidence: "inferred", confidenceScore: 50, summary: "ثبت وعده‌های غذایی در اپلیکیشن سلامت.", evidence: ["همگام‌سازی داده تغذیه"], lastUpdated: "۱ هفته پیش", strength: 0.45 , relatedNodeIds: ["u1-leaf-sabkeZendegi-plant-diet"] },
        { slug: "vision-checkup", label: "معاینه بینایی اخیر", confidence: "weak", confidenceScore: 33, summary: "یک نوبت معاینه چشم در سه ماه اخیر.", evidence: ["رزرو نوبت اپتومتری"], lastUpdated: "۳ ماه پیش", strength: 0.3 , relatedNodeIds: ["u1-leaf-dastgahha-ipad"] },
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
        { slug: "morning-exercise", label: "علاقه به ورزش صبحگاهی", confidence: "confirmed", confidenceScore: 75, summary: "ثبت فعالیت ورزشی در بازه صبح.", evidence: ["داده فعالیت صبحگاهی"], lastUpdated: "۲ روز پیش", strength: 0.65 , relatedNodeIds: ["u1-leaf-salamat-steps", "u1-leaf-makanha-gym-location"] },
        { slug: "plant-diet", label: "رژیم غذایی گیاه‌محور", confidence: "weak", confidenceScore: 38, summary: "افزایش خرید محصولات گیاهی در ماه اخیر.", evidence: ["افزایش خرید سبزیجات"], lastUpdated: "۱۰ روز پیش", strength: 0.35 },
        { slug: "yoga", label: "علاقه به یوگا", confidence: "inferred", confidenceScore: 52, summary: "ثبت‌نام در دو کلاس آنلاین یوگا.", evidence: ["ثبت‌نام کلاس یوگا"], lastUpdated: "۲ هفته پیش", strength: 0.45 , relatedNodeIds: ["u1-leaf-ahdaf-fitness-goal"] },
        { slug: "reading-habit", label: "عادت مطالعه شبانه", confidence: "weak", confidenceScore: 34, summary: "فعالیت اپلیکیشن کتاب‌خوانی در ساعات شب.", evidence: ["استفاده شبانه از اپ کتاب‌خوانی"], lastUpdated: "۵ روز پیش", strength: 0.3 },
        { slug: "coffee-lover", label: "علاقه‌مند به قهوه تخصصی", confidence: "confirmed", confidenceScore: 68, summary: "خرید مکرر دانه قهوه تخصصی.", evidence: ["سه سفارش دانه قهوه"], lastUpdated: "۴ روز پیش", strength: 0.55 , relatedNodeIds: ["u1-leaf-makanha-cafe"] },
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
        { slug: "gym-location", label: "باشگاه ثابت محله", confidence: "confirmed", confidenceScore: 74, summary: "چک‌این منظم در یک باشگاه مشخص نزدیک منزل.", evidence: ["چک‌این باشگاه محله"], lastUpdated: "۲ روز پیش", strength: 0.6 },
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
        { slug: "english", label: "ثبت‌نام دوره زبان انگلیسی", confidence: "confirmed", confidenceScore: 82, summary: "ثبت‌نام تایید شده در دوره آنلاین زبان.", evidence: ["رسید پرداخت دوره زبان"], lastUpdated: "۵ روز پیش", strength: 0.7 , relatedNodeIds: ["u1-leaf-ahdaf-abroad-trip"] },
        { slug: "coding", label: "علاقه به یادگیری برنامه‌نویسی", confidence: "weak", confidenceScore: 32, summary: "جستجوی چندباره درباره دوره‌های برنامه‌نویسی.", evidence: ["جستجوی دوره پایتون"], lastUpdated: "۹ روز پیش", strength: 0.3 },
        { slug: "certificate", label: "دریافت گواهی دوره آنلاین", confidence: "confirmed", confidenceScore: 66, summary: "دریافت گواهی پایان یک دوره آنلاین اخیر.", evidence: ["دانلود گواهی دوره"], lastUpdated: "۳ هفته پیش", strength: 0.55 },
        { slug: "webinar", label: "شرکت در وبینارهای آموزشی", confidence: "inferred", confidenceScore: 48, summary: "ثبت‌نام در دو وبینار رایگان اخیر.", evidence: ["ثبت‌نام وبینار"], lastUpdated: "۱۰ روز پیش", strength: 0.4 },
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
        { slug: "ipad", label: "استفاده گاه‌به‌گاه از آیپد", confidence: "weak", confidenceScore: 34, summary: "ورود پراکنده از یک دستگاه آیپد ثانویه.", evidence: ["دو ورود از آیپد در ماه اخیر"], lastUpdated: "۲ هفته پیش", strength: 0.3 },
        { slug: "smart-speaker", label: "مالک اسپیکر هوشمند", confidence: "inferred", confidenceScore: 50, summary: "اتصال یک اسپیکر هوشمند به حساب خانگی.", evidence: ["ثبت دستگاه اسپیکر هوشمند"], lastUpdated: "۱ ماه پیش", strength: 0.4 , relatedNodeIds: ["u1-leaf-appHayeMotasel-bank-app"] },
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
        { slug: "snapp", label: "اتصال به اسنپ", confidence: "confirmed", confidenceScore: 85, summary: "استفاده منظم از سرویس اسنپ برای جابجایی.", evidence: ["ورود با اسنپ"], lastUpdated: "۴ روز پیش", strength: 0.7 , relatedNodeIds: ["u1-leaf-makanha-tehran-2"] },
        { slug: "exchange", label: "اتصال به صرافی رمزارز", confidence: "inferred", confidenceScore: 60, summary: "اتصال به یک کیف پول رمزارز خارجی شناسایی شد.", evidence: ["تراکنش ورودی از صرافی"], lastUpdated: "۲ هفته پیش", strength: 0.5 },
        { slug: "bank-app", label: "اتصال به اپلیکیشن بانکی", confidence: "confirmed", confidenceScore: 80, summary: "اتصال فعال به اپلیکیشن بانک اصلی.", evidence: ["ورود منظم به اپ بانکی"], lastUpdated: "۲ روز پیش", strength: 0.7 },
        { slug: "food-delivery", label: "اتصال به سرویس تحویل غذا", confidence: "confirmed", confidenceScore: 72, summary: "سفارش منظم غذا از طریق اپلیکیشن متصل.", evidence: ["اتصال حساب تحویل غذا"], lastUpdated: "۳ روز پیش", strength: 0.6 , relatedNodeIds: ["u1-leaf-kharid-supermarket"] },
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
        { slug: "spotify", label: "اشتراک اسپاتیفای", confidence: "confirmed", confidenceScore: 75, summary: "پرداخت منظم اشتراک اسپاتیفای.", evidence: ["پرداخت ماهانه اسپاتیفای"], lastUpdated: "۱ هفته پیش", strength: 0.6 , relatedNodeIds: ["u1-leaf-sabkeZendegi-coffee-lover"] },
        { slug: "cloud-storage", label: "اشتراک فضای ابری", confidence: "confirmed", confidenceScore: 65, summary: "پرداخت منظم برای افزایش فضای ابری.", evidence: ["پرداخت ماهانه فضای ابری"], lastUpdated: "۲ هفته پیش", strength: 0.55 },
        { slug: "music-podcast", label: "شنونده فعال پادکست", confidence: "inferred", confidenceScore: 46, summary: "دنبال کردن چند پادکست به‌صورت هفتگی.", evidence: ["فعالیت اپ پادکست"], lastUpdated: "۵ روز پیش", strength: 0.4 },
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
        { slug: "extended-family", label: "ارتباط نزدیک با خانواده گسترده", confidence: "weak", confidenceScore: 32, summary: "خرید هدیه برای اعضای خانواده در چند مناسبت.", evidence: ["خرید هدیه در دو مناسبت"], lastUpdated: "۱ ماه پیش", strength: 0.3 , relatedNodeIds: ["u1-leaf-tarjihat-iranian-brand"] },
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
        { slug: "compare", label: "درخواست مکرر مقایسه محصول", confidence: "inferred", confidenceScore: 62, summary: "درخواست مقایسه قیمت در چند دسته کالا.", evidence: ["درخواست مقایسه گوشی"], lastUpdated: "۳ روز پیش", strength: 0.55 , relatedNodeIds: ["u1-leaf-kalaha-macbook-air-m4"] },
        { slug: "recipe-chat", label: "درخواست دستور پخت غذا", confidence: "weak", confidenceScore: 34, summary: "چند گفتگو درباره دستور پخت غذا.", evidence: ["گفتگوی دستور پخت"], lastUpdated: "۱ هفته پیش", strength: 0.3 , relatedNodeIds: ["u1-leaf-kharid-supermarket"] },
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
        { slug: "dark-mode", label: "ترجیح حالت تیره در اپلیکیشن", confidence: "confirmed", confidenceScore: 60, summary: "استفاده مداوم از حالت تیره در تنظیمات اپلیکیشن.", evidence: ["تنظیم حالت تیره فعال"], lastUpdated: "۲ هفته پیش", strength: 0.5 , relatedNodeIds: ["u1-leaf-dastgahha-iphone"] },
        { slug: "notification-pref", label: "کاهش دریافت اعلان‌های تبلیغاتی", confidence: "inferred", confidenceScore: 44, summary: "غیرفعال‌سازی بخشی از اعلان‌های تبلیغاتی.", evidence: ["تغییر تنظیمات اعلان"], lastUpdated: "۳ هفته پیش", strength: 0.4 , relatedNodeIds: ["u1-leaf-servisha-music-podcast"] },
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
        { slug: "fraud-alert", label: "هشدار امنیتی ورود مشکوک", confidence: "weak", confidenceScore: 28, summary: "یک تلاش ورود مشکوک از دستگاه ناشناس مسدود شد.", evidence: ["هشدار ورود از دستگاه جدید"], lastUpdated: "۱ ماه پیش", strength: 0.3 , relatedNodeIds: ["u1-leaf-appHayeMotasel-bank-app"] },
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
        { slug: "retirement-saving", label: "هدف پس‌انداز بازنشستگی", confidence: "inferred", confidenceScore: 48, summary: "شروع واریز کوچک ماهانه به یک صندوق بازنشستگی.", evidence: ["واریز ماهانه صندوق بازنشستگی"], lastUpdated: "۲ هفته پیش", strength: 0.4 },
        { slug: "fitness-goal", label: "هدف کاهش وزن", confidence: "weak", confidenceScore: 30, summary: "جستجوی برنامه تمرینی کاهش وزن.", evidence: ["جستجوی برنامه تمرینی"], lastUpdated: "۱۰ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "kalaha",
      confidence: "confirmed",
      confidenceScore: 75,
      summary: "علاقه پایدار به چند کالای مشخص در چند دسته شناسایی شده است.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.7,
      leaves: [
        { slug: "macbook-air-m4", label: "مک‌بوک ایر M4", confidence: "confirmed", confidenceScore: 82, summary: "بازدید و مقایسه مکرر مک‌بوک ایر نسل M4.", evidence: ["۶ بازدید از صفحه محصول در دو هفته", "افزودن به سبد خرید دو بار"], lastUpdated: "۱ روز پیش", strength: 0.75, aiRecommendation: "پیشنهاد اطلاع‌رسانی تخفیف این محصول.", imageUrl: "/images/shopping/laptops/macbook-air-m4.webp" },
        { slug: "orange-phone", label: "گوشی هوشمند مورد علاقه", confidence: "confirmed", confidenceScore: 78, summary: "بازدید مکرر و مقایسه قیمت این گوشی.", evidence: ["۴ بازدید از صفحه محصول"], lastUpdated: "۳ روز پیش", strength: 0.7, imageUrl: "/images/shopping/orange-phone.png" , relatedNodeIds: ["u1-leaf-kharid-digital"] },
        { slug: "instax-camera", label: "دوربین اینستکس", confidence: "inferred", confidenceScore: 60, summary: "افزودن به لیست علاقه‌مندی‌ها.", evidence: ["افزودن به علاقه‌مندی‌ها"], lastUpdated: "۱ هفته پیش", strength: 0.55, imageUrl: "/images/shopping/instax-camera.png" , relatedNodeIds: ["u1-leaf-makanha-north-trip"] },
        { slug: "new-balance-shoe", label: "کفش نیوبالانس", confidence: "confirmed", confidenceScore: 70, summary: "خرید قبلی از همین برند و بازدید مکرر مدل جدید.", evidence: ["یک خرید قبلی از برند مشابه", "سه بازدید از مدل جدید"], lastUpdated: "۴ روز پیش", strength: 0.6, imageUrl: "/images/shopping/new-balance-shoe.png" , relatedNodeIds: ["u1-leaf-sabkeZendegi-morning-exercise"] },
        { slug: "omega-moonswatch", label: "ساعت امگا مون‌سواچ", confidence: "weak", confidenceScore: 40, summary: "یک بازدید کوتاه از صفحه محصول.", evidence: ["یک بازدید از صفحه محصول"], lastUpdated: "۲ هفته پیش", strength: 0.35, imageUrl: "/images/shopping/opportunity/omega-moonswatch.avif" },
        { slug: "delsey-suitcase", label: "چمدان دلسی", confidence: "inferred", confidenceScore: 52, summary: "جستجوی چمدان پیش از سفر برنامه‌ریزی‌شده.", evidence: ["جستجوی چمدان مسافرتی"], lastUpdated: "۱۰ روز پیش", strength: 0.45, relatedNodeIds: ["u1-leaf-ahdaf-abroad-trip"], imageUrl: "/images/shopping/opportunity/delsey-suitcase.png" },
      ],
    },
  ]
);

const u2: UserProfile = buildUser(
  "u2",
  "رضا کریمی",
  "/images/admin/avatars/user-2.png",
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
        { slug: "supplements", label: "علاقه به مکمل‌های ورزشی", confidence: "weak", confidenceScore: 35, summary: "بازدید از صفحات مکمل بدون خرید.", evidence: ["مشاهده صفحه مکمل"], lastUpdated: "۱ هفته پیش", strength: 0.3 , relatedNodeIds: ["u2-leaf-goftogooha-diet-q"] },
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
        { slug: "smartband", label: "مالک مچ‌بند هوشمند", confidence: "inferred", confidenceScore: 55, summary: "همگام‌سازی داده گام از مچ‌بند هوشمند.", evidence: ["داده مچ‌بند هوشمند"], lastUpdated: "۱ هفته پیش", strength: 0.5 , relatedNodeIds: ["u2-leaf-salamat-gym"] },
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
        { slug: "gear-q", label: "پرسش درباره تجهیزات ورزشی", confidence: "inferred", confidenceScore: 58, summary: "چند پرسش درباره کفش دویدن.", evidence: ["گفتگوی کفش دویدن"], lastUpdated: "۳ روز پیش", strength: 0.5 , relatedNodeIds: ["u2-leaf-kharid-sportswear"] },
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
        { slug: "fitness-goal", label: "هدف بهبود آمادگی جسمانی", confidence: "inferred", confidenceScore: 55, summary: "افزایش تدریجی شدت تمرینات ثبت‌شده.", evidence: ["افزایش شدت تمرین"], lastUpdated: "۱۰ روز پیش", strength: 0.5 , relatedNodeIds: ["u2-leaf-salamat-gym", "u2-leaf-ahdaf-marathon"] },
      ],
    },
  ]
);

const u3: UserProfile = buildUser(
  "u3",
  "نیلوفر حسینی",
  "/images/admin/avatars/user-3.png",
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
        { slug: "fashion", label: "علاقه به مد فصلی", confidence: "weak", confidenceScore: 34, summary: "بازدید از کالکشن فصلی پوشاک.", evidence: ["مشاهده کالکشن جدید"], lastUpdated: "۹ روز پیش", strength: 0.3 , relatedNodeIds: ["u3-leaf-tarjihat-handmade"] },
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
        { slug: "reading", label: "علاقه به مطالعه رمان", confidence: "inferred", confidenceScore: 55, summary: "خرید چند جلد رمان در سه ماه اخیر.", evidence: ["خرید کتاب رمان"], lastUpdated: "۲ هفته پیش", strength: 0.5 , relatedNodeIds: ["u3-leaf-sabkeZendegi-art"] },
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
        { slug: "design-interest", label: "علاقه به یادگیری طراحی گرافیک", confidence: "weak", confidenceScore: 36, summary: "جستجوی چندباره درباره دوره طراحی.", evidence: ["جستجوی دوره گرافیک"], lastUpdated: "۱ هفته پیش", strength: 0.35 , relatedNodeIds: ["u3-leaf-sabkeZendegi-art"] },
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
        { slug: "handmade", label: "ترجیح محصولات دست‌ساز", confidence: "inferred", confidenceScore: 62, summary: "خرید مکرر از فروشندگان صنایع‌دستی.", evidence: ["دو خرید صنایع‌دستی"], lastUpdated: "۶ روز پیش", strength: 0.55 , relatedNodeIds: ["u3-leaf-kharid-beauty"] },
        { slug: "eco", label: "ترجیح بسته‌بندی سازگار با محیط‌زیست", confidence: "weak", confidenceScore: 34, summary: "انتخاب گزینه بسته‌بندی سبز در سفارش.", evidence: ["انتخاب بسته‌بندی سبز"], lastUpdated: "۲ هفته پیش", strength: 0.3 },
      ],
    },
  ]
);

const u4: UserProfile = buildUser(
  "u4",
  "امیر رستمی",
  "/images/admin/avatars/user-1.png",
  "۵ گفتگوی فعال",
  [
    {
      category: "kharid",
      confidence: "confirmed",
      confidenceScore: 88,
      summary: "خریدار پرتکرار در دسته لوازم خانگی و الکترونیک.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.85,
      leaves: [
        { slug: "appliances", label: "خرید مکرر لوازم خانگی", confidence: "confirmed", confidenceScore: 85, summary: "چهار خرید لوازم خانگی بزرگ در سه ماه اخیر.", evidence: ["خرید یخچال، ماشین لباسشویی و جاروبرقی"], lastUpdated: "۱ روز پیش", strength: 0.8, aiRecommendation: "پیشنهاد گارانتی تمدیدی برای خریدهای اخیر." },
        { slug: "electronics", label: "علاقه به گجت‌های جدید", confidence: "confirmed", confidenceScore: 80, summary: "خرید زودهنگام محصولات تازه‌عرضه‌شده در حوزه الکترونیک.", evidence: ["پیش‌خرید هدفون بی‌سیم جدید"], lastUpdated: "۴ روز پیش", strength: 0.7 , relatedNodeIds: ["u4-leaf-dastgahha-android-flagship"] },
        { slug: "warranty", label: "استفاده مکرر از گارانتی", confidence: "inferred", confidenceScore: 58, summary: "ثبت درخواست گارانتی برای دو محصول اخیر.", evidence: ["دو تیکت گارانتی باز"], lastUpdated: "۲ هفته پیش", strength: 0.5 , relatedNodeIds: ["u4-leaf-goftogooha-warranty-support"] },
      ],
    },
    {
      category: "mali",
      confidence: "confirmed",
      confidenceScore: 80,
      summary: "استفاده فعال از اعتبار خرید اقساطی دیجی‌کالا.",
      lastUpdated: "۲ روز پیش",
      centerStrength: 0.75,
      leaves: [
        { slug: "credit-line", label: "استفاده از خط اعتباری خرید", confidence: "confirmed", confidenceScore: 82, summary: "استفاده مکرر از اعتبار خرید اقساطی برای کالای دیجیتال.", evidence: ["سه خرید اقساطی متوالی"], lastUpdated: "۲ روز پیش", strength: 0.75, aiRecommendation: "پیشنهاد افزایش سقف اعتبار بر اساس سابقه پرداخت منظم." , relatedNodeIds: ["u4-leaf-kharid-appliances"] },
        { slug: "on-time-installment", label: "پرداخت به‌موقع اقساط", confidence: "confirmed", confidenceScore: 90, summary: "بدون سابقه تاخیر در بازپرداخت اقساط.", evidence: ["۱۲ قسط پرداخت‌شده بدون تاخیر"], lastUpdated: "۱ هفته پیش", strength: 0.8 },
      ],
    },
    {
      category: "dastgahha",
      confidence: "confirmed",
      confidenceScore: 78,
      summary: "دستگاه اصلی اندروید همراه با کنسول بازی.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.7,
      leaves: [
        { slug: "android-flagship", label: "استفاده از گوشی پرچمدار اندروید", confidence: "confirmed", confidenceScore: 85, summary: "دستگاه ثبت‌شده گوشی پرچمدار نسل اخیر.", evidence: ["اطلاعات دستگاه ورود"], lastUpdated: "۳ روز پیش", strength: 0.75 },
        { slug: "console", label: "مالک کنسول بازی", confidence: "inferred", confidenceScore: 60, summary: "خرید بازی دیجیتال به‌صورت مکرر.", evidence: ["دو خرید بازی دیجیتال"], lastUpdated: "۱۰ روز پیش", strength: 0.5 , relatedNodeIds: ["u4-leaf-servisha-gamepass"] },
      ],
    },
    {
      category: "servisha",
      confidence: "confirmed",
      confidenceScore: 72,
      summary: "مشترک چند سرویس گیمینگ و استریم.",
      lastUpdated: "۴ روز پیش",
      centerStrength: 0.65,
      leaves: [
        { slug: "gamepass", label: "اشتراک سرویس بازی ابری", confidence: "confirmed", confidenceScore: 75, summary: "تمدید مداوم اشتراک بازی ابری.", evidence: ["تمدید ماهانه فعال"], lastUpdated: "۴ روز پیش", strength: 0.65 },
        { slug: "youtube-premium", label: "اشتراک یوتیوب پرمیوم", confidence: "inferred", confidenceScore: 55, summary: "پرداخت مکرر با همان روش پرداخت مرتبط با یوتیوب.", evidence: ["الگوی پرداخت مشابه ماهانه"], lastUpdated: "۲ هفته پیش", strength: 0.5 },
      ],
    },
    {
      category: "goftogooha",
      confidence: "confirmed",
      confidenceScore: 70,
      summary: "گفتگوهای فعال درباره مقایسه گجت و پشتیبانی گارانتی.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.65,
      leaves: [
        { slug: "gadget-compare", label: "درخواست مکرر مقایسه گجت", confidence: "confirmed", confidenceScore: 75, summary: "درخواست مقایسه مشخصات فنی چند گوشی.", evidence: ["گفتگوی مقایسه گوشی"], lastUpdated: "۱ روز پیش", strength: 0.7, relatedNodeIds: ["u4-leaf-kharid-electronics"] },
        { slug: "warranty-support", label: "پیگیری وضعیت گارانتی", confidence: "inferred", confidenceScore: 58, summary: "دو گفتگوی پیگیری وضعیت تعمیر.", evidence: ["گفتگوی پیگیری تعمیر"], lastUpdated: "۵ روز پیش", strength: 0.5 },
      ],
    },
  ]
);

const u5: UserProfile = buildUser(
  "u5",
  "مریم صادقی",
  "/images/admin/avatars/user-2.png",
  "بدون گفتگوی فعال",
  [
    {
      category: "salamat",
      confidence: "confirmed",
      confidenceScore: 85,
      summary: "پیگیری فعال سلامت بارداری.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.8,
      leaves: [
        { slug: "pregnancy", label: "پیگیری دوران بارداری", confidence: "confirmed", confidenceScore: 90, summary: "خرید مکمل و مراجعه منظم به محتوای بارداری.", evidence: ["خرید ویتامین دوران بارداری", "بازدید مکرر از مقالات بارداری"], lastUpdated: "۱ روز پیش", strength: 0.85, aiRecommendation: "پیشنهاد نمایش ویجت اختصاصی دوران بارداری." },
        { slug: "checkup", label: "چکاپ‌های دوره‌ای", confidence: "inferred", confidenceScore: 62, summary: "رزرو نوبت پزشک به‌صورت ماهانه.", evidence: ["دو نوبت رزرو پزشکی متوالی"], lastUpdated: "۳ هفته پیش", strength: 0.55 , relatedNodeIds: ["u5-leaf-salamat-pregnancy"] },
      ],
    },
    {
      category: "kharid",
      confidence: "confirmed",
      confidenceScore: 75,
      summary: "خرید تمرکز یافته روی کالای مادر و کودک.",
      lastUpdated: "۲ روز پیش",
      centerStrength: 0.7,
      leaves: [
        { slug: "baby-gear", label: "خرید لوازم نوزاد", confidence: "confirmed", confidenceScore: 80, summary: "خرید تدریجی سیسمونی در دو ماه اخیر.", evidence: ["سه سفارش لوازم نوزاد"], lastUpdated: "۲ روز پیش", strength: 0.75, relatedNodeIds: ["u5-leaf-salamat-pregnancy"] },
        { slug: "maternity-wear", label: "خرید پوشاک بارداری", confidence: "inferred", confidenceScore: 60, summary: "خرید دو مورد پوشاک مخصوص بارداری.", evidence: ["دو سفارش پوشاک بارداری"], lastUpdated: "۱ هفته پیش", strength: 0.55 },
      ],
    },
    {
      category: "ravabet",
      confidence: "confirmed",
      confidenceScore: 78,
      summary: "متاهل و در انتظار فرزند اول.",
      lastUpdated: "۱ هفته پیش",
      centerStrength: 0.7,
      leaves: [
        { slug: "married-expecting", label: "متاهل و باردار", confidence: "confirmed", confidenceScore: 82, summary: "اشاره صریح به بارداری در چند گفتگو.", evidence: ["اشاره به «بارداری‌ام» در گفتگو"], lastUpdated: "۱ هفته پیش", strength: 0.75 },
      ],
    },
    {
      category: "amoozesh",
      confidence: "inferred",
      confidenceScore: 55,
      summary: "جستجوی محتوای آموزشی مراقبت از نوزاد.",
      lastUpdated: "۵ روز پیش",
      centerStrength: 0.5,
      leaves: [
        { slug: "newborn-care", label: "علاقه به آموزش مراقبت از نوزاد", confidence: "inferred", confidenceScore: 58, summary: "جستجوی چندباره درباره مراقبت از نوزاد تازه متولد.", evidence: ["جستجوی راهنمای مراقبت نوزاد"], lastUpdated: "۵ روز پیش", strength: 0.5 },
      ],
    },
    {
      category: "ahdaf",
      confidence: "inferred",
      confidenceScore: 60,
      summary: "هدف آماده‌سازی خانه برای فرزند جدید.",
      lastUpdated: "۴ روز پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "nursery-setup", label: "هدف آماده‌سازی اتاق نوزاد", confidence: "inferred", confidenceScore: 62, summary: "جستجوی مبلمان و دکوراسیون اتاق نوزاد.", evidence: ["جستجوی تخت نوزاد"], lastUpdated: "۴ روز پیش", strength: 0.55, aiRecommendation: "پیشنهاد نمایش لیست کامل سیسمونی." },
      ],
    },
  ]
);

export const intelligenceUsers: UserProfile[] = [u1, u2, u3, u4, u5];
