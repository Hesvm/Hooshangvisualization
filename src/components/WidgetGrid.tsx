import type { SpaceWidget } from "@/types/widget";
import styles from "./WidgetGrid.module.css";

type WidgetGridProps = {
  widgets: SpaceWidget[];
};

export function WidgetGrid({ widgets }: WidgetGridProps) {
  return (
    <div className={styles.grid}>
      {widgets.map((widget) => {
        const Component = widget.component;
        return (
          <div key={widget.id} className={widget.span === "full" ? styles.full : styles.half}>
            <Component data={widget.data} />
          </div>
        );
      })}
    </div>
  );
}
