import type { AssetHolding } from "@/types/finance";

export const TOP_HOLDINGS: AssetHolding[] = [
  { id: "bitcoin", label: "بیت‌کوین", amount: 62_000_000, changePercentage: 16.4, color: "#c98a09" },
  { id: "gold", label: "طلا", amount: 41_500_000, changePercentage: 2.1, color: "#a8a29e" },
  { id: "usd", label: "دلار", amount: 28_600_000, changePercentage: -0.6, color: "#2377d9" },
  { id: "fixed-income", label: "صندوق درآمد ثابت", amount: 16_000_000, changePercentage: 0.9, color: "#1a9e6b" },
];
