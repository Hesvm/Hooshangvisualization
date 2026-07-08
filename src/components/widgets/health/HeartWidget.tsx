import { HeartOutline } from "@/components/icons/line";
import { ComponentHeader } from "@/components/ComponentHeader";
import type { HeartData } from "@/lib/mocks/health";
import shared from "@/components/widgets/shared.module.css";
import styles from "./HealthWidgets.module.css";

export function HeartWidget({ data }: { data: unknown }) {
  const d = data as HeartData;

  return (
    <div className={`${shared.card} ${styles.heart}`}>
      <ComponentHeader
        title="قلب"
        tone="light"
        className={styles.widgetHeader}
        action={<HeartOutline size={16} strokeWidth={2} className={styles.heartTopIcon} />}
      />

      <div className={styles.heartGlyphWrap}>
        <svg viewBox="0 0 100 90" className={styles.heartGlyph} aria-hidden>
          <path
            d="M50 84S8 58 8 29.5C8 13 21 4 34 8c7 2.2 12.8 8 16 13 3.2-5 9-10.8 16-13 13-4 26 5 26 21.5C92 58 50 84 50 84Z"
            fill="rgba(255,255,255,0.16)"
          />
        </svg>
        <div className={styles.heartBpmWrap}>
          <span className={styles.heartBpm}>{d.bpm}</span>
          <span className={styles.heartBpmUnit}>bpm</span>
        </div>
      </div>

      <div className={styles.statRows}>
        <div className={styles.statRow}>
          <span className={`${styles.statLabel} ${styles.statLabelLight}`}>ضربان استراحت</span>
          <span className={styles.statValueLight}>{d.restingBpm} bpm</span>
        </div>
        <div className={styles.statRow}>
          <span className={`${styles.statLabel} ${styles.statLabelLight}`}>محدوده طبیعی</span>
          <span className={styles.statValueLight}>{d.normalRange} bpm</span>
        </div>
      </div>
    </div>
  );
}
