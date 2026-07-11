"use client";

import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import { NumericText } from "@/components/NumericText";
import { AssetValueChart } from "@/components/widgets/finance/AssetValueChart";
import { faNum, formatTomanCompact } from "@/lib/faNum";
import { PORTFOLIO_VALUE_DATA } from "@/lib/mocks/financeDashboard";
import { TOP_HOLDINGS } from "@/lib/mocks/financeAssets";
import tabStyles from "./tabs.module.css";
import styles from "./AssetsTab.module.css";

export function AssetsTab() {
  return (
    <div className={tabStyles.stack}>
      <AssetValueChart data={PORTFOLIO_VALUE_DATA} />

      <div className={tabStyles.card}>
        <h2 className={tabStyles.heading}>دارایی‌های برتر</h2>
        <div className={styles.list}>
          {TOP_HOLDINGS.map((holding) => {
            const isUp = holding.changePercentage >= 0;
            return (
              <div key={holding.id} className={styles.row}>
                <span className={styles.dot} style={{ background: holding.color }} aria-hidden />
                <span className={styles.label}>{holding.label}</span>
                <span className={`${styles.changePill} ${isUp ? styles.changeUp : styles.changeDown}`}>
                  {isUp ? <ArrowUp2 size={10} color="currentColor" /> : <ArrowDown2 size={10} color="currentColor" />}
                  <NumericText>{faNum(Math.abs(holding.changePercentage))}٪</NumericText>
                </span>
                <span className={styles.amount}>
                  <NumericText>{formatTomanCompact(holding.amount)}</NumericText>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
