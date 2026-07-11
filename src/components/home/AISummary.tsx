import { MagicStar } from "iconsax-react";
import type { AISummaryInsight } from "@/types/home";
import styles from "./AISummary.module.css";

type AISummaryProps = {
  insights: AISummaryInsight[];
};

export function AISummary({ insights }: AISummaryProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>
        خلاصه هوشنگ
        <MagicStar size={16} variant="Bold" color="currentColor" className={styles.headingIcon} />
      </h2>

      <ul className={styles.list}>
        {insights.map((insight) => (
          <li key={insight.id} className={styles.item}>
            <span className={styles.dot} aria-hidden />
            <span className={styles.text}>{insight.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
