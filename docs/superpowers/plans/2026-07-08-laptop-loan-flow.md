# Laptop Loan/Financing Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Adaptation note:** This codebase has no test runner (no jest/vitest/pytest — `package.json` only has `lint`). It's a scripted-timing visual prototype verified by lint + `tsc --noEmit` + manual browser walkthrough (see `AGENTS.md` mandate to use the `make-interfaces-feel-better` skill for all UI work, and the existing pattern in every `*Flow.tsx` file). So instead of "write failing test → implement → pass" steps, each task ends with "lint + typecheck + manual verify in preview" steps. Do not introduce a new test framework — that's out of scope.

**Goal:** Replace the existing down-payment-based loan flow in `LaptopShoppingFlow.tsx` with the full loan-amount → repayment-duration → provider-offer → multi-stage credit-validation → Digikala/Digipay invoice → payment-confirmation flow described in the user's spec, reusing the app's existing design system end to end.

**Architecture:** One new focused component per stage of the flow (mirrors the existing `shopping/` folder convention — `DealCard.tsx`, `DeepDiveSheet.tsx`, etc., one file each), driven by an expanded `LoanFlowStep` state machine inside `LaptopShoppingFlow.tsx` using the same `schedule()`-timer pattern already in that file. All financial math lives in `lib/loan.ts`; all Persian copy and timing constants live in `lib/mocks/shoppingScript.ts`; all mock provider/validation data lives in new `lib/mocks/loanProviders.ts` and `lib/mocks/validationStages.ts` files, per the codebase's existing "no hardcoded strings/numbers in JSX" convention.

**Tech Stack:** Next.js 16 / React 19, CSS Modules, `motion` (framer-motion fork) for animation, `iconsax-react` for functional icons, no new dependencies.

---

## Decisions already confirmed with the user

1. **Validation icons** — best-guess mapping from `/Users/hesam/Downloads/finance_icons_transparent/` (shown in Task 1). User will review the final mapping after implementation.
2. **Providers** — 3 distinct fictional banks (پارسیان، ملت، سامان) with different rates/requirements, not 3 identical cards.
3. **Digikala/Digipay logos** — user has added the real files to `/public` (`Digi kala logo.svg/png`, `Digi pay logo.svg/png`). These will be copied to space-free filenames under `public/images/brands/` since raw filenames contain spaces (URL-encoding risk in `<img src>`).
4. **Post-payment CTAs** (`مشاهده سفارش`, `دیدن برنامه اقساط`) — omitted entirely; no order-detail route exists.

## Assumption flagged for review (not yet confirmed — flag before/while executing Task 8)

The **existing** post-loan pipeline in `LaptopShoppingFlow.tsx` — `hesitationVisible` → `HESITATION_QUESTION` → (`dealThinking`/`DealCard`/`handoffThinking`) → `purchaseCompleted` → `trackingVisible` — is **only ever reached from the old loan flow** (confirmed via repo-wide grep: `DealCard`, `lib/deal.ts`, `hesitationVisible`, `purchaseCompleted`, `trackingVisible`, `handoffThinking` all appear exclusively in `LaptopShoppingFlow.tsx` + their own definition files). The new spec's steps 12–16 (invoice → payment confirmation → success) supersede this entirely — showing the old "is this deal good for you?" question after the user has already completed a full validated purchase would be contradictory. **Plan assumes this whole pipeline is dead weight to remove**, along with its now-fully-unused source files `DealCard.tsx`, `DealCard.module.css`, `lib/deal.ts`. If wrong, stop before Task 8/10 and ask.

---

## File Map

**New files:**
- `src/lib/mocks/loanProviders.ts` — provider + bounds data
- `src/lib/mocks/validationStages.ts` — 8 validation stage defs (copy, icon, durations)
- `src/components/conversation/shopping/RangeSlider.tsx` (+ `.module.css`) — shared slider primitive (continuous or discrete-snap)
- `src/components/conversation/shopping/LoanPreferenceCard.tsx` (+ `.module.css`) — 2-step amount/months card
- `src/components/conversation/shopping/LoanOfferCard.tsx` (+ `.module.css`) — one provider offer card
- `src/components/conversation/shopping/LoanValidationFlow.tsx` (+ `.module.css`) — 8-stage sequential validation
- `src/components/conversation/shopping/LoanInvoice.tsx` (+ `.module.css`) — final invoice
- `src/components/conversation/shopping/PaymentConfirmationModal.tsx` (+ `.module.css`) — confirmation content (rendered inside existing `BottomSheet`)
- `public/images/brands/digikala-logo.svg`, `digipay-logo.svg` — copies of user-provided files, space-free names
- `public/images/validation/*.png` — copies of the 8 mapped icon files, renamed to stage ids

**Modified files:**
- `src/lib/loan.ts` — rewrite: remove down-payment estimator, add installment/offer math
- `src/types/shopping.ts` — replace `LoanEstimate` with `LoanOffer`, add `ValidationStage`/`ValidationStageStatus`
- `src/lib/mocks/shoppingScript.ts` — remove down-payment/months/hesitation/deal/handoff constants, add new copy + timing
- `src/components/conversation/shopping/LaptopShoppingFlow.tsx` — new `LoanFlowStep` state machine, new render sequence, remove dead hesitation/deal/handoff code

**Deleted files:**
- `src/components/conversation/shopping/LoanFlow.tsx`, `LoanFlow.module.css` (replaced by the focused files above)
- `src/components/conversation/shopping/DealCard.tsx`, `DealCard.module.css`
- `src/lib/deal.ts`

---

## Task 1: Copy static assets into place

**Files:**
- Create: `public/images/validation/sejam.png`, `sayad.png`, `makna.png`, `iranian-rank.png`, `padi-debt.png`, `mazaneh-novin.png`, `credit-status.png`, `special-contract.png`
- Create: `public/images/brands/digikala-logo.svg`, `public/images/brands/digipay-logo.svg`

Icon mapping (best guess, confirmed with user as reviewable-after-the-fact):

| Stage | Source file |
| --- | --- |
| استعلام سجام | `review-bank-account.png` |
| استعلام صیاد | `cheque.png` |
| استعلام مکنا | `credit.png` |
| استعلام رتبه ایرانیان | `star.png` |
| استعلام بدهی پادی | `bill.png` |
| استعلام مظنه‌نوین | `money.png` |
| استعلام وضعیت اعتباری | `trust-fund.png` |
| استعلام ویژه قرارداد | `guarantee.png` |

(`debit.png`, `deposit.png`, `police-siren.png`, `review-card.png` are unused — no 8th/9th stage needs them.)

- [ ] **Step 1: Copy and rename validation icons**

```bash
mkdir -p "public/images/validation" "public/images/brands"
cp "/Users/hesam/Downloads/finance_icons_transparent/review-bank-account.png" "public/images/validation/sejam.png"
cp "/Users/hesam/Downloads/finance_icons_transparent/cheque.png" "public/images/validation/sayad.png"
cp "/Users/hesam/Downloads/finance_icons_transparent/credit.png" "public/images/validation/makna.png"
cp "/Users/hesam/Downloads/finance_icons_transparent/star.png" "public/images/validation/iranian-rank.png"
cp "/Users/hesam/Downloads/finance_icons_transparent/bill.png" "public/images/validation/padi-debt.png"
cp "/Users/hesam/Downloads/finance_icons_transparent/money.png" "public/images/validation/mazaneh-novin.png"
cp "/Users/hesam/Downloads/finance_icons_transparent/trust-fund.png" "public/images/validation/credit-status.png"
cp "/Users/hesam/Downloads/finance_icons_transparent/guarantee.png" "public/images/validation/special-contract.png"
```

- [ ] **Step 2: Copy brand logos to space-free filenames**

```bash
cp "public/Digi kala logo.svg" "public/images/brands/digikala-logo.svg"
cp "public/Digi pay logo.svg" "public/images/brands/digipay-logo.svg"
```

- [ ] **Step 3: Verify files exist**

Run: `ls public/images/validation public/images/brands`
Expected: 8 files in the first dir, 2 files in the second.

---

## Task 2: Data layer — types

**Files:**
- Modify: `src/types/shopping.ts`

- [ ] **Step 1: Replace `LoanEstimate` with the new financing types**

Remove the existing `LoanEstimate` type (bottom of file) and replace with:

```ts
export type LoanOffer = {
  id: string;
  providerName: string;
  providerInitial: string;
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
```

- [ ] **Step 2: Verify no other file still imports `LoanEstimate`**

Run: `grep -rn "LoanEstimate" src`
Expected: no matches (it was only used by `lib/loan.ts` and `LoanFlow.tsx`, both being rewritten in later tasks — if this still matches something else, stop and check it before continuing).

---

## Task 3: Data layer — provider + bounds mock data

**Files:**
- Create: `src/lib/mocks/loanProviders.ts`

- [ ] **Step 1: Write the file**

```ts
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
    annualRate: 0.23,
    requiredMembership: "برلیان",
    guaranteeType: "سفته",
    isRecommended: false,
  },
  {
    id: "mellat",
    providerName: "بانک ملت",
    providerInitial: "م",
    annualRate: 0.21,
    requiredMembership: "طلایی",
    guaranteeType: "چک ضمانت",
    isRecommended: true,
  },
  {
    id: "saman",
    providerName: "بانک سامان",
    providerInitial: "س",
    annualRate: 0.255,
    requiredMembership: "نقره‌ای",
    guaranteeType: "ضامن کارمند",
    isRecommended: false,
  },
];
```

- [ ] **Step 2: Verify it compiles in isolation**

Run: `npx tsc --noEmit -p .`
Expected: no new errors referencing this file (other errors from not-yet-updated callers are expected at this point in the plan — ignore those until their own task).

---

## Task 4: Data layer — validation stage definitions

**Files:**
- Create: `src/lib/mocks/validationStages.ts`

- [ ] **Step 1: Write the file**

```ts
import type { ValidationStage } from "@/types/shopping";

/**
 * The 8 credit/identity validation stages, run sequentially inside
 * LoanValidationFlow. `realisticDurationMs` matches the product spec's
 * 10-20s-per-stage guidance; `fastPreviewDurationMs` is a dev/QA-only speed
 * (never exposed in end-user UI — see isFastPreviewMode()).
 */
export type ValidationStageDef = {
  id: string;
  title: string;
  processingText: string;
  icon: string;
  realisticDurationMs: number;
  fastPreviewDurationMs: number;
};

export const VALIDATION_STAGE_DEFS: ValidationStageDef[] = [
  {
    id: "sejam",
    title: "استعلام سجام",
    processingText: "در حال بررسی اطلاعات هویتی و ثبت‌نام سجام...",
    icon: "/images/validation/sejam.png",
    realisticDurationMs: 12_000,
    fastPreviewDurationMs: 1_500,
  },
  {
    id: "sayad",
    title: "استعلام صیاد",
    processingText: "در حال بررسی وضعیت چک‌ها و سوابق صیاد...",
    icon: "/images/validation/sayad.png",
    realisticDurationMs: 14_000,
    fastPreviewDurationMs: 1_800,
  },
  {
    id: "makna",
    title: "استعلام مکنا",
    processingText: "در حال دریافت اطلاعات اعتبارسنجی مکنا...",
    icon: "/images/validation/makna.png",
    realisticDurationMs: 11_000,
    fastPreviewDurationMs: 1_400,
  },
  {
    id: "iranianRank",
    title: "استعلام رتبه ایرانیان",
    processingText: "در حال بررسی رتبه اعتباری ایرانیان...",
    icon: "/images/validation/iranian-rank.png",
    realisticDurationMs: 16_000,
    fastPreviewDurationMs: 2_000,
  },
  {
    id: "padiDebt",
    title: "استعلام بدهی پادی",
    processingText: "در حال بررسی بدهی‌های ثبت‌شده...",
    icon: "/images/validation/padi-debt.png",
    realisticDurationMs: 13_000,
    fastPreviewDurationMs: 1_600,
  },
  {
    id: "mazanehNovin",
    title: "استعلام مظنه‌نوین",
    processingText: "در حال بررسی اطلاعات مالی تکمیلی...",
    icon: "/images/validation/mazaneh-novin.png",
    realisticDurationMs: 15_000,
    fastPreviewDurationMs: 1_900,
  },
  {
    id: "creditStatus",
    title: "استعلام وضعیت اعتباری",
    processingText: "در حال جمع‌بندی وضعیت اعتباری...",
    icon: "/images/validation/credit-status.png",
    realisticDurationMs: 18_000,
    fastPreviewDurationMs: 2_200,
  },
  {
    id: "specialContract",
    title: "استعلام ویژه قرارداد",
    processingText: "در حال آماده‌سازی شرایط نهایی قرارداد...",
    icon: "/images/validation/special-contract.png",
    realisticDurationMs: 14_000,
    fastPreviewDurationMs: 1_700,
  },
];

/** Dev/QA-only speed switch via `?fastPreview=1` — never surfaced as end-user UI. */
export function isFastPreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("fastPreview") === "1";
}

export function makeInitialValidationStages(fastPreview: boolean): ValidationStage[] {
  return VALIDATION_STAGE_DEFS.map((def) => ({
    id: def.id,
    title: def.title,
    processingText: def.processingText,
    icon: def.icon,
    status: "pending",
    durationMs: fastPreview ? def.fastPreviewDurationMs : def.realisticDurationMs,
  }));
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit -p .`
Expected: no new errors from this file.

---

## Task 5: Financial calculation helper

**Files:**
- Modify: `src/lib/loan.ts` (full rewrite)

- [ ] **Step 1: Replace the file contents**

```ts
import type { LoanOffer } from "@/types/shopping";
import { LOAN_PROVIDERS, MIN_LOAN_AMOUNT } from "@/lib/mocks/loanProviders";

/**
 * Isolated so this mock flat-rate estimator can be swapped for a real
 * provider-rate API later without touching any component. Simple-interest
 * model (not a true amortization table) — consistent with this being a
 * scripted demo, not a real credit product.
 */
export function computeInstallment(loanAmount: number, months: number, annualRate: number) {
  const totalRepayment = Math.round((loanAmount * (1 + annualRate * (months / 12))) / 10_000) * 10_000;
  const monthlyInstallment = Math.round(totalRepayment / months / 10_000) * 10_000;
  return { monthlyInstallment, totalRepayment: monthlyInstallment * months };
}

/** Loan amount must never exceed the product price (no cash-loan use case here). */
export function clampLoanAmount(amount: number, productPrice: number): number {
  return Math.min(Math.max(amount, MIN_LOAN_AMOUNT), productPrice);
}

export function buildLoanOffers(loanAmount: number, months: number): LoanOffer[] {
  return LOAN_PROVIDERS.map((provider) => {
    const { monthlyInstallment, totalRepayment } = computeInstallment(loanAmount, months, provider.annualRate);
    return {
      id: provider.id,
      providerName: provider.providerName,
      providerInitial: provider.providerInitial,
      annualRate: provider.annualRate,
      loanAmount,
      repaymentMonths: months,
      monthlyInstallment,
      totalRepayment,
      requiredMembership: provider.requiredMembership,
      guaranteeType: provider.guaranteeType,
      isRecommended: provider.isRecommended,
    };
  });
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit -p .`
Expected: errors should now only come from `LoanFlow.tsx`/`LaptopShoppingFlow.tsx` (not yet updated) — confirm no errors from `loan.ts` itself.

---

## Task 6: `RangeSlider` primitive

**Files:**
- Create: `src/components/conversation/shopping/RangeSlider.tsx`
- Create: `src/components/conversation/shopping/RangeSlider.module.css`

This backs both the loan-amount slider (continuous, snapped to 500,000-toman steps) and the repayment-duration slider (discrete snap to `REPAYMENT_MONTH_OPTIONS`). Built on a native `input[type=range]` for accessibility/keyboard support, restyled.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import styles from "./RangeSlider.module.css";

type RangeSliderProps = {
  value: number;
  min: number;
  max: number;
  /** Discrete allowed values (e.g. month options). If provided, `step` is ignored and the slider snaps to the nearest one. */
  steps?: readonly number[];
  step?: number;
  ariaLabel: string;
  onChange: (value: number) => void;
};

function nearestStep(value: number, steps: readonly number[]): number {
  return steps.reduce((closest, step) => (Math.abs(step - value) < Math.abs(closest - value) ? step : closest));
}

export function RangeSlider({ value, min, max, steps, step = 1, ariaLabel, onChange }: RangeSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  function handleInput(raw: number) {
    onChange(steps ? nearestStep(raw, steps) : raw);
  }

  return (
    <div className={styles.wrap}>
      <input
        type="range"
        className={styles.input}
        aria-label={ariaLabel}
        min={min}
        max={max}
        step={steps ? 1 : step}
        value={value}
        style={{ ["--fill-percent" as string]: `${percent}%` }}
        onChange={(e) => handleInput(Number(e.target.value))}
      />
    </div>
  );
}
```

- [ ] **Step 2: Write the CSS**

```css
.wrap {
  width: 100%;
  padding: 4px 0;
}

.input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 40px; /* full hit area, per minimum-hit-area guidance, even though the visible track is thin */
  background: transparent;
  margin: 0;
  cursor: pointer;
}

.input::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(
    to left,
    var(--color-primary) var(--fill-percent),
    var(--color-secondary-bg) var(--fill-percent)
  );
}

.input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--color-white);
  border: none;
  box-shadow: var(--shadow-card);
  margin-top: -8px;
  transition-property: scale;
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

.input:active::-webkit-slider-thumb {
  scale: 0.92;
}

.input::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: var(--color-secondary-bg);
}

.input::-moz-range-progress {
  height: 6px;
  border-radius: 999px;
  background: var(--color-primary);
}

.input::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--color-white);
  border: none;
  box-shadow: var(--shadow-card);
}
```

Note: the gradient direction uses `to left` because the page is RTL and the fill should visually grow from the right, matching the reference screenshot (max on the right label, min on the left label, thumb fill emanating from the right). Verify this visually in Task 12 and flip to `to right` if it reads backwards in the browser.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit -p .` and `npx eslint src/components/conversation/shopping/RangeSlider.tsx`
Expected: no errors.

---

## Task 7: `LoanPreferenceCard` — the shared 2-step amount/months component

**Files:**
- Create: `src/components/conversation/shopping/LoanPreferenceCard.tsx`
- Create: `src/components/conversation/shopping/LoanPreferenceCard.module.css`

Reuses the exact `qCard`/`qHead`/`qProgress`/`qFooter`/`qNext`/`qBack` classes from `conversation.module.css` (imported directly, same as `QuestionCard.tsx` does) so it's visually identical to the existing question-card pattern, but swaps the options-list body for a slider body, and keeps the outer card mounted across its 2 internal steps via a `mode="wait"` `AnimatePresence` crossfade (~220ms) instead of unmounting/remounting the whole card.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft } from "@/components/icons/line";
import { faNum } from "@/lib/faNum";
import { MIN_LOAN_AMOUNT, REPAYMENT_MONTH_OPTIONS, DEFAULT_REPAYMENT_MONTHS } from "@/lib/mocks/loanProviders";
import { RangeSlider } from "./RangeSlider";
import conversationStyles from "@/components/conversation/conversation.module.css";
import styles from "./LoanPreferenceCard.module.css";

type LoanPreferenceCardProps = {
  productPrice: number;
  initialAmount?: number;
  initialMonths?: number;
  onComplete: (amount: number, months: number) => void;
};

const EASE = [0.22, 0.61, 0.36, 1] as const;

export function LoanPreferenceCard({ productPrice, initialAmount, initialMonths, onComplete }: LoanPreferenceCardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState(initialAmount ?? productPrice);
  const [months, setMonths] = useState(initialMonths ?? DEFAULT_REPAYMENT_MONTHS);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={conversationStyles.qCard}>
      <div className={conversationStyles.qHead}>
        <span className={conversationStyles.qQuestion}>{step === 1 ? "چقدر نیاز به وام داری؟" : "چند ماهه اقساط؟"}</span>
        <span className={conversationStyles.qProgress}>{faNum(step)} / {faNum(2)}</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <div className={styles.valueDisplay}>{faNum(amount)} تومان</div>
            <RangeSlider
              value={amount}
              min={MIN_LOAN_AMOUNT}
              max={productPrice}
              step={500_000}
              ariaLabel="مبلغ وام"
              onChange={setAmount}
            />
            <div className={styles.rangeLabels}>
              <span>{faNum(productPrice)} ت</span>
              <span>{faNum(MIN_LOAN_AMOUNT)} ت</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="months"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <div className={styles.valueDisplay}>{faNum(months)} ماه</div>
            <RangeSlider
              value={months}
              min={REPAYMENT_MONTH_OPTIONS[0]}
              max={REPAYMENT_MONTH_OPTIONS[REPAYMENT_MONTH_OPTIONS.length - 1]}
              steps={REPAYMENT_MONTH_OPTIONS}
              ariaLabel="مدت بازپرداخت"
              onChange={setMonths}
            />
            <div className={styles.rangeLabels}>
              <span>{faNum(REPAYMENT_MONTH_OPTIONS[REPAYMENT_MONTH_OPTIONS.length - 1])} ماه</span>
              <span>{faNum(REPAYMENT_MONTH_OPTIONS[0])} ماه</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={conversationStyles.qFooter}>
        <button
          type="button"
          className={conversationStyles.qNext}
          disabled={submitted}
          onClick={() => {
            if (step === 1) {
              setStep(2);
              return;
            }
            setSubmitted(true);
            onComplete(amount, months);
          }}
        >
          تایید
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          className={conversationStyles.qBack}
          aria-label="قبلی"
          disabled={step === 1 || submitted}
          style={{ visibility: step === 2 ? "visible" : "hidden" }}
          onClick={() => setStep(1)}
        >
          <ChevronLeft size={18} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the CSS**

```css
.valueDisplay {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
  margin-bottom: 8px;
}

.rangeLabels {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-history-heading);
  font-variant-numeric: tabular-nums;
}
```

Note: `rangeLabels` renders max-label first in source order (physical right in RTL) then min-label, matching the reference screenshot (right = max/current bound, left = min bound) — verify visually in Task 12.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit -p .` and `npx eslint src/components/conversation/shopping/LoanPreferenceCard.tsx`
Expected: no errors (ignore unrelated pre-existing errors from `LaptopShoppingFlow.tsx`, fixed in Task 11).

---

## Task 8: `LoanOfferCard`

**Files:**
- Create: `src/components/conversation/shopping/LoanOfferCard.tsx`
- Create: `src/components/conversation/shopping/LoanOfferCard.module.css`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { faNum } from "@/lib/faNum";
import type { LoanOffer } from "@/types/shopping";
import styles from "./LoanOfferCard.module.css";

type LoanOfferCardProps = {
  offer: LoanOffer;
  selected: boolean;
  onSelect: () => void;
};

export function LoanOfferCard({ offer, selected, onSelect }: LoanOfferCardProps) {
  return (
    <div className={`${styles.card} ${selected ? styles.cardSelected : ""}`}>
      <div className={styles.header}>
        <div className={styles.providerInfo}>
          <span className={styles.providerLogo} aria-hidden>
            {offer.providerInitial}
          </span>
          <div>
            <div className={styles.providerName}>{offer.providerName}</div>
            <div className={styles.rate}>سود سالانه {faNum(Math.round(offer.annualRate * 1000) / 10)}٪</div>
          </div>
        </div>
        <button type="button" className={styles.selectButton} onClick={onSelect}>
          {selected ? "انتخاب شد" : "انتخاب"}
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.valueRow}>
        <span className={styles.valueLabel}>مبلغ هر قسط</span>
        <span className={styles.valueAmount}>{faNum(offer.monthlyInstallment)} تومان</span>
      </div>
      <div className={styles.valueRow}>
        <span className={styles.valueLabel}>مجموع اقساط</span>
        <span className={styles.valueAmount}>{faNum(offer.totalRepayment)} تومان</span>
      </div>

      <div className={styles.requirements}>
        <div className={styles.requirementItem}>
          <span className={styles.requirementLabel}>اشتراک مورد نیاز</span>
          <span className={styles.requirementValue}>{offer.requiredMembership}</span>
        </div>
        <div className={styles.requirementItem}>
          <span className={styles.requirementLabel}>ضمانت</span>
          <span className={styles.requirementValue}>{offer.guaranteeType}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the CSS**

```css
.card {
  display: flex;
  flex-direction: column;
  background: var(--color-white);
  border-radius: 20px;
  padding: 16px;
  box-shadow: var(--shadow-card-soft);
  transition-property: box-shadow;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

.cardSelected {
  box-shadow: var(--shadow-card-soft), 0 0 0 1.5px var(--color-primary);
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.providerInfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.providerLogo {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 12px; /* concentric with the 16px-radius header area around it */
  background: var(--color-surface-subtle);
  color: var(--color-history-title);
  font-weight: 700;
  font-size: 15px;
  outline: 1px solid rgba(0, 0, 0, 0.06);
}

.providerName {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-history-title);
}

.rate {
  font-size: 13px;
  color: var(--color-history-heading);
  margin-top: 2px;
}

.selectButton {
  min-width: 40px;
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 999px;
  background: var(--color-selected);
  color: var(--color-white);
  font-family: var(--font-ravi);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition-property: scale;
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

.selectButton:active {
  scale: 0.96;
}

.divider {
  height: 1px;
  background: var(--color-border-soft);
  margin: 14px 0;
}

.valueRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
}

.valueLabel {
  color: var(--color-history-heading);
}

.valueAmount {
  font-weight: 700;
  color: var(--color-history-title);
  font-variant-numeric: tabular-nums;
}

.requirements {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 12px;
  padding: 12px;
  background: var(--color-surface-subtle);
  border-radius: 14px; /* concentric: 20px card - ~6-8px inset */
}

.requirementItem {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.requirementLabel {
  font-size: 12px;
  color: var(--color-history-heading);
}

.requirementValue {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-history-title);
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit -p .` and `npx eslint src/components/conversation/shopping/LoanOfferCard.tsx`
Expected: no errors.

---

## Task 9: `LoanValidationFlow`

**Files:**
- Create: `src/components/conversation/shopping/LoanValidationFlow.tsx`
- Create: `src/components/conversation/shopping/LoanValidationFlow.module.css`

Key correctness requirement from the spec (section 25): progress must survive rerenders. This is done by storing `startedAt` (a real timestamp) on the active stage and computing elapsed/remaining from `Date.now()` on a `requestAnimationFrame` loop — never resetting the stored timestamp on rerender, and cancelling the loop on unmount.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TickCircle } from "iconsax-react";
import { faNum } from "@/lib/faNum";
import type { ValidationStage } from "@/types/shopping";
import styles from "./LoanValidationFlow.module.css";

type LoanValidationFlowProps = {
  stages: ValidationStage[];
  onAllComplete: () => void;
};

function formatSecondsLeft(ms: number): string {
  return `حدود ${faNum(Math.max(1, Math.ceil(ms / 1000)))} ثانیه تا پایان`;
}

export function LoanValidationFlow({ stages: initialStages, onAllComplete }: LoanValidationFlowProps) {
  const [stages, setStages] = useState<ValidationStage[]>(() =>
    initialStages.map((stage, index) =>
      index === 0 ? { ...stage, status: "active", startedAt: Date.now() } : stage,
    ),
  );
  const [now, setNow] = useState(() => Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    let frame: number;
    const tick = () => {
      setNow(Date.now());
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const activeIndex = stages.findIndex((s) => s.status === "active");
    if (activeIndex === -1) return;
    const active = stages[activeIndex];
    if (!active.startedAt) return;
    const elapsed = now - active.startedAt;
    if (elapsed < active.durationMs) return;

    setStages((current) =>
      current.map((stage, index) => {
        if (index === activeIndex) return { ...stage, status: "completed" };
        if (index === activeIndex + 1) return { ...stage, status: "active", startedAt: Date.now() };
        return stage;
      }),
    );
  }, [now, stages]);

  useEffect(() => {
    if (completedRef.current) return;
    if (stages.every((s) => s.status === "completed")) {
      completedRef.current = true;
      onAllComplete();
    }
  }, [stages, onAllComplete]);

  const completedCount = stages.filter((s) => s.status === "completed").length;
  const overallPercent = (completedCount / stages.length) * 100;

  return (
    <div className={styles.card}>
      <div className={styles.overallHead}>
        <span>مرحله {faNum(Math.min(completedCount + 1, stages.length))} از {faNum(stages.length)}</span>
      </div>
      <div className={styles.overallTrack}>
        <div className={styles.overallFill} style={{ width: `${overallPercent}%` }} />
      </div>

      <div className={styles.stageList}>
        {stages.map((stage) => {
          const active = stage.status === "active";
          const completed = stage.status === "completed";
          const elapsed = stage.startedAt ? now - stage.startedAt : 0;
          const stagePercent = active ? Math.min(100, (elapsed / stage.durationMs) * 100) : completed ? 100 : 0;
          const remaining = stage.durationMs - elapsed;

          return (
            <div key={stage.id} className={`${styles.stageRow} ${active ? styles.stageActive : ""}`}>
              <div className={styles.stageIcon}>
                <Image src={stage.icon} alt="" width={28} height={28} />
              </div>
              <div className={styles.stageBody}>
                <div className={styles.stageTitle}>{stage.title}</div>
                {active && (
                  <>
                    <div className={styles.stageStatus}>{stage.processingText}</div>
                    <div className={styles.stageTrack}>
                      <div className={styles.stageFill} style={{ width: `${stagePercent}%` }} />
                    </div>
                    <div className={styles.stageRemaining}>{formatSecondsLeft(remaining)}</div>
                  </>
                )}
              </div>
              {completed && <TickCircle variant="Bold" size={20} color="var(--color-primary)" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the CSS**

```css
.card {
  background: var(--color-white);
  border-radius: 22px;
  padding: 18px 16px;
  box-shadow: var(--shadow-card-soft);
}

.overallHead {
  font-size: 13px;
  color: var(--color-history-heading);
  font-variant-numeric: tabular-nums;
  margin-bottom: 8px;
}

.overallTrack {
  height: 4px;
  border-radius: 999px;
  background: var(--color-surface-subtle);
  overflow: hidden;
  margin-bottom: 16px;
}

.overallFill {
  height: 100%;
  border-radius: 999px;
  background: var(--color-primary);
  transition-property: width;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

.stageList {
  display: flex;
  flex-direction: column;
}

.stageRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-soft);
}

.stageRow:last-child {
  border-bottom: none;
}

.stageIcon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border-radius: 12px;
  background: var(--color-surface-subtle);
  outline: 1px solid rgba(0, 0, 0, 0.06);
}

.stageIcon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.stageBody {
  flex: 1;
  min-width: 0;
}

.stageTitle {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-history-title);
}

.stageActive .stageTitle {
  color: var(--color-primary);
}

.stageStatus {
  font-size: 12.5px;
  color: var(--color-history-heading);
  margin-top: 4px;
}

.stageTrack {
  height: 4px;
  border-radius: 999px;
  background: var(--color-surface-subtle);
  overflow: hidden;
  margin-top: 8px;
}

.stageFill {
  height: 100%;
  border-radius: 999px;
  background: var(--color-primary);
  transition-property: width;
  transition-duration: 0.2s;
  transition-timing-function: linear;
}

.stageRemaining {
  font-size: 11.5px;
  color: var(--color-history-heading);
  margin-top: 4px;
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit -p .` and `npx eslint src/components/conversation/shopping/LoanValidationFlow.tsx`
Expected: no errors. (Full behavioral verification — timers not resetting, sequential stage advance — happens in Task 12's manual browser pass using `?fastPreview=1`.)

---

## Task 10: `LoanInvoice`

**Files:**
- Create: `src/components/conversation/shopping/LoanInvoice.tsx`
- Create: `src/components/conversation/shopping/LoanInvoice.module.css`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import Image from "next/image";
import { faNum } from "@/lib/faNum";
import type { LoanOffer } from "@/types/shopping";
import type { ShoppingProduct } from "@/types/shopping";
import styles from "./LoanInvoice.module.css";

type LoanInvoiceProps = {
  product: ShoppingProduct;
  offer: LoanOffer;
  onConfirm: () => void;
};

export function LoanInvoice({ product, offer, onConfirm }: LoanInvoiceProps) {
  const immediatePayment = product.price - offer.loanAmount;

  return (
    <div className={styles.card}>
      <div className={styles.brandRow}>
        <Image src="/images/brands/digikala-logo.svg" alt="دیجی‌کالا" width={72} height={20} />
        <Image src="/images/brands/digipay-logo.svg" alt="دیجی‌پی" width={64} height={20} />
      </div>

      <div className={styles.productRow}>
        <div className={styles.productImage} aria-hidden>
          {product.imageGlyph}
        </div>
        <div>
          <div className={styles.productName}>{product.name}</div>
          <div className={styles.productConfig}>{product.configuration}</div>
        </div>
        <div className={styles.productPrice}>{faNum(product.price)} تومان</div>
      </div>

      <div className={styles.sectionTitle}>شرایط وام</div>
      <div className={styles.row}>
        <span>ارائه‌دهنده</span>
        <strong>{offer.providerName}</strong>
      </div>
      <div className={styles.row}>
        <span>مبلغ وام</span>
        <strong>{faNum(offer.loanAmount)} تومان</strong>
      </div>
      <div className={styles.row}>
        <span>مدت بازپرداخت</span>
        <strong>{faNum(offer.repaymentMonths)} ماه</strong>
      </div>
      <div className={styles.row}>
        <span>قسط ماهانه</span>
        <strong>{faNum(offer.monthlyInstallment)} تومان</strong>
      </div>
      <div className={styles.row}>
        <span>مجموع بازپرداخت</span>
        <strong>{faNum(offer.totalRepayment)} تومان</strong>
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <span>مبلغ کالا</span>
        <strong>{faNum(product.price)} تومان</strong>
      </div>
      <div className={styles.row}>
        <span>مبلغ وام</span>
        <strong>{faNum(offer.loanAmount)} تومان</strong>
      </div>
      <div className={`${styles.row} ${styles.rowHighlight}`}>
        <span>پرداخت نقدی اولیه</span>
        <strong>{immediatePayment > 0 ? `${faNum(immediatePayment)} تومان` : "صفر تومان"}</strong>
      </div>

      <button type="button" className={styles.cta} onClick={onConfirm}>
        تایید و پرداخت
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Write the CSS**

```css
.card {
  background: var(--color-white);
  border-radius: 22px;
  padding: 18px 16px;
  box-shadow: var(--shadow-card-soft);
}

.brandRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.productRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border-soft);
  margin-bottom: 14px;
}

.productImage {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 14px;
  background: var(--color-surface-subtle);
  outline: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 20px;
}

.productName {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-history-title);
}

.productConfig {
  font-size: 12.5px;
  color: var(--color-history-heading);
  margin-top: 2px;
}

.productPrice {
  margin-inline-start: auto;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-history-title);
  font-variant-numeric: tabular-nums;
}

.sectionTitle {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-history-heading);
  margin-bottom: 8px;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: var(--color-history-title);
}

.row strong {
  font-variant-numeric: tabular-nums;
}

.rowHighlight strong {
  color: var(--color-primary);
}

.divider {
  height: 1px;
  background: var(--color-border-soft);
  margin: 12px 0;
}

.cta {
  width: 100%;
  height: 48px;
  margin-top: 16px;
  border: none;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-white);
  font-family: var(--font-ravi);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition-property: scale;
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

.cta:active {
  scale: 0.96;
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit -p .` and `npx eslint src/components/conversation/shopping/LoanInvoice.tsx`
Expected: no errors.

---

## Task 11: `PaymentConfirmationModal`

**Files:**
- Create: `src/components/conversation/shopping/PaymentConfirmationModal.tsx`
- Create: `src/components/conversation/shopping/PaymentConfirmationModal.module.css`

Content-only component; `LaptopShoppingFlow.tsx` wraps it in the existing `BottomSheet`.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { faNum } from "@/lib/faNum";
import type { LoanOffer, ShoppingProduct } from "@/types/shopping";
import styles from "./PaymentConfirmationModal.module.css";

type PaymentConfirmationModalProps = {
  product: ShoppingProduct;
  offer: LoanOffer;
  immediatePayment: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export function PaymentConfirmationModal({ product, offer, immediatePayment, onConfirm, onCancel }: PaymentConfirmationModalProps) {
  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>تایید نهایی پرداخت</h3>
      <p className={styles.summary}>با تایید این مرحله، خرید لپ‌تاپ با شرایط وام انتخاب‌شده ثبت می‌شه.</p>

      <div className={styles.detailList}>
        <div className={styles.detailRow}>
          <span>محصول</span>
          <strong>{product.name}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>ارائه‌دهنده وام</span>
          <strong>{offer.providerName}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>مبلغ وام</span>
          <strong>{faNum(offer.loanAmount)} تومان</strong>
        </div>
        <div className={styles.detailRow}>
          <span>قسط ماهانه</span>
          <strong>{faNum(offer.monthlyInstallment)} تومان</strong>
        </div>
        <div className={styles.detailRow}>
          <span>مدت بازپرداخت</span>
          <strong>{faNum(offer.repaymentMonths)} ماه</strong>
        </div>
        <div className={styles.detailRow}>
          <span>پرداخت نقدی اولیه</span>
          <strong>{immediatePayment > 0 ? `${faNum(immediatePayment)} تومان` : "صفر تومان"}</strong>
        </div>
      </div>

      <button type="button" className={styles.confirmButton} onClick={onConfirm}>
        تایید و پرداخت
      </button>
      <button type="button" className={styles.cancelButton} onClick={onCancel}>
        انصراف
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Write the CSS**

```css
.wrap {
  padding: 4px 4px 12px;
}

.title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-history-title);
  text-align: center;
  margin: 0 0 8px;
}

.summary {
  font-size: 14px;
  color: var(--color-history-heading);
  text-align: center;
  margin: 0 0 18px;
  text-wrap: pretty;
}

.detailList {
  background: var(--color-surface-subtle);
  border-radius: 16px;
  padding: 12px 14px;
  margin-bottom: 18px;
}

.detailRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13.5px;
  color: var(--color-history-title);
}

.detailRow strong {
  font-variant-numeric: tabular-nums;
}

.confirmButton {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-white);
  font-family: var(--font-ravi);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition-property: scale;
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

.confirmButton:active {
  scale: 0.96;
}

.cancelButton {
  width: 100%;
  height: 44px;
  margin-top: 8px;
  border: none;
  background: transparent;
  color: var(--color-history-heading);
  font-family: var(--font-ravi);
  font-size: 14px;
  cursor: pointer;
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit -p .` and `npx eslint src/components/conversation/shopping/PaymentConfirmationModal.tsx`
Expected: no errors.

---

## Task 12: Copy + timing constants in `shoppingScript.ts`

**Files:**
- Modify: `src/lib/mocks/shoppingScript.ts`

- [ ] **Step 1: Remove obsolete loan/hesitation/deal/handoff constants**

Delete these existing exports (all being replaced or retired): `LOAN_INTRO_PREFIX`, `LOAN_INTRO_SUFFIX`, `DOWN_PAYMENT_OPTIONS`, `MONTHS_OPTIONS`, `LOAN_DOWN_PAYMENT_QUESTION`, `LOAN_MONTHS_QUESTION`, `LOAN_DISCLAIMER`, `LOAN_PRIMARY_CTA`, `LOAN_SECONDARY_CTA`, `HESITATION_QUESTION`, `HESITATION_OPTIONS`, `HESITATION_THINKING_REPLY`, `DEAL_ACTIVATED_TITLE`, `DEAL_ACTIVATED_SUBTITLE`, `DEAL_CTA`, `DEAL_EXPIRED_TEXT`, `HANDOFF_TEXT`, `HANDOFF_CTA`, `POST_PURCHASE_TEXT`.

Also remove these `TIMING` keys (superseded below): `loanChipFeedback`, `loanChipToMessage`, `loanIntroThinking`, `loanQ2Thinking`, `loanResultThinking`, `hesitationAfterResult`, `dealThinking`, `handoffThinking`, `postPurchaseAfterHandoff`.

Also remove `THINKING_TEXT.loanIntro`, `THINKING_TEXT.loanQ2`, `THINKING_TEXT.loanResult`, `THINKING_TEXT.deal`, `THINKING_TEXT.handoff`.

- [ ] **Step 2: Add the replacement constants**

Add to `TIMING`:

```ts
  loanEntryThinking: 900,
  loanIntroAfterThinking: 400,
  preferenceAfterIntro: 500,

  offerSearchThinking: 2600,
  offerSearchTextSwitch: 1500,
  offersAfterIntro: 400,

  offerPrepThinking: 1100,
  validationIntroAfterThinking: 500,

  invoicePrepThinking: 1400,
  invoiceAfterThinking: 500,

  paymentProcessing: 1400,
```

Add to `THINKING_TEXT`:

```ts
  loanEntry: ["دارم شرایط خرید قسطی این مدل رو بررسی می‌کنم..."],
  offerSearch: [
    "دارم پیشنهادهای وام مناسب رو بررسی می‌کنم...",
    "دارم مبلغ قسط و هزینه نهایی رو بین ارائه‌دهنده‌ها مقایسه می‌کنم...",
    "دارم شرایط ضمانت و اعتبارسنجی رو بررسی می‌کنم...",
    "دارم بهترین گزینه‌ها رو برات مرتب می‌کنم...",
  ],
  offerPrep: ["دارم اطلاعات لازم برای اعتبارسنجی رو آماده می‌کنم..."],
  invoicePrep: [
    "دارم فاکتور خرید و شرایط پرداخت رو آماده می‌کنم...",
    "دارم اطلاعات دیجی‌کالا و دیجی‌پی رو با پیشنهاد وام هماهنگ می‌کنم...",
  ],
  paymentProcessing: ["در حال ثبت پرداخت و نهایی‌کردن سفارش..."],
```

Add new top-level exports (all Persian copy from spec section 38):

```ts
export const LOAN_INTRO_TEXT =
  "مبلغ وام و مدت بازپرداختی که می‌خوای رو مشخص کن تا بهترین پیشنهادها رو برات پیدا کنم.";

export const LOAN_OFFER_INTRO =
  "با توجه به مبلغ و مدت بازپرداختی که انتخاب کردی، این گزینه‌ها شرایط مناسب‌تری دارن.";
export const LOAN_OFFER_INTRO_SUPPORT =
  "مبلغ قسط، هزینه نهایی، ضمانت و شرایط دریافت هرکدوم رو مقایسه کردم.";
export const LOAN_OFFER_CONTINUE_CTA = "ادامه اعتبارسنجی";

export const LOAN_VALIDATION_INTRO =
  "اطلاعاتت رو گرفتم. حالا باید چند استعلام و اعتبارسنجی انجام بدیم تا نتیجه نهایی مشخص بشه.";
export const LOAN_VALIDATION_INTRO_SUPPORT =
  "این فرایند مرحله‌به‌مرحله انجام می‌شه و وضعیت هر بخش رو همین‌جا می‌بینی.";

export const LOAN_VALIDATION_SUCCESS = "نتیجه آزمایشی اعتبارسنجی با موفقیت تکمیل شد.";
export const LOAN_VALIDATION_SUCCESS_SUPPORT = "شرایط دریافت این وام برای ادامه فرایند آماده‌ست.";

export const LOAN_INVOICE_INTRO =
  "فاکتور نهایی آماده‌ست. قبل از تایید پرداخت، جزئیاتش رو یک‌بار بررسی کن.";

export const LOAN_PAYMENT_SUCCESS = "پرداخت با موفقیت تایید شد.";
export const LOAN_PAYMENT_SUCCESS_SUPPORT = "سفارش لپ‌تاپت ثبت شد و شرایط اقساط هم برات فعال شد.";

export function buildLoanRequestMessage(amount: number, months: number): string {
  return `برای این لپ‌تاپ ${faNumForScript(amount)} تومان وام با بازپرداخت ${faNumForScript(months)} ماهه می‌خوام.`;
}

export function buildOfferSelectionMessage(providerName: string): string {
  return `پیشنهاد ${providerName} رو انتخاب می‌کنم.`;
}
```

`faNumForScript` is a tiny local Persian-digit converter (this file already has one private helper, `budgetFa()`, at the top — follow that exact pattern instead of importing `faNum` here, to keep this file free of component-layer imports):

```ts
function faNumForScript(value: number): string {
  const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/[0-9]/g, (d) => FA[Number(d)]);
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit -p .`
Expected: errors should now only be in `LoanFlow.tsx` and `LaptopShoppingFlow.tsx` (both rewritten next task) — confirm none from this file.

---

## Task 13: Delete dead files

**Files:**
- Delete: `src/components/conversation/shopping/LoanFlow.tsx`
- Delete: `src/components/conversation/shopping/LoanFlow.module.css`
- Delete: `src/components/conversation/shopping/DealCard.tsx`
- Delete: `src/components/conversation/shopping/DealCard.module.css`
- Delete: `src/lib/deal.ts`

- [ ] **Step 1: Delete**

```bash
git rm src/components/conversation/shopping/LoanFlow.tsx src/components/conversation/shopping/LoanFlow.module.css
git rm src/components/conversation/shopping/DealCard.tsx src/components/conversation/shopping/DealCard.module.css
git rm src/lib/deal.ts
```

(These will show as unresolved imports in `LaptopShoppingFlow.tsx` until the next task rewrites it — expected, don't fix here.)

---

## Task 14: Rewire `LaptopShoppingFlow.tsx`

**Files:**
- Modify: `src/components/conversation/shopping/LaptopShoppingFlow.tsx`

This is the integration task. Work through it in the following order.

- [ ] **Step 1: Replace imports**

Remove:
```ts
import { computeLoanEstimate } from "@/lib/loan";
import { computeDeal, DEAL_DURATION_MS, type Deal } from "@/lib/deal";
import { DownPaymentQuestion, MonthsQuestion, LoanResultCard } from "./LoanFlow";
```
and the now-removed named imports from `shoppingScript` (`LOAN_INTRO_PREFIX`, `LOAN_INTRO_SUFFIX`, `HESITATION_QUESTION`, `HESITATION_OPTIONS`, `HESITATION_THINKING_REPLY`, `HANDOFF_TEXT`, `HANDOFF_CTA`, `POST_PURCHASE_TEXT`).

Add:
```ts
import { buildLoanOffers, clampLoanAmount } from "@/lib/loan";
import { isFastPreviewMode, makeInitialValidationStages } from "@/lib/mocks/validationStages";
import type { LoanOffer, ValidationStage } from "@/types/shopping";
import { LoanPreferenceCard } from "./LoanPreferenceCard";
import { LoanOfferCard } from "./LoanOfferCard";
import { LoanValidationFlow } from "./LoanValidationFlow";
import { LoanInvoice } from "./LoanInvoice";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import {
  TIMING,
  THINKING_TEXT,
  LOAN_INTRO_TEXT,
  LOAN_OFFER_INTRO,
  LOAN_OFFER_INTRO_SUPPORT,
  LOAN_OFFER_CONTINUE_CTA,
  LOAN_VALIDATION_INTRO,
  LOAN_VALIDATION_INTRO_SUPPORT,
  LOAN_VALIDATION_SUCCESS,
  LOAN_VALIDATION_SUCCESS_SUPPORT,
  LOAN_INVOICE_INTRO,
  LOAN_PAYMENT_SUCCESS,
  LOAN_PAYMENT_SUCCESS_SUPPORT,
  buildLoanRequestMessage,
  buildOfferSelectionMessage,
  /* ...plus the other already-existing imports from shoppingScript that remain unchanged... */
} from "@/lib/mocks/shoppingScript";
```

- [ ] **Step 2: Replace the `LoanStep` type and loan-related `FlowState` fields**

Replace:
```ts
type LoanStep = "closed" | "introThinking" | "downPayment" | "monthsThinking" | "months" | "resultThinking" | "result";
```
with:
```ts
type LoanStep =
  | "closed"
  | "introThinking"
  | "preference"
  | "offerThinking"
  | "offerIntro"
  | "offers"
  | "offerContinueThinking"
  | "validationIntro"
  | "validating"
  | "validationDone"
  | "invoiceThinking"
  | "invoice"
  | "paymentProcessing"
  | "paymentDone";
```

In `FlowState`, replace:
```ts
  loanStep: LoanStep;
  loanDownPayment: number | null;
  loanMonths: number | null;

  hesitationVisible: boolean;
  hesitationResponse: string | null;

  dealThinking: boolean;
  dealActivated: boolean;
  deal: Deal | null;
  dealExpiresAt: number | null;

  purchaseCtaShown: boolean;
  handoffThinking: boolean;
  purchaseCompleted: boolean;
  trackingVisible: boolean;
```
with:
```ts
  loanStep: LoanStep;
  loanAmount: number | null;
  loanMonths: number | null;
  loanOffers: LoanOffer[];
  selectedOfferId: string | null;
  validationStages: ValidationStage[];
  confirmationOpen: boolean;
```

- [ ] **Step 3: Update `makeInitialState`**

Replace the corresponding block:
```ts
    loanStep: "closed",
    loanDownPayment: null,
    loanMonths: null,

    hesitationVisible: false,
    hesitationResponse: null,

    dealThinking: false,
    dealActivated: false,
    deal: null,
    dealExpiresAt: null,

    purchaseCtaShown: false,
    handoffThinking: false,
    purchaseCompleted: false,
    trackingVisible: false,
```
with:
```ts
    loanStep: "closed",
    loanAmount: null,
    loanMonths: null,
    loanOffers: [],
    selectedOfferId: null,
    validationStages: [],
    confirmationOpen: false,
```

- [ ] **Step 4: Remove the old `loanEstimate` derived value**

Delete:
```ts
  const loanEstimate =
    state.loanDownPayment !== null && state.loanMonths !== null
      ? computeLoanEstimate(recommendedProduct.price, state.loanDownPayment, state.loanMonths)
      : null;
```
(offers are computed inside the handler instead — see Step 6).

- [ ] **Step 5: Update `handleDecisionChip`'s loan branch**

Replace:
```ts
    if (chipId === "loan") {
      patch({ answeredChips: [...state.answeredChips, chipId], loanStep: "introThinking" });
      schedule(() => patch({ loanStep: "downPayment" }), TIMING.loanIntroThinking);
      return;
    }
```
with:
```ts
    if (chipId === "loan") {
      patch({ answeredChips: [...state.answeredChips, chipId], loanStep: "introThinking" });
      schedule(() => patch({ loanStep: "preference" }), TIMING.loanEntryThinking);
      return;
    }
```

- [ ] **Step 6: Replace `handleDownPaymentSubmit`/`handleMonthsSubmit`/`handleLoanRestart` with the new handlers**

Delete those three functions entirely. Add:

```ts
  function handleLoanPreferenceComplete(amount: number, months: number) {
    const clampedAmount = clampLoanAmount(amount, recommendedProduct.price);
    const offers = buildLoanOffers(clampedAmount, months);
    patch({
      loanAmount: clampedAmount,
      loanMonths: months,
      loanOffers: offers,
      loanStep: "offerThinking",
    });
    schedule(() => {
      patch({ loanStep: "offerIntro" });
      schedule(() => patch({ loanStep: "offers" }), TIMING.offersAfterIntro);
    }, TIMING.offerSearchThinking);
  }

  function handleSelectOffer(offerId: string) {
    patch({ selectedOfferId: offerId });
  }

  function handleOfferContinue() {
    if (!state.selectedOfferId) return;
    patch({ loanStep: "offerContinueThinking" });
    schedule(() => {
      patch({
        loanStep: "validationIntro",
        validationStages: makeInitialValidationStages(isFastPreviewMode()),
      });
      schedule(() => patch({ loanStep: "validating" }), TIMING.validationIntroAfterThinking);
    }, TIMING.offerPrepThinking);
  }

  function handleValidationComplete() {
    patch({ loanStep: "validationDone" });
    schedule(() => {
      patch({ loanStep: "invoiceThinking" });
      schedule(() => patch({ loanStep: "invoice" }), TIMING.invoiceAfterThinking);
    }, TIMING.invoicePrepThinking);
  }

  function handleOpenConfirmation() {
    patch({ confirmationOpen: true });
  }

  function handleCloseConfirmation() {
    patch({ confirmationOpen: false });
  }

  function handleConfirmPayment() {
    patch({ confirmationOpen: false, loanStep: "paymentProcessing" });
    schedule(() => patch({ loanStep: "paymentDone" }), TIMING.paymentProcessing);
  }
```

- [ ] **Step 7: Remove the dead hesitation/deal/handoff handlers**

Delete `handleHesitationPick`, `handleDealPurchase`, `handleHandoffCta` entirely (per the flagged assumption at the top of this plan — confirm this is correct before this step; if the user objects, keep them and gate them behind a step that no longer auto-triggers from the loan flow instead of deleting).

- [ ] **Step 8: Replace the loan-related JSX block**

Replace this entire existing block:
```tsx
      <ThinkingBeat show={state.loanStep === "introThinking"} messages={THINKING_TEXT.loanIntro} />

      {state.loanStep !== "closed" && state.loanStep !== "introThinking" && (
        <Reveal>
          <AssistantText paragraphs={[`${LOAN_INTRO_PREFIX} ${faNum(recommendedProduct.price)} ${LOAN_INTRO_SUFFIX}`]} />
        </Reveal>
      )}

      {state.loanStep === "downPayment" && (
        <Reveal>
          <DownPaymentQuestion price={recommendedProduct.price} onSubmit={handleDownPaymentSubmit} />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "monthsThinking"} messages={THINKING_TEXT.loanQ2} />

      {state.loanStep === "months" && (
        <Reveal>
          <MonthsQuestion onSubmit={handleMonthsSubmit} />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "resultThinking"} messages={THINKING_TEXT.loanResult} />

      {state.loanStep === "result" && loanEstimate && (
        <Reveal>
          <LoanResultCard price={recommendedProduct.price} estimate={loanEstimate} onRestart={handleLoanRestart} />
        </Reveal>
      )}

      {state.hesitationVisible && (
        <Reveal>
          <div>
            <AssistantText paragraphs={[HESITATION_QUESTION]} />
            <div style={{ marginTop: 16 }}>
              <ChipRow
                chips={HESITATION_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
                doneIds={state.hesitationResponse ? HESITATION_OPTIONS.map((o) => o.id) : []}
                onPick={handleHesitationPick}
              />
            </div>
          </div>
        </Reveal>
      )}

      {state.hesitationResponse === "thinking" && (
        <Reveal>
          <AssistantText paragraphs={[HESITATION_THINKING_REPLY]} />
        </Reveal>
      )}

      <ThinkingBeat show={state.dealThinking} messages={THINKING_TEXT.deal} cycleMs={TIMING.searchThinkingTextSwitch} />

      {state.dealActivated && state.deal && state.dealExpiresAt && (
        <Reveal>
          <DealCard price={recommendedProduct.price} deal={state.deal} expiresAt={state.dealExpiresAt} onPurchase={handleDealPurchase} />
        </Reveal>
      )}

      {state.purchaseCtaShown && (
        <Reveal>
          <div>
            <AssistantText paragraphs={[HANDOFF_TEXT]} />
            <button
              type="button"
              className={styles.ctaButton}
              style={{ marginTop: 16 }}
              disabled={state.handoffThinking || state.purchaseCompleted}
              onClick={handleHandoffCta}
            >
              {HANDOFF_CTA}
            </button>
          </div>
        </Reveal>
      )}

      <ThinkingBeat show={state.handoffThinking} messages={THINKING_TEXT.handoff} />

      {state.trackingVisible && (
        <Reveal>
          <AssistantText paragraphs={[POST_PURCHASE_TEXT]} />
        </Reveal>
      )}
```

with:
```tsx
      <ThinkingBeat show={state.loanStep === "introThinking"} messages={THINKING_TEXT.loanEntry} />

      {state.loanStep !== "closed" && state.loanStep !== "introThinking" && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_INTRO_TEXT]} />
        </Reveal>
      )}

      {state.loanStep === "preference" && (
        <Reveal>
          <LoanPreferenceCard
            productPrice={recommendedProduct.price}
            initialAmount={state.loanAmount ?? undefined}
            initialMonths={state.loanMonths ?? undefined}
            onComplete={handleLoanPreferenceComplete}
          />
        </Reveal>
      )}

      {state.loanAmount !== null && state.loanMonths !== null && state.loanStep !== "preference" && state.loanStep !== "introThinking" && (
        <Reveal>
          <UserBubble text={buildLoanRequestMessage(state.loanAmount, state.loanMonths)} />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "offerThinking"} messages={THINKING_TEXT.offerSearch} cycleMs={TIMING.offerSearchTextSwitch} />

      {(state.loanStep === "offerIntro" || state.loanStep === "offers") && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_OFFER_INTRO, LOAN_OFFER_INTRO_SUPPORT]} />
        </Reveal>
      )}

      {state.loanStep === "offers" && (
        <Reveal>
          <div className={styles.offerList}>
            {state.loanOffers.map((offer) => (
              <LoanOfferCard
                key={offer.id}
                offer={offer}
                selected={state.selectedOfferId === offer.id}
                onSelect={() => handleSelectOffer(offer.id)}
              />
            ))}
            <button
              type="button"
              className={styles.ctaButton}
              disabled={!state.selectedOfferId}
              style={{ opacity: state.selectedOfferId ? 1 : 0.5 }}
              onClick={handleOfferContinue}
            >
              {LOAN_OFFER_CONTINUE_CTA}
            </button>
          </div>
        </Reveal>
      )}

      {state.selectedOfferId && (state.loanStep === "offerContinueThinking" || state.loanStep === "validationIntro" || state.loanStep === "validating" || state.loanStep === "validationDone" || state.loanStep === "invoiceThinking" || state.loanStep === "invoice" || state.loanStep === "paymentProcessing" || state.loanStep === "paymentDone") && (
        <Reveal>
          <UserBubble
            text={buildOfferSelectionMessage(state.loanOffers.find((o) => o.id === state.selectedOfferId)?.providerName ?? "")}
          />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "offerContinueThinking"} messages={THINKING_TEXT.offerPrep} />

      {(state.loanStep === "validationIntro" || state.loanStep === "validating" || state.loanStep === "validationDone" || state.loanStep === "invoiceThinking" || state.loanStep === "invoice" || state.loanStep === "paymentProcessing" || state.loanStep === "paymentDone") && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_VALIDATION_INTRO, LOAN_VALIDATION_INTRO_SUPPORT]} />
        </Reveal>
      )}

      {(state.loanStep === "validating" || state.loanStep === "validationDone" || state.loanStep === "invoiceThinking" || state.loanStep === "invoice" || state.loanStep === "paymentProcessing" || state.loanStep === "paymentDone") && (
        <Reveal>
          <LoanValidationFlow stages={state.validationStages} onAllComplete={handleValidationComplete} />
        </Reveal>
      )}

      {(state.loanStep === "validationDone" || state.loanStep === "invoiceThinking" || state.loanStep === "invoice" || state.loanStep === "paymentProcessing" || state.loanStep === "paymentDone") && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_VALIDATION_SUCCESS, LOAN_VALIDATION_SUCCESS_SUPPORT]} />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "invoiceThinking"} messages={THINKING_TEXT.invoicePrep} />

      {(state.loanStep === "invoice" || state.loanStep === "paymentProcessing" || state.loanStep === "paymentDone") && state.selectedOfferId && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_INVOICE_INTRO]} />
          <LoanInvoice
            product={recommendedProduct}
            offer={state.loanOffers.find((o) => o.id === state.selectedOfferId)!}
            onConfirm={handleOpenConfirmation}
          />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "paymentProcessing"} messages={THINKING_TEXT.paymentProcessing} />

      {state.loanStep === "paymentDone" && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_PAYMENT_SUCCESS, LOAN_PAYMENT_SUCCESS_SUPPORT]} />
        </Reveal>
      )}
```

- [ ] **Step 9: Add the `BottomSheet` for payment confirmation**

Add a second `<BottomSheet>` near the existing deep-dive one at the bottom of the returned JSX:
```tsx
      <BottomSheet open={state.confirmationOpen} onClose={handleCloseConfirmation} ariaLabel="تایید نهایی پرداخت">
        {state.selectedOfferId && (
          <PaymentConfirmationModal
            product={recommendedProduct}
            offer={state.loanOffers.find((o) => o.id === state.selectedOfferId)!}
            immediatePayment={recommendedProduct.price - (state.loanAmount ?? 0)}
            onConfirm={handleConfirmPayment}
            onCancel={handleCloseConfirmation}
          />
        )}
      </BottomSheet>
```

- [ ] **Step 10: Add the `.offerList` CSS rule**

In `LaptopShoppingFlow.module.css`, add:
```css
.offerList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```

- [ ] **Step 11: Verify**

Run: `npx tsc --noEmit -p .`
Expected: zero errors across the whole project.

Run: `npx eslint src`
Expected: zero errors/warnings.

---

## Task 15: Manual browser verification

Use the `preview_*` tools (per the environment's instructions — never plain Bash/curl for this).

- [ ] **Step 1: Start the dev server and navigate to the laptop shopping conversation**

Use `preview_start`, then navigate to the space/conversation route that mounts `LaptopShoppingFlow` (check `src/config/spaces.ts` / the conversations route for the exact URL if not already known from this session).

- [ ] **Step 2: Run the full flow once in fast-preview mode**

Append `?fastPreview=1` to the URL. Click through:
1. Tap the loan chip (`چقدرش رو می‌تونم با وام پرداخت کنم؟`)
2. Confirm the down-payment question is gone, and the flow goes straight to the 2-step `LoanPreferenceCard`
3. Confirm step 1 defaults to the product's price, drag the slider, tap تایید
4. Confirm it crossfades to step 2 (progress `۲/۲`), defaults to ۱۸ ماه, snaps to discrete steps only
5. Tap تایید — confirm exactly one consolidated user bubble appears (no down-payment mention)
6. Confirm the offer-search thinking state cycles through its 4 messages, then 3 distinct (not identical) offer cards appear
7. Confirm tapping "انتخاب" toggles only one card selected at a time, "ادامه اعتبارسنجی" is disabled until a selection is made
8. Confirm the validation component shows all 8 stages, one active at a time, each with its own icon, progress bar advancing, and "مرحله X از ۸" updating
9. Confirm validation success copy appears, then the invoice (with Digikala + Digipay logos actually rendering, not broken images), then tapping "تایید و پرداخت" opens the confirmation bottom sheet without losing scroll position
10. Tap "انصراف" — confirm it closes without changing any state; reopen and tap "تایید و پرداخت" — confirm the processing state then the final success message appear

- [ ] **Step 3: Check for runtime issues**

Run `preview_console_logs` (level: error) and `preview_network` (filter: failed) — expect zero errors and zero failed image/asset requests (this will catch a wrong Digikala/Digipay logo path or a bad validation icon path immediately).

- [ ] **Step 4: Visual check with `preview_inspect`**

Inspect `.stageIcon img`, `.providerLogo`, and the slider thumb for the concentric-radius/outline/hit-area details called out in the `make-interfaces-feel-better` skill — confirm 40px+ hit areas on the slider track and offer-card select button, and that the RTL slider fill direction reads correctly (max on the right, matching the reference screenshot) — flip the CSS gradient direction from Task 6 if it reads backwards.

- [ ] **Step 5: Screenshot for the user**

Use `preview_screenshot` at 2–3 key moments (offer cards, validation mid-flight, invoice) and report back.

---

## Self-Review Notes (already applied above)

- Every spec section (1–42) maps to a task above except: down-payment removal (Task 14 Steps 2–8), consolidated single user bubble (Task 14 Step 8), discrete month snapping (Task 6/7), stable validation timers across rerenders (Task 9), immediate-payment calc (Task 10), confirmation modal via existing `BottomSheet` (Task 11/14), omitted post-payment CTAs (Task 14 Step 8, final block has no CTA buttons), fast/realistic timing modes (Task 4/9).
- Type/method names checked for consistency: `LoanOffer`, `ValidationStage`, `buildLoanOffers`, `clampLoanAmount`, `makeInitialValidationStages`, `isFastPreviewMode` are used identically in their defining task and every later task that calls them.
- No placeholders — every task has literal code/data, no "TODO" or "add validation here".
