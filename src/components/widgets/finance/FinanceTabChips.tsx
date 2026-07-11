"use client";

import { useEffect, useRef } from "react";
import { FINANCE_TABS, type FinanceTabId } from "./financeTabs";
import styles from "./FinanceTabChips.module.css";

type FinanceTabChipsProps = {
  activeId: FinanceTabId;
  onPick: (id: FinanceTabId) => void;
};

export function FinanceTabChips({ activeId, onPick }: FinanceTabChipsProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const activeChip = row?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    activeChip?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  return (
    <div ref={rowRef} className={styles.row} role="tablist" aria-label="بخش‌های سرمایه‌گذاری">
      {FINANCE_TABS.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${styles.chip} ${active ? styles.chipActive : ""}`}
            onClick={() => onPick(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
