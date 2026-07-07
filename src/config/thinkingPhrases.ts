/**
 * Per-niche "Hooshang is thinking" status phrases.
 *
 * These are the calm, generic rotating phrases shown by `HooshangThinkingState`
 * when a flow doesn't pass its own step-specific copy. Each space gets a small
 * set (3–4) so the thinking line feels native to that niche.
 *
 * NOTE: The scripted shopping conversation passes *contextual* per-step phrases
 * (see `THINKING_TEXT` in `shoppingScript.ts`) which are richer than these
 * defaults — those win wherever they're supplied. This map is the fallback and
 * the source for any niche page that only needs a generic thinking beat.
 */

export const GLOBAL_THINKING_PHRASES = [
  "دارم فکر می‌کنم",
  "دارم بررسی می‌کنم",
  "دارم جمع‌بندی می‌کنم",
] as const;

export const THINKING_PHRASES_BY_NICHE: Record<string, readonly string[]> = {
  kharid: [
    "دارم گزینه‌ها رو بررسی می‌کنم",
    "دارم بهترین انتخاب رو پیدا می‌کنم",
    "دارم قیمت‌ها رو مقایسه می‌کنم",
  ],
  badan: [
    "دارم وضعیتت رو بررسی می‌کنم",
    "دارم داده‌هات رو تحلیل می‌کنم",
    "دارم جمع‌بندی می‌کنم",
  ],
  ravan: [
    "دارم حواسم بهت هست",
    "دارم فکر می‌کنم",
    "دارم جمع‌بندی می‌کنم",
  ],
  "modiriat-mali": [
    "دارم خرج‌هات رو بررسی می‌کنم",
    "دارم حساب و کتاب می‌کنم",
    "دارم جمع‌بندی می‌کنم",
  ],
};

/** Resolve the phrase set for a space, falling back to the global calm set. */
export function thinkingPhrasesFor(spaceId?: string): readonly string[] {
  if (spaceId && THINKING_PHRASES_BY_NICHE[spaceId]) {
    return THINKING_PHRASES_BY_NICHE[spaceId];
  }
  return GLOBAL_THINKING_PHRASES;
}
