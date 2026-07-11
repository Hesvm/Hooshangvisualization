"use client";

import { AccountsWidget } from "@/components/widgets/finance/AccountsWidget";
import { FINANCE_ACCOUNTS } from "@/lib/mocks/financeAccounts";
import styles from "./tabs.module.css";

export function AccountsTab() {
  return (
    <div className={styles.stack}>
      <AccountsWidget accounts={FINANCE_ACCOUNTS} />
    </div>
  );
}
