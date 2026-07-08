const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert Latin digits in a string/number to Persian digits. */
export function faNum(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

const personNumberFormatter = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });

/** Persian-locale grouped integer, e.g. 49000000 -> "۴۹٬۰۰۰٬۰۰۰". */
export function formatPersianNumber(value: number): string {
  return personNumberFormatter.format(value);
}

/** Persian-locale grouped toman amount, e.g. 49000000 -> "۴۹٬۰۰۰٬۰۰۰ تومان". */
export function formatToman(value: number): string {
  return `${formatPersianNumber(value)} تومان`;
}

/**
 * Compact toman amount for large financial figures — picks میلیارد/میلیون
 * automatically instead of a raw grouped integer, e.g. 1280000000 -> "۱٫۲۸ میلیارد تومان".
 * Falls back to formatToman below one million (installment/expense-sized amounts).
 */
export function formatTomanCompact(value: number): string {
  const BILLION = 1_000_000_000;
  const MILLION = 1_000_000;
  const abs = Math.abs(value);

  if (abs >= BILLION) {
    const n = Math.round((value / BILLION) * 100) / 100;
    return `${faNum(trimTrailingZeros(n))} میلیارد تومان`;
  }
  if (abs >= MILLION) {
    const n = Math.round((value / MILLION) * 100) / 100;
    return `${faNum(trimTrailingZeros(n))} میلیون تومان`;
  }
  return formatToman(value);
}

function trimTrailingZeros(n: number): string {
  return String(n).replace(/\.0+$|(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}
