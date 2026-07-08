import { Moon } from "@/components/icons/line";
import { ComponentHeader } from "@/components/ComponentHeader";
import type { SleepData } from "@/lib/mocks/health";
import { NumericRuns } from "@/components/NumericText";
import shared from "@/components/widgets/shared.module.css";
import styles from "./HealthWidgets.module.css";

export function SleepWidget({ data }: { data: unknown }) {
  const d = data as SleepData;

  return (
    <div className={`${shared.card} ${styles.sleep}`}>
      <ComponentHeader
        title="خواب"
        tone="light"
        className={styles.widgetHeader}
        action={<Moon size={16} strokeWidth={2} className={styles.sleepTopIcon} />}
      />

      <div className={styles.sleepScoreCircle}>
        <span className={styles.sleepScore}>{d.score}</span>
        <span className={styles.sleepQuality}>{d.quality}</span>
      </div>

      <div className={styles.statRows}>
        <div className={styles.statRow}>
          <span className={`${styles.statLabel} ${styles.statLabelLight}`}>مدت خواب</span>
          <span className={styles.statValueLight}>
            <NumericRuns text={d.duration} />
          </span>
        </div>
        <div className={styles.statRow}>
          <span className={`${styles.statLabel} ${styles.statLabelLight}`}>کیفیت خواب</span>
          <span className={styles.statValueLight}>{d.quality}</span>
        </div>
      </div>
    </div>
  );
}
