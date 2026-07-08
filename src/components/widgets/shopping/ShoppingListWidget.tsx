import type { CSSProperties } from "react";
import Image from "next/image";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import type { ShoppingListPreviewItem, ShoppingListWidgetData } from "@/lib/mocks/shopping";
import shared from "@/components/widgets/shared.module.css";
import styles from "./ShoppingWidgets.module.css";

type ProductTileArea = "camera" | "phone" | "shoe";

type ShoppingListWidgetProps = {
  data: unknown;
  onOpen?: () => void;
};

const tileAreaClass: Record<ProductTileArea, string> = {
  camera: styles.shoppingListTileCamera,
  phone: styles.shoppingListTilePhone,
  shoe: styles.shoppingListTileShoe,
};

function productImageStyle(item: ShoppingListPreviewItem): CSSProperties {
  return {
    objectFit: item.imageFit ?? "contain",
    transform: `translate(${item.imageOffsetX ?? 0}px, ${item.imageOffsetY ?? 0}px) scale(${
      item.imageScale ?? 1
    })`,
  };
}

function ProductPreviewTile({ item }: { item: ShoppingListPreviewItem }) {
  const areaClass = item.id in tileAreaClass ? tileAreaClass[item.id as ProductTileArea] : "";

  return (
    <span className={`${styles.shoppingListTile} ${areaClass}`}>
      <Image
        fill
        className={styles.shoppingListImage}
        src={item.image}
        alt={item.name}
        sizes="72px"
        style={productImageStyle(item)}
        loading="lazy"
        draggable={false}
      />
    </span>
  );
}

function RemainingCountTile({ count }: { count: number }) {
  const persianCount = faNum(count);

  return (
    <span
      className={`${styles.shoppingListTile} ${styles.shoppingListTileRemaining}`}
      aria-label={`${persianCount} کالای دیگر`}
    >
      <span aria-hidden>+{persianCount}</span>
    </span>
  );
}

export function ShoppingListWidget({ data, onOpen }: ShoppingListWidgetProps) {
  const d = data as ShoppingListWidgetData;
  const visibleItems = d.items.slice(0, d.visibleCount);
  const remainingCount = Math.max(0, d.totalCount - visibleItems.length);

  return (
    <button
      type="button"
      className={`${shared.card} ${styles.shoppingListWidget}`}
      onClick={onOpen}
      aria-label="باز کردن لیست خرید"
      dir="rtl"
    >
      <ComponentHeader as="span" title={d.title} titleAs="span" className={styles.shoppingListHeader} />

      <span className={styles.shoppingListGrid} aria-hidden={false}>
        {visibleItems.map((item) => (
          <ProductPreviewTile key={item.id} item={item} />
        ))}
        <RemainingCountTile count={remainingCount} />
      </span>
    </button>
  );
}
