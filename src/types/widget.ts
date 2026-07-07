import type { ComponentType } from "react";

export type WidgetSpan = "full" | "half";

export type SpaceWidget = {
  id: string;
  span: WidgetSpan;
  component: ComponentType<{ data: unknown }>;
  data: unknown;
};
