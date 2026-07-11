"use client";

import { FinanceMessageGroups } from "@/components/widgets/finance/FinanceMessageCard";
import { FINANCE_MESSAGES } from "@/lib/mocks/financeMessages";
import styles from "./tabs.module.css";

export function MessagesTab() {
  return (
    <div className={styles.stack}>
      <FinanceMessageGroups messages={FINANCE_MESSAGES} />
    </div>
  );
}
