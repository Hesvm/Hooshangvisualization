"use client";

import Image from "next/image";
import type { ExchangeDef } from "@/types/finance";
import { EXCHANGE_SHEET_COPY } from "@/lib/mocks/financeCopy";
import styles from "./ExchangeConnectionSheet.module.css";

type ExchangeConnectionSheetProps = {
  exchange: ExchangeDef;
  onConfirm: () => void;
  onCancel: () => void;
};

/** BottomSheet content for the exchange-connection confirmation step, following
 * the same header/actions structure as `DeepDiveSheet`. */
export function ExchangeConnectionSheet({ exchange, onConfirm, onCancel }: ExchangeConnectionSheetProps) {
  return (
    <div>
      <div className={styles.header}>
        {exchange.logoSrc ? (
          <span className={styles.avatar}>
            <Image src={exchange.logoSrc} alt="" width={32} height={32} className={styles.avatarImage} />
          </span>
        ) : (
          <span className={styles.avatar} style={{ background: exchange.color }}>
            <span className={styles.avatarInitial}>{exchange.initial}</span>
          </span>
        )}
        <div className={styles.headerInfo}>
          <div className={styles.title}>{EXCHANGE_SHEET_COPY.title}</div>
          <div className={styles.name}>{exchange.name}</div>
        </div>
      </div>

      <p className={styles.body}>{EXCHANGE_SHEET_COPY.body}</p>

      <div className={styles.actions}>
        <button type="button" className={`${styles.actionButton} ${styles.actionPrimary}`} onClick={onConfirm}>
          {EXCHANGE_SHEET_COPY.confirmLabel}
        </button>
        <button type="button" className={styles.actionButton} onClick={onCancel}>
          {EXCHANGE_SHEET_COPY.cancelLabel}
        </button>
      </div>
    </div>
  );
}
