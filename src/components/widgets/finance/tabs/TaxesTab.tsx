"use client";

import { Calendar } from "iconsax-react";
import { NumericText } from "@/components/NumericText";
import { formatTomanCompact } from "@/lib/faNum";
import { TAX_SUMMARY } from "@/lib/mocks/financeTaxes";
import tabStyles from "./tabs.module.css";
import styles from "./TaxesTab.module.css";

export function TaxesTab() {
  return (
    <div className={tabStyles.stack}>
      <div className={tabStyles.card}>
        <h2 className={tabStyles.heading}>برآورد مالیاتی</h2>
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>سود شناسایی‌شده</span>
            <span className={styles.statValue}>
              <NumericText>{formatTomanCompact(TAX_SUMMARY.realizedGains)}</NumericText>
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>مالیات برآوردی</span>
            <span className={styles.statValue}>
              <NumericText>{formatTomanCompact(TAX_SUMMARY.estimatedTax)}</NumericText>
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>مالیات موردانتظار</span>
            <span className={styles.statValue}>
              <NumericText>{formatTomanCompact(TAX_SUMMARY.expectedTaxes)}</NumericText>
            </span>
          </div>
        </div>
      </div>

      <div className={tabStyles.card}>
        <h2 className={tabStyles.heading}>مهلت‌های پیش رو</h2>
        <div>
          {TAX_SUMMARY.deadlines.map((deadline) => (
            <div key={deadline.id} className={styles.deadlineRow}>
              <span className={styles.deadlineIcon} aria-hidden="true">
                <Calendar variant="Bold" size={16} color="currentColor" />
              </span>
              <span className={styles.deadlineLabel}>{deadline.label}</span>
              <span className={styles.deadlineDate}>{deadline.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
