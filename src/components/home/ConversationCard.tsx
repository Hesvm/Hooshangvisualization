import Link from "next/link";
import type { ConversationPreview } from "@/types/home";
import styles from "./ConversationCard.module.css";

type ConversationCardProps = {
  item: ConversationPreview;
};

function CardInner({ item }: { item: ConversationPreview }) {
  return (
    <>
      <span className={styles.avatar} aria-hidden>
        {item.icon}
      </span>
      <div className={styles.text}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.preview}>{item.preview}</p>
      </div>
      <span className={styles.time}>{item.relativeTime}</span>
    </>
  );
}

export function ConversationCard({ item }: ConversationCardProps) {
  if (item.href) {
    return (
      <Link href={item.href} className={styles.card}>
        <CardInner item={item} />
      </Link>
    );
  }

  return (
    <article className={styles.card}>
      <CardInner item={item} />
    </article>
  );
}
