import Link from "next/link";
import Image from "next/image";
import type { ConversationPreview } from "@/types/home";
import styles from "./ConversationCard.module.css";

type ConversationCardProps = {
  item: ConversationPreview;
};

function CardMeta({ item }: { item: ConversationPreview }) {
  if (item.needsApproval) {
    return <span className={styles.approvalPill}>نیاز به تایید</span>;
  }

  if (item.unreadCount) {
    return (
      <span className={styles.meta}>
        <span className={styles.badge}>{item.unreadCount}</span>
        <span className={styles.time}>{item.relativeTime}</span>
      </span>
    );
  }

  return <span className={styles.time}>{item.relativeTime}</span>;
}

function CardInner({ item }: { item: ConversationPreview }) {
  return (
    <>
      <span className={styles.avatar} aria-hidden>
        {item.iconSrc ? (
          <Image
            src={item.iconSrc}
            alt=""
            width={item.iconSize ?? 44}
            height={item.iconSize ?? 44}
            className={styles.avatarImage}
            style={item.iconScale ? { transform: `scale(${item.iconScale})` } : undefined}
          />
        ) : (
          item.icon
        )}
      </span>
      <div className={styles.text}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.preview}>{item.preview}</p>
      </div>
      <CardMeta item={item} />
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
