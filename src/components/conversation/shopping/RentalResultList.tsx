"use client";

import { Buildings2 } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import {
  RENTAL_BADGE_LABEL,
  RENTAL_PROPERTIES,
  TEHRAN_DISTRICTS,
  formatRentalPrice,
  type RentalBadge,
  type RentalProperty,
} from "@/lib/mocks/rentalHouse";
import styles from "./RentalResultList.module.css";

const BADGE_STYLE: Record<RentalBadge, { bg: string; color: string }> = {
  "better-offer": { bg: "var(--color-success-bg)", color: "var(--color-success)" },
  closer: { bg: "var(--color-info-bg)", color: "var(--color-info)" },
  "more-value": { bg: "var(--color-warning-bg)", color: "var(--color-warning)" },
};

const THUMB_GRADIENTS = [
  "linear-gradient(135deg, #3b93eb 0%, #7cb6f2 100%)",
  "linear-gradient(135deg, #565f73 0%, #2b2f3a 100%)",
  "linear-gradient(135deg, #c98a09 0%, #e3b98f 100%)",
  "linear-gradient(135deg, #1a9e6b 0%, #8fd4b6 100%)",
  "linear-gradient(135deg, #ed1844 0%, #f29aa8 100%)",
];

function districtLabel(districtId: string): string {
  return TEHRAN_DISTRICTS.find((d) => d.id === districtId)?.label ?? "";
}

type RentalResultListProps = {
  onViewProperty: (propertyId: string) => void;
  properties?: RentalProperty[];
};

export function RentalResultList({ onViewProperty, properties = RENTAL_PROPERTIES }: RentalResultListProps) {
  return (
    <div className={styles.card}>
      <ComponentHeader title="گزینه‌های پیشنهادی" tone="muted" />

      <div className={styles.list}>
        {properties.map((property, index) => (
          <button
            key={property.id}
            type="button"
            className={styles.row}
            onClick={() => onViewProperty(property.id)}
          >
            <span className={styles.thumb} style={{ background: THUMB_GRADIENTS[index % THUMB_GRADIENTS.length] }}>
              <Buildings2 variant="Bold" size={26} color="currentColor" />
            </span>

            <span className={styles.body}>
              <span className={styles.headRow}>
                <span className={styles.title}>{property.title}</span>
                <span className={styles.badge} style={BADGE_STYLE[property.badge]}>
                  {RENTAL_BADGE_LABEL[property.badge]}
                </span>
              </span>

              <span className={styles.meta}>
                {districtLabel(property.districtId)} · {faNum(property.area)} متر · {faNum(property.bedrooms)} خواب
              </span>
              <span className={styles.features}>{property.features.join("، ")}</span>

              <span className={styles.footRow}>
                <span className={styles.prices}>
                  <span>
                    رهن <span className={styles.priceValue}>{formatRentalPrice(property.deposit)}</span>
                  </span>
                  <span>
                    اجاره <span className={styles.priceValue}>{formatRentalPrice(property.rent)}</span>
                  </span>
                </span>
                <span className={styles.cta}>مشاهده</span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
