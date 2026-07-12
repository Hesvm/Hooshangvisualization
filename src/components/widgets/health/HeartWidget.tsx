"use client";

import { useEffect, useState } from "react";
import type { HeartData } from "@/lib/mocks/health";
import { faNum } from "@/lib/faNum";
import shared from "@/components/widgets/shared.module.css";
import styles from "./HealthWidgets.module.css";

/** Small live-reading jitter so the bpm feels like it's updating, not just a static mock value. */
const BPM_JITTER = [0, 1, -1, 2, 0, -1];

export function HeartWidget({ data }: { data: unknown }) {
  const d = data as HeartData;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4500);
    return () => clearInterval(id);
  }, []);

  const liveBpm = d.bpm + BPM_JITTER[tick % BPM_JITTER.length];

  return (
    <div className={`${shared.card} ${styles.heart}`}>
      <div className={styles.visualZone}>
        <svg viewBox="0 0 78 70" className={styles.heartShape} aria-hidden>
          <path
            d="M41.418 69.069C40.092 69.537 37.908 69.537 36.582 69.069C25.272 65.208 0 49.101 0 21.801C0 9.75 9.711 0 21.684 0C28.782 0 35.061 3.432 39 8.736C42.939 3.432 49.257 0 56.316 0C68.289 0 78 9.75 78 21.801C78 49.101 52.728 65.208 41.418 69.069Z"
            fill="#fbeef1"
          />
        </svg>
        <div className={styles.heartCenter}>
          <span className={styles.heartValue}>{faNum(liveBpm)}</span>
          <span className={styles.heartSub}>تپش / دقیقه</span>
        </div>
      </div>

      <div className={styles.metaZone}>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>ضربان استراحت</span>
          <span className={`${styles.metaValue} ${styles.valueWhite}`}>{d.restingBpm} bpm</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>محدوده</span>
          <span className={`${styles.metaValue} ${styles.valueWhite}`}>
            {d.rangeLow}–{d.rangeHigh} bpm
          </span>
        </div>
      </div>
    </div>
  );
}
