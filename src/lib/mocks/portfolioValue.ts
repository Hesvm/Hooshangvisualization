import type { PortfolioRiskAnalysis, PortfolioValueData } from "@/types/finance";
import { CRYPTO_ANALYSIS_CONVERSATION_ID } from "@/lib/mocks/financeCopy";

const HOUR_POINTS = [
  { label: "۰۰", value: 145_200_000, date: "امروز ۰۰:۰۰" },
  { label: "۰۴", value: 144_600_000, date: "امروز ۰۴:۰۰" },
  { label: "۰۸", value: 146_100_000, date: "امروز ۰۸:۰۰" },
  { label: "۱۲", value: 147_400_000, date: "امروز ۱۲:۰۰" },
  { label: "۱۶", value: 146_800_000, date: "امروز ۱۶:۰۰" },
  { label: "۲۰", value: 148_100_000, date: "امروز ۲۰:۰۰" },
];

const WEEK_POINTS = [
  { label: "شنبه", value: 139_500_000, date: "۶ روز پیش" },
  { label: "یکشنبه", value: 141_200_000, date: "۵ روز پیش" },
  { label: "دوشنبه", value: 140_100_000, date: "۴ روز پیش" },
  { label: "سه‌شنبه", value: 143_800_000, date: "۳ روز پیش" },
  { label: "چهارشنبه", value: 145_000_000, date: "۲ روز پیش" },
  { label: "پنجشنبه", value: 146_600_000, date: "دیروز" },
  { label: "جمعه", value: 148_100_000, date: "امروز" },
];

const DETAIL_POINTS = [
  { label: "هفته ۱", value: 128_400_000, date: "۴ هفته پیش" },
  { label: "هفته ۲", value: 133_900_000, date: "۳ هفته پیش" },
  { label: "هفته ۳", value: 137_200_000, date: "۲ هفته پیش" },
  { label: "هفته ۴", value: 148_100_000, date: "این هفته" },
];

export const PORTFOLIO_VALUE_DATA: PortfolioValueData = {
  totalValueToman: 148_100_000,
  totalValueUsd: 1664.04,
  series: {
    "24h": { range: "24h", changePercentage: 2.0, points: HOUR_POINTS },
    "7d": { range: "7d", changePercentage: 6.2, points: WEEK_POINTS },
    detail: { range: "detail", changePercentage: 15.3, points: DETAIL_POINTS },
  },
};

export const PORTFOLIO_RISK_ANALYSIS: PortfolioRiskAnalysis = {
  level: "balanced",
  score: 58,
  label: "متعادل",
  insightText: "پرتفوی تو **۶۰٪ در دارایی‌های کم‌ریسک** و بقیه در کریپتوئه؛ نسبت به ماه قبل کمی محتاطانه‌تر شده.",
  lastUpdatedLabel: "به‌روزرسانی ۲ ساعت پیش",
  ctaHref: `/spaces/modiriat-mali/conversations/${CRYPTO_ANALYSIS_CONVERSATION_ID}`,
};
