"use client";

import { useState } from "react";
import { Buildings2, Heart, TickCircle, Warning2 } from "iconsax-react";
import { faNum } from "@/lib/faNum";
import { RENTAL_PROPERTIES, TEHRAN_DISTRICTS, formatRentalPrice } from "@/lib/mocks/rentalHouse";
import styles from "./RentalPropertyDetailSheet.module.css";

const IMAGE_GRADIENTS = [
  "linear-gradient(135deg, #3b93eb 0%, #7cb6f2 100%)",
  "linear-gradient(135deg, #565f73 0%, #2b2f3a 100%)",
  "linear-gradient(135deg, #c98a09 0%, #e3b98f 100%)",
];

function districtLabel(districtId: string): string {
  return TEHRAN_DISTRICTS.find((d) => d.id === districtId)?.label ?? "";
}

type RentalPropertyDetailSheetProps = {
  propertyId: string;
  onScheduleVisit: (propertyId: string) => void;
  onShowSimilar: () => void;
};

export function RentalPropertyDetailSheet({ propertyId, onScheduleVisit, onShowSimilar }: RentalPropertyDetailSheetProps) {
  const [saved, setSaved] = useState(false);
  const property = RENTAL_PROPERTIES.find((p) => p.id === propertyId);
  if (!property) return null;

  return (
    <div>
      <div className={styles.imageStrip}>
        {IMAGE_GRADIENTS.map((gradient, index) => (
          <span key={index} className={styles.imageTile} style={{ background: gradient }}>
            <Buildings2 variant="Bold" size={28} color="currentColor" />
          </span>
        ))}
      </div>

      <h3 className={styles.title}>{property.title}</h3>
      <p className={styles.metaLine}>
        {districtLabel(property.districtId)} · {faNum(property.area)} متر · {faNum(property.bedrooms)} خواب · {faNum(property.buildingAge)} سال ساخت
      </p>

      <div className={styles.priceRow}>
        <div className={styles.priceTile}>
          <span className={styles.priceLabel}>رهن</span>
          <span className={styles.priceValue}>{formatRentalPrice(property.deposit)}</span>
        </div>
        <div className={styles.priceTile}>
          <span className={styles.priceLabel}>اجاره ماهانه</span>
          <span className={styles.priceValue}>{formatRentalPrice(property.rent)}</span>
        </div>
      </div>

      <div className={styles.chipRow}>
        {property.features.map((feature) => (
          <span key={feature} className={styles.featureChip}>
            {feature}
          </span>
        ))}
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>نکات مثبت</span>
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
        <span className={styles.sectionLabel}>محدودیت‌ها</span>
        <div className={styles.list}>
          {property.limitations.map((item) => (
            <span key={item} className={styles.item}>
              <Warning2 variant="Bold" size={16} className={styles.itemIconWarn} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <p className={styles.accessibilityNote}>{property.accessibilityNote}</p>

      <div className={styles.ctaRow}>
        <button type="button" className={styles.ctaPrimary} onClick={() => onScheduleVisit(property.id)}>
          هماهنگی بازدید
        </button>
        <button
          type="button"
          className={`${styles.ctaSecondary} ${saved ? styles.ctaSaved : ""}`}
          onClick={() => setSaved((prev) => !prev)}
        >
          <Heart variant={saved ? "Bold" : "Linear"} size={16} color="currentColor" style={{ marginLeft: 6, verticalAlign: "-3px" }} />
          ذخیره
        </button>
        <button type="button" className={styles.ctaSecondary} onClick={onShowSimilar}>
          گزینه‌های مشابه
        </button>
      </div>
    </div>
  );
}
