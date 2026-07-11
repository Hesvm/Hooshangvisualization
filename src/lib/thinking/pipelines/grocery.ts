import { faNum } from "@/lib/faNum";
import { groceryContext } from "@/lib/mocks/monthlyGrocery";
import type { ThinkingPipeline } from "../types";

const HOUSEHOLD = faNum(groceryContext.householdSize);

/** Brief prep beat before the setup questionnaire. */
export const GROCERY_INITIAL_PIPELINE: ThinkingPipeline = [
  {
    id: "grocery-initial-plan",
    minDuration: 1100,
    maxDuration: 1800,
    messages: ["دارم برای خرید ماهانه‌تون برنامه می‌چینم...", "دارم موجودی فروشگاه‌های اطراف رو بررسی می‌کنم..."],
  },
  {
    id: "grocery-initial-household",
    minDuration: 1100,
    maxDuration: 1950,
    messages: [
      `دارم نیازهای یک خانواده ${HOUSEHOLD} نفره رو در نظر می‌گیرم...`,
      "دارم برندهای مشابه با قیمت کمتر پیدا می‌کنم...",
    ],
  },
];

/** Main basket-building investigation. Target total: ~8–14s. */
export const GROCERY_BASKET_PIPELINE: ThinkingPipeline = [
  {
    id: "grocery-consumption",
    minDuration: 1550,
    maxDuration: 2500,
    messages: [
      `دارم مصرف یک‌ماهه خانواده ${HOUSEHOLD} نفره رو تخمین می‌زنم...`,
      "دارم مقدار هر کالا رو بر اساس مصرف معمول یه ماه حساب می‌کنم...",
    ],
  },
  {
    id: "grocery-inventory",
    minDuration: 1400,
    maxDuration: 2400,
    messages: [
      "دارم قیمت و موجودی کالاهای نزدیکت رو بررسی می‌کنم...",
      "این برند امروز تخفیف بیشتری داره...",
      "این کالا فعلاً موجود نیست، دارم جایگزینش رو پیدا می‌کنم...",
    ],
  },
  {
    id: "grocery-budget",
    minDuration: 1400,
    maxDuration: 2250,
    messages: [
      "دارم خریدها رو بر اساس ضرورت و بودجه مرتب می‌کنم...",
      "اگه برند دومش رو انتخاب کنی چندتا کالا ارزون‌تر میشه...",
    ],
  },
  {
    id: "grocery-finalize",
    minDuration: 1100,
    maxDuration: 1800,
    messages: ["دارم سبد نهایی دیجی‌جت رو آماده می‌کنم...", "دارم سبد رو یه‌بار دیگه با بودجه‌ت چک می‌کنم..."],
  },
];
