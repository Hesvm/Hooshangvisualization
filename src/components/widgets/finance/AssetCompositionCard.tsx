"use client";

import { DonutChart } from "@/components/charts/DonutChart";
import { NumericText } from "@/components/NumericText";
import { faNum } from "@/lib/faNum";
import type { DistributionSlice } from "@/types/finance";
import styles from "./AssetCompositionCard.module.css";

type AssetCompositionCardProps = {
  slices: DistributionSlice[];
};

export function AssetCompositionCard({ slices }: AssetCompositionCardProps) {
  const dominant = slices.reduce((max, slice) => (slice.percentage > max.percentage ? slice : max), slices[0]);
  const chartSlices = slices.map((slice) => ({
    id: slice.category,
    percentage: slice.percentage,
    color: slice.color,
  }));

  return (
    <section className={styles.card}>
      <div className={styles.headRow}>
        <h2 className={styles.heading}>ترکیب دارایی‌های شما</h2>
      </div>

      <div className={styles.chartRow}>
        <DonutChart
          slices={chartSlices}
          size={128}
          centerContent={
            <span className={styles.centerValue}>
              <span className={styles.centerLabel}>{dominant.label}</span>
              <span className={styles.centerShare}>
                سهم <NumericText>{faNum(dominant.percentage)}٪</NumericText>
              </span>
            </span>
          }
        />
      </div>

      <div className={styles.legend}>
        {slices.map((slice) => (
          <div key={slice.category} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: slice.color }} aria-hidden />
            <span className={styles.legendLabel}>{slice.label}</span>
            <span className={styles.legendPercentage}>
              <NumericText>{faNum(slice.percentage)}٪</NumericText>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
