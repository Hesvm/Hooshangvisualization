import Link from "next/link";
import { Clock } from "@/components/icons/line";
import type { HistoryItem } from "@/types/history";
import styles from "./HistoryList.module.css";

type HistoryListProps = {
  items: HistoryItem[];
};

function CardInner({ item }: { item: HistoryItem }) {
  return (
    <>
      <div className={styles.text}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.subtitle}>{item.subtitle}</p>
      </div>
      {item.isUnread && <span className={styles.unreadDot} />}
    </>
  );
}

export function HistoryList({ items }: HistoryListProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        تاریخچه
        <Clock size={14} strokeWidth={2} className={styles.headingIcon} />
      </h2>

      <div className={styles.list}>
        {items.map((item) =>
          item.href ? (
            <Link key={item.id} href={item.href} className={styles.card}>
              <CardInner item={item} />
            </Link>
          ) : (
            <article key={item.id} className={styles.card}>
              <CardInner item={item} />
            </article>
          )
        )}
      </div>
    </section>
  );
}
