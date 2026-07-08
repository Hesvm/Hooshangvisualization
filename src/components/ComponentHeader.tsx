import Image from "next/image";
import type { ElementType, ReactNode } from "react";
import styles from "./ComponentHeader.module.css";

type ComponentHeaderTone = "default" | "muted" | "light" | "accent";

type ComponentHeaderProps = {
  title: ReactNode;
  logo?: string;
  logoAlt?: string;
  action?: ReactNode;
  className?: string;
  as?: ElementType;
  titleAs?: ElementType;
  tone?: ComponentHeaderTone;
};

const toneClass: Record<ComponentHeaderTone, string> = {
  default: "",
  muted: styles.muted,
  light: styles.light,
  accent: styles.accent,
};

export function ComponentHeader({
  title,
  logo,
  logoAlt = "",
  action,
  className = "",
  as: RootTag = "header",
  titleAs: TitleTag = "h3",
  tone = "default",
}: ComponentHeaderProps) {
  const leftSlot =
    action ??
    (logo ? (
      <Image
        className={styles.logo}
        src={logo}
        alt={logoAlt}
        aria-hidden={logoAlt === "" ? true : undefined}
        width={16}
        height={16}
      />
    ) : null);

  return (
    <RootTag className={`${styles.header} ${toneClass[tone]} ${className}`}>
      <TitleTag className={styles.title}>{title}</TitleTag>
      {leftSlot && <div className={styles.leftSlot}>{leftSlot}</div>}
    </RootTag>
  );
}
