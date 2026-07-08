"use client";

import { TickCircle } from "iconsax-react";
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

      <div className={styles.tokenBox}>
        <span className={styles.tokenLabel}>کد پیگیری سفارش</span>
        <span className={styles.tokenValue}>{orderCode}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <span>کالا</span>
        <strong>{product.name}</strong>
      </div>
      <div className={styles.row}>
        <span>ارائه‌دهنده وام</span>
        <strong>{offer.providerName}</strong>
      </div>
      <div className={styles.row}>
        <span>آدرس تحویل</span>
        <strong>{address.label}</strong>
      </div>
      <div className={styles.row}>
        <span>زمان ارسال</span>
        <strong>
          {deliverySlot.dayLabel} · {faNum(deliverySlot.timeWindow)}
        </strong>
      </div>
      <div className={`${styles.row} ${styles.rowHighlight}`}>
        <span>پرداخت نقدی اولیه</span>
        <strong>{immediatePayment > 0 ? <Price amount={formatPersianNumber(immediatePayment)} /> : "صفر تومان"}</strong>
      </div>
    </div>
  );
}
