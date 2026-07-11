"use client";

import { TickCircle, Warning2 } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import {
  RENTAL_BEST_MATCH_PROPERTY_ID,
  RENTAL_PROPERTIES,
  TEHRAN_DISTRICTS,
  formatRentalPrice,
  rentalPropertyPhoto,
} from "@/lib/mocks/rentalHouse";
import styles from "./RentalBestMatchCard.module.css";

type RentalBestMatchCardProps = {
  onViewProperty: (propertyId: string) => void;
};

function districtLabel(districtId: string): string {
  return TEHRAN_DISTRICTS.find((d) => d.id === districtId)?.label ?? "";
}

export function RentalBestMatchCard({ onViewProperty }: RentalBestMatchCardProps) {
  const property = RENTAL_PROPERTIES.find((p) => p.id === RENTAL_BEST_MATCH_PROPERTY_ID);
  if (!property) return null;

  return (
    <div className={styles.card}>
      <ComponentHeader title="انتخاب مناسب تو" tone="accent" className={styles.labelHeader} />

      <div className={styles.heroFrame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.heroPhoto} src={rentalPropertyPhoto(property.id)} alt="" draggable={false} />
      </div>

      <div className={styles.identityBlock}>
        <div className={styles.name}>{property.title}</div>
        <div className={styles.config}>
          {districtLabel(property.districtId)} · {faNum(property.area)} متر · {faNum(property.bedrooms)} خواب
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceItem}>
            <span className={styles.priceLabel}>رهن</span>
            <span className={styles.priceValue}>{formatRentalPrice(property.deposit)}</span>
          </span>
          <span className={styles.priceItem}>
            <span className={styles.priceLabel}>اجاره</span>
            <span className={styles.priceValue}>{formatRentalPrice(property.rent)}</span>
          </span>
        </div>
      </div>

      <div className={styles.matchBlock}>
        <span className={styles.matchScore}>{faNum(property.matchScore)}٪ مناسب نیاز تو</span>
      </div>

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
