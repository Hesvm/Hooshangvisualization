import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { Home } from "iconsax-react";
import styles from "./SpaceHeader.module.css";

type SpaceHeaderProps = {
  title: string;
  iconSrc: string;
  /* RGB channels (e.g. "232, 56, 79") of the space accent for the ambient glow. */
  accentRgb: string;
};

export function SpaceHeader({ title, iconSrc, accentRgb }: SpaceHeaderProps) {
  return (
    <>
      {/* Home shortcut, top-left. */}
      <Link href="/" className={styles.homeButton} aria-label="خانه">
        <Home variant="Linear" size={20} color="currentColor" />
      </Link>

      {/* Centered on the full frame width (independent of the right-side menu),
         with a soft accent glow diffusing behind the badge. */}
      <div
        className={styles.badgeWrapper}
        style={{ "--space-accent-rgb": accentRgb } as CSSProperties}
      >
        <div className={styles.glow} aria-hidden />

        <div className={styles.pill}>
          {/* First child in the RTL flex row = visual right (leading) edge, matching the reference. */}
          <span className={styles.pillIcon}>
            <Image src={iconSrc} alt="" width={42} height={42} />
          </span>
          <span className={styles.pillText}>{title}</span>
        </div>
      </div>

      <HamburgerMenu className={styles.menuButton} />
    </>
  );
}
