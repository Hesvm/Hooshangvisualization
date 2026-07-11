import { MessageText1 } from "iconsax-react";
import type { ConversationPreview } from "@/types/home";
import { ConversationCard } from "./ConversationCard";
import styles from "./ConversationList.module.css";

type ConversationListProps = {
  items: ConversationPreview[];
};

export function ConversationList({ items }: ConversationListProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        آخرین گفتگوهای هوشنگ
        <MessageText1 size={14} variant="Bold" color="currentColor" className={styles.headingIcon} />
      </h2>

      <div className={styles.list}>
        {items.map((item) => (
          <ConversationCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
