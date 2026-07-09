"use client";

import { TickCircle } from "iconsax-react";
import { RENTAL_BEDROOM_OPTIONS, TEHRAN_DISTRICTS, formatRentalPrice, type RentalAnswers } from "@/lib/mocks/rentalHouse";
import styles from "./RentalAutoSearchCard.module.css";

type RentalAutoSearchCardProps = {
  answers: RentalAnswers;
};

export function RentalAutoSearchCard({ answers }: RentalAutoSearchCardProps) {
  const districts = answers.districtIds
    .map((id) => TEHRAN_DISTRICTS.find((d) => d.id === id)?.label)
    .filter(Boolean)
    .join("، ");
  const bedrooms = RENTAL_BEDROOM_OPTIONS.find((option) => option.id === answers.bedroomsId)?.label ?? "";

  return (
    <div className={styles.card}>
      <span className={styles.icon}>
        <TickCircle variant="Bold" size={18} color="currentColor" />
      </span>
      <span className={styles.body}>
        <span className={styles.title}>باشه، هر چند ساعت گزینه‌های تازه رو چک می‌کنم</span>
        <span className={styles.criteria}>
          محدوده: {districts || "محله‌های انتخابی"} · تا {formatRentalPrice(answers.rentBudget)} اجاره · {bedrooms} خواب
        </span>
      </span>
    </div>
  );
}
