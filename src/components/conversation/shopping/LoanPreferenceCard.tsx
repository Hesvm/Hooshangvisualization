"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft } from "@/components/icons/line";
import { faNum, formatPersianNumber } from "@/lib/faNum";
import { Price } from "@/components/Price";
import { MIN_LOAN_AMOUNT, REPAYMENT_MONTH_OPTIONS, DEFAULT_REPAYMENT_MONTHS } from "@/lib/mocks/loanProviders";
import { RangeSlider } from "./RangeSlider";
import conversationStyles from "@/components/conversation/conversation.module.css";
import styles from "./LoanPreferenceCard.module.css";

type LoanPreferenceCardProps = {
  productPrice: number;
  initialAmount?: number;
  initialMonths?: number;
  onComplete: (amount: number, months: number) => void;
};

const EASE = [0.22, 0.61, 0.36, 1] as const;

export function LoanPreferenceCard({ productPrice, initialAmount, initialMonths, onComplete }: LoanPreferenceCardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState(initialAmount ?? productPrice);
  const [months, setMonths] = useState(initialMonths ?? DEFAULT_REPAYMENT_MONTHS);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={conversationStyles.qCard}>
      <div className={conversationStyles.qHead}>
        <span className={conversationStyles.qQuestion}>{step === 1 ? "چقدر نیاز به وام داری؟" : "چند ماهه اقساط؟"}</span>
        <span className={conversationStyles.qProgress}>{faNum(step)} / {faNum(2)}</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <div className={styles.valueDisplay}>
              <Price amount={formatPersianNumber(amount)} />
            </div>
            <RangeSlider
              value={amount}
              min={MIN_LOAN_AMOUNT}
              max={productPrice}
              step={500_000}
              ariaLabel="مبلغ وام"
              onChange={setAmount}
            />
            <div className={styles.rangeLabels}>
              <Price amount={formatPersianNumber(productPrice)} />
              <Price amount={formatPersianNumber(MIN_LOAN_AMOUNT)} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="months"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <div className={styles.valueDisplay}>{faNum(months)} ماه</div>
            <RangeSlider
              value={months}
              min={REPAYMENT_MONTH_OPTIONS[0]}
              max={REPAYMENT_MONTH_OPTIONS[REPAYMENT_MONTH_OPTIONS.length - 1]}
              steps={REPAYMENT_MONTH_OPTIONS}
              ariaLabel="مدت بازپرداخت"
              onChange={setMonths}
            />
            <div className={styles.rangeLabels}>
              <span>{faNum(REPAYMENT_MONTH_OPTIONS[REPAYMENT_MONTH_OPTIONS.length - 1])} ماه</span>
              <span>{faNum(REPAYMENT_MONTH_OPTIONS[0])} ماه</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={conversationStyles.qFooter}>
        <button
          type="button"
          className={conversationStyles.qNext}
          disabled={submitted}
          onClick={() => {
            if (step === 1) {
              setStep(2);
              return;
            }
            setSubmitted(true);
            onComplete(amount, months);
          }}
        >
          تایید
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          className={conversationStyles.qBack}
          aria-label="قبلی"
          disabled={step === 1 || submitted}
          style={{ visibility: step === 2 ? "visible" : "hidden" }}
          onClick={() => setStep(1)}
        >
          <ChevronLeft size={18} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
