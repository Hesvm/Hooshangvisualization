"use client";

import { motion } from "motion/react";
import { NumericText } from "@/components/NumericText";
import { SpendingWidget } from "@/components/widgets/finance/SpendingWidget";
import { formatTomanCompact } from "@/lib/faNum";
import { SPENDING_DATA } from "@/lib/mocks/spending";
import tabStyles from "./tabs.module.css";
import styles from "./SpendingTab.module.css";

const CATEGORY_COLORS = ["#174f43", "#287961", "#6abf9e", "#92d9d2", "#57a6dd", "#2377d9"];

export function SpendingTab() {
  const categories = [...SPENDING_DATA.categories].sort((a, b) => b.amount - a.amount);

  return (
    <div className={tabStyles.stack}>
      <SpendingWidget data={SPENDING_DATA} />

      <div className={tabStyles.card}>
        <h2 className={tabStyles.heading}>سهم هر دسته از خرج این ماه</h2>
        <div className={styles.list}>
          {categories.map((category, index) => {
            const percentage = (category.amount / SPENDING_DATA.total) * 100;
            const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
            return (
              <div key={category.id} className={styles.item}>
                <div className={styles.itemHead}>
                  <span className={styles.itemLabel}>{category.label}</span>
                  <span className={styles.itemAmount}>
                    <NumericText>{formatTomanCompact(category.amount)}</NumericText>
                  </span>
                </div>
                <div className={styles.track}>
                  <motion.div
                    className={styles.fill}
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: index * 0.05 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
