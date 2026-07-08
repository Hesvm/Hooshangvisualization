"use client";

import { Calendar, TickCircle, TruckFast } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { DELIVERY_SELECTION_CTA } from "@/lib/mocks/shoppingScript";
import type { DeliverySlot } from "@/types/shopping";
import styles from "./DeliveryDaySelector.module.css";

type DeliveryDaySelectorProps = {
  slots: DeliverySlot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
};

export function DeliveryDaySelector({ slots, selectedId, onSelect, onConfirm }: DeliveryDaySelectorProps) {
  return (
    <div className={styles.card}>
      <ComponentHeader
        title="زمان ارسال"
        className={styles.header}
        action={<Calendar variant="Bold" size={18} color="var(--color-history-heading)" />}
      />

      <div className={styles.slotList}>
        {slots.map((slot) => {
          const selected = selectedId === slot.id;
          return (
            <button
              type="button"
              key={slot.id}
              className={`${styles.slotItem} ${selected ? styles.slotItemSelected : ""}`}
              onClick={() => onSelect(slot.id)}
            >
              <div className={styles.slotIcon} aria-hidden>
                {slot.isExpress ? (
                  <TruckFast variant="Bold" size={18} color={selected ? "var(--color-primary)" : "var(--color-history-heading)"} />
                ) : (
                  <Calendar variant="Bold" size={18} color={selected ? "var(--color-primary)" : "var(--color-history-heading)"} />
                )}
              </div>
              <div className={styles.slotInfo}>
                <div className={styles.slotDay}>
                  {slot.dayLabel} · {slot.dateLabel}
                  {slot.isExpress && <span className={styles.expressBadge}>سریع</span>}
                </div>
                <div className={styles.slotTime}>ساعت {slot.timeWindow}</div>
              </div>
              {selected && <TickCircle variant="Bold" size={18} color="var(--color-primary)" />}
            </button>
          );
        })}
      </div>

      <button type="button" className={styles.cta} disabled={!selectedId} style={{ opacity: selectedId ? 1 : 0.5 }} onClick={onConfirm}>
        {DELIVERY_SELECTION_CTA}
      </button>
    </div>
  );
}
