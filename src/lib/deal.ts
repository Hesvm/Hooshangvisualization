export const DEAL_DISCOUNT_PERCENT = 2;
export const DEAL_DURATION_MS = 10 * 60 * 1000;

export type Deal = {
  discountPercent: number;
  discountAmount: number;
  finalPrice: number;
};

/**
 * Isolated the same way loan.ts is: a flat placeholder discount, not a real
 * promotions engine. Kept separate from ShoppingProduct so a deal only ever
 * exists transiently in conversation state, never as baked-in product data.
 */
export function computeDeal(price: number): Deal {
  const discountAmount = Math.round(price * (DEAL_DISCOUNT_PERCENT / 100) * 100) / 100;
  const finalPrice = Math.round((price - discountAmount) * 100) / 100;
  return { discountPercent: DEAL_DISCOUNT_PERCENT, discountAmount, finalPrice };
}
