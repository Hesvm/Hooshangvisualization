import type { StepsData } from "@/lib/mocks/health";
import shared from "@/components/widgets/shared.module.css";
import styles from "./HealthWidgets.module.css";

export function StepsWidget({ data }: { data: unknown }) {
  const d = data as StepsData;
  const circumference = 2 * Math.PI * 42;
  const arcFraction = 0.78;
  const offset = circumference * (1 - (arcFraction * d.percent) / 100);

  return (
    <div className={`${shared.card} ${styles.steps}`}>
      <div className={styles.visualZone}>
        <svg viewBox="0 0 100 100" className={styles.gauge} aria-hidden>
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * arcFraction} ${circumference}`}
            transform="rotate(120 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(120 50 50)"
          />
        </svg>
        <div className={styles.gaugeCenter}>
          <span className={styles.gaugeValue}>{d.count}</span>
          <span className={styles.gaugePercent}>قدم</span>
        </div>
      </div>

      <div className={styles.metaZone}>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>مسافت</span>
          <span className={`${styles.metaValue} ${styles.valueWhite}`}>{d.distanceKm} کیلومتر</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>فعالیت</span>
          <span className={`${styles.metaValue} ${styles.valueWhite}`}>{d.activeTime}</span>
        </div>
      </div>
    </div>
  );
}
