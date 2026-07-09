"use client";

import { RENTAL_VIBE_OPTIONS } from "@/lib/mocks/rentalHouse";
import styles from "./RentalVibeSelector.module.css";

type RentalVibeSelectorProps = {
  vibeId: string;
  onChange: (id: string) => void;
};

export function RentalVibeSelector({ vibeId, onChange }: RentalVibeSelectorProps) {
  return (
    <div className={styles.grid}>
      {RENTAL_VIBE_OPTIONS.map((vibe) => {
        const selected = vibeId === vibe.id;
        return (
          <button
            key={vibe.id}
            type="button"
            className={`${styles.card} ${selected ? styles.cardSelected : ""}`}
            style={{ background: vibe.gradient }}
            aria-pressed={selected}
            onClick={() => onChange(vibe.id)}
          >
            <span className={styles.labelPill}>{vibe.label}</span>
          </button>
        );
      })}
    </div>
  );
}
