"use client";

import { NumericText } from "@/components/NumericText";
import { faNum, formatTomanCompact } from "@/lib/faNum";
import { LOAN_SUMMARY } from "@/lib/mocks/financeLoans";
import tabStyles from "./tabs.module.css";
import styles from "./LoansTab.module.css";

export function LoansTab() {
  const monthsPaid = LOAN_SUMMARY.totalMonths - LOAN_SUMMARY.monthsRemaining;
  const progressPercentage = (monthsPaid / LOAN_SUMMARY.totalMonths) * 100;

  return (
    <div className={tabStyles.stack}>
      <div className={tabStyles.card}>
        <h2 className={tabStyles.heading}>وام فعلی</h2>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>مانده وام</span>
            <span className={styles.statValue}>
              <NumericText>{formatTomanCompact(LOAN_SUMMARY.totalRemaining)}</NumericText>
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>قسط ماهانه</span>
            <span className={styles.statValue}>
              <NumericText>{formatTomanCompact(LOAN_SUMMARY.monthlyPayment)}</NumericText>
            </span>
          </div>
        </div>

        <div className={styles.progressRow}>
          <div className={styles.progressLabelRow}>
            <span>
              <NumericText>{faNum(monthsPaid)}</NumericText> از <NumericText>{faNum(LOAN_SUMMARY.totalMonths)}</NumericText> ماه پرداخت‌شده
            </span>
            <span>
              <NumericText>{faNum(LOAN_SUMMARY.monthsRemaining)}</NumericText> ماه باقی‌مانده
            </span>
          </div>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        <div className={styles.progressRow}>
          <div className={styles.progressLabelRow}>
            <span>امتیاز اعتباری</span>
            <span>
              <NumericText>{faNum(LOAN_SUMMARY.creditScore)}</NumericText> از ۱۰۰
            </span>
          </div>
          <div className={styles.track}>
            <div className={`${styles.fill} ${styles.creditFill}`} style={{ width: `${LOAN_SUMMARY.creditScore}%` }} />
          </div>
        </div>
      </div>

      <div className={tabStyles.card}>
        <h2 className={tabStyles.heading}>وام‌های قابل دریافت</h2>
        <div>
          {LOAN_SUMMARY.eligibleLoans.map((loan) => (
            <div key={loan.id} className={styles.eligibleRow}>
              <span className={styles.eligibleLabel}>{loan.label}</span>
              <span className={styles.eligibleAmount}>
                تا <NumericText>{formatTomanCompact(loan.maxAmount)}</NumericText>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
