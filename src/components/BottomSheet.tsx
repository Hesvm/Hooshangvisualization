"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
 * HamburgerMenu's side drawer, just bottom-anchored instead of right-anchored.
 *
 * Portals to document.body: callers mount this from deep inside the conversation's
 * scrollArea, which sets `transform: translateY(0)` for its raise/lower animation —
 * any transform makes an ancestor a containing block for absolute/fixed descendants,
 * so without the portal the sheet would scroll away with the conversation instead of
 * staying pinned to the viewport. */
export function BottomSheet({ open, onClose, ariaLabel, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={styles.viewport}>
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
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
