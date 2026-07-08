"use client";

import styles from "./ChipRow.module.css";

export type Chip = { id: string; label: string };

type ChipRowProps = {
  chips: Chip[];
  /** ids already answered/used — rendered dim and inert, never re-triggerable. */
  doneIds?: string[];
  /** id to visually emphasize as the primary action in the row. */
  primaryId?: string;
  /** id to mark as the currently selected view/filter choice. */
  activeId?: string;
  ariaLabel?: string;
  onPick: (id: string) => void;
};

const MAX_VISIBLE_CHIPS = 3;

export function ChipRow({ chips, doneIds = [], primaryId, activeId, ariaLabel, onPick }: ChipRowProps) {
  const visibleChips = chips.slice(0, MAX_VISIBLE_CHIPS);

  return (
    <div className={styles.row} role={ariaLabel ? "group" : undefined} aria-label={ariaLabel}>
      {visibleChips.map((chip) => {
        const done = doneIds.includes(chip.id);
        const active = chip.id === activeId;
        return (
          <button
            key={chip.id}
            type="button"
            className={`${styles.chip} ${chip.id === primaryId || active ? styles.chipPrimary : ""} ${done ? styles.chipDone : ""}`}
            disabled={done}
            aria-pressed={activeId ? active : undefined}
            onClick={() => !done && onPick(chip.id)}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
