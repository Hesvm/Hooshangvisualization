"use client";

import { RangeSlider } from "@/components/conversation/shopping/RangeSlider";
import {
  RENTAL_BUDGET_PRESETS,
  RENTAL_DEPOSIT_RANGE,
  RENTAL_RENT_RANGE,
  type BudgetPreset,
} from "@/lib/mocks/rentalHouse";
import { formatTomanCompact } from "@/lib/faNum";
import styles from "./RentalBudgetStep.module.css";

const PRESET_DELTAS: Record<BudgetPreset, { depositFactor: number; rentFactor: number }> = {
  "deposit-heavy": { depositFactor: 1.25, rentFactor: 0.75 },
  balanced: { depositFactor: 1, rentFactor: 1 },
  "rent-light": { depositFactor: 0.75, rentFactor: 1.25 },
};

type RentalBudgetStepProps = {
  depositBudget: number;
  rentBudget: number;
  budgetPreset: BudgetPreset | null;
  onChange: (patch: { depositBudget?: number; rentBudget?: number; budgetPreset?: BudgetPreset }) => void;
};

export function RentalBudgetStep({ depositBudget, rentBudget, budgetPreset, onChange }: RentalBudgetStepProps) {
  function pickPreset(preset: BudgetPreset) {
    const { depositFactor, rentFactor } = PRESET_DELTAS[preset];
    const baseDeposit = (RENTAL_DEPOSIT_RANGE.min + RENTAL_DEPOSIT_RANGE.max) / 2;
    const baseRent = (RENTAL_RENT_RANGE.min + RENTAL_RENT_RANGE.max) / 2;
    onChange({
      budgetPreset: preset,
      depositBudget: clamp(baseDeposit * depositFactor, RENTAL_DEPOSIT_RANGE),
      rentBudget: clamp(baseRent * rentFactor, RENTAL_RENT_RANGE),
    });
  }

  return (
    <div>
      <div className={styles.field}>
        <div className={styles.fieldHead}>
          <span className={styles.label}>سقف رهن</span>
          <span className={styles.value}>{formatTomanCompact(depositBudget)}</span>
        </div>
        <RangeSlider
          value={depositBudget}
          min={RENTAL_DEPOSIT_RANGE.min}
          max={RENTAL_DEPOSIT_RANGE.max}
          step={RENTAL_DEPOSIT_RANGE.step}
          ariaLabel="سقف رهن"
          onChange={(value) => onChange({ depositBudget: value })}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldHead}>
          <span className={styles.label}>سقف اجاره ماهانه</span>
          <span className={styles.value}>{formatTomanCompact(rentBudget)}</span>
        </div>
        <RangeSlider
          value={rentBudget}
          min={RENTAL_RENT_RANGE.min}
          max={RENTAL_RENT_RANGE.max}
          step={RENTAL_RENT_RANGE.step}
          ariaLabel="سقف اجاره ماهانه"
          onChange={(value) => onChange({ rentBudget: value })}
        />
      </div>

      <div className={styles.presetRow}>
        {RENTAL_BUDGET_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`${styles.preset} ${budgetPreset === preset.id ? styles.presetSelected : ""}`}
            onClick={() => pickPreset(preset.id)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function clamp(value: number, range: { min: number; max: number }): number {
  return Math.min(range.max, Math.max(range.min, Math.round(value)));
}
