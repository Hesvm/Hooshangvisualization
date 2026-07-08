import type { LoanOffer } from "@/types/shopping";
import { LOAN_PROVIDERS, MIN_LOAN_AMOUNT } from "@/lib/mocks/loanProviders";

/** ShoppingProduct.price is stored in million-toman units (e.g. 49 = ۴۹ میلیون تومان);
 *  everything else in the loan flow works in raw toman, so this is the single conversion point. */
const MILLION_TOMAN = 1_000_000;

export function productPriceToman(priceInMillionToman: number): number {
  return priceInMillionToman * MILLION_TOMAN;
}

/**
 * Isolated so this mock flat-rate estimator can be swapped for a real
 * provider-rate API later without touching any component. Simple-interest
 * model (not a true amortization table) — consistent with this being a
 * scripted demo, not a real credit product.
 */
export function computeInstallment(loanAmount: number, months: number, annualRate: number) {
  const totalRepayment = Math.round((loanAmount * (1 + annualRate * (months / 12))) / 10_000) * 10_000;
  const monthlyInstallment = Math.round(totalRepayment / months / 10_000) * 10_000;
  return { monthlyInstallment, totalRepayment: monthlyInstallment * months };
}

/** Loan amount must never exceed the product price (no cash-loan use case here). */
export function clampLoanAmount(amount: number, productPrice: number): number {
  return Math.min(Math.max(amount, MIN_LOAN_AMOUNT), productPrice);
}

export function buildLoanOffers(loanAmount: number, months: number): LoanOffer[] {
  return LOAN_PROVIDERS.map((provider) => {
    const { monthlyInstallment, totalRepayment } = computeInstallment(loanAmount, months, provider.annualRate);
    return {
      id: provider.id,
      providerName: provider.providerName,
      providerInitial: provider.providerInitial,
      logoSrc: provider.logoSrc,
      annualRate: provider.annualRate,
      loanAmount,
      repaymentMonths: months,
      monthlyInstallment,
      totalRepayment,
      requiredMembership: provider.requiredMembership,
      guaranteeType: provider.guaranteeType,
      isRecommended: provider.isRecommended,
    };
  });
}
