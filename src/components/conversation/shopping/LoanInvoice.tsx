"use client";

import Image from "next/image";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum, formatPersianNumber } from "@/lib/faNum";
import { Price } from "@/components/Price";
import { productPriceToman } from "@/lib/loan";
import { LOAN_INVOICE_CTA } from "@/lib/mocks/shoppingScript";
import type { LoanOffer, ShoppingProduct } from "@/types/shopping";
import styles from "./LoanInvoice.module.css";

type LoanInvoiceProps = {
  product: ShoppingProduct;
  offer: LoanOffer;
  onConfirm: () => void;
};

export function LoanInvoice({ product, offer, onConfirm }: LoanInvoiceProps) {
  const priceToman = productPriceToman(product.price);
  const immediatePayment = priceToman - offer.loanAmount;

  return (
    <div className={styles.card}>
      <ComponentHeader
        title="فاکتور نهایی خرید"
        className={styles.invoiceHeader}
        action={
          <div className={styles.brandRow} aria-hidden>
            <Image src="/images/brands/digikala-logo.svg" alt="" width={16} height={16} />
            <Image src="/images/brands/digipay-logo.svg" alt="" width={16} height={16} />
          </div>
        }
      />

      <div className={styles.productRow}>
        <div className={styles.productImage} aria-hidden>
          {product.imageGlyph}
        </div>
        <div>
          <div className={styles.productName}>{product.name}</div>
          <div className={styles.productConfig}>{product.configuration}</div>
        </div>
        <Price className={styles.productPrice} amount={formatPersianNumber(priceToman)} />
      </div>

      <div className={styles.sectionTitle}>شرایط وام</div>
      <div className={styles.row}>
        <span>ارائه‌دهنده</span>
        <strong>{offer.providerName}</strong>
      </div>
      <div className={styles.row}>
        <span>مبلغ وام</span>
        <strong>
          <Price amount={formatPersianNumber(offer.loanAmount)} />
        </strong>
      </div>
      <div className={styles.row}>
        <span>مدت بازپرداخت</span>
        <strong>{faNum(offer.repaymentMonths)} ماه</strong>
      </div>
      <div className={styles.row}>
        <span>قسط ماهانه</span>
        <strong>
          <Price amount={formatPersianNumber(offer.monthlyInstallment)} />
        </strong>
      </div>
      <div className={styles.row}>
        <span>مجموع بازپرداخت</span>
        <strong>
          <Price amount={formatPersianNumber(offer.totalRepayment)} />
        </strong>
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <span>مبلغ کالا</span>
        <strong>
          <Price amount={formatPersianNumber(priceToman)} />
        </strong>
      </div>
      <div className={styles.row}>
        <span>مبلغ وام</span>
        <strong>
          <Price amount={formatPersianNumber(offer.loanAmount)} />
        </strong>
      </div>
      <div className={`${styles.row} ${styles.rowHighlight}`}>
        <span>پرداخت نقدی اولیه</span>
        <strong>{immediatePayment > 0 ? <Price amount={formatPersianNumber(immediatePayment)} /> : "صفر تومان"}</strong>
      </div>

      <button type="button" className={styles.cta} onClick={onConfirm}>
        {LOAN_INVOICE_CTA}
      </button>
    </div>
  );
}
