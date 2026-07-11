"use client";

import { Diagram } from "iconsax-react";
import { ChevronLeft } from "@/components/icons/line";
import { DonutChart } from "@/components/charts/DonutChart";
import { NumericText } from "@/components/NumericText";
import { faNum } from "@/lib/faNum";
import { CRYPTO_ANALYSIS_CONVERSATION_ID } from "@/lib/mocks/financeCopy";
import { PORTFOLIO_DATA } from "@/lib/mocks/portfolio";
import tabStyles from "./tabs.module.css";
import styles from "./PortfolioTab.module.css";

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

export function PortfolioTab() {
  const dominant = PORTFOLIO_DATA.distribution[0];
  const diversificationScore = 100 - PORTFOLIO_DATA.concentrationScore;

  return (
    <div className={tabStyles.stack}>
      <div className={tabStyles.card}>
        <h2 className={tabStyles.heading}>ترکیب پرتفوی کریپتو</h2>
        <div className={styles.chartRow}>
          <DonutChart
            slices={PORTFOLIO_DATA.distribution.map((slice) => ({ id: slice.category, percentage: slice.percentage, color: slice.color }))}
            size={128}
            centerContent={
              <span className={styles.centerValue}>
                <span className={styles.centerAmount}>{dominant.label}</span>
                <span className={styles.centerUnit}>
                  سهم <NumericText>{faNum(dominant.percentage)}٪</NumericText>
                </span>
              </span>
            }
          />
        </div>
        <div className={styles.legend}>
          {PORTFOLIO_DATA.distribution.map((slice) => (
            <div key={slice.category} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: slice.color }} aria-hidden />
              <span className={styles.legendLabel}>{slice.label}</span>
              <span className={styles.legendPercentage}>
                <NumericText>{faNum(slice.percentage)}٪</NumericText>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={tabStyles.card}>
        <h2 className={tabStyles.heading}>امتیازهای پرتفوی</h2>
        <div className={styles.scoreGrid}>
          <ScoreItem label="امتیاز ریسک" value={PORTFOLIO_DATA.riskScore} />
          <ScoreItem label="امتیاز تنوع" value={diversificationScore} />
          <ScoreItem label="نقدشوندگی" value={PORTFOLIO_DATA.liquidityScore} />
        </div>
      </div>

      <a href={`/spaces/modiriat-mali/conversations/${CRYPTO_ANALYSIS_CONVERSATION_ID}`} className={styles.rebalanceCard}>
        <span className={styles.rebalanceIcon} aria-hidden="true">
          <Diagram variant="Bold" size={22} color="currentColor" />
        </span>
        <span className={styles.rebalanceText}>
          <span className={styles.rebalanceTitle}>پیشنهاد بازتوزیع پرتفوی</span>
          <span className={styles.rebalanceBody}>تمرکز بالا روی بیت‌کوین و اتریوم — هوشنگ یه ترکیب متعادل‌تر پیشنهاد می‌ده.</span>
        </span>
        <span className={styles.rebalanceChevron} aria-hidden="true">
          <ChevronLeft size={18} strokeWidth={2.25} />
        </span>
      </a>
    </div>
  );
}
