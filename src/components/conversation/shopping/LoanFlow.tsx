"use client";

import { useState } from "react";
import { faNum } from "@/lib/faNum";
import { minDownPayment } from "@/lib/loan";
import {
  DOWN_PAYMENT_OPTIONS,
  MONTHS_OPTIONS,
  LOAN_DOWN_PAYMENT_QUESTION,
  LOAN_MONTHS_QUESTION,
  LOAN_DISCLAIMER,
  LOAN_PRIMARY_CTA,
  LOAN_SECONDARY_CTA,
} from "@/lib/mocks/shoppingScript";
import type { LoanEstimate } from "@/types/shopping";
import styles from "./LoanFlow.module.css";

export function DownPaymentQuestion({ price, onSubmit }: { price: number; onSubmit: (amount: number) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function pick(id: string) {
    setSelected(id);
    setError(null);
    if (id === "min") return onSubmit(minDownPayment(price));
    const opt = DOWN_PAYMENT_OPTIONS.find((o) => o.id === id);
    if (opt && "value" in opt) onSubmit(opt.value);
  }

  function submitCustom() {
    const value = Number(customValue);
    if (!customValue.trim() || Number.isNaN(value) || value <= 0) {
      setError("لطفاً یک مبلغ معتبر وارد کن.");
      return;
    }
    if (value > price) {
      setError("پیش‌پرداخت نمی‌تونه از قیمت کالا بیشتر باشه.");
      return;
    }
    onSubmit(value);
  }

  return (
    <div className={styles.card}>
      <div className={styles.question}>{LOAN_DOWN_PAYMENT_QUESTION}</div>
      <div className={styles.options}>
        {DOWN_PAYMENT_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`${styles.option} ${selected === o.id ? styles.optionSelected : ""}`}
            onClick={() => pick(o.id)}
          >
            {o.label}
          </button>
        ))}
        {selected === "custom" && (
          <>
            <div className={styles.customRow}>
              <input
                className={styles.customInput}
                inputMode="numeric"
                placeholder="مبلغ به میلیون تومان"
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  setError(null);
                }}
              />
              <button type="button" className={styles.customSubmit} onClick={submitCustom}>
                تأیید
              </button>
            </div>
            {error && <div className={styles.customError}>{error}</div>}
          </>
        )}
      </div>
    </div>
  );
}

export function MonthsQuestion({ onSubmit }: { onSubmit: (months: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  function pick(months: number) {
    setSelected(months);
    onSubmit(months);
  }

  return (
    <div className={styles.card}>
      <div className={styles.question}>{LOAN_MONTHS_QUESTION}</div>
      <div className={styles.options}>
        {MONTHS_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`${styles.option} ${selected === o.value ? styles.optionSelected : ""}`}
            onClick={() => pick(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LoanResultCard({
  price,
  estimate,
  onRestart,
}: {
  price: number;
  estimate: LoanEstimate;
  onRestart: () => void;
}) {
  const [checkRequested, setCheckRequested] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.resultTitle}>برآورد اولیه پرداخت</div>

      <div className={styles.resultRow}>
        <span className={styles.resultLabel}>قیمت کالا</span>
        <span className={styles.resultValue}>{faNum(price)} میلیون تومان</span>
      </div>
      <div className={styles.resultRow}>
        <span className={styles.resultLabel}>پیش‌پرداخت</span>
        <span className={styles.resultValue}>{faNum(estimate.downPayment)} میلیون تومان</span>
      </div>
      <div className={styles.resultRow}>
        <span className={styles.resultLabel}>مبلغ اعتبار</span>
        <span className={styles.resultValue}>{faNum(estimate.creditAmount)} میلیون تومان</span>
      </div>
      <div className={styles.resultRow}>
        <span className={styles.resultLabel}>مدت بازپرداخت</span>
        <span className={styles.resultValue}>{faNum(estimate.months)} ماه</span>
      </div>
      <div className={styles.resultRow}>
        <span className={styles.resultLabel}>قسط ماهانه</span>
        <span className={`${styles.resultValue} ${styles.resultHighlight}`}>
          {faNum(estimate.monthlyInstallment)} میلیون تومان
        </span>
      </div>

      <div className={styles.disclaimer}>{LOAN_DISCLAIMER}</div>

      <div className={styles.ctaRow}>
        <button type="button" className={styles.ctaPrimary} disabled={checkRequested} onClick={() => setCheckRequested(true)}>
          {LOAN_PRIMARY_CTA}
        </button>
        <button type="button" className={styles.ctaSecondary} onClick={onRestart}>
          {LOAN_SECONDARY_CTA}
        </button>
      </div>

      {checkRequested && (
        <div className={styles.ackNote}>
          درخواستت ثبت شد. بعد از بررسی اعتبار، شرایط نهایی رو بهت اطلاع می‌دیم.
        </div>
      )}
    </div>
  );
}
