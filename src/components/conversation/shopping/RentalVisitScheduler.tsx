"use client";

import { useState } from "react";
import { RENTAL_VISIT_TIME_OPTIONS } from "@/lib/mocks/rentalHouse";
import styles from "./RentalVisitScheduler.module.css";

type RentalVisitSchedulerProps = {
  onConfirm: (label: string) => void;
};

export function RentalVisitScheduler({ onConfirm }: RentalVisitSchedulerProps) {
  const [customText, setCustomText] = useState("");

  return (
    <div className={styles.card}>
      <p className={styles.title}>کِی برات بهتره بازدید کنیم؟</p>
      <div className={styles.optionStack}>
        {RENTAL_VISIT_TIME_OPTIONS.map((option) => (
          <button key={option.id} type="button" className={styles.optionButton} onClick={() => onConfirm(option.label)}>
            {option.label}
          </button>
        ))}
      </div>
      <div className={styles.customRow} style={{ marginTop: 8 }}>
        <input
          className={styles.customInput}
          placeholder="یه زمان دیگه بنویس..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
        />
        <button
          type="button"
          className={styles.submitButton}
          disabled={!customText.trim()}
          onClick={() => onConfirm(customText.trim())}
        >
          ثبت
        </button>
      </div>
    </div>
  );
}
