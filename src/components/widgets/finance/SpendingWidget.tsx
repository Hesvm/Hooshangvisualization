"use client";

import { ArrowDown2, Bag2, Car, Home2, LampCharge, ShoppingCart } from "iconsax-react";
import { formatTomanCompact } from "@/lib/faNum";
import type { SpendingData } from "@/types/finance";
import shared from "@/components/widgets/shared.module.css";
import styles from "./FinanceWidgets.module.css";

type SpendingWidgetProps = {
  data: unknown;
};

const CATEGORY_COLORS = ["#174f43", "#287961", "#6abf9e", "#92d9d2", "#57a6dd", "#2377d9"];

const CATEGORY_ICON = {
  groceries: ShoppingCart,
  bills: LampCharge,
  shopping: Bag2,
  transport: Car,
  entertainment: Home2,
};

export function SpendingWidget({ data }: SpendingWidgetProps) {
  const spending = data as SpendingData;
  const categories = [...spending.categories]
    .sort((a, b) => b.amount - a.amount)
    .map((category, index) => ({ ...category, color: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }));

  return (
    <div className={`${shared.card} ${styles.spendingWidget}`}>
      <div className={styles.spendingHeader}>
        <h2 className={styles.spendingTitle}>خرج این ماه</h2>
        <span className={styles.totalValue}>{formatTomanCompact(spending.total)}</span>
      </div>

      <button type="button" className={styles.monthPill} aria-label="انتخاب ماه">
        <span>{spending.monthLabel}</span>
        <ArrowDown2 variant="Linear" size={13} color="currentColor" />
      </button>

      <div className={styles.spendingDivider} />

      <div className={styles.categoryBar} role="img" aria-label="نسبت خرج بین دسته‌بندی‌ها">
        {categories.map((category) => (
          <span
            key={category.id}
            className={styles.categorySegment}
            style={{ width: `${(category.amount / spending.total) * 100}%`, background: category.color }}
          />
        ))}
      </div>

      <div className={styles.categoryRows}>
        {categories.slice(0, 5).map((category) => {
          const Icon = CATEGORY_ICON[category.id as keyof typeof CATEGORY_ICON] ?? Bag2;
          return (
            <div key={category.id} className={styles.categoryRow}>
              <span className={styles.categoryIcon} style={{ color: category.color }} aria-hidden>
                <Icon variant="Linear" size={16} color="currentColor" />
              </span>
              <span className={styles.categoryLabel}>{category.label}</span>
              <span
                className={styles.categoryMiniLine}
                style={{ ["--category-line-color" as string]: category.color }}
                aria-hidden
              />
              <span className={styles.categoryAmount}>{formatTomanCompact(category.amount)}</span>
            </div>
          );
        })}
      </div>

      <p className={styles.insight}>{spending.insight}</p>
    </div>
  );
}
