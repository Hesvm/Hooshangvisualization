import { faNum, formatPersianNumber } from "@/lib/faNum";

export const RENTAL_HOUSE_CONVERSATION_ID = "rental-house-search";
export const RENTAL_HOUSE_USER_MESSAGE = "میخوام خونم رو عوض کنم. برام میتونی چندتا خونه برای اجاره پیدا کنی؟";
export const RENTAL_HOUSE_HEADER_ACCENT_RGB = "59, 147, 235";

export const RENTAL_INTRO_TEXT =
  "آره. برای اینکه گزینه‌های الکی نشونت ندم، چندتا سؤال کوتاه می‌پرسم و بعد بر اساس بودجه، محله، مسیرهای مهم و چیزهایی که دوست داری، چندتا گزینه مرتب‌شده میارم.";

export const RENTAL_ROUTES_CONTEXT_TEXT =
  "من درباره مسیرهای مهمت مثل محل کارت، دانشگاه، باشگاه یا جاهایی که زیاد میری اطلاعات زیادی دارم و می‌تونم دسترسی خونه‌ها به اون‌ها رو هم توی امتیازدهی لحاظ کنم.";

export const RENTAL_THINKING_MESSAGES = [
  "دارم گزینه‌ها رو بر اساس بودجه و محله فیلتر می‌کنم...",
  "دارم مسیرهای مهمت رو با خونه‌ها تطبیق می‌دم...",
  "دارم آگهی‌هایی که به سلیقه‌ت نزدیک‌ترن جدا می‌کنم...",
  "دارم گزینه‌هایی که ارزش بازدید دارن رو مرتب می‌کنم...",
] as const;

export const RENTAL_BEST_MATCH_THINKING_MESSAGES = ["دارم گزینه‌ها رو با هم مقایسه می‌کنم..."] as const;

export const RENTAL_RESULT_INTRO_TEXT =
  "این چندتا گزینه از بین آگهی‌هایی که بررسی کردم، به بودجه، محله و چیزهایی که گفتی نزدیک‌ترن. اول به شکل انتخاب هوشمند می‌بینی، ولی می‌تونی روی نقشه یا جدول مقایسه هم نگاهشون کنی.";

/* ---------------------------------- Step 1: budget ---------------------------------- */

export type BudgetPreset = "deposit-heavy" | "balanced" | "rent-light";

export const RENTAL_BUDGET_PRESETS: { id: BudgetPreset; label: string }[] = [
  { id: "deposit-heavy", label: "رهن بیشتر، اجاره کمتر" },
  { id: "balanced", label: "متعادل" },
  { id: "rent-light", label: "اجاره کمتر مهم‌تره" },
];

export const RENTAL_DEPOSIT_RANGE = { min: 500_000_000, max: 3_000_000_000, step: 50_000_000 };
export const RENTAL_RENT_RANGE = { min: 10_000_000, max: 80_000_000, step: 5_000_000 };

/* ---------------------------------- Step 2: map ---------------------------------- */

export type TehranDistrict = {
  id: string;
  label: string;
  /** stylized blob path in a 0 0 360 260 viewBox */
  path: string;
  /** label anchor, percentage of the map card */
  x: number;
  y: number;
};

export const TEHRAN_DISTRICTS: TehranDistrict[] = [
  { id: "sadeghieh", label: "صادقیه", path: "M28,96 C20,74 40,54 66,56 C92,58 104,80 94,102 C84,124 54,128 38,116 C30,110 32,104 28,96 Z", x: 17, y: 38 },
  { id: "marzdaran", label: "مرزداران", path: "M104,60 C98,40 122,24 148,28 C174,32 182,54 170,72 C158,90 128,90 112,78 C104,72 108,68 104,60 Z", x: 37, y: 24 },
  { id: "jannatabad", label: "جنت‌آباد", path: "M18,168 C10,146 32,126 58,130 C84,134 94,156 82,176 C70,196 40,198 24,186 C16,180 20,176 18,168 Z", x: 15, y: 62 },
  { id: "punak", label: "پونک", path: "M112,140 C104,118 128,100 154,104 C180,108 190,130 178,150 C166,170 134,172 118,160 C110,154 116,148 112,140 Z", x: 40, y: 55 },
  { id: "sattarkhan", label: "ستارخان", path: "M196,54 C188,32 212,16 238,20 C264,24 274,46 262,66 C250,86 218,86 202,74 C194,68 200,62 196,54 Z", x: 63, y: 22 },
  { id: "ekbatan", label: "اکباتان", path: "M20,232 C12,210 34,190 60,194 C86,198 96,220 84,240 C74,258 44,260 28,248 C20,242 24,238 20,232 Z", x: 16, y: 90 },
  { id: "tehransar", label: "تهرانسر", path: "M104,214 C96,192 120,174 146,178 C172,182 182,204 170,224 C158,244 126,246 110,234 C102,228 108,222 104,214 Z", x: 38, y: 84 },
  { id: "ariashahr", label: "آریاشهر", path: "M196,140 C188,118 212,100 238,104 C264,108 274,130 262,150 C250,170 218,172 202,160 C194,154 200,148 196,140 Z", x: 63, y: 55 },
  { id: "shahrak-gharb", label: "شهرک غرب", path: "M280,84 C272,62 296,44 322,48 C348,52 356,74 344,94 C332,114 300,116 284,104 C276,98 284,92 280,84 Z", x: 87, y: 32 },
];

export const RENTAL_ACCEPTABLE_DISTRICT_IDS = ["sadeghieh", "marzdaran", "jannatabad", "punak", "sattarkhan"];

/* ---------------------------------- Step 3: area & bedrooms ---------------------------------- */

export const RENTAL_AREA_OPTIONS = [
  { id: "60-80", label: "۶۰–۸۰ متر" },
  { id: "80-100", label: "۸۰–۱۰۰ متر" },
  { id: "100+", label: "۱۰۰+ متر" },
];

export const RENTAL_BEDROOM_OPTIONS = [
  { id: "1", label: faNum(1) },
  { id: "2", label: faNum(2) },
  { id: "3+", label: `${faNum(3)}+` },
];

/* ---------------------------------- Steps 4/6/9: single-select ---------------------------------- */

export const RENTAL_BUILDING_AGE_OPTIONS = [
  { id: "new", label: "نوساز" },
  { id: "under-5", label: "زیر ۵ سال" },
  { id: "under-10", label: "زیر ۱۰ سال" },
  { id: "under-15", label: "تا ۱۵ سال قابل قبوله" },
  { id: "any", label: "مهم نیست" },
];

export const RENTAL_FLOOR_MATERIAL_OPTIONS = [
  { id: "parquet", label: "پارکت" },
  { id: "ceramic", label: "سرامیک" },
  { id: "stone", label: "سنگ" },
  { id: "any", label: "فرقی نمی‌کنه" },
];

export const RENTAL_MOVE_IN_OPTIONS = [
  { id: "immediate", label: "فوری" },
  { id: "two-weeks", label: "تا دو هفته آینده" },
  { id: "one-month", label: "تا یک ماه آینده" },
  { id: "browsing", label: "فعلاً دارم بررسی می‌کنم" },
];

/* ---------------------------------- Steps 5/10: multi-select ---------------------------------- */

export const RENTAL_MUST_HAVE_OPTIONS = [
  { id: "parking", label: "پارکینگ" },
  { id: "elevator", label: "آسانسور" },
  { id: "storage", label: "انباری" },
  { id: "good-light", label: "نور خوب" },
  { id: "balcony", label: "بالکن" },
  { id: "good-kitchen", label: "آشپزخونه خوب" },
  { id: "big-hall", label: "سالن بزرگ" },
  { id: "master-bed", label: "خواب مستر" },
];

export const RENTAL_DEAL_BREAKER_OPTIONS = [
  { id: "street-noise", label: "سر و صدای خیابون" },
  { id: "low-light", label: "نور کم" },
  { id: "crowded-building", label: "ساختمان شلوغ" },
  { id: "small-kitchen", label: "آشپزخونه کوچک" },
  { id: "small-bedroom", label: "اتاق خواب کوچک" },
  { id: "hard-access", label: "دسترسی سخت" },
  { id: "no-elevator-high-floor", label: "طبقات بالا بدون آسانسور" },
];

/* ---------------------------------- Step 7: vibe ---------------------------------- */

export type RentalVibe = { id: string; label: string; gradient: string };

export const RENTAL_VIBE_OPTIONS: RentalVibe[] = [
  { id: "minimal-bright", label: "مینیمال و روشن", gradient: "linear-gradient(135deg, #f4f4f5 0%, #dfe6ec 100%)" },
  { id: "warm-family", label: "گرم و خانوادگی", gradient: "linear-gradient(135deg, #f6e6d8 0%, #e3b98f 100%)" },
  { id: "modern-luxury", label: "مدرن و لوکس", gradient: "linear-gradient(135deg, #2b2f3a 0%, #565f73 100%)" },
  { id: "cozy-compact", label: "دنج و جمع‌وجور", gradient: "linear-gradient(135deg, #e8ece3 0%, #b7c9a8 100%)" },
];

/* ---------------------------------- Step 8: routes ---------------------------------- */

export const RENTAL_ROUTE_SUGGESTIONS = [
  { id: "work", label: "محل کار" },
  { id: "university", label: "دانشگاه" },
  { id: "gym", label: "باشگاه" },
  { id: "family", label: "خونه خانواده" },
];

/* ---------------------------------- Answers ---------------------------------- */

export type RentalAnswers = {
  depositBudget: number;
  rentBudget: number;
  budgetPreset: BudgetPreset | null;
  districtIds: string[];
  areaId: string;
  bedroomsId: string;
  buildingAgeId: string;
  mustHaveIds: string[];
  floorMaterialId: string;
  vibeId: string;
  routeIds: string[];
  customRoutes: string[];
  moveInId: string;
  dealBreakerIds: string[];
};

function labelOf(options: { id: string; label: string }[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? "";
}

function districtLabels(ids: string[]): string {
  return ids.map((id) => TEHRAN_DISTRICTS.find((d) => d.id === id)?.label ?? "").filter(Boolean).join("، ");
}

/** Interpolates the collected questionnaire answers into one consolidated Persian sentence. */
export function buildRentalSummaryMessage(answers: RentalAnswers): string {
  const districts = districtLabels(answers.districtIds) || "چند محله مدنظرت";
  const deposit = faNum(Math.round(answers.depositBudget / 100_000_000) / 10);
  const rent = faNum(Math.round(answers.rentBudget / 1_000_000));
  const bedrooms = labelOf(RENTAL_BEDROOM_OPTIONS, answers.bedroomsId) || "۲";
  const buildingAge = labelOf(RENTAL_BUILDING_AGE_OPTIONS, answers.buildingAgeId);
  const mustHaves = answers.mustHaveIds.map((id) => labelOf(RENTAL_MUST_HAVE_OPTIONS, id)).filter(Boolean);
  const floorMaterial = labelOf(RENTAL_FLOOR_MATERIAL_OPTIONS, answers.floorMaterialId);
  const vibe = RENTAL_VIBE_OPTIONS.find((v) => v.id === answers.vibeId)?.label ?? "";

  const mustHaveText = mustHaves.length > 0 ? `${mustHaves.join("، ")} برام مهمه، ` : "";
  const floorText = floorMaterial && floorMaterial !== "فرقی نمی‌کنه" ? `کف ${floorMaterial} رو ترجیح می‌دم و ` : "";
  const vibeText = vibe ? `بیشتر با فضای ${vibe} ارتباط می‌گیرم.` : "";
  const ageText = buildingAge && buildingAge !== "مهم نیست" ? `و ${buildingAge}` : "";

  return `دنبال خونه اجاره‌ای توی ${districts}ام. حدود ${deposit} میلیارد رهن و تا ${rent} میلیون اجاره، ترجیحاً ${bedrooms} خواب ${ageText}. ${mustHaveText}${floorText}${vibeText}`.trim();
}

/* ---------------------------------- Result properties ---------------------------------- */

export type RentalBadge = "better-offer" | "closer" | "more-value";

export type RentalProperty = {
  id: string;
  title: string;
  districtId: string;
  area: number;
  bedrooms: number;
  buildingAge: number;
  deposit: number;
  rent: number;
  parking: boolean;
  elevator: boolean;
  metroAccessMinutes: number;
  features: string[];
  positives: string[];
  limitations: string[];
  accessibilityNote: string;
  badge: RentalBadge;
  matchScore: number;
  markerX: number;
  markerY: number;
};

export const RENTAL_BADGE_LABEL: Record<RentalBadge, string> = {
  "better-offer": "پیشنهاد بهتر",
  closer: "نزدیک‌تر",
  "more-value": "ارزشمندتر",
};

export const RENTAL_PROPERTIES: RentalProperty[] = [
  {
    id: "p1",
    title: "آپارتمان نوساز صادقیه",
    districtId: "sadeghieh",
    area: 88,
    bedrooms: 2,
    buildingAge: 3,
    deposit: 1_900_000_000,
    rent: 38_000_000,
    parking: true,
    elevator: true,
    metroAccessMinutes: 6,
    features: ["نور خوب", "بالکن", "کف پارکت"],
    positives: ["توی محدوده بودجه‌اته", "به محل کارت دسترسی بهتری داره", "پارکینگ و آسانسور داره"],
    limitations: ["آشپزخونه خیلی بزرگ نیست"],
    accessibilityNote: "۶ دقیقه پیاده تا مترو صادقیه، دسترسی مستقیم به بزرگراه همت.",
    badge: "better-offer",
    matchScore: 88,
    markerX: 20,
    markerY: 40,
  },
  {
    id: "p2",
    title: "واحد دوبلکس مرزداران",
    districtId: "marzdaran",
    area: 102,
    bedrooms: 2,
    buildingAge: 7,
    deposit: 2_200_000_000,
    rent: 32_000_000,
    parking: true,
    elevator: false,
    metroAccessMinutes: 12,
    features: ["سالن بزرگ", "انباری", "کف سرامیک"],
    positives: ["متراژ بزرگ‌تر از بقیه گزینه‌ها", "سالن بزرگ و نورگیر"],
    limitations: ["آسانسور نداره", "ساختمونش خیلی نوساز نیست"],
    accessibilityNote: "دسترسی به بزرگراه چمران، تا میدان توحید ۱۵ دقیقه.",
    badge: "more-value",
    matchScore: 79,
    markerX: 40,
    markerY: 26,
  },
  {
    id: "p3",
    title: "آپارتمان مستر جنت‌آباد",
    districtId: "jannatabad",
    area: 75,
    bedrooms: 2,
    buildingAge: 5,
    deposit: 1_600_000_000,
    rent: 28_000_000,
    parking: true,
    elevator: true,
    metroAccessMinutes: 4,
    features: ["خواب مستر", "پارکینگ", "آسانسور"],
    positives: ["زیر بودجه تعیین‌شده‌ات", "نزدیک‌ترین گزینه به مترو"],
    limitations: ["متراژش از بعضی گزینه‌ها کمتره"],
    accessibilityNote: "۴ دقیقه پیاده تا مترو جنت‌آباد، مسیر کوتاه به بزرگراه همت.",
    badge: "closer",
    matchScore: 82,
    markerX: 18,
    markerY: 63,
  },
  {
    id: "p4",
    title: "واحد شیک ستارخان",
    districtId: "sattarkhan",
    area: 95,
    bedrooms: 2,
    buildingAge: 9,
    deposit: 2_450_000_000,
    rent: 25_000_000,
    parking: true,
    elevator: true,
    metroAccessMinutes: 9,
    features: ["نور خوب", "آشپزخونه خوب", "بالکن"],
    positives: ["اجاره پایین‌تر از بقیه", "آشپزخونه بزرگ و مدرن"],
    limitations: ["رهن بالاتره", "کمی دورتر از محدوده اصلی"],
    accessibilityNote: "دسترسی به بزرگراه یادگار امام، ۹ دقیقه تا مترو ستارخان.",
    badge: "more-value",
    matchScore: 75,
    markerX: 66,
    markerY: 24,
  },
  {
    id: "p5",
    title: "آپارتمان دنج پونک",
    districtId: "punak",
    area: 68,
    bedrooms: 2,
    buildingAge: 4,
    deposit: 1_750_000_000,
    rent: 30_000_000,
    parking: false,
    elevator: true,
    metroAccessMinutes: 8,
    features: ["کف پارکت", "نور خوب"],
    positives: ["نوساز و کم‌مصرف", "توی بودجه‌ات جا میشه"],
    limitations: ["پارکینگ نداره", "متراژ کوچک‌تر"],
    accessibilityNote: "۸ دقیقه تا مترو پونک، دسترسی خوب به همت.",
    badge: "closer",
    matchScore: 71,
    markerX: 44,
    markerY: 57,
  },
];

export const RENTAL_BEST_MATCH_PROPERTY_ID = "p1";

/* ---------------------------------- View switcher ---------------------------------- */

export const RENTAL_VIEW_CHIPS = [
  { id: "smart", label: "انتخاب هوشنگ" },
  { id: "map", label: "نقشه" },
  { id: "table", label: "جدول مقایسه" },
] as const;

/* ---------------------------------- Follow-ups ---------------------------------- */

export const RENTAL_VISIT_TIME_OPTIONS = [
  { id: "today-evening", label: "امروز عصر" },
  { id: "tomorrow-morning", label: "فردا صبح" },
  { id: "tomorrow-evening", label: "فردا عصر" },
  { id: "weekend", label: "آخر هفته" },
];

export const RENTAL_NEGOTIATION_TIPS = [
  "قبل از بازدید، قیمت چند واحد مشابه توی همون محله رو چک کن تا دست بازتری برای چانه‌زنی داشته باشی.",
  "سر بازدید حتماً فشار آب، کنتور برق و گاز و وضعیت شارژ ساختمان رو بپرس.",
  "اگه موجر عجله داره، معمولاً جای مذاکره روی رهن و اجاره بیشتره — پیشنهاد بده بخشی از اجاره رو به رهن اضافه کنی.",
];

export function formatRentalPrice(amount: number): string {
  return formatPersianNumber(amount);
}
