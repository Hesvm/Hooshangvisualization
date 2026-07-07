import type { LoanEstimate } from "@/types/shopping";

/**
 * Isolated so this rough estimator can be swapped for a real credit-check API
 * later without touching the conversation UI. Fee rate is a flat placeholder,
 * not a real financing product's terms.
 */
const FEE_RATE = 0.05;

/** "کمترین پیش‌پرداخت" quick answer — a flat 10% of price, rounded to the nearest 0.5M toman. */
const MIN_DOWN_PAYMENT_RATIO = 0.1;

export function computeLoanEstimate(price: number, downPayment: number, months: number): LoanEstimate {
  const creditAmount = Math.max(0, price - downPayment);
  const monthlyInstallment = Math.round(((creditAmount * (1 + FEE_RATE)) / months) * 10) / 10;
  return { downPayment, months, creditAmount, monthlyInstallment };
}

export function minDownPayment(price: number): number {
  return Math.round(price * MIN_DOWN_PAYMENT_RATIO * 2) / 2;
}
