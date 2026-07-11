"use client";

import { Bank, Coin, Wallet2 } from "iconsax-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { formatTomanCompact } from "@/lib/faNum";
import type { AccountBalance, AccountKind } from "@/types/finance";
import styles from "./AccountsWidget.module.css";

const ICON_BY_KIND: Record<AccountKind, typeof Bank> = {
  bank: Bank,
  wallet: Wallet2,
  invest: Coin,
};

const ICON_CLASS_BY_KIND: Record<AccountKind, string> = {
  bank: styles.iconBank,
  wallet: styles.iconWallet,
  invest: styles.iconInvest,
};

type AccountsWidgetProps = {
  accounts: AccountBalance[];
};

export function AccountsWidget({ accounts }: AccountsWidgetProps) {
  const total = accounts.reduce((sum, account) => sum + account.amount, 0);

  return (
    <div className={styles.list}>
      <div className={`${styles.card} ${styles.totalCard}`}>
        <div className={styles.text}>
          <span className={styles.totalLabel}>مجموع دارایی‌های شما</span>
          <AnimatedNumber className={styles.totalAmount} value={total} format={formatTomanCompact} />
        </div>
      </div>

      {accounts.map((account) => {
        const Icon = ICON_BY_KIND[account.kind];
        return (
          <div key={account.id} className={styles.card}>
            <span className={`${styles.icon} ${ICON_CLASS_BY_KIND[account.kind]}`} aria-hidden="true">
              <Icon variant="Bold" size={20} color="currentColor" />
            </span>
            <div className={styles.text}>
              <span className={styles.label}>{account.label}</span>
              {account.maskedNumber && <span className={styles.masked}>{account.maskedNumber}</span>}
            </div>
            <AnimatedNumber className={styles.amount} value={account.amount} format={formatTomanCompact} />
          </div>
        );
      })}
    </div>
  );
}
