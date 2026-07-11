"use client";

import type { IntelligenceCategory } from "@/types/intelligence";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/config/intelligenceColors";
import styles from "./FilterChips.module.css";

type FilterChipsProps = {
  activeCategories: "all" | ReadonlySet<IntelligenceCategory>;
  onToggleCategory: (category: IntelligenceCategory) => void;
  onSelectAll: () => void;
  showInsights: boolean;
  onToggleInsights: () => void;
};

export function FilterChips({
  activeCategories,
  onToggleCategory,
  onSelectAll,
  showInsights,
  onToggleInsights,
}: FilterChipsProps) {
  const allSelected = activeCategories === "all";

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={`${styles.chip} ${allSelected ? styles.active : ""}`}
        onClick={onSelectAll}
      >
        همه
      </button>
      {CATEGORY_ORDER.map((category) => {
        const active = allSelected || activeCategories.has(category);
        return (
          <button
            key={category}
            type="button"
            className={`${styles.chip} ${active ? styles.active : ""}`}
            onClick={() => onToggleCategory(category)}
          >
            {CATEGORY_LABELS[category]}
          </button>
        );
      })}
      <button
        type="button"
        className={`${styles.chip} ${showInsights ? styles.active : ""}`}
        onClick={onToggleInsights}
      >
        AI Insights
      </button>
    </div>
  );
}
