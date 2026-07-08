import { Fragment, type ReactNode } from "react";

type NumericTextProps = {
  children: ReactNode;
  className?: string;
  dir?: "ltr" | "rtl" | "auto";
};

/**
 * Wraps a numeric run (price, count, rating, percentage, date, measurement…)
 * with the shared tight numeral tracking and bidi isolation so it can't be
 * reordered by surrounding Persian text. See .numeric-text in globals.css.
 */
export function NumericText({ children, className, dir = "auto" }: NumericTextProps) {
  return (
    <bdi dir={dir} className={className ? `numeric-text ${className}` : "numeric-text"}>
      {children}
    </bdi>
  );
}

const NUMERIC_RUN = /[0-9۰-۹]+(?:[.,٫٬/:×-][0-9۰-۹]+)*/g;

/**
 * Renders a mixed Persian sentence (e.g. "۴ ساعت و ۱۹ دقیقه") and wraps only
 * the digit runs in the shared numeral tracking — the surrounding Persian
 * words must never receive the tight numeral letter-spacing.
 */
export function NumericRuns({ text, className }: { text: string; className?: string }) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(NUMERIC_RUN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(<Fragment key={key++}>{text.slice(lastIndex, index)}</Fragment>);
    }
    parts.push(
      <bdi key={key++} dir="auto" className={className ? `numeric-text ${className}` : "numeric-text"}>
        {match[0]}
      </bdi>,
    );
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return <>{parts}</>;
}
