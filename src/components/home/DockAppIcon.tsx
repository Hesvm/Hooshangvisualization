import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUp2 } from "iconsax-react";
import type { DockAppEntry } from "@/types/home";
import styles from "./DockAppIcon.module.css";

type DockAppIconProps = {
  app: DockAppEntry;
};

const GROCERY_APP_ID = "kharid-supermarketi";

function TileVisual({ app }: { app: DockAppEntry }) {
  const isGrocery = app.id === GROCERY_APP_ID;
  const size = isGrocery ? 52 : 68;

  return (
    <span className={styles.iconWrap} style={{ background: `rgba(${app.accentRgb}, 0.12)` }}>
      <Image
        src={app.iconSrc}
        alt=""
        width={size}
        height={size}
        className={`${styles.icon} ${isGrocery ? "" : styles.iconLarge}`}
      />
      {app.hasNotification && <span className={styles.notificationDot} />}
    </span>
  );
}

export function DockAppIcon({ app }: DockAppIconProps) {
  const content = (
    <>
      <TileVisual app={app} />
      <span className={styles.label}>{app.label}</span>
    </>
  );

  if (app.href) {
    return (
      <Link href={app.href} className={styles.tile}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={styles.tile} disabled>
      {content}
    </button>
  );
}

type MoreTileProps = {
  expanded: boolean;
  onToggle: () => void;
};

/** Permanently occupies slot #1 — collapsed points up (more above), expanded points down (collapse). */
export function MoreTile({ expanded, onToggle }: MoreTileProps) {
  return (
    <button type="button" className={styles.tile} onClick={onToggle} aria-expanded={expanded} aria-label="نمایش همه اپ‌ها">
      <span className={styles.iconWrap} style={{ background: "var(--color-surface-subtle)" }}>
        <motion.span
          className={styles.moreArrow}
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowUp2 size={26} variant="Bold" color="currentColor" />
        </motion.span>
      </span>
      <span className={styles.label}>بیشتر</span>
    </button>
  );
}
