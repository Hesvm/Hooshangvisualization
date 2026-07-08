"use client";

import Link from "next/link";
import { Chart2 } from "iconsax-react";
import { ChevronLeft } from "@/components/icons/line";
import { CRYPTO_ANALYSIS_CONVERSATION_ID, FINANCE_START_COPY } from "@/lib/mocks/financeCopy";
import styles from "./FinanceWidgets.module.css";

export function FinanceStartSection() {
  return (
    <section className={styles.startSection}>
      <h2 className={styles.startHeading}>{FINANCE_START_COPY.eyebrow}</h2>

      <Link
        href={`/spaces/modiriat-mali/conversations/${CRYPTO_ANALYSIS_CONVERSATION_ID}`}
        className={styles.startCard}
      >
        <span className={styles.startIcon} aria-hidden="true">
          <Chart2 variant="Bold" size={22} color="currentColor" />
        </span>
        <span className={styles.startText}>
          <span className={styles.startTitle}>{FINANCE_START_COPY.title}</span>
          <span className={styles.startBody}>{FINANCE_START_COPY.body}</span>
        </span>
        <span className={styles.startChevron} aria-hidden="true">
          <ChevronLeft size={18} strokeWidth={2.25} />
        </span>
      </Link>
    </section>
  );
}
