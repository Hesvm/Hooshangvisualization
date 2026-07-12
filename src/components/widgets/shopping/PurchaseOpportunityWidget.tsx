"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { Price } from "@/components/Price";
import { formatPersianNumber } from "@/lib/faNum";
import type { PurchaseOpportunityItem } from "@/lib/mocks/shopping";
import shared from "@/components/widgets/shared.module.css";
import styles from "./ShoppingWidgets.module.css";

type PurchaseOpportunityWidgetProps = {
  data: unknown;
};

const ROTATE_MS = 4500;
const EASE = [0.22, 0.61, 0.36, 1] as const;

export function PurchaseOpportunityWidget({ data }: PurchaseOpportunityWidgetProps) {
  const items = data as PurchaseOpportunityItem[];
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className={`${shared.card} ${styles.opportunityWidget}`} dir="rtl">
      <ComponentHeader as="span" title="فرصت خرید" titleAs="span" className={styles.opportunityHeader} />

      <div className={styles.opportunityBody}>
        {items.map((item, i) => {
          const isActive = i === index;

          return (
            <motion.div
              key={item.id}
              className={styles.opportunitySlide}
              animate={
                prefersReducedMotion
                  ? { opacity: isActive ? 1 : 0 }
                  : { opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }
              }
              transition={{ duration: 0.36, ease: EASE }}
              aria-hidden={!isActive}
              style={{ pointerEvents: isActive ? "auto" : "none" }}
            >
              <div className={styles.opportunityInfo}>
                {item.originalPrice ? (
                  <Price
                    className={styles.opportunityOriginalPrice}
                    amount={formatPersianNumber(item.originalPrice)}
                  />
                ) : null}
                <Price className={styles.opportunityPrice} amount={formatPersianNumber(item.price)} />
              </div>

              <div className={styles.opportunityImageArea}>
                <Image
                  fill
                  className={styles.opportunityImage}
                  src={item.image}
                  alt={item.name}
                  sizes="200px"
                  style={{
                    transform: `scale(${item.imageScale ?? 1}) translateY(${item.imageOffsetY ?? 0}px)`,
                  }}
                  loading="lazy"
                  draggable={false}
                />
                <span className={styles.opportunityLabel}>{item.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
