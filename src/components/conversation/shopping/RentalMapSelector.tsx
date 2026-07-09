"use client";

import { useState } from "react";
import { CloseCircle } from "iconsax-react";
import { TEHRAN_DISTRICTS } from "@/lib/mocks/rentalHouse";
import styles from "./RentalMapSelector.module.css";

type RentalMapSelectorProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function RentalMapSelector({ selectedIds, onChange }: RentalMapSelectorProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim();

  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  }

  return (
    <div className={styles.wrap}>
      <input
        className={styles.search}
        placeholder="جست‌وجوی محله..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className={styles.mapCard}>
        <svg className={styles.svg} viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {TEHRAN_DISTRICTS.map((district) => {
            const selected = selectedIds.includes(district.id);
            const matches = !normalizedQuery || district.label.includes(normalizedQuery);
            return (
              <path
                key={district.id}
                d={district.path}
                className={`${styles.blob} ${selected ? styles.blobSelected : ""} ${!matches ? styles.blobDimmed : ""}`}
              />
            );
          })}
        </svg>

        {TEHRAN_DISTRICTS.map((district) => {
          const selected = selectedIds.includes(district.id);
          const matches = !normalizedQuery || district.label.includes(normalizedQuery);
          return (
            <button
              key={district.id}
              type="button"
              className={styles.districtButton}
              style={{ left: `${district.x}%`, top: `${district.y}%`, opacity: matches ? 1 : 0.4 }}
              aria-pressed={selected}
              onClick={() => toggle(district.id)}
            >
              <span className={`${styles.districtLabel} ${selected ? styles.districtLabelSelected : ""}`}>
                {district.label}
              </span>
            </button>
          );
        })}
      </div>

      {selectedIds.length > 0 ? (
        <div className={styles.chipRow}>
          {selectedIds.map((id) => {
            const district = TEHRAN_DISTRICTS.find((d) => d.id === id);
            if (!district) return null;
            return (
              <button key={id} type="button" className={styles.chip} onClick={() => toggle(id)}>
                {district.label}
                <CloseCircle variant="Bold" size={15} color="currentColor" />
              </button>
            );
          })}
        </div>
      ) : (
        <span className={styles.emptyChips}>روی نقشه محله‌های موردنظرت رو انتخاب کن</span>
      )}
    </div>
  );
}
