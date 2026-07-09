"use client";

import { useState } from "react";
import { Buildings2 } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import { RENTAL_PROPERTIES, TEHRAN_DISTRICTS, formatRentalPrice } from "@/lib/mocks/rentalHouse";
import styles from "./RentalMapResult.module.css";

type RentalMapResultProps = {
  onViewProperty: (propertyId: string) => void;
};

export function RentalMapResult({ onViewProperty }: RentalMapResultProps) {
  const [activeId, setActiveId] = useState(RENTAL_PROPERTIES[0]?.id ?? null);
  const activeProperty = RENTAL_PROPERTIES.find((p) => p.id === activeId) ?? null;

  return (
    <div className={styles.card}>
      <ComponentHeader title="نقشه گزینه‌ها" tone="muted" />

      <div className={styles.mapCard}>
        <svg className={styles.svg} viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {TEHRAN_DISTRICTS.map((district) => (
            <path key={district.id} d={district.path} className={styles.blob} />
          ))}
        </svg>

        {RENTAL_PROPERTIES.map((property, index) => (
          <button
            key={property.id}
            type="button"
            className={styles.marker}
            style={{ left: `${property.markerX}%`, top: `${property.markerY}%` }}
            aria-pressed={activeId === property.id}
            onClick={() => setActiveId(property.id)}
          >
            <span className={`${styles.pin} ${activeId === property.id ? styles.pinActive : ""}`}>{faNum(index + 1)}</span>
          </button>
        ))}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "var(--color-primary)" }} />
          گزینه پیشنهادی
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "var(--color-selected)" }} />
          انتخاب فعلی روی نقشه
        </span>
      </div>

      {activeProperty && (
        <div className={styles.preview}>
          <span className={styles.previewThumb} style={{ background: "linear-gradient(135deg, #3b93eb 0%, #7cb6f2 100%)" }}>
            <Buildings2 variant="Bold" size={20} color="currentColor" />
          </span>
          <span className={styles.previewBody}>
            <span className={styles.previewTitle}>{activeProperty.title}</span>
            <span className={styles.previewMeta}>
              رهن {formatRentalPrice(activeProperty.deposit)} · اجاره {formatRentalPrice(activeProperty.rent)}
            </span>
          </span>
          <button type="button" className={styles.previewCta} onClick={() => onViewProperty(activeProperty.id)}>
            مشاهده
          </button>
        </div>
      )}
    </div>
  );
}
