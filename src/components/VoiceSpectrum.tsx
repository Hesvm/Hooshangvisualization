"use client";

import { SPECTRUM_BAR_COUNT } from "@/hooks/useAudioSpectrum";
import styles from "./VoiceSpectrum.module.css";

type VoiceSpectrumProps = {
  samples: number[];
};

/**
 * Decorative amplitude spectrum — index 0 in `samples` is always the newest
 * reading. Rendered reversed under an explicit `dir="ltr"` so the newest bar
 * always lands on the visual right edge, regardless of page RTL direction.
 */
export function VoiceSpectrum({ samples }: VoiceSpectrumProps) {
  const bars = [...samples].reverse();
  const lastIndex = SPECTRUM_BAR_COUNT - 1;

  return (
    <div className={styles.spectrum} dir="ltr" aria-hidden>
      {bars.map((height, i) => {
        const age = lastIndex - i;
        const opacity = 1 - (age / lastIndex) * 0.68;
        return <span key={i} className={styles.bar} style={{ height: `${height}px`, opacity }} />;
      })}
    </div>
  );
}
