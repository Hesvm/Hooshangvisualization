"use client";

import { Fragment } from "react";
import Link from "next/link";
import { MessageQuestion } from "iconsax-react";
import type { PortfolioRiskAnalysis } from "@/types/finance";
import styles from "./PortfolioAnalysisPanel.module.css";

type PortfolioAnalysisPanelProps = {
  data: PortfolioRiskAnalysis;
};

function renderInsight(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : <Fragment key={index}>{part}</Fragment>,
  );
}

export function PortfolioAnalysisPanel({ data }: PortfolioAnalysisPanelProps) {
  const pointerLeft = 100 - data.score;

  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>تحلیل پرتفوی شما</h2>

      <div className={styles.gauge}>
        <div className={styles.gaugeTrack}>
          <div className={styles.gaugePointer} style={{ left: `${pointerLeft}%` }} />
        </div>
        <div className={styles.gaugeLabels}>
          <span>خطرناک</span>
          <span className={styles.gaugeCurrentLabel}>{data.label}</span>
          <span>امن و آرام</span>
        </div>
      </div>

      <p className={styles.insight}>{renderInsight(data.insightText)}</p>

      <Link href={data.ctaHref} className={styles.ctaButton}>
        <MessageQuestion variant="Bold" size={18} color="currentColor" />
        ادامه گفتگو با هوشنگ
      </Link>

      <p className={styles.timestamp}>{data.lastUpdatedLabel}</p>
    </section>
  );
}
