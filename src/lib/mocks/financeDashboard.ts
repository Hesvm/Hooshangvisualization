/**
 * Mock data for the finance space's Dashboard tab (asset-value chart, asset
 * composition donut, and the risk/analysis panel). Numbers are self-consistent
 * demo data mirroring the reference screenshot, not real market data.
 */

import type { DistributionSlice, PortfolioRiskAnalysis, PortfolioValueData } from "@/types/finance";

export const PORTFOLIO_VALUE_DATA: PortfolioValueData = {
  totalValueToman: 148_100_000,
  totalValueUsd: 1_664.04,
  series: {
    "24h": {
      range: "24h",
      changePercentage: 16.4,
      points: [
        { label: "۰۰", value: 127, date: "00:00" },
        { label: "۰۴", value: 124, date: "04:00" },
        { label: "۰۸", value: 121, date: "08:00" },
        { label: "۱۲", value: 118, date: "12:00" },
        { label: "۱۶", value: 122, date: "16:00" },
        { label: "۲۰", value: 133, date: "20:00" },
        { label: "۲۴", value: 148, date: "24:00" },
      ],
    },
    "7d": {
      range: "7d",
      changePercentage: 5.4,
      points: [
        { label: "ش", value: 141, date: "شنبه" },
        { label: "ی", value: 136, date: "یکشنبه" },
        { label: "د", value: 132, date: "دوشنبه" },
        { label: "س", value: 129, date: "سه‌شنبه" },
        { label: "چ", value: 134, date: "چهارشنبه" },
        { label: "پ", value: 139, date: "پنجشنبه" },
        { label: "ج", value: 148, date: "جمعه" },
      ],
    },
    detail: {
      range: "detail",
      changePercentage: 5.4,
      points: [
        { label: "ش", value: 141, date: "شنبه" },
        { label: "ی", value: 136, date: "یکشنبه" },
        { label: "د", value: 132, date: "دوشنبه" },
        { label: "س", value: 129, date: "سه‌شنبه" },
        { label: "چ", value: 134, date: "چهارشنبه" },
        { label: "پ", value: 139, date: "پنجشنبه" },
        { label: "ج", value: 148, date: "جمعه" },
      ],
    },
  },
};

export const ASSET_COMPOSITION_DATA: DistributionSlice[] = [
  { category: "altcoins", label: "نقد", percentage: 34, color: "#1a9e6b" },
  { category: "stablecoin", label: "ارز", percentage: 30, color: "#2377d9" },
  { category: "bitcoin", label: "رمزارز", percentage: 20, color: "#c98a09" },
  { category: "ethereum", label: "طلا", percentage: 16, color: "#a8a29e" },
];

export const PORTFOLIO_RISK_ANALYSIS: PortfolioRiskAnalysis = {
  level: "balanced",
  score: 54,
  label: "متعادل",
  insightText:
    "با توجه به ترکیب فعلی سبد دارایی‌هاتون (۱۷٪ طلا، ۳۰٪ ارز و ۲۰٪ رمزارز)، حرکت امروز بازار طلا و دلار می‌تواند بر ارزش کل دارایی‌هاتان اثر بگذارد. سیگنال برچسبتان: بیت‌کوینی که دارید فعلاً از سطح حمایت خودش برگشته. پیشنهاد می‌شه فعلاً نگهش دارید و منتظر سیگنال قوی‌تر برای خرید باشید.",
  lastUpdatedLabel: "آخرین بروزرسانی: ۲۵ تیر ۱۴۰۴، ۱۴:۴۷",
  ctaHref: `/spaces/modiriat-mali/conversations/crypto-portfolio-analysis`,
};
