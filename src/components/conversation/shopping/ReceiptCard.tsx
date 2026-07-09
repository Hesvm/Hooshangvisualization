"use client";

import { Calendar, Home2, ReceiptText, ShieldTick, TickCircle, TruckFast } from "iconsax-react";
import { Price } from "@/components/Price";
import { faNum, formatPersianNumber } from "@/lib/faNum";
import { LOAN_PAYMENT_SUCCESS, LOAN_PAYMENT_SUCCESS_SUPPORT } from "@/lib/mocks/shoppingScript";
import type { Address, DeliverySlot, LoanOffer, ShoppingProduct } from "@/types/shopping";
import styles from "./ReceiptCard.module.css";

type ReceiptCardProps = {
  product: ShoppingProduct;
  offer: LoanOffer;
  address: Address;
  deliverySlot: DeliverySlot;
  immediatePayment: number;
  orderCode: string;
};

export function ReceiptCard({ product, offer, address, deliverySlot, immediatePayment, orderCode }: ReceiptCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.successRow}>
        <TickCircle variant="Bold" size={28} color="var(--color-success)" />
        <div>
          <div className={styles.successTitle}>{LOAN_PAYMENT_SUCCESS}</div>
          <div className={styles.successSupport}>{LOAN_PAYMENT_SUCCESS_SUPPORT}</div>
        </div>
      </div>

      <div className={styles.receiptGrid}>
        <div className={styles.tokenBox}>
          <ReceiptText variant="Bold" size={18} color="var(--color-primary)" />
          <span className={styles.tokenLabel}>کد پیگیری</span>
          <span className={styles.tokenValue}>{orderCode}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowIcon} aria-hidden>
            <ShieldTick variant="Bold" size={15} color="currentColor" />
          </span>
          <span>کالا</span>
          <strong>{product.name}</strong>
        </div>
        <div className={styles.row}>
          <span className={styles.rowIcon} aria-hidden>
            <TruckFast variant="Bold" size={15} color="currentColor" />
          </span>
          <span>ارائه‌دهنده وام</span>
          <strong>{offer.providerName}</strong>
        </div>
        <div className={styles.row}>
          <span className={styles.rowIcon} aria-hidden>
            <Home2 variant="Bold" size={15} color="currentColor" />
          </span>
          <span>آدرس تحویل</span>
          <strong>{address.label}</strong>
        </div>
        <div className={styles.row}>
          <span className={styles.rowIcon} aria-hidden>
            <Calendar variant="Bold" size={15} color="currentColor" />
          </span>
          <span>زمان ارسال</span>
          <strong>
            {deliverySlot.dayLabel} · {faNum(deliverySlot.timeWindow)}
          </strong>
        </div>
        <div className={`${styles.row} ${styles.rowHighlight}`}>
          <span className={styles.rowIcon} aria-hidden>
            <ReceiptText variant="Bold" size={15} color="currentColor" />
          </span>
          <span>پرداخت نقدی اولیه</span>
          <strong>{immediatePayment > 0 ? <Price amount={formatPersianNumber(immediatePayment)} /> : "صفر تومان"}</strong>
        </div>
      </div>
    </div>
  );
}
