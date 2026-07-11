import type { TaxSummary } from "@/types/finance";

export const TAX_SUMMARY: TaxSummary = {
  estimatedTax: 12_400_000,
  realizedGains: 57_600_000,
  expectedTaxes: 8_600_000,
  deadlines: [
    { id: "quarterly", label: "اظهارنامه فصلی ارزش‌افزوده", date: "۱۵ مرداد ۱۴۰۴" },
    { id: "annual", label: "اظهارنامه مالیات بر عملکرد", date: "۳۱ تیر ۱۴۰۵" },
  ],
};
