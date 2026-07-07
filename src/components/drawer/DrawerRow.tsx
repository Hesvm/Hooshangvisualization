import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./DrawerRow.module.css";

type DrawerRowProps = {
  icon: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  brand?: boolean;
};

export function DrawerRow({ icon, label, href, onClick, selected, disabled, brand }: DrawerRowProps) {
  const className = [styles.row, selected && styles.selected, disabled && styles.disabled, brand && styles.brand]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
