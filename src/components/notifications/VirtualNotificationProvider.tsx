"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { NotificationBanner } from "./NotificationBanner";

export type VirtualNotificationKind = "success" | "info" | "warning";

export type VirtualNotification = {
  id: string;
  sourceName: string;
  title: string;
  body?: string;
  icon?: string;
  timestampLabel?: string;
  kind?: VirtualNotificationKind;
  onClick?: () => void;
};

export type ShowNotificationInput = Omit<VirtualNotification, "id"> & { id?: string };

type VirtualNotificationContextValue = {
  showNotification: (input: ShowNotificationInput) => string;
  dismissNotification: (id: string) => void;
};

const VirtualNotificationContext = createContext<VirtualNotificationContextValue | null>(null);

const DEFAULT_DURATION_MS = 4000;

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `virtual-notification-${idCounter}`;
}

export function VirtualNotificationProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<VirtualNotification | null>(null);
  const queue = useRef<VirtualNotification[]>([]);
  const dismissTimer = useRef<number | null>(null);

  const advanceQueue = useCallback(() => {
    const next = queue.current.shift();
    setActive(next ?? null);
  }, []);

  const dismissNotification = useCallback(
    (id: string) => {
      setActive((current) => {
        if (current?.id !== id) return current;
        if (dismissTimer.current) {
          window.clearTimeout(dismissTimer.current);
          dismissTimer.current = null;
        }
        return current;
      });
      // Defer so the exit animation can play before the next one mounts.
      window.setTimeout(() => {
        setActive((current) => (current?.id === id ? null : current));
        if (queue.current.length) advanceQueue();
      }, 260);
    },
    [advanceQueue],
  );

  const showNotification = useCallback((input: ShowNotificationInput) => {
    const notification: VirtualNotification = { ...input, id: input.id ?? nextId() };

    setActive((current) => {
      if (!current) {
        return notification;
      }
      queue.current.push(notification);
      return current;
    });

    return notification.id;
  }, []);

  const handleAutoDismiss = useCallback(
    (id: string) => {
      if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
      dismissTimer.current = window.setTimeout(() => {
        dismissNotification(id);
      }, DEFAULT_DURATION_MS);
    },
    [dismissNotification],
  );

  const value = useMemo(() => ({ showNotification, dismissNotification }), [showNotification, dismissNotification]);

  return (
    <VirtualNotificationContext.Provider value={value}>
      {children}
      <NotificationBanner
        notification={active}
        onAutoDismissStart={handleAutoDismiss}
        onDismiss={dismissNotification}
      />
    </VirtualNotificationContext.Provider>
  );
}

export function useVirtualNotifications() {
  const ctx = useContext(VirtualNotificationContext);
  if (!ctx) {
    throw new Error("useVirtualNotifications must be used within a VirtualNotificationProvider");
  }
  return ctx;
}
