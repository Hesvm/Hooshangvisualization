import Link from "next/link";
import type { ComposerSuggestion } from "@/types/space";
import styles from "./QuickStartSection.module.css";

type QuickStartSectionProps = {
  title: string;
  suggestions: ComposerSuggestion[];
};

export function QuickStartSection({ title, suggestions }: QuickStartSectionProps) {
  if (!suggestions.length) return null;

  return (
    <section className={styles.section} dir="rtl" aria-label={title}>
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.chips}>
        {suggestions.map((suggestion) =>
          suggestion.href ? (
            <Link key={suggestion.id} href={suggestion.href} className={styles.chip}>
              {suggestion.label}
            </Link>
          ) : (
            <span key={suggestion.id} className={styles.chip}>
              {suggestion.label}
            </span>
          )
        )}
      </div>
    </section>
  );
}
