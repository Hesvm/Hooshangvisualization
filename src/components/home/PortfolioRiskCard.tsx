import Link from "next/link";
import { Fragment } from "react";
import { Message2 } from "iconsax-react";
import type { PortfolioRiskAnalysis } from "@/types/finance";
import styles from "./PortfolioRiskCard.module.css";

type PortfolioRiskCardProps = {
  data: PortfolioRiskAnalysis;
};

/** Splits `**bold**` markers into alternating plain/<strong> spans — a tiny
 * local convention, not a markdown parser, since this is the only place
 * inline emphasis is needed. */
function renderInsight(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : <Fragment key={index}>{part}</Fragment>,
  );
}

export function PortfolioRiskCard({ data }: PortfolioRiskCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.gaugeHeader}>
        <span className={styles.gaugeTitle}>تحلیل ریسک</span>
        <span className={styles.gaugeLabel}>{data.label}</span>
      </div>

      <div className={styles.gaugeTrack}>
        <span className={styles.gaugePointer} style={{ insetInlineStart: `${data.score}%` }} aria-hidden />
      </div>
      <div className={styles.gaugeScale}>
        <span>محافظه‌کار</span>
        <span>پرریسک</span>
      </div>

      <p className={styles.insight}>{renderInsight(data.insightText)}</p>

      <div className={styles.footer}>
        <span className={styles.updated}>{data.lastUpdatedLabel}</span>
        <Link href={data.ctaHref} className={styles.cta}>
          <Message2 size={15} variant="Bold" color="currentColor" />
          ادامه گفتگو با هوشنگ
        </Link>
      </div>
    </div>
  );
}
