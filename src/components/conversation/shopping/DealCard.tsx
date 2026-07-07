"use client";

import { useEffect, useState } from "react";
import { faNum } from "@/lib/faNum";
import type { Deal } from "@/lib/deal";
import {
  DEAL_ACTIVATED_TITLE,
  DEAL_ACTIVATED_SUBTITLE,
  DEAL_CTA,
  DEAL_EXPIRED_TEXT,
} from "@/lib/mocks/shoppingScript";
import styles from "./DealCard.module.css";

type DealCardProps = {
  price: number;
  deal: Deal;
  /** Fixed timestamp, set once at activation — never recomputed on rerender. */
  expiresAt: number;
  onPurchase: () => void;
};

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${faNum(minutes)}:${faNum(String(seconds).padStart(2, "0"))}`;
}

export function DealCard({ price, deal, expiresAt, onPurchase }: DealCardProps) {
  const [now, setNow] = useState(() => Date.now());
  const expired = now >= expiresAt;

  useEffect(() => {
    if (expired) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [expired]);

  return (
    <div className={styles.card}>
      <div className={styles.title}>{DEAL_ACTIVATED_TITLE}</div>
      {!expired && <div className={styles.subtitle}>{DEAL_ACTIVATED_SUBTITLE}</div>}

      <div className={styles.priceRow}>
        <span className={styles.originalPrice}>{faNum(price)} میلیون تومان</span>
        <span className={styles.finalPrice}>{faNum(deal.finalPrice)} میلیون تومان</span>
        <span className={styles.discountBadge}>{faNum(deal.discountPercent)}٪</span>
      </div>

      {expired ? (
        <div className={styles.expired}>{DEAL_EXPIRED_TEXT}</div>
      ) : (
        <div className={styles.countdown}>
          <span>زمان باقی‌مانده:</span>
          <span className={styles.countdownValue}>{formatRemaining(expiresAt - now)}</span>
        </div>
      )}

      <button type="button" className={styles.cta} disabled={expired} onClick={onPurchase}>
        {DEAL_CTA}
      </button>
    </div>
  );
}
