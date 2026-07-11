"use client";

import { ChevronLeft } from "@/components/icons/line";
import type { FinanceMessage, FinanceMessageCategory } from "@/types/finance";
import styles from "./FinanceMessageCard.module.css";

const CATEGORY_LABEL: Record<FinanceMessageCategory, string> = {
  warning: "اخطار",
  suggestion: "پیشنهاد",
  news: "خبر",
  analysis: "تحلیل",
};

const CATEGORY_ITEM_CLASS: Record<FinanceMessageCategory, string> = {
  warning: styles.itemWarning,
  suggestion: styles.itemSuggestion,
  news: styles.itemNews,
  analysis: styles.itemAnalysis,
};

const CATEGORY_TITLE_CLASS: Record<FinanceMessageCategory, string> = {
  warning: styles.itemTitleWarning,
  suggestion: styles.itemTitleSuggestion,
  news: styles.itemTitleNews,
  analysis: styles.itemTitleAnalysis,
};

function MessageItem({ message }: { message: FinanceMessage }) {
  return (
    <div className={`${styles.item} ${CATEGORY_ITEM_CLASS[message.category]}`}>
      <div className={styles.itemHead}>
        <span className={`${styles.itemTitle} ${CATEGORY_TITLE_CLASS[message.category]}`}>{message.title}</span>
        <button type="button" className={`${styles.itemCta} ${CATEGORY_TITLE_CLASS[message.category]}`}>
          {message.ctaLabel}
          <ChevronLeft size={12} strokeWidth={2.5} />
        </button>
      </div>
      <p className={styles.itemBody}>{message.body}</p>
    </div>
  );
}

type FinanceMessageCardProps = {
  heading?: string;
  messages: FinanceMessage[];
};

/** Flat list — used for the Dashboard tab's "پیام امروز" preview. */
export function FinanceMessageCard({ heading = "پیام امروز", messages }: FinanceMessageCardProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.list}>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </section>
  );
}

const CATEGORY_ORDER: FinanceMessageCategory[] = ["warning", "suggestion", "news", "analysis"];

/** Grouped by category — used for the full "پیام‌های هوشنگ" tab. */
export function FinanceMessageGroups({ messages }: { messages: FinanceMessage[] }) {
  return (
    <section className={styles.card}>
      {CATEGORY_ORDER.map((category) => {
        const items = messages.filter((message) => message.category === category);
        if (!items.length) return null;
        return (
          <div key={category} className={styles.list}>
            <h3 className={styles.groupHeading}>{CATEGORY_LABEL[category]}</h3>
            {items.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        );
      })}
    </section>
  );
}
