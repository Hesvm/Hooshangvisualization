"use client";

import { Location, TickCircle } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { ADDRESS_SELECTION_CTA } from "@/lib/mocks/shoppingScript";
import type { Address } from "@/types/shopping";
import styles from "./AddressSelectionCard.module.css";

type AddressSelectionCardProps = {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
};

export function AddressSelectionCard({ addresses, selectedId, onSelect, onNext }: AddressSelectionCardProps) {
  return (
    <div className={styles.card}>
      <ComponentHeader
        title="انتخاب آدرس"
        className={styles.header}
        action={<Location variant="Bold" size={18} color="var(--color-history-heading)" />}
      />

      <div className={styles.addressList}>
        {addresses.map((address) => {
          const selected = selectedId === address.id;
          return (
            <button
              type="button"
              key={address.id}
              className={`${styles.addressItem} ${selected ? styles.addressItemSelected : ""}`}
              onClick={() => onSelect(address.id)}
            >
              <div className={styles.addressTopRow}>
                <span className={styles.addressLabel}>{address.label}</span>
                {selected && <TickCircle variant="Bold" size={18} color="var(--color-primary)" />}
              </div>
              <p className={styles.addressText}>{address.fullAddress}</p>
              <div className={styles.addressMeta}>
                <span>{address.recipientName}</span>
                <span className={styles.postalCode}>کد پستی {address.postalCode}</span>
              </div>
            </button>
          );
        })}
      </div>

      <button type="button" className={styles.cta} disabled={!selectedId} style={{ opacity: selectedId ? 1 : 0.5 }} onClick={onNext}>
        {ADDRESS_SELECTION_CTA}
      </button>
    </div>
  );
}
