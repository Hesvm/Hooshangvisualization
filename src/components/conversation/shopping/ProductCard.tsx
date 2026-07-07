"use client";

import type { Icon } from "iconsax-react";
import { CpuCharge, MedalStar, Star1, WalletMoney } from "iconsax-react";
import { faNum } from "@/lib/faNum";
import { PRODUCT_ROLE_LABEL, type ProductRole, type ShoppingProduct } from "@/types/shopping";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: ShoppingProduct;
  onOpenDeepDive: (productId: string) => void;
};

const ROLE_ICONS: Record<ProductRole, Icon> = {
  economical: WalletMoney,
  balanced: MedalStar,
  powerful: CpuCharge,
};

const ROLE_CLASSES: Record<ProductRole, string> = {
  economical: styles.roleEconomical,
  balanced: styles.roleBalanced,
  powerful: styles.rolePowerful,
};

export function ProductCard({ product, onOpenDeepDive }: ProductCardProps) {
  const RoleIcon = ROLE_ICONS[product.role];

  return (
    <div className={styles.card}>
      <div className={styles.hero}>
        <div className={styles.imageSlot} aria-hidden>
          {product.imageGlyph}
        </div>
        <span className={`${styles.rolePill} ${ROLE_CLASSES[product.role]}`}>
          <RoleIcon variant="Bold" size={13} color="currentColor" />
          {PRODUCT_ROLE_LABEL[product.role]}
        </span>
      </div>

      <div className={styles.ratingRow}>
        <Star1 variant="Bold" size={14} color="var(--color-warning)" />
        <span className={styles.ratingValue}>{faNum(product.rating)}</span>
        <span>({faNum(product.reviewCount)} نظر)</span>
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.config}>{product.configuration}</div>
      </div>

      <div className={styles.price}>{faNum(product.price)} میلیون تومان</div>

      <div className={styles.copyBlock}>
        <p className={styles.positioning}>{product.suitableFor}</p>
        <p className={styles.reviewSummary}>{product.shortReviewSummary}</p>
      </div>

      <button type="button" className={styles.deepDiveButton} onClick={() => onOpenDeepDive(product.id)}>
        بررسی کامل
      </button>
    </div>
  );
}
