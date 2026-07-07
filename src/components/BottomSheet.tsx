"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import styles from "./BottomSheet.module.css";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
};

/** Generic bottom sheet, reused for product deep dives, the match-score
 * breakdown, and the seller explanation — same drag-to-dismiss pattern as
 * HamburgerMenu's side drawer, just bottom-anchored instead of right-anchored. */
export function BottomSheet({ open, onClose, ariaLabel, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            key="backdrop"
            type="button"
            className={styles.backdrop}
            aria-label="بستن"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.14, ease: "linear" } }}
            exit={{ opacity: 0, transition: { duration: 0.12, ease: "linear" } }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) onClose();
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0, transition: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] } }}
            exit={{ y: "100%", transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
          >
            <div className={styles.grabber} aria-hidden />
            <div className={styles.content}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
