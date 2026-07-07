"use client";

import styles from "./ChipRow.module.css";

export type Chip = { id: string; label: string };

type ChipRowProps = {
  chips: Chip[];
  /** ids already answered/used — rendered dim and inert, never re-triggerable. */
  doneIds?: string[];
  /** id to visually emphasize as the primary action in the row. */
  primaryId?: string;
  onPick: (id: string) => void;
};

export function ChipRow({ chips, doneIds = [], primaryId, onPick }: ChipRowProps) {
  return (
    <div className={styles.row}>
      {chips.map((chip) => {
        const done = doneIds.includes(chip.id);
        return (
          <button
            key={chip.id}
            type="button"
            className={`${styles.chip} ${chip.id === primaryId ? styles.chipPrimary : ""} ${done ? styles.chipDone : ""}`}
            disabled={done}
            onClick={() => !done && onPick(chip.id)}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
