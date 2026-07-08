"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { More, Refresh2, TickCircle } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import shared from "@/components/widgets/shared.module.css";
import styles from "./GroceryWidgets.module.css";

export type ReorderItem = {
  id: string;
  name: string;
  image: string;
  status: string;
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
    <article className={`${shared.card} ${styles.reorderCard}`} dir="rtl">
      <ComponentHeader
        as="div"
        title={d.title}
        titleAs="h3"
        className={styles.reorderHeader}
        action={<Refresh2 variant="Linear" size={20} color="currentColor" />}
      />

      <div key={activeItem.id} className={styles.reorderStage}>
        <div className={styles.productFrame}>
          <Image
            className={styles.productImage}
            src={activeItem.image}
            alt={activeItem.name}
            width={92}
            height={92}
            sizes="92px"
            priority={activeIndex === 0}
          />
        </div>
        <p className={styles.productName}>{activeItem.name}</p>
        <p className={styles.productStatus}>{activeItem.status}</p>
      </div>

      <div className={styles.dots} aria-label={`${faNum(activeIndex + 1)} از ${faNum(d.items.length)}`}>
        {d.items.map((item, index) => (
          <span
            key={item.id}
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
          />
        ))}
      </div>
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
        <span className={styles.noteMenu} aria-hidden>
          <More variant="Linear" size={20} color="currentColor" />
        </span>
      </header>

      <ul className={styles.noteList}>
        {d.items.map((item) => (
          <li key={item.id} className={styles.noteItem}>
            <span className={`${styles.noteText} ${item.checked ? styles.noteTextChecked : ""}`}>
              {item.label}
            </span>
            <span className={styles.noteCheck} aria-label={item.checked ? "خریده شده" : "خریده نشده"}>
              {item.checked && <TickCircle variant="Linear" size={22} color="currentColor" />}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
