"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown2, Bank, Calendar, Card, Lock1, ShieldTick } from "iconsax-react";
import { faNum, formatPersianNumber } from "@/lib/faNum";
import { Price } from "@/components/Price";
import { productPriceToman } from "@/lib/loan";
import {
  LOAN_INVOICE_CTA,
  LOAN_INVOICE_DETAILS_TOGGLE,
  LOAN_INVOICE_HEADER_TITLE,
  LOAN_INVOICE_SECURITY_NOTE,
  LOAN_INVOICE_TODAY_LABEL,
  buildLoanInvoiceRemainderNote,
} from "@/lib/mocks/shoppingScript";
import type { LoanOffer, ShoppingProduct } from "@/types/shopping";
import styles from "./LoanInvoice.module.css";

type LoanInvoiceProps = {
  product: ShoppingProduct;
  offer: LoanOffer;
  onConfirm: () => void;
};

export function LoanInvoice({ product, offer, onConfirm }: LoanInvoiceProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const priceToman = productPriceToman(product.price);
  const immediatePayment = priceToman - offer.loanAmount;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>{LOAN_INVOICE_HEADER_TITLE}</span>
        <div className={styles.brandRow} aria-hidden>
          <Image src="/images/brands/digikala-logo.svg" alt="" width={18} height={18} />
          <span className={styles.brandDivider}>×</span>
          <Image src="/images/brands/digipay-logo.svg" alt="" width={18} height={18} />
        </div>
      </div>

      <div className={styles.perforation} aria-hidden>
        <span className={styles.notch} data-side="right" />
        <span className={styles.notch} data-side="left" />
      </div>

      <div className={styles.productCard}>
        <div className={styles.productInfo}>
          <div className={styles.productName}>{product.name}</div>
          <div className={styles.productConfig}>{product.configuration}</div>
          <Price className={styles.productPrice} amount={formatPersianNumber(priceToman)} />
        </div>
        <div className={styles.productImage}>
          <Image
            className={styles.productPhoto}
            src={product.imageSrc}
            alt={product.imageAlt}
            width={56}
            height={56}
            sizes="56px"
          />
        </div>
      </div>

      <div className={styles.todayBox}>
        <div className={styles.todayInfo}>
          <span className={styles.todayLabel}>{LOAN_INVOICE_TODAY_LABEL}</span>
          <Price className={styles.todayAmount} amount={formatPersianNumber(immediatePayment)} />
          <span className={styles.todayNote}>{buildLoanInvoiceRemainderNote(offer.repaymentMonths)}</span>
        </div>
        <span className={styles.todayIcon} aria-hidden>
          <Card variant="Bold" size={20} color="var(--color-primary)" />
        </span>
      </div>

      <div className={styles.detailRows}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabelGroup}>
            <span className={styles.detailIcon} aria-hidden>
              <Bank variant="Bold" size={14} color="var(--color-history-heading)" />
            </span>
            <span className={styles.detailLabel}>وام:</span>
          </span>
          <Price className={styles.detailValue} amount={formatPersianNumber(offer.loanAmount)} />
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabelGroup}>
            <span className={styles.detailIcon} aria-hidden>
              <ShieldTick variant="Bold" size={14} color="var(--color-history-heading)" />
            </span>
            <span className={styles.detailLabel}>ارائه‌دهنده:</span>
          </span>
          <strong className={styles.detailValue}>{offer.providerName}</strong>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabelGroup}>
            <span className={styles.detailIcon} aria-hidden>
              <Calendar variant="Bold" size={14} color="var(--color-history-heading)" />
            </span>
            <span className={styles.detailLabel}>قسط ماهانه:</span>
          </span>
          <Price className={styles.detailValue} amount={formatPersianNumber(offer.monthlyInstallment)} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {detailsOpen && (
          <motion.div
            className={styles.expandedRows}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          >
            <div className={styles.divider} />
            <div className={styles.row}>
              <span>مدت بازپرداخت</span>
              <strong>{faNum(offer.repaymentMonths)} ماه</strong>
            </div>
            <div className={styles.row}>
              <span>مجموع بازپرداخت</span>
              <Price amount={formatPersianNumber(offer.totalRepayment)} />
            </div>
            <div className={styles.row}>
              <span>ضمانت</span>
              <strong>{offer.guaranteeType}</strong>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={styles.detailsToggle}
        onClick={() => setDetailsOpen((open) => !open)}
        aria-expanded={detailsOpen}
      >
        <motion.span
          className={styles.detailsToggleIcon}
          animate={{ rotate: detailsOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        >
          <ArrowDown2 variant="Linear" size={16} color="currentColor" />
        </motion.span>
        {LOAN_INVOICE_DETAILS_TOGGLE}
      </button>

      <p className={styles.note}>
        <span className={styles.noteIcon} aria-hidden>
          <ShieldTick variant="Bold" size={14} color="var(--color-history-heading)" />
        </span>
        {LOAN_INVOICE_SECURITY_NOTE}
      </p>

      <button type="button" className={styles.cta} onClick={onConfirm}>
        <Lock1 variant="Bold" size={16} color="currentColor" />
        {LOAN_INVOICE_CTA}
      </button>
    </div>
  );
}
