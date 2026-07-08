/**
 * Cross-market allocation editor logic: preset mixes, proportional
 * redistribution when a slider moves, and a derived (non-promissory) risk
 * summary. All percentages always sum to exactly 100 — amounts are derived
 * from percentage * TOTAL_INVESTABLE_AMOUNT, never stored.
 */

import type {
  AllocationItem,
  AllocationPresetId,
  AllocationRiskSummary,
  MarketId,
} from "@/types/finance";

/** Separate fixed demo figure — not the crypto portfolio's totalValue. */
export const TOTAL_INVESTABLE_AMOUNT = 400_000_000;

const MARKET_META: Record<MarketId, { label: string; color: string; min: number; max: number }> = {
  fixedIncome: { label: "سپرده و اوراق با درآمد ثابت", color: "#1a9e6b", min: 0, max: 80 },
  gold: { label: "طلا", color: "#c98a09", min: 0, max: 50 },
  stocks: { label: "بورس", color: "#5c82b8", min: 0, max: 60 },
  crypto: { label: "ارز دیجیتال", color: "#e5484d", min: 0, max: 50 },
};

const MARKET_ORDER: MarketId[] = ["fixedIncome", "gold", "stocks", "crypto"];

function buildItems(percentages: Record<MarketId, number>): AllocationItem[] {
  return MARKET_ORDER.map((id) => ({
    id,
    label: MARKET_META[id].label,
    color: MARKET_META[id].color,
    percentage: percentages[id],
    min: MARKET_META[id].min,
    max: MARKET_META[id].max,
  }));
}

export const PRESETS: Record<AllocationPresetId, AllocationItem[]> = {
  conservative: buildItems({ fixedIncome: 55, gold: 20, stocks: 15, crypto: 10 }),
  balanced: buildItems({ fixedIncome: 35, gold: 20, stocks: 25, crypto: 20 }),
  aggressive: buildItems({ fixedIncome: 15, gold: 15, stocks: 30, crypto: 40 }),
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Moves `changedId` to `newValue` and proportionally rescales the other three
 * items so the total stays exactly 100. Any rounding remainder is assigned to
 * whichever of the other three items is currently largest, so the sum never
 * drifts.
 */
export function redistribute(
  items: AllocationItem[],
  changedId: MarketId,
  newValue: number
): AllocationItem[] {
  const changed = items.find((i) => i.id === changedId);
  if (!changed) return items;

  const clampedValue = clamp(Math.round(newValue), changed.min, changed.max);
  const others = items.filter((i) => i.id !== changedId);
  const othersSum = others.reduce((sum, i) => sum + i.percentage, 0);
  const remaining = 100 - clampedValue;

  let rescaled: AllocationItem[];
  if (othersSum === 0) {
    const share = Math.floor(remaining / others.length);
    rescaled = others.map((i) => ({ ...i, percentage: clamp(share, i.min, i.max) }));
  } else {
    rescaled = others.map((i) => ({
      ...i,
      percentage: clamp(Math.round((i.percentage / othersSum) * remaining), i.min, i.max),
    }));
  }

  const rescaledSum = rescaled.reduce((sum, i) => sum + i.percentage, 0);
  const drift = remaining - rescaledSum;
  if (drift !== 0) {
    const largest = rescaled.reduce((a, b) => (b.percentage > a.percentage ? b : a));
    largest.percentage = clamp(largest.percentage + drift, largest.min, largest.max);
  }

  return items.map((i) => {
    if (i.id === changedId) return { ...i, percentage: clampedValue };
    return rescaled.find((r) => r.id === i.id) ?? i;
  });
}

export function deriveRiskSummary(items: AllocationItem[]): AllocationRiskSummary {
  const pct = (id: MarketId) => items.find((i) => i.id === id)?.percentage ?? 0;
  const volatileShare = pct("crypto") + pct("stocks");
  const cryptoShare = pct("crypto");

  const riskLevel = volatileShare >= 55 ? "high" : volatileShare >= 30 ? "medium" : "low";
  const liquidityLevel = cryptoShare >= 30 ? "high" : cryptoShare >= 10 ? "medium" : "low";

  const expectedVolatilityRange =
    riskLevel === "high" ? "±۲۵٪ تا ±۴۰٪" : riskLevel === "medium" ? "±۱۰٪ تا ±۲۵٪" : "±۳٪ تا ±۱۰٪";

  const recommendedMinimumHorizon =
    riskLevel === "high" ? "حداقل ۳ تا ۵ سال" : riskLevel === "medium" ? "حداقل ۱ تا ۳ سال" : "حداقل ۶ ماه تا ۱ سال";

  return { riskLevel, liquidityLevel, expectedVolatilityRange, recommendedMinimumHorizon };
}
