import type { SpaceWidget } from "@/types/widget";
import type { ComposerSuggestion } from "@/types/space";
import type { HistoryItem } from "@/types/history";
import { MovementWidget } from "@/components/widgets/health/MovementWidget";
import { HeartWidget } from "@/components/widgets/health/HeartWidget";
import { SleepWidget } from "@/components/widgets/health/SleepWidget";
import { StepsWidget } from "@/components/widgets/health/StepsWidget";
import { PurchaseHistoryWidget } from "@/components/widgets/shopping/PurchaseHistoryWidget";
import { ShoppingListWidget } from "@/components/widgets/shopping/ShoppingListWidget";
import { YourItemsWidget } from "@/components/widgets/shopping/YourItemsWidget";
import { MonthlyListNoteWidget, SmartReorderWidget } from "@/components/widgets/grocery/GroceryWidgets";
import { SpendingWidget } from "@/components/widgets/finance/SpendingWidget";
import { healthWidgetData, healthHistory } from "@/lib/mocks/health";
import { purchaseDayActivity, shoppingListData, yourItemsData, shoppingHistory } from "@/lib/mocks/shopping";
import { groceryHomeHistory, groceryMonthlyList, groceryReorderItems } from "@/lib/mocks/monthlyGrocery";
import { SPENDING_DATA } from "@/lib/mocks/spending";

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
    accentRgb: "232, 56, 79", // soft pink, from the heart icon

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
    accentRgb: "80, 130, 220", // soft blue, from the shopping icon

    widgets: [
      { id: "purchaseHistory", span: "full", component: PurchaseHistoryWidget, data: purchaseDayActivity },
      { id: "yourItems", span: "half", component: YourItemsWidget, data: yourItemsData },
      { id: "shoppingList", span: "half", component: ShoppingListWidget, data: shoppingListData },
    ],
    history: shoppingHistory,
  },
  "kharid-supermarketi": {
    title: "خرید روزمره",
    iconSrc: "/images/spaces/new-icons-symbol-130/grocery.png",
    accentRgb: "245, 112, 34", // restrained grocery orange

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
    accentRgb: "26, 158, 107", // finance green, from the success token

    widgets: [{ id: "spending", span: "full", component: SpendingWidget, data: SPENDING_DATA }],
    history: [],
  },
};
