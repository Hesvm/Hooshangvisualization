"use client";

import Image from "next/image";
import { Add, Minus } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { Price } from "@/components/Price";
import { faNum, formatPersianNumber } from "@/lib/faNum";
import { ORDER_SUMMARY_NEXT_CTA } from "@/lib/mocks/shoppingScript";
import type { ShoppingProduct } from "@/types/shopping";
import styles from "./OrderSummaryCard.module.css";

type OrderSummaryCardProps = {
  product: ShoppingProduct;
  unitPriceToman: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onNext: () => void;
};

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 3;

export function OrderSummaryCard({ product, unitPriceToman, quantity, onQuantityChange, onNext }: OrderSummaryCardProps) {
  const total = unitPriceToman * quantity;

  return (
    <div className={styles.card}>
      <ComponentHeader
        title="سبد خرید دیجی‌کالا"
        className={styles.header}
        action={
          <Image
            src="/images/brands/digikala-logo.svg"
            alt=""
            width={18}
            height={18}
            aria-hidden
          />
        }
      />

      <div className={styles.productRow}>
        <div className={styles.productImage} aria-hidden>
          {product.imageGlyph}
        </div>
        <div className={styles.productInfo}>
          <div className={styles.productName}>{product.name}</div>
          <div className={styles.productConfig}>{product.configuration}</div>
          <Price className={styles.unitPrice} amount={formatPersianNumber(unitPriceToman)} />
        </div>
        <div className={styles.quantityControl}>
          <button
            type="button"
            aria-label="کم کردن"
            disabled={quantity <= MIN_QUANTITY}
            onClick={() => onQuantityChange(Math.max(MIN_QUANTITY, quantity - 1))}
          >
            <Minus variant="Linear" size={16} color="currentColor" />
          </button>
          <span>{faNum(quantity)}</span>
          <button
            type="button"
            aria-label="زیاد کردن"
            disabled={quantity >= MAX_QUANTITY}
            onClick={() => onQuantityChange(Math.min(MAX_QUANTITY, quantity + 1))}
          >
            <Add variant="Linear" size={16} color="currentColor" />
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.totalRow}>
        <span>مبلغ قابل پرداخت</span>
        <Price className={styles.totalPrice} amount={formatPersianNumber(total)} />
      </div>

      <button type="button" className={styles.cta} onClick={onNext}>
        {ORDER_SUMMARY_NEXT_CTA}
      </button>
    </div>
  );
}
