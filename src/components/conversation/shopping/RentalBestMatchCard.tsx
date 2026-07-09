"use client";

import { TickCircle, Warning2 } from "iconsax-react";
import { faNum } from "@/lib/faNum";
import { RENTAL_BEST_MATCH_PROPERTY_ID, RENTAL_PROPERTIES } from "@/lib/mocks/rentalHouse";
import styles from "./RentalBestMatchCard.module.css";

type RentalBestMatchCardProps = {
  onViewProperty: (propertyId: string) => void;
};

export function RentalBestMatchCard({ onViewProperty }: RentalBestMatchCardProps) {
  const property = RENTAL_PROPERTIES.find((p) => p.id === RENTAL_BEST_MATCH_PROPERTY_ID);
  if (!property) return null;

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>انتخاب مناسب تو</span>
        <span className={styles.score}>{faNum(property.matchScore)}٪ مناسب نیاز تو</span>
      </div>
      <p className={styles.subtitle}>{property.title}</p>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>چرا این گزینه؟</span>
        <div className={styles.list}>
          {property.positives.map((item) => (
            <span key={item} className={styles.item}>
              <TickCircle variant="Bold" size={16} className={styles.itemIconGood} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>چه محدودیت‌هایی داره؟</span>
        <div className={styles.list}>
          {property.limitations.map((item) => (
            <span key={item} className={styles.item}>
              <Warning2 variant="Bold" size={16} className={styles.itemIconWarn} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <button type="button" className={styles.cta} onClick={() => onViewProperty(property.id)}>
        مشاهده کامل این گزینه
      </button>
    </div>
  );
}
