"use client";

import { Danger, InfoCircle, TickCircle } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import type { InsightSeverity, PortfolioInsight } from "@/types/finance";
import styles from "./PortfolioInsights.module.css";

type PortfolioInsightsProps = { insights: PortfolioInsight[] };

const SEVERITY_ICON: Record<InsightSeverity, typeof Danger> = {
  high: Danger,
  medium: InfoCircle,
  low: TickCircle,
};

export function PortfolioInsights({ insights }: PortfolioInsightsProps) {
  return (
    <div className={styles.card}>
      <ComponentHeader title="نکات تحلیل" className={styles.header} />
      <div className={styles.list}>
        {insights.map((insight) => {
          const Icon = SEVERITY_ICON[insight.severity];
          const iconClass =
            insight.severity === "high" ? styles.iconHigh : insight.severity === "medium" ? styles.iconMedium : styles.iconLow;
          return (
            <div key={insight.id} className={styles.item}>
              <span className={`${styles.iconSlot} ${iconClass}`}>
                <Icon variant="Bold" size={16} color="currentColor" />
              </span>
              <div className={styles.itemBody}>
                <div className={styles.itemTitle}>{insight.title}</div>
                <p className={styles.itemText}>{insight.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
