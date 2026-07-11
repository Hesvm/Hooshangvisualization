import {
  RENTAL_BUDGET_PRESETS,
  RENTAL_MUST_HAVE_OPTIONS,
  RENTAL_ROUTE_SUGGESTIONS,
  RENTAL_VIBE_OPTIONS,
  districtLabels,
  labelOf,
  type RentalAnswers,
} from "@/lib/mocks/rentalHouse";
import type { ThinkingPipeline } from "../types";

/** Brief prep beat before the questionnaire — kept short, matches the old fixed 900ms. */
export const RENTAL_INTRO_PIPELINE: ThinkingPipeline = [
  {
    id: "rental-intro",
    minDuration: 500,
    maxDuration: 700,
    messages: ["دارم چندتا سؤال کوتاه آماده می‌کنم تا گزینه‌های الکی نشونت ندم..."],
  },
];

/** Main house-search investigation. Target total: ~15–25s across 6 beats. */
export function buildRentalSearchPipeline(answers: RentalAnswers): ThinkingPipeline {
  const districts = districtLabels(answers.districtIds) || "محله‌هایی که گفتی";
  const budgetLabel = RENTAL_BUDGET_PRESETS.find((p) => p.id === answers.budgetPreset)?.label;
  const vibeLabel = RENTAL_VIBE_OPTIONS.find((v) => v.id === answers.vibeId)?.label;
  const routeLabels = answers.routeIds
    .map((id) => RENTAL_ROUTE_SUGGESTIONS.find((r) => r.id === id)?.label)
    .filter((label): label is string => Boolean(label));
  const mustHaves = answers.mustHaveIds.map((id) => labelOf(RENTAL_MUST_HAVE_OPTIONS, id)).filter(Boolean);

  return [
    {
      id: "rental-filter-budget",
      minDuration: 1550,
      maxDuration: 2500,
      messages: [
        `دارم آگهی‌های ${districts} رو بر اساس بودجه‌ت فیلتر می‌کنم...`,
        budgetLabel
          ? `دارم فایل‌هایی که با اولویت «${budgetLabel}» جور درمیان رو جدا می‌کنم...`
          : "دارم فایل‌ها رو بر اساس رهن و اجاره فیلتر می‌کنم...",
        "دارم آگهی‌هایی که خارج از بودجه‌ت هستن رو کنار می‌ذارم...",
      ],
    },
    {
      id: "rental-routes",
      minDuration: 1700,
      maxDuration: 2800,
      messages:
        routeLabels.length > 0
          ? [
              `دارم فاصله هر خونه تا ${routeLabels[0]} رو اندازه می‌گیرم...`,
              `دارم دسترسی به ${routeLabels.join("، ")} رو با نقشه تطبیق می‌دم...`,
            ]
          : ["دارم مسیرهای مهمت رو با موقعیت هر خونه تطبیق می‌دم..."],
    },
    {
      id: "rental-photos",
      minDuration: 1550,
      maxDuration: 2650,
      messages: [
        "دارم عکس‌های سالن پذیرایی و نورگیری واحدها رو بررسی می‌کنم...",
        "از روی تصاویر، به نظر میاد چندتاشون نورگیری خوبی دارن...",
        "اتاق مستر توی توضیحات نوشته شده ولی از روی عکس‌ها مشخص نیست...",
      ],
    },
    {
      id: "rental-discovery",
      minDuration: 1250,
      maxDuration: 2100,
      messages: [
        "چندتا آگهی رو چون خارج از بودجه بودن حذف کردم...",
        "یه آگهی با شرایط بهتر از چیزی که گفته بودی پیدا کردم...",
        "این مورد ارزش بازدید حضوری داره...",
      ],
    },
    {
      id: "rental-vibe",
      minDuration: 1400,
      maxDuration: 2400,
      messages: [
        vibeLabel
          ? `دارم دنبال خونه‌هایی می‌گردم که با فضای ${vibeLabel} همخونی دارن...`
          : "دارم دنبال خونه‌هایی می‌گردم که با سلیقه‌ت همخونی دارن...",
        mustHaves.length > 0
          ? `دارم مطمئن می‌شم ${mustHaves.join("، ")} توی این گزینه‌ها هست...`
          : "دارم امکانات ضروری رو با لیستت چک می‌کنم...",
      ],
    },
    {
      id: "rental-rank",
      minDuration: 1100,
      maxDuration: 1800,
      messages: [
        "دارم قیمت هر متر مربع رو با فایل‌های مشابه مقایسه می‌کنم...",
        "دارم گزینه‌ها رو بر اساس ارزش بازدید مرتب می‌کنم...",
        "چندتا گزینه امتیاز بالاتری گرفتن...",
      ],
    },
  ];
}

/** Short "which one's best for me" follow-up. */
export const RENTAL_BEST_MATCH_PIPELINE: ThinkingPipeline = [
  {
    id: "rental-best-match-compare",
    minDuration: 1250,
    maxDuration: 2100,
    messages: [
      "دارم گزینه‌ها رو از نظر قیمت، محله و امکانات کنار هم می‌ذارم...",
      "دارم می‌بینم کدوم گزینه به چیزهایی که برات مهم بود نزدیک‌تره...",
    ],
  },
  {
    id: "rental-best-match-verdict",
    minDuration: 1000,
    maxDuration: 1700,
    messages: ["این گزینه بیشترین همخونی رو با ترجیحاتت داره...", "به نظرم این یکی ارزش بازدید بیشتری داره..."],
  },
];
