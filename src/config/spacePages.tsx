import type { SpaceWidget } from "@/types/widget";
import type { ComposerSuggestion } from "@/types/space";
import type { HistoryItem } from "@/types/history";
import { MovementWidget } from "@/components/widgets/health/MovementWidget";
import { HeartWidget } from "@/components/widgets/health/HeartWidget";
import { SleepWidget } from "@/components/widgets/health/SleepWidget";
import { StepsWidget } from "@/components/widgets/health/StepsWidget";
import { PurchaseOpportunityWidget } from "@/components/widgets/shopping/PurchaseOpportunityWidget";
import { ShoppingListWidget } from "@/components/widgets/shopping/ShoppingListWidget";
import { MonthlyListNoteWidget, SmartReorderWidget } from "@/components/widgets/grocery/GroceryWidgets";
import { healthWidgetData, healthHistory } from "@/lib/mocks/health";
import { purchaseOpportunityData, shoppingListData, shoppingHistory } from "@/lib/mocks/shopping";
import { groceryHomeHistory, groceryMonthlyList, groceryReorderItems } from "@/lib/mocks/monthlyGrocery";
import { RENTAL_HOME_HISTORY, RENTAL_HOUSE_SPACE_ID } from "@/lib/mocks/rentalHouse";
import { SPACE_ACCENT_RGB } from "@/config/spaceColors";

export type SpacePageContent = {
  title: string;
  iconSrc: string;
  /* RGB channels of the space's accent, used for the ambient header glow.
     Each space provides its own so the haze matches its icon/theme. */
  accentRgb: string;
  widgets: SpaceWidget[];
  history: HistoryItem[];
  quickStarts?: ComposerSuggestion[];
};

export const spacePages: Record<string, SpacePageContent> = {
  badan: {
    title: "بدن و سلامتی",
    iconSrc: "/images/spaces/new-icons-symbol-130/health.png",
    accentRgb: SPACE_ACCENT_RGB.badan,

    widgets: [
      { id: "heart", span: "half", component: HeartWidget, data: healthWidgetData.heart },
      { id: "movement", span: "half", component: MovementWidget, data: healthWidgetData.movement },
      { id: "steps", span: "half", component: StepsWidget, data: healthWidgetData.steps },
      { id: "sleep", span: "half", component: SleepWidget, data: healthWidgetData.sleep },
    ],
    history: healthHistory,
  },
  kharid: {
    title: "خرید",
    iconSrc: "/images/spaces/new-icons-symbol-130/shopping.png",
    accentRgb: SPACE_ACCENT_RGB.kharid,

    widgets: [
      { id: "purchaseOpportunity", span: "half", component: PurchaseOpportunityWidget, data: purchaseOpportunityData },
      { id: "shoppingList", span: "half", component: ShoppingListWidget, data: shoppingListData },
    ],
    history: shoppingHistory,
  },
  "kharid-supermarketi": {
    title: "خرید روزمره",
    iconSrc: "/images/spaces/new-icons-symbol-130/grocery.png",
    accentRgb: SPACE_ACCENT_RGB["kharid-supermarketi"],

    widgets: [
      {
        id: "monthlyList",
        span: "half",
        component: MonthlyListNoteWidget,
        data: groceryMonthlyList,
      },
      {
        id: "smartReorder",
        span: "half",
        component: SmartReorderWidget,
        data: { title: "وقت خرید دوباره", items: groceryReorderItems },
      },
    ],
    history: groceryHomeHistory,
  },
  "modiriat-mali": {
    title: "سرمایه‌گذاری",
    iconSrc: "/images/spaces/new-icons-symbol-130/finance.png",
    accentRgb: SPACE_ACCENT_RGB["modiriat-mali"],

    /* Rendered entirely by FinanceSpaceHome (tab chips + panels) — see page.tsx. */
    widgets: [],
    history: [],
  },
  [RENTAL_HOUSE_SPACE_ID]: {
    title: "اجاره خونه",
    iconSrc: "/images/spaces/new-icons-symbol-130/house.png",
    accentRgb: SPACE_ACCENT_RGB[RENTAL_HOUSE_SPACE_ID],

    widgets: [],
    history: RENTAL_HOME_HISTORY,
  },
};
