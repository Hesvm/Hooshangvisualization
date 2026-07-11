"use client";

import { useRef, useState } from "react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import {
  RENTAL_BADGE_LABEL,
  RENTAL_CURATED_PROPERTIES,
  RENTAL_VIBE_OPTIONS,
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

function districtLabel(districtId: string): string {
  return TEHRAN_DISTRICTS.find((d) => d.id === districtId)?.label ?? "";
}

function photosFor(index: number): string[] {
  const sources = RENTAL_VIBE_OPTIONS.map((vibe) => vibe.imageSrc);
  return Array.from({ length: sources.length }, (_, i) => sources[(index + i) % sources.length]);
}

type PropertyPhotoCarouselProps = {
  photos: string[];
  badge: RentalBadge;
};

function PropertyPhotoCarousel({ photos, badge }: PropertyPhotoCarouselProps) {
  const scrollerRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <span className={styles.photoWrap}>
      <span className={styles.photoScroller} ref={scrollerRef} onScroll={handleScroll}>
        {photos.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} className={styles.photo} src={src} alt="" draggable={false} />
        ))}
      </span>

      <span className={styles.badge} style={BADGE_STYLE[badge]}>
        {RENTAL_BADGE_LABEL[badge]}
      </span>

      {photos.length > 1 ? (
        <span className={styles.dots} aria-hidden="true">
          {photos.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`} />
          ))}
        </span>
      ) : null}
    </span>
  );
}

type RentalResultListProps = {
  onViewProperty: (propertyId: string) => void;
  properties?: RentalProperty[];
};

export function RentalResultList({ onViewProperty, properties = RENTAL_CURATED_PROPERTIES }: RentalResultListProps) {
  return (
    <div className={styles.wrap}>
      <ComponentHeader title="گزینه‌های پیشنهادی" tone="muted" />

      <div className={styles.list}>
        {properties.map((property, index) => (
          <div key={property.id} className={styles.propertyCard}>
            <PropertyPhotoCarousel photos={photosFor(index)} badge={property.badge} />

            <div className={styles.body}>
              <span className={styles.title}>{property.title}</span>
              <span className={styles.meta}>
                {districtLabel(property.districtId)} · {faNum(property.area)} متر · {faNum(property.bedrooms)} خواب
              </span>

              <span className={styles.priceFrames}>
                <span className={styles.priceFrame}>
                  <span className={styles.priceLabel}>رهن</span>
                  <span className={styles.priceValue}>{formatRentalPrice(property.deposit)}</span>
                </span>
                <span className={styles.priceFrame}>
                  <span className={styles.priceLabel}>اجاره</span>
                  <span className={styles.priceValue}>{formatRentalPrice(property.rent)}</span>
                </span>
              </span>

              <span className={styles.features}>{property.features.join("، ")}</span>

              <button type="button" className={styles.cta} onClick={() => onViewProperty(property.id)}>
                مشاهده
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
