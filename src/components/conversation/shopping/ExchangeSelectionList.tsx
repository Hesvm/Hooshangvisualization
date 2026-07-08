"use client";

import Image from "next/image";
import { Additem, ArrowLeft2 } from "iconsax-react";
import type { Icon } from "iconsax-react";
import type { ExchangeDef } from "@/types/finance";
import { EXCHANGES, PERSONAL_WALLET_OPTION_ID } from "@/lib/mocks/exchanges";
import styles from "./ExchangeSelectionList.module.css";

type ExchangeSelectionListProps = {
  selectedId?: string | null;
  disabled?: boolean;
  onSelect: (id: string) => void;
};

const SPECIAL_OPTIONS: { id: string; label: string; icon: Icon }[] = [
  { id: PERSONAL_WALLET_OPTION_ID, label: "کیف پول شخصی", icon: Additem },
];

function ExchangeAvatar({ exchange }: { exchange: ExchangeDef }) {
  if (exchange.logoSrc) {
    return (
      <span className={styles.avatar}>
        <Image src={exchange.logoSrc} alt="" width={28} height={28} className={styles.avatarImage} />
      </span>
    );
  }
  return (
    <span className={styles.avatar} style={{ background: exchange.color }}>
      <span className={styles.avatarInitial}>{exchange.initial}</span>
    </span>
  );
}

export function ExchangeSelectionList({ selectedId = null, disabled = false, onSelect }: ExchangeSelectionListProps) {
  return (
    <div className={styles.card} role="list">
      {EXCHANGES.map((exchange) => (
        <button
          key={exchange.id}
          type="button"
          role="listitem"
          className={`${styles.row} ${selectedId === exchange.id ? styles.rowSelected : ""}`}
          disabled={disabled}
          onClick={() => onSelect(exchange.id)}
        >
          <ExchangeAvatar exchange={exchange} />
          <span className={styles.name}>{exchange.name}</span>
          <ArrowLeft2 variant="Bold" size={16} color="var(--color-history-heading)" className={styles.chevron} />
        </button>
      ))}

      {SPECIAL_OPTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="listitem"
          className={`${styles.row} ${selectedId === id ? styles.rowSelected : ""}`}
          disabled={disabled}
          onClick={() => onSelect(id)}
        >
          <span className={styles.avatar} style={{ background: "var(--color-secondary-bg)" }}>
            <Icon variant="Bold" size={18} color="var(--color-history-heading)" />
          </span>
          <span className={styles.name}>{label}</span>
          <ArrowLeft2 variant="Bold" size={16} color="var(--color-history-heading)" className={styles.chevron} />
        </button>
      ))}
    </div>
  );
}
