import { Shoe } from "@/components/icons/line";
import type { StepsData } from "@/lib/mocks/health";
import shared from "@/components/widgets/shared.module.css";
import styles from "./HealthWidgets.module.css";

export function StepsWidget({ data }: { data: unknown }) {
  const d = data as StepsData;

  return (
    <div className={`${shared.card} ${styles.steps}`}>
      <span className={`${shared.iconTopRight} ${styles.stepsTopIcon}`}>
        <Shoe size={20} strokeWidth={2} />
      </span>

      <p className={`${styles.label} ${styles.labelLight}`}>حرکت روزانه</p>

      <svg viewBox="0 0 100 55" className={styles.gauge} aria-hidden>
        <path
          d="M6 52a44 44 0 0 1 88 0"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M6 52a44 44 0 0 1 88 0"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={138}
          strokeDashoffset={138 * (1 - 0.75)}
        />
      </svg>
      <p className={`${styles.value} ${styles.valueLight} ${styles.gaugeValue}`}>{d.count}</p>

      <div className={styles.statRows}>
        <div className={styles.statRow}>
          <span className={`${styles.statLabel} ${styles.statLabelLight}`}>مسافت</span>
          <span className={styles.statValueLight}>{d.distanceKm} کیلومتر</span>
        </div>
        <div className={styles.statRow}>
          <span className={`${styles.statLabel} ${styles.statLabelLight}`}>فعالیت</span>
          <span className={styles.statValueLight}>{d.activeTime}</span>
        </div>
      </div>
    </div>
  );
}
