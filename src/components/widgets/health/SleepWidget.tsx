import { Moon } from "@/components/icons/line";
import type { SleepData } from "@/lib/mocks/health";
import shared from "@/components/widgets/shared.module.css";
import styles from "./HealthWidgets.module.css";

export function SleepWidget({ data }: { data: unknown }) {
  const d = data as SleepData;

  return (
    <div className={`${shared.card} ${styles.sleep}`}>
      <span className={`${shared.iconTopRight} ${styles.sleepTopIcon}`}>
        <Moon size={20} strokeWidth={2} />
      </span>

      <p className={`${styles.label} ${styles.labelLight}`}>خواب</p>

      <div className={styles.sleepScoreCircle}>
        <span className={styles.sleepScore}>{d.score}</span>
        <span className={styles.sleepQuality}>{d.quality}</span>
      </div>

      <div className={styles.statRows}>
        <div className={styles.statRow}>
          <span className={`${styles.statLabel} ${styles.statLabelLight}`}>مدت خواب</span>
          <span className={styles.statValueLight}>{d.duration}</span>
        </div>
        <div className={styles.statRow}>
          <span className={`${styles.statLabel} ${styles.statLabelLight}`}>کیفیت خواب</span>
          <span className={styles.statValueLight}>{d.quality}</span>
        </div>
      </div>
    </div>
  );
}
