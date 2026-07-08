"use client";

import Image from "next/image";
import { faNum, formatPersianNumber } from "@/lib/faNum";
import { Price } from "@/components/Price";
import type { LoanOffer } from "@/types/shopping";
import styles from "./LoanOfferCard.module.css";

type LoanOfferCardProps = {
  offer: LoanOffer;
  selected: boolean;
  onSelect: () => void;
};

export function LoanOfferCard({ offer, selected, onSelect }: LoanOfferCardProps) {
  return (
    <div className={`${styles.card} ${selected ? styles.cardSelected : ""}`}>
      <div className={styles.header}>
        <div className={styles.providerInfo}>
          <span className={styles.providerLogo} aria-hidden>
            <Image src={offer.logoSrc} alt="" width={28} height={28} className={styles.providerLogoImage} />
          </span>
          <div>
            <div className={styles.providerName}>{offer.providerName}</div>
            <div className={styles.rate}>سود سالانه {faNum(Math.round(offer.annualRate * 1000) / 10)}٪</div>
          </div>
        </div>
        <button type="button" className={styles.selectButton} onClick={onSelect}>
          {selected ? "انتخاب شد" : "انتخاب"}
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.valueRow}>
        <span className={styles.valueLabel}>مبلغ هر قسط</span>
        <Price className={styles.valueAmount} amount={formatPersianNumber(offer.monthlyInstallment)} />
      </div>
      <div className={styles.valueRow}>
        <span className={styles.valueLabel}>مجموع اقساط</span>
        <Price className={styles.valueAmount} amount={formatPersianNumber(offer.totalRepayment)} />
      </div>

      <div className={styles.requirements}>
        <div className={styles.requirementItem}>
          <span className={styles.requirementLabel}>اشتراک مورد نیاز</span>
          <span className={styles.requirementValue}>{offer.requiredMembership}</span>
        </div>
        <div className={styles.requirementItem}>
          <span className={styles.requirementLabel}>ضمانت</span>
          <span className={styles.requirementValue}>{offer.guaranteeType}</span>
        </div>
      </div>
    </div>
  );
}
