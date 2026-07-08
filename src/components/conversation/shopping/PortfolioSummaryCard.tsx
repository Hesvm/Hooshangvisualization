"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import { DonutChart } from "@/components/charts/DonutChart";
import { NumericText } from "@/components/NumericText";
import { faNum, formatTomanCompact } from "@/lib/faNum";
import type { PortfolioData } from "@/types/finance";
import styles from "./PortfolioSummaryCard.module.css";

type PortfolioSummaryCardProps = { data: PortfolioData };

const CHART_COLORS = ["#2450E6", "#FF1F5B", "#A944F5", "#FF9B0A", "#08C789"];

function ScoreItem({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.scoreItem}>
      <div className={styles.scoreLabelRow}>
        <span className={styles.scoreLabel}>{label}</span>
        <span className={styles.scoreValue}>
          <NumericText>{faNum(value)}</NumericText>
        </span>
      </div>
      <div className={styles.scoreTrack}>
        <div className={styles.scoreFill} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function PortfolioSummaryCard({ data }: PortfolioSummaryCardProps) {
  const isProfit = data.totalProfitLoss >= 0;
  const chartSlices = data.holdings.map((holding, index) => ({
    id: holding.id,
    label: holding.name,
    percentage: holding.allocationPercentage,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div className={styles.card}>
      <ComponentHeader title="پرتفوی کریپتو" logo="/images/exchanges/bitpin.webp" logoAlt="Bitpin" className={styles.header} />

      <div className={styles.chartRow}>
        <DonutChart
          slices={chartSlices}
          size={140}
          centerContent={
            <span className={styles.centerValue}>
              <span className={styles.centerAmount}>۱.۲۸</span>
              <span className={styles.centerUnit}>میلیارد ت</span>
            </span>
          }
        />
        <div className={styles.legend}>
          {chartSlices.map((d) => (
            <div key={d.id} className={styles.legendItem}>
              <span className={styles.legendAsset}>
                <span className={styles.legendDot} style={{ background: d.color }} aria-hidden />
                <span className={styles.legendLabel}>{d.label}</span>
              </span>
              <span className={styles.legendPercentage}>
                <NumericText>{faNum(d.percentage)}٪</NumericText>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.statsRow}>
        <span className={`${styles.statPill} ${isProfit ? styles.statPillUp : styles.statPillDown}`}>
          <NumericText>
            {isProfit ? "+" : ""}
            {faNum(data.profitLossPercentage)}٪ ({formatTomanCompact(Math.abs(data.totalProfitLoss))})
          </NumericText>
        </span>
        <span className={styles.statMeta}>
          <NumericText>{faNum(data.holdingsCount)}</NumericText> دارایی | <NumericText>{faNum(data.connectedExchangeCount)}</NumericText> صرافی متصل
        </span>
      </div>

      <div className={styles.scoreGrid}>
        <ScoreItem label="نقدشوندگی" value={data.liquidityScore} />
        <ScoreItem label="تمرکز دارایی" value={data.concentrationScore} />
        <ScoreItem label="ریسک" value={data.riskScore} />
      </div>
    </div>
  );
}
