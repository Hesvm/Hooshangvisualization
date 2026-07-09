"use client";

import { TickCircle } from "iconsax-react";
import styles from "./RentalChoiceStep.module.css";

export type ChoiceOption = { id: string; label: string };

type RentalChoiceStepProps = {
  options: ChoiceOption[];
  selectedIds: string[];
  multiple?: boolean;
  onChange: (ids: string[]) => void;
};

/** Shared single/multi-select option list, reused for the building-age, floor-material,
 * must-have, move-in-timing, and deal-breaker questionnaire steps — same visual language
 * as the option buttons already used in the grocery/laptop questionnaires. */
export function RentalChoiceStep({ options, selectedIds, multiple = false, onChange }: RentalChoiceStepProps) {
  function pick(id: string) {
    if (!multiple) {
      onChange([id]);
      return;
    }
    onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  }

  return (
    <div className={styles.optionStack}>
      {options.map((option) => {
        const selected = selectedIds.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            className={`${styles.optionButton} ${selected ? styles.optionSelected : ""}`}
            aria-pressed={selected}
            onClick={() => pick(option.id)}
          >
            <span className={styles.optionLabel}>{option.label}</span>
            {multiple && selected && <TickCircle variant="Bold" size={18} color="currentColor" />}
          </button>
        );
      })}
    </div>
  );
}
