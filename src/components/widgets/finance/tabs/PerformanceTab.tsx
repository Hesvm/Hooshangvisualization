"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { NumericText } from "@/components/NumericText";
import { faNum } from "@/lib/faNum";
import { PERFORMANCE_PERIODS } from "@/lib/mocks/financePerformance";
import tabStyles from "./tabs.module.css";
import styles from "./PerformanceTab.module.css";

export function PerformanceTab() {
  return (
    <div className={tabStyles.stack}>
      <div className={styles.grid}>
        {PERFORMANCE_PERIODS.map((period) => {
          const isUp = period.changePercentage >= 0;
          const chartData = period.points.map((value, index) => ({ index, value }));
          const color = isUp ? "var(--color-success)" : "var(--color-danger)";
          return (
            <div key={period.id} className={styles.card}>
              <span className={styles.label}>{period.label}</span>
              <span className={`${styles.change} ${isUp ? styles.changeUp : styles.changeDown}`}>
                <NumericText>
                  {isUp ? "+" : ""}
                  {faNum(period.changePercentage)}٪
                </NumericText>
              </span>
              <div className={styles.sparkline}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
                    <YAxis hide domain={["dataMin", "dataMax"]} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive
                      animationDuration={700}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
