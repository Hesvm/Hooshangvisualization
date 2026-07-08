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
    realisticDurationMs: 3_200,
    fastPreviewDurationMs: 1_500,
  },
  {
    id: "sayad",
    title: "استعلام صیاد",
    processingText: "در حال بررسی وضعیت چک‌ها و سوابق صیاد...",
    icon: "/images/validation/sayad.png",
    realisticDurationMs: 3_700,
    fastPreviewDurationMs: 1_800,
  },
  {
    id: "makna",
    title: "استعلام مکنا",
    processingText: "در حال دریافت اطلاعات اعتبارسنجی مکنا...",
    icon: "/images/validation/makna.png",
    realisticDurationMs: 2_900,
    fastPreviewDurationMs: 1_400,
  },
  {
    id: "iranianRank",
    title: "استعلام رتبه ایرانیان",
    processingText: "در حال بررسی رتبه اعتباری ایرانیان...",
    icon: "/images/validation/iranian-rank.png",
    realisticDurationMs: 4_200,
    fastPreviewDurationMs: 2_000,
  },
  {
    id: "padiDebt",
    title: "استعلام بدهی پادی",
    processingText: "در حال بررسی بدهی‌های ثبت‌شده...",
    icon: "/images/validation/padi-debt.png",
    realisticDurationMs: 3_600,
    fastPreviewDurationMs: 1_600,
  },
  {
    id: "mazanehNovin",
    title: "استعلام مظنه‌نوین",
    processingText: "در حال بررسی اطلاعات مالی تکمیلی...",
    icon: "/images/validation/mazaneh-novin.png",
    realisticDurationMs: 4_000,
    fastPreviewDurationMs: 1_900,
  },
  {
    id: "creditStatus",
    title: "استعلام وضعیت اعتباری",
    processingText: "در حال جمع‌بندی وضعیت اعتباری...",
    icon: "/images/validation/credit-status.png",
    realisticDurationMs: 4_700,
    fastPreviewDurationMs: 2_200,
  },
  {
    id: "specialContract",
    title: "استعلام ویژه قرارداد",
    processingText: "در حال آماده‌سازی شرایط نهایی قرارداد...",
    icon: "/images/validation/special-contract.png",
    realisticDurationMs: 3_700,
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
