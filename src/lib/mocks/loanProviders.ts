/**
 * Mock financing-provider data for the laptop loan flow. Three genuinely
 * different fictional banks/plans — never render identical offer cards.
 * Isolated here so real provider data/rates can replace this later without
 * touching any component.
 */

export const MIN_LOAN_AMOUNT = 10_000_000; // 10 میلیون تومان — system-wide financing floor
export const REPAYMENT_MONTH_OPTIONS = [6, 9, 12, 18, 24] as const;
export const DEFAULT_REPAYMENT_MONTHS = 18;

export type LoanProviderDef = {
  id: string;
  providerName: string;
  providerInitial: string;
  logoSrc: string;
  annualRate: number; // e.g. 0.23 = 23%
  requiredMembership: string;
  guaranteeType: string;
  isRecommended: boolean;
};

export const LOAN_PROVIDERS: LoanProviderDef[] = [
  {
    id: "parsian",
    providerName: "بانک پارسیان",
    providerInitial: "پ",
    logoSrc: "/images/brands/parsian-logo.png",
    annualRate: 0.23,
    requiredMembership: "برلیان",
    guaranteeType: "سفته",
    isRecommended: false,
  },
  {
    id: "mellat",
    providerName: "بانک ملت",
    providerInitial: "م",
    logoSrc: "/images/brands/mellat-logo.png",
    annualRate: 0.21,
    requiredMembership: "طلایی",
    guaranteeType: "چک ضمانت",
    isRecommended: true,
  },
  {
    id: "saman",
    providerName: "بانک سامان",
    providerInitial: "س",
    logoSrc: "/images/brands/saman-logo.png",
    annualRate: 0.255,
    requiredMembership: "نقره‌ای",
    guaranteeType: "ضامن کارمند",
    isRecommended: false,
  },
];
