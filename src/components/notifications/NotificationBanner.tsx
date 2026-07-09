"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { VirtualNotification } from "./VirtualNotificationProvider";
import { LiquidGlassFilter } from "./LiquidGlassFilter";
import styles from "./NotificationBanner.module.css";

type NotificationBannerProps = {
  notification: VirtualNotification | null;
  onAutoDismissStart: (id: string) => void;
  onDismiss: (id: string) => void;
};

export function NotificationBanner({ notification, onAutoDismissStart, onDismiss }: NotificationBannerProps) {
  const prefersReducedMotion = useReducedMotion();
  const armedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!notification) return;
    if (armedFor.current === notification.id) return;
    armedFor.current = notification.id;
    onAutoDismissStart(notification.id);
  }, [notification, onAutoDismissStart]);

  return (
    <>
      <LiquidGlassFilter />
      <AnimatePresence initial={false}>
        {notification && (
          <motion.div
            key={notification.id}
            className={styles.virtualNotification}
            dir="ltr"
            role="status"
            aria-live="polite"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { y: -96, opacity: 0, scale: 0.982 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { y: 0, opacity: 1, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { y: -96, opacity: 0, scale: 0.982 }
            }
            transition={{ duration: 0.34, ease: [0.22, 0.8, 0.2, 1] }}
            onClick={() => {
              notification.onClick?.();
              onDismiss(notification.id);
            }}
          >
            <span className={styles.material} aria-hidden />
            <span className={styles.refract} aria-hidden />
            <span className={styles.rim} aria-hidden />
            <span className={styles.shine} aria-hidden />

            <div className={styles.notificationIconWrap}>
              {notification.icon ? (
                <Image
                  src={notification.icon}
                  alt=""
                  width={40}
                  height={40}
                  className={styles.notificationIcon}
                />
              ) : (
                <span className={styles.notificationIconFallback} aria-hidden />
              )}
            </div>

            <div className={styles.notificationText}>
              <div className={styles.notificationSource} dir="auto">
                {notification.sourceName}
              </div>
              <div className={styles.notificationTitle} dir="auto">
                {notification.title}
              </div>
              {notification.body && (
                <div className={styles.notificationBody} dir="auto">
                  {notification.body}
                </div>
              )}
            </div>

            <div className={styles.notificationTime}>{notification.timestampLabel ?? "now"}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
