import type { SpaceWidget } from "@/types/widget";
import type { HistoryItem } from "@/types/history";
import { MovementWidget } from "@/components/widgets/health/MovementWidget";
import { HeartWidget } from "@/components/widgets/health/HeartWidget";
import { SleepWidget } from "@/components/widgets/health/SleepWidget";
import { StepsWidget } from "@/components/widgets/health/StepsWidget";
import { PurchaseHistoryWidget } from "@/components/widgets/shopping/PurchaseHistoryWidget";
import { ShoppingListWidget } from "@/components/widgets/shopping/ShoppingListWidget";
import { YourItemsWidget } from "@/components/widgets/shopping/YourItemsWidget";
import { healthWidgetData, healthHistory } from "@/lib/mocks/health";
import { purchaseDayActivity, shoppingListData, yourItemsData, shoppingHistory } from "@/lib/mocks/shopping";

export type SpacePageContent = {
  title: string;
  iconSrc: string;
  /* RGB channels of the space's accent, used for the ambient header glow.
     Each space provides its own so the haze matches its icon/theme. */
  accentRgb: string;
  widgets: SpaceWidget[];
  history: HistoryItem[];
};

export const spacePages: Record<string, SpacePageContent> = {
  badan: {
    title: "بدن و سلامتی",
    iconSrc: "/images/spaces/new-icons-symbol-130/health.png",
    accentRgb: "232, 56, 79", // soft pink, from the heart icon

    widgets: [
      { id: "movement", span: "half", component: MovementWidget, data: healthWidgetData.movement },
      { id: "heart", span: "half", component: HeartWidget, data: healthWidgetData.heart },
      { id: "sleep", span: "half", component: SleepWidget, data: healthWidgetData.sleep },
      { id: "steps", span: "half", component: StepsWidget, data: healthWidgetData.steps },
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
};
