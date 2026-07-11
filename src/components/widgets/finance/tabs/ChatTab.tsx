"use client";

import { HistoryList } from "@/components/HistoryList";
import { QuickStartSection } from "@/components/QuickStartSection";
import { FINANCE_HISTORY, FINANCE_SUGGESTED_PROMPTS } from "@/lib/mocks/financeCopy";
import styles from "./tabs.module.css";

export function ChatTab() {
  return (
    <div className={styles.stack}>
      <HistoryList items={FINANCE_HISTORY} />
      <QuickStartSection title="پیشنهاد شروع گفتگو" suggestions={FINANCE_SUGGESTED_PROMPTS} />
    </div>
  );
}
