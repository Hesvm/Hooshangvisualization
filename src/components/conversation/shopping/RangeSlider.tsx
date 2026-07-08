"use client";

import styles from "./RangeSlider.module.css";

type RangeSliderProps = {
  value: number;
  min: number;
  max: number;
  /** Discrete allowed values (e.g. month options). If provided, `step` is ignored and the slider snaps to the nearest one. */
  steps?: readonly number[];
  step?: number;
  /** Overrides the track/thumb fill color (defaults to --color-primary). */
  accentColor?: string;
  ariaLabel: string;
  onChange: (value: number) => void;
};

function nearestStep(value: number, steps: readonly number[]): number {
  return steps.reduce((closest, step) => (Math.abs(step - value) < Math.abs(closest - value) ? step : closest));
}

export function RangeSlider({ value, min, max, steps, step = 1, accentColor, ariaLabel, onChange }: RangeSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  function handleInput(raw: number) {
    onChange(steps ? nearestStep(raw, steps) : raw);
  }

  return (
    <div className={styles.wrap}>
      <input
        type="range"
        className={styles.input}
        aria-label={ariaLabel}
        min={min}
        max={max}
        step={steps ? 1 : step}
        value={value}
        style={{
          ["--fill-percent" as string]: `${percent}%`,
          ...(accentColor ? { ["--fill-color" as string]: accentColor } : {}),
        }}
        onChange={(e) => handleInput(Number(e.target.value))}
      />
    </div>
  );
}
