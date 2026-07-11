"use client";

import { useState } from "react";
import { NumericText } from "@/components/NumericText";
import { faNum, formatTomanCompact } from "@/lib/faNum";
import type { PortfolioRiskAnalysis, PortfolioValueData, PortfolioValueRange } from "@/types/finance";
import { PortfolioValueChart } from "./PortfolioValueChart";
import { PortfolioRiskCard } from "./PortfolioRiskCard";
import styles from "./FinanceSection.module.css";

type FinanceSectionProps = {
  valueData: PortfolioValueData;
  riskData: PortfolioRiskAnalysis;
};

const RANGE_TABS: { id: PortfolioValueRange; label: string }[] = [
  { id: "detail", label: "تفاصیل بیشتر" },
  { id: "7d", label: "۷ روز" },
  { id: "24h", label: "۲۴ ساعت" },
];

export function FinanceSection({ valueData, riskData }: FinanceSectionProps) {
  const [activeRange, setActiveRange] = useState<PortfolioValueRange>("7d");
  const series = valueData.series[activeRange];
  const isUp = series.changePercentage >= 0;

  return (
    <section className={styles.section}>
      <div className={styles.valueCard}>
        <div className={styles.valueHeader}>
          <div className={styles.totals}>
            <span className={styles.totalToman}>
              <NumericText>{formatTomanCompact(valueData.totalValueToman)}</NumericText>
            </span>
            <span className={styles.totalUsd}>
              <NumericText>${faNum(valueData.totalValueUsd.toFixed(2))}</NumericText>
            </span>
          </div>
          <span className={`${styles.changePill} ${isUp ? styles.changeUp : styles.changeDown}`}>
            <NumericText>
              {isUp ? "+" : ""}
              {faNum(series.changePercentage)}٪
            </NumericText>
          </span>
        </div>

        <PortfolioValueChart series={series} />

        <div className={styles.tabs}>
          {RANGE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeRange === tab.id ? styles.tabActive : ""}`}
              onClick={() => setActiveRange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <PortfolioRiskCard data={riskData} />
    </section>
  );
}
