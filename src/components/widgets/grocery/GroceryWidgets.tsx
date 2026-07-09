"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TickCircle } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import shared from "@/components/widgets/shared.module.css";
import styles from "./GroceryWidgets.module.css";

export type ReorderItem = {
  id: string;
  name: string;
  image: string;
  status: string;
  /** Per-asset tuning so odd product photos don't force layout changes on the fixed square card. */
  imageScale?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
};

export type ReorderWidgetData = {
  title: string;
  items: ReorderItem[];
};

export type MonthlyNoteItem = {
  id: string;
  label: string;
  checked: boolean;
};

export type MonthlyNoteWidgetData = {
  title: string;
  count: number;
  items: MonthlyNoteItem[];
};

const ROTATION_MS = 2600;

export function SmartReorderWidget({ data }: { data: unknown }) {
  const d = data as ReorderWidgetData;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = d.items[activeIndex] ?? d.items[0];

  useEffect(() => {
    if (d.items.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % d.items.length);
    }, ROTATION_MS);

    return () => window.clearInterval(interval);
  }, [d.items.length]);

  return (
    <article
      className={`${shared.card} ${styles.reorderCard}`}
      dir="rtl"
      aria-label={`${faNum(activeIndex + 1)} از ${faNum(d.items.length)}`}
    >
      <ComponentHeader as="div" title={d.title} titleAs="h3" className={styles.reorderHeader} />

      <div key={`copy-${activeItem.id}`} className={styles.reorderStage}>
        <div className={styles.reorderCopy}>
          <strong className={styles.productName}>{activeItem.name}</strong>
          <span className={styles.productStatus}>{activeItem.status}</span>
        </div>
      </div>
      <Image
        key={`image-${activeItem.id}`}
        className={styles.productImage}
        src={activeItem.image}
        alt={activeItem.name}
        width={140}
        height={140}
        sizes="140px"
        priority={activeIndex === 0}
        style={{
          width: `${74 * (activeItem.imageScale ?? 1)}%`,
          transform: `translateX(calc(-50% + ${activeItem.imageOffsetX ?? 0}px)) translateY(${activeItem.imageOffsetY ?? 0}px)`,
        }}
      />
    </article>
  );
}

export function MonthlyListNoteWidget({ data }: { data: unknown }) {
  const d = data as MonthlyNoteWidgetData;

  return (
    <article className={`${shared.card} ${styles.noteCard}`} dir="rtl">
      <header className={styles.noteHeader}>
        <span className={styles.noteCount}>{faNum(d.count)}</span>
        <h3 className={styles.noteTitle}>{d.title}</h3>
      </header>

      <ul className={styles.noteList}>
        {d.items.map((item) => (
          <li key={item.id} className={styles.noteItem}>
            <span
              className={styles.noteCheck}
              data-state={item.checked ? "checked" : "unchecked"}
              aria-label={item.checked ? "خریده شده" : "خریده نشده"}
            >
              {item.checked && (
                <TickCircle className={styles.noteCheckIcon} variant="Bold" size={11.2} color="currentColor" />
              )}
            </span>
            <span className={`${styles.noteText} ${item.checked ? styles.noteTextChecked : ""}`}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
