"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum, formatTomanCompact } from "@/lib/faNum";
import type { SpendingData } from "@/types/finance";
import shared from "@/components/widgets/shared.module.css";
import styles from "./FinanceWidgets.module.css";

type SpendingWidgetProps = {
  data: unknown;
};

const TOP_CATEGORIES_SHOWN = 3;

export function SpendingWidget({ data }: SpendingWidgetProps) {
  const spending = data as SpendingData;
  const isIncrease = spending.previousMonthDeltaPercentage >= 0;
  const topCategories = [...spending.categories]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, TOP_CATEGORIES_SHOWN);

  return (
    <div className={`${shared.card} ${styles.spendingWidget}`}>
      <ComponentHeader
        title={`خرج ${spending.monthLabel}`}
        titleAs="h2"
        action={
          <span className={`${styles.deltaPill} ${isIncrease ? styles.deltaPillUp : styles.deltaPillDown}`}>
            {`٪${faNum(Math.abs(spending.previousMonthDeltaPercentage))} ${isIncrease ? "بیشتر" : "کمتر"} از ماه قبل`}
          </span>
        }
      />

      <div className={styles.totalRow}>
        <span className={styles.totalValue}>{formatTomanCompact(spending.total)}</span>
      </div>

      <div className={styles.categoryBar} role="img" aria-label="نسبت خرج بین دسته‌بندی‌ها">
        {spending.categories.map((category) => (
          <span
            key={category.id}
            className={styles.categorySegment}
            style={{ width: `${(category.amount / spending.total) * 100}%`, background: category.color }}
          />
        ))}
      </div>

      <div className={styles.legend}>
        {topCategories.map((category) => (
          <span key={category.id} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: category.color }} />
            {category.label}
            <span className={styles.legendAmount}>{formatTomanCompact(category.amount)}</span>
          </span>
        ))}
      </div>

      <p className={styles.insight}>{spending.insight}</p>
    </div>
  );
}
