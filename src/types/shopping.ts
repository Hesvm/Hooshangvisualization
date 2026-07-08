/**
 * Product data for the shopping recommendation flow. Kept isolated from
 * conversation.ts so the recommendation/match logic can later be swapped for
 * a real backend without touching the generic conversation block schema.
 */

export type ProductRole = "economical" | "balanced" | "powerful";

export type MatchBreakdownItem = {
  /** e.g. "بودجه", "قدرت موردنیاز" */
  label: string;
  verdict: string;
};

export type ShoppingProduct = {
  id: string;
  name: string;
  configuration: string;
  /** Placeholder glyph shown in the image slot — no real product photo asset exists yet. */
  imageGlyph: string;
  price: number;
  originalPrice?: number;
  role: ProductRole;
  rating: number;
  reviewCount: number;
  shortReviewSummary: string;

  suitableFor: string;
  personalizedFitText: string;
  strengths: string[];
  limitations: string[];
  buyerReviewSummary: string;

  /** Only meaningful once this product becomes the personalized pick. */
  matchScore: number;
  matchBreakdown: MatchBreakdownItem[];
  recommendationReasons: string[];

  seller: string;
  sellerSatisfaction: number;
  fulfilledByDigikala: boolean;
  authenticityGuarantee: boolean;
  returnWindowDays: number;
  deliveryEstimate: string;

  /** No real Digikala integration exists yet — kept null until one does. */
  productUrl: string | null;
};

export const PRODUCT_ROLE_LABEL: Record<ProductRole, string> = {
  economical: "اقتصادی‌ترین",
  balanced: "متعادل‌ترین انتخاب",
  powerful: "قوی‌ترین گزینه",
};

export type LoanOffer = {
  id: string;
  providerName: string;
  providerInitial: string;
  logoSrc: string;
  annualRate: number;
  loanAmount: number;
  repaymentMonths: number;
  monthlyInstallment: number;
  totalRepayment: number;
  requiredMembership: string;
  guaranteeType: string;
  isRecommended: boolean;
};

export type ValidationStageStatus = "pending" | "active" | "completed" | "failed";

export type ValidationStage = {
  id: string;
  title: string;
  processingText: string;
  icon: string;
  status: ValidationStageStatus;
  durationMs: number;
  startedAt?: number;
};

export type Address = {
  id: string;
  label: string;
  recipientName: string;
  fullAddress: string;
  postalCode: string;
};

export type DeliverySlot = {
  id: string;
  dayLabel: string;
  dateLabel: string;
  timeWindow: string;
  isExpress?: boolean;
};
