"use client";

import { Add, Eye } from "iconsax-react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { NumericText } from "@/components/NumericText";
import { faNum } from "@/lib/faNum";
import type { PortfolioValueData } from "@/types/finance";
import styles from "./AssetValueChart.module.css";

type AssetValueChartProps = {
  data: PortfolioValueData;
};

export function AssetValueChart({ data }: AssetValueChartProps) {
  const chartPoints = data.series["7d"].points.map((point) => ({ label: point.label, value: point.value }));
  const dayChange = data.series["24h"].changePercentage;
  const weekChange = data.series["7d"].changePercentage;
  const millionsValue = Math.round((data.totalValueToman / 1_000_000) * 10) / 10;

  return (
    <section className={styles.card}>
      <div className={styles.headRow}>
        <h2 className={styles.heading}>ارزش دارایی‌های شما</h2>
        <div className={styles.headActions}>
          <button type="button" className={styles.headActionButton} aria-label="مشاهده جزئیات">
            <Eye variant="Linear" size={16} color="currentColor" />
          </button>
          <button type="button" className={styles.headActionButton} aria-label="افزودن دارایی">
            <Add variant="Linear" size={16} color="currentColor" />
          </button>
        </div>
      </div>

      <div className={styles.valueRow}>
        <NumericText className={styles.valueToman}>{faNum(millionsValue)}</NumericText>
        <span className={styles.valueUnit}>میلیون تومان</span>
        <NumericText className={styles.valueUsd}>${faNum(data.totalValueUsd.toFixed(2))}</NumericText>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartPoints} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="assetValueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin - 4", "dataMax + 4"]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-success)"
              strokeWidth={2}
              fill="url(#assetValueGradient)"
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 4, fill: "var(--color-danger)", stroke: "var(--color-white)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.footRow}>
        <button type="button" className={styles.detailsChip}>
          جزئیات بیشتر
        </button>
        <span className={styles.statPill}>
          <span className={styles.statPeriod}>۷ روز</span>
          <span className={`${styles.statChange} ${weekChange >= 0 ? styles.statChangeUp : styles.statChangeDown}`}>
            <NumericText>
              {weekChange >= 0 ? "+" : ""}
              {faNum(weekChange)}٪
            </NumericText>
          </span>
        </span>
        <span className={styles.statPill}>
          <span className={styles.statPeriod}>۲۴ ساعت</span>
          <span className={`${styles.statChange} ${dayChange >= 0 ? styles.statChangeUp : styles.statChangeDown}`}>
            <NumericText>
              {dayChange >= 0 ? "+" : ""}
              {faNum(dayChange)}٪
            </NumericText>
          </span>
        </span>
      </div>
    </section>
  );
}
