/**
 * Data model for the Finance/Investment space: exchange connection, the mocked
 * crypto portfolio analysis, and the cross-market allocation editor. Kept
 * separate from `types/conversation.ts` the same way `types/shopping.ts` is —
 * this flow's payload is entirely self-contained (no ConversationBlock fields).
 */

export type ExchangeStatus = "not_connected" | "connected";

export type ExchangeDef = {
  id: string;
  name: string;
  initial: string;
  color: string;
  logoSrc?: string;
  status: ExchangeStatus;
};

export type LiquidityLevel = "high" | "medium" | "low";
export type RiskLevel = "low" | "medium" | "high";

export type Holding = {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  currentValue: number;
  averageBuyPrice: number;
  currentPrice: number;
  profitLoss: number;
  profitLossPercentage: number;
  allocationPercentage: number;
  liquidityLevel: LiquidityLevel;
  riskLevel: RiskLevel;
};

export type DistributionCategory = "bitcoin" | "ethereum" | "stablecoin" | "altcoins";

export type DistributionSlice = {
  category: DistributionCategory;
  label: string;
  percentage: number;
  color: string;
};

export type InsightSeverity = "high" | "medium" | "low";

export type PortfolioInsight = {
  id: string;
  severity: InsightSeverity;
  title: string;
  body: string;
};

export type PortfolioData = {
  totalValue: number;
  totalProfitLoss: number;
  profitLossPercentage: number;
  change30d: number;
  connectedExchangeCount: number;
  holdingsCount: number;
  holdings: Holding[];
  distribution: DistributionSlice[];
  liquidityScore: number;
  concentrationScore: number;
  riskScore: number;
  insights: PortfolioInsight[];
};

export type SpendingCategory = {
  id: string;
  label: string;
  amount: number;
  color: string;
};

export type SpendingData = {
  monthLabel: string;
  total: number;
  previousMonthDeltaPercentage: number;
  categories: SpendingCategory[];
  insight: string;
};

export type InvestmentHorizon = "short" | "medium" | "long";
export type RiskTolerance = "low" | "medium" | "high";

export type MarketId = "fixedIncome" | "gold" | "stocks" | "crypto";

export type AllocationItem = {
  id: MarketId;
  label: string;
  color: string;
  percentage: number;
  min: number;
  max: number;
};

export type AllocationPresetId = "conservative" | "balanced" | "aggressive";

export type AllocationRiskSummary = {
  riskLevel: RiskLevel;
  liquidityLevel: LiquidityLevel;
  expectedVolatilityRange: string;
  recommendedMinimumHorizon: string;
};

/* --- Homepage 2.0 portfolio-value & risk-analysis widgets --- */

export type PortfolioValuePoint = {
  label: string;
  value: number;
  date: string;
};

export type PortfolioValueRange = "24h" | "7d" | "detail";

export type PortfolioValueSeries = {
  range: PortfolioValueRange;
  changePercentage: number;
  points: PortfolioValuePoint[];
};

export type PortfolioValueData = {
  totalValueToman: number;
  totalValueUsd: number;
  series: Record<PortfolioValueRange, PortfolioValueSeries>;
};

export type RiskGaugeLevel = "low" | "balanced" | "high";

export type PortfolioRiskAnalysis = {
  level: RiskGaugeLevel;
  /** 0-100, drives the pointer position on the gauge. */
  score: number;
  label: string;
  /** May contain `**bold**` markers for inline emphasis. */
  insightText: string;
  lastUpdatedLabel: string;
  ctaHref: string;
};

/* --- Finance space tabs (حساب‌ها / پیام‌های هوشنگ / دارایی‌ها / عملکرد / بیمه / وام / مالیات) --- */

export type AccountKind = "bank" | "wallet" | "invest";

export type AccountBalance = {
  id: string;
  kind: AccountKind;
  label: string;
  amount: number;
  maskedNumber?: string;
};

export type FinanceMessageCategory = "warning" | "suggestion" | "news" | "analysis";

export type FinanceMessage = {
  id: string;
  category: FinanceMessageCategory;
  title: string;
  body: string;
  ctaLabel: string;
};

export type AssetHolding = {
  id: string;
  label: string;
  amount: number;
  changePercentage: number;
  color: string;
};

export type PerformancePeriodId = "today" | "week" | "month" | "year";

export type PerformancePeriod = {
  id: PerformancePeriodId;
  label: string;
  changePercentage: number;
  points: number[];
};

export type InsurancePolicy = {
  id: string;
  label: string;
  icon: "car" | "health" | "life";
  coverage: string;
  renewalDate: string;
  premium: number;
};

export type EligibleLoan = {
  id: string;
  label: string;
  maxAmount: number;
};

export type LoanSummary = {
  totalRemaining: number;
  monthlyPayment: number;
  monthsRemaining: number;
  totalMonths: number;
  creditScore: number;
  eligibleLoans: EligibleLoan[];
};

export type TaxDeadline = {
  id: string;
  label: string;
  date: string;
};

export type TaxSummary = {
  estimatedTax: number;
  realizedGains: number;
  expectedTaxes: number;
  deadlines: TaxDeadline[];
};
