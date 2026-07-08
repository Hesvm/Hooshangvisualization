"use client";

import type { CSSProperties } from "react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { jalaliMonthLabels, type DayActivity } from "@/lib/mocks/shopping";
import shared from "@/components/widgets/shared.module.css";
import styles from "./ShoppingWidgets.module.css";

type PurchaseHistoryWidgetProps = {
  data: unknown;
  onOpenPurchaseAnalysis?: () => void;
};

type MonthGroupStyle = CSSProperties & {
  "--month-columns": number;
  "--month-days": number;
};

const DAYS_PER_COLUMN = 7;

export function PurchaseHistoryWidget({ data, onOpenPurchaseAnalysis }: PurchaseHistoryWidgetProps) {
  const days = data as DayActivity[];
  const handleOpenPurchaseAnalysis = onOpenPurchaseAnalysis ?? (() => undefined);
  const daysByMonth = jalaliMonthLabels.map((monthLabel, monthIndex) => ({
    monthLabel,
    days: days.filter((day) => day.jalaliMonth === monthIndex + 1),
  }));

  return (
    <div className={`${shared.card} ${styles.purchaseHistory}`}>
      <ComponentHeader
        title="تاریخچه خریدهای آنلاین شما"
        titleAs="h2"
        className={styles.purchaseHistoryHeader}
        action={
          <button
            type="button"
            className={styles.purchaseAnalysisButton}
            onClick={handleOpenPurchaseAnalysis}
          >
            تحلیل خرید
          </button>
        }
      />

      <div className={styles.dailyTimeline} aria-label="تاریخچه روزانه خریدهای آنلاین">
        {daysByMonth.map(({ monthLabel, days: monthDays }, monthIndex) => (
          <div
            key={`${monthIndex + 1}-${monthLabel}`}
            className={styles.monthGroup}
            style={
              {
                "--month-columns": Math.ceil(monthDays.length / DAYS_PER_COLUMN),
                "--month-days": monthDays.length,
              } as MonthGroupStyle
            }
          >
            <span className={styles.monthLabel}>{monthLabel}</span>

            <div className={styles.dayList}>
              {monthDays.map((day) => (
                <span
                  key={`${day.jalaliMonth}-${day.dayIndex}`}
                  className={styles.dayCell}
                  data-intensity={day.intensity}
                  data-tone={day.tone}
                  role="img"
                  aria-label={`روز ${day.dayIndex}، ${monthLabel}، ${day.activityCount} خرید`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
