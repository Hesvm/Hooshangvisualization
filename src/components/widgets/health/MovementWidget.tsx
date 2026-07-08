import { Running } from "@/components/icons/line";
import { ComponentHeader } from "@/components/ComponentHeader";
import type { MovementData } from "@/lib/mocks/health";
import { NumericText } from "@/components/NumericText";
import shared from "@/components/widgets/shared.module.css";
import styles from "./HealthWidgets.module.css";

export function MovementWidget({ data }: { data: unknown }) {
  const d = data as MovementData;

  return (
    <div className={`${shared.card} ${styles.movement}`}>
      <ComponentHeader
        title="تحرک"
        tone="light"
        className={styles.widgetHeader}
        action={<Running size={16} strokeWidth={2} className={styles.movementIcon} />}
      />

      <svg viewBox="0 0 100 100" className={styles.rings} aria-hidden>
        <circle cx="50" cy="50" r="42" stroke="#3d3d42" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="#E5384F"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 42}
          strokeDashoffset={2 * Math.PI * 42 * (1 - 0.68)}
          transform="rotate(-90 50 50)"
        />
        <circle cx="50" cy="50" r="31" stroke="#2b2b2f" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="31"
          stroke="#8CE64B"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 31}
          strokeDashoffset={2 * Math.PI * 31 * (1 - 0.88)}
          transform="rotate(-90 50 50)"
        />
        <circle cx="50" cy="50" r="20" stroke="#1f2a2c" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="20"
          stroke="#33D6D6"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 20}
          strokeDashoffset={2 * Math.PI * 20 * (1 - 0.83)}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <p className={`${styles.value} ${styles.valueLight}`}>{d.calories}</p>
      <p className={styles.subValue}>از {d.calorieGoal} کالری</p>

      <div className={styles.statRows}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>ورزش</span>
          <span className={styles.statValueGreen}>
            <NumericText>{d.exerciseMinutes}</NumericText> دقیقه
          </span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>ایستادن</span>
          <span className={styles.statValueCyan}>
            <NumericText>{d.standHours}</NumericText> ساعت
          </span>
        </div>
      </div>
    </div>
  );
}
