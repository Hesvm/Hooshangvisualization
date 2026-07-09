"use client";

import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import { RENTAL_BEST_MATCH_PROPERTY_ID, RENTAL_PROPERTIES, TEHRAN_DISTRICTS, formatRentalPrice } from "@/lib/mocks/rentalHouse";
import styles from "./RentalComparisonTable.module.css";

const ROWS = [
  { key: "area", label: "متراژ" },
  { key: "bedrooms", label: "اتاق‌خواب" },
  { key: "deposit", label: "رهن" },
  { key: "rent", label: "اجاره" },
  { key: "parking", label: "پارکینگ" },
  { key: "metro", label: "دسترسی مترو" },
] as const;

function districtLabel(districtId: string): string {
  return TEHRAN_DISTRICTS.find((d) => d.id === districtId)?.label ?? "";
}

function cellValue(rowKey: (typeof ROWS)[number]["key"], property: (typeof RENTAL_PROPERTIES)[number]): string {
  switch (rowKey) {
    case "area":
      return `${faNum(property.area)} متر`;
    case "bedrooms":
      return faNum(property.bedrooms);
    case "deposit":
      return formatRentalPrice(property.deposit);
    case "rent":
      return formatRentalPrice(property.rent);
    case "parking":
      return property.parking ? "داره" : "نداره";
    case "metro":
      return `${faNum(property.metroAccessMinutes)} دقیقه`;
  }
}

export function RentalComparisonTable() {
  return (
    <div className={styles.card}>
      <ComponentHeader title="جدول مقایسه گزینه‌ها" tone="muted" />

      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.headCell} ${styles.rowLabelCell}`}>محله</th>
              {RENTAL_PROPERTIES.map((property) => {
                const isBest = property.id === RENTAL_BEST_MATCH_PROPERTY_ID;
                return (
                  <th key={property.id} className={`${styles.headCell} ${isBest ? styles.bestColumn : ""}`}>
                    {districtLabel(property.districtId)}
                    {isBest && <span className={styles.bestLabel}>پیشنهادی</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key}>
                <td className={`${styles.cell} ${styles.rowLabelCell}`}>{row.label}</td>
                {RENTAL_PROPERTIES.map((property) => {
                  const isBest = property.id === RENTAL_BEST_MATCH_PROPERTY_ID;
                  return (
                    <td key={property.id} className={`${styles.cell} ${isBest ? styles.bestColumn : ""}`}>
                      {cellValue(row.key, property)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
