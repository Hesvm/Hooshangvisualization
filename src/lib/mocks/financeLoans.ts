import type { LoanSummary } from "@/types/finance";

export const LOAN_SUMMARY: LoanSummary = {
  totalRemaining: 84_000_000,
  monthlyPayment: 3_500_000,
  monthsRemaining: 24,
  totalMonths: 36,
  creditScore: 76,
  eligibleLoans: [
    { id: "personal", label: "وام خرید کالا", maxAmount: 30_000_000 },
    { id: "marriage", label: "وام ازدواج", maxAmount: 150_000_000 },
    { id: "refinance", label: "تجمیع اقساط", maxAmount: 60_000_000 },
  ],
};
