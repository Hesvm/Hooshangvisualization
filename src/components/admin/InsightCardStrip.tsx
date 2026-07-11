import type { AIInsight } from "@/types/intelligence";
import styles from "./InsightCardStrip.module.css";

type InsightCardStripProps = {
  insights: AIInsight[];
};

export function InsightCardStrip({ insights }: InsightCardStripProps) {
  if (insights.length === 0) return null;

  return (
    <div className={styles.strip}>
      {insights.map((insight) => (
        <div key={insight.id} className={styles.card}>
          <p className={styles.text}>{insight.text}</p>
          {insight.trendDelta && (
            <span
              className={`${styles.delta} ${insight.trendDelta.startsWith("-") ? styles.negative : styles.positive}`}
            >
              {insight.trendDelta}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
