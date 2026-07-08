/**
 * Mock monthly spending breakdown for the homepage SpendingWidget. Unrelated
 * to the crypto portfolio flow — this is general personal-finance spend
 * tracking, the entry point into the finance space's "discovery" section.
 */

import type { SpendingData } from "@/types/finance";

export const SPENDING_DATA: SpendingData = {
  monthLabel: "تیر ۱۴۰۴",
  total: 18_400_000,
  previousMonthDeltaPercentage: 12,
  categories: [
    { id: "groceries", label: "خوراک و بقالی", amount: 6_200_000, color: "#c98a09" },
    { id: "bills", label: "قبض و اجاره", amount: 5_400_000, color: "#5c82b8" },
    { id: "shopping", label: "خرید آنلاین", amount: 3_300_000, color: "#e5484d" },
    { id: "transport", label: "حمل و نقل", amount: 2_100_000, color: "#1a9e6b" },
    { id: "entertainment", label: "تفریح", amount: 1_400_000, color: "#78716c" },
  ],
  insight: "بیشترین افزایش نسبت به ماه قبل مربوط به «خرید آنلاین» بوده.",
};
