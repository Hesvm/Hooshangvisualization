"use client";

import type { ReactNode } from "react";
import { useIOSViewportHeight } from "@/hooks/useIOSViewportHeight";

type AppViewportProps = {
  children: ReactNode;
};

export function AppViewport({ children }: AppViewportProps) {
  useIOSViewportHeight();

  return <div className="app-shell">{children}</div>;
}
