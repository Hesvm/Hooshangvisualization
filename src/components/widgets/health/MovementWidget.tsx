import Image from "next/image";
import { Star1 } from "iconsax-react";
import type { MovementData } from "@/lib/mocks/health";
import shared from "@/components/widgets/shared.module.css";
import styles from "./HealthWidgets.module.css";

export function MovementWidget({ data }: { data: unknown }) {
  const d = data as MovementData;

  return (
    <div className={`${shared.card} ${styles.movement}`}>
      <div className={styles.starBadge}>
        <Star1 size={11} variant="Bold" color="#3a2a00" />
      </div>

      <div className={styles.visualZone}>
        <Image
          src="/images/health/calorie-chart.svg"
          alt=""
          width={64}
          height={64}
          className={styles.rings}
        />
      </div>

      <div className={styles.metaZone}>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>ورزش</span>
          <span className={`${styles.metaValue} ${styles.valueGreen}`}>
            {d.exerciseValue}/{d.exerciseGoal}
          </span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>ایستادن</span>
          <span className={`${styles.metaValue} ${styles.valueCyan}`}>
            {d.standValue}/{d.standGoal}
          </span>
        </div>
      </div>
    </div>
  );
}
