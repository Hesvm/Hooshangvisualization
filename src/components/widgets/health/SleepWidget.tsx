import type { SleepData } from "@/lib/mocks/health";
import shared from "@/components/widgets/shared.module.css";
import styles from "./HealthWidgets.module.css";

export function SleepWidget({ data }: { data: unknown }) {
  const d = data as SleepData;

  return (
    <div className={`${shared.card} ${styles.sleep}`}>
      <div className={styles.visualZone}>
        <div className={styles.moon} aria-hidden />
        <div className={styles.sleepCenter}>
          <span className={styles.sleepValue}>۶۱</span>
          <span className={styles.sleepQuality}>{d.quality}</span>
        </div>
      </div>

      <div className={styles.metaZone}>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>خواب</span>
          <span className={`${styles.metaValue} ${styles.valueWhite}`}>{d.sleepDuration}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>در تخت</span>
          <span className={`${styles.metaValue} ${styles.valueWhite}`}>{d.inBed}</span>
        </div>
      </div>
    </div>
  );
}
