"use client";

import { faNum, formatPersianNumber } from "@/lib/faNum";
import { Price } from "@/components/Price";
import type { LoanOffer, ShoppingProduct } from "@/types/shopping";
import styles from "./PaymentConfirmationModal.module.css";

type PaymentConfirmationModalProps = {
  product: ShoppingProduct;
  offer: LoanOffer;
  immediatePayment: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export function PaymentConfirmationModal({ product, offer, immediatePayment, onConfirm, onCancel }: PaymentConfirmationModalProps) {
  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>تایید نهایی پرداخت</h3>
      <p className={styles.summary}>با تایید این مرحله، خرید لپ‌تاپ با شرایط وام انتخاب‌شده ثبت می‌شه.</p>

      <div className={styles.detailList}>
        <div className={styles.detailRow}>
          <span>محصول</span>
          <strong>{product.name}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>ارائه‌دهنده وام</span>
          <strong>{offer.providerName}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>مبلغ وام</span>
          <strong>
            <Price amount={formatPersianNumber(offer.loanAmount)} />
          </strong>
        </div>
        <div className={styles.detailRow}>
          <span>قسط ماهانه</span>
          <strong>
            <Price amount={formatPersianNumber(offer.monthlyInstallment)} />
          </strong>
        </div>
        <div className={styles.detailRow}>
          <span>مدت بازپرداخت</span>
          <strong>{faNum(offer.repaymentMonths)} ماه</strong>
        </div>
        <div className={styles.detailRow}>
          <span>پرداخت نقدی اولیه</span>
          <strong>{immediatePayment > 0 ? <Price amount={formatPersianNumber(immediatePayment)} /> : "صفر تومان"}</strong>
        </div>
      </div>

      <button type="button" className={styles.confirmButton} onClick={onConfirm}>
        تایید و پرداخت
      </button>
      <button type="button" className={styles.cancelButton} onClick={onCancel}>
        انصراف
      </button>
    </div>
  );
}
