"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "motion/react";
import { Hamburger } from "@/components/icons/line";
import { Drawer } from "@/components/drawer/Drawer";
import styles from "./HamburgerMenu.module.css";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.14, ease: "linear" as const } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: "linear" as const } },
};

/* Only this decorative, contentless span/div carries the shared layoutId —
   Framer interpolates its box (position/size/radius) between the circular
   trigger and the full drawer shell. Nothing with text or rows ever shares
   this id, so nothing legible gets stretched mid-morph. */
const openSurfaceTransition = { layout: { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] as const } };
const closeSurfaceTransition = { layout: { duration: 0.16, ease: [0.4, 0, 1, 1] as const } };

const iconVariants = {
  hidden: { opacity: 0, transition: { duration: 0.07 } },
  visible: { opacity: 1, transition: { duration: 0.065, delay: 0.1 } },
};

/* Content is a fully separate layer from the morphing surface — it only
   ever animates opacity/x, so it never visibly scales. */
const contentVariants = {
  hidden: { opacity: 0, x: 8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.12, delay: 0.045, ease: [0.2, 0.8, 0.2, 1] as const },
  },
  exit: {
    opacity: 0,
    x: 6,
    transition: { duration: 0.08, ease: [0.4, 0, 1, 1] as const },
  },
};

type HamburgerMenuProps = {
  className?: string;
};

export function HamburgerMenu({ className }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const reduceMotion = useReducedMotion();
  const surfaceLayoutId = reduceMotion ? undefined : "menu-surface";

  return (
    <LayoutGroup id="hamburger-menu">
      <AnimatePresence initial={false}>
        {!open ? (
          <motion.button
            key="trigger"
            type="button"
            className={`${styles.trigger} ${className ?? ""}`}
            aria-label="منو"
            onClick={() => setOpen(true)}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.07 }}
          >
            <motion.span
              layoutId={surfaceLayoutId}
              className={styles.triggerSurface}
              transition={closeSurfaceTransition}
            />
            <motion.span className={styles.iconWrap} variants={iconVariants} initial="hidden" animate="visible" exit="hidden">
              <Hamburger className={styles.icon} />
            </motion.span>
          </motion.button>
        ) : (
          <>
            <motion.button
              key="backdrop"
              type="button"
              className={styles.backdrop}
              aria-label="بستن منو"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={close}
            />
            <motion.div
              key="drawer-frame"
              className={styles.drawerFrame}
              role="dialog"
              aria-modal="true"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 90 || info.velocity.x > 500) close();
              }}
            >
              <motion.div layoutId={surfaceLayoutId} className={styles.drawerSurface} transition={openSurfaceTransition} />
              <motion.nav className={styles.drawerContent} variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                <Drawer onNavigate={close} />
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
