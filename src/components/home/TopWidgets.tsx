import { WidgetGrid } from "@/components/WidgetGrid";
import { HeartWidget } from "@/components/widgets/health/HeartWidget";
import { MovementWidget } from "@/components/widgets/health/MovementWidget";
import { healthWidgetData } from "@/lib/mocks/health";
import type { SpaceWidget } from "@/types/widget";

const TOP_WIDGETS: SpaceWidget[] = [
  { id: "heart", span: "half", component: HeartWidget, data: healthWidgetData.heart },
  { id: "movement", span: "half", component: MovementWidget, data: healthWidgetData.movement },
];

export function TopWidgets() {
  return <WidgetGrid widgets={TOP_WIDGETS} />;
}
