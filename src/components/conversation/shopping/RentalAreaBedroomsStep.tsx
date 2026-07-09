"use client";

import { RENTAL_AREA_OPTIONS, RENTAL_BEDROOM_OPTIONS } from "@/lib/mocks/rentalHouse";
import styles from "./RentalAreaBedroomsStep.module.css";

type RentalAreaBedroomsStepProps = {
  areaId: string;
  bedroomsId: string;
  onChangeArea: (id: string) => void;
  onChangeBedrooms: (id: string) => void;
};

export function RentalAreaBedroomsStep({ areaId, bedroomsId, onChangeArea, onChangeBedrooms }: RentalAreaBedroomsStepProps) {
  return (
    <div>
      <div className={styles.section}>
        <span className={styles.label}>متراژ</span>
        <div className={styles.pillRow}>
          {RENTAL_AREA_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.pill} ${areaId === option.id ? styles.pillSelected : ""}`}
              aria-pressed={areaId === option.id}
              onClick={() => onChangeArea(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.label}>تعداد خواب</span>
        <div className={styles.pillRow}>
          {RENTAL_BEDROOM_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.pill} ${bedroomsId === option.id ? styles.pillSelected : ""}`}
              aria-pressed={bedroomsId === option.id}
              onClick={() => onChangeBedrooms(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
