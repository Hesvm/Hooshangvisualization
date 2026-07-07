"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Composer, type ComposerState } from "@/components/Composer";
import type { ComposerSuggestion } from "@/types/space";
import styles from "./SpacePageLayout.module.css";

type SpacePageLayoutProps = {
  header: ReactNode;
  widgets: ReactNode;
  history: ReactNode;
  suggestions?: ComposerSuggestion[];
};

export function SpacePageLayout({ header, widgets, history, suggestions }: SpacePageLayoutProps) {
  const [composerState, setComposerState] = useState<ComposerState>("idle");
  const isComposerFocused = composerState === "focused";

  return (
    <main className={styles.frame}>
      <div className={`${styles.scrollArea} ${isComposerFocused ? styles.scrollAreaRaised : ""}`}>
        {widgets}
        {history}
      </div>

      {/* Decorative header fade/blur — sits above the scroll content, below the controls. */}
      <div className={styles.topEdge} aria-hidden />

      {header}

      <Composer suggestions={suggestions} onStateChange={setComposerState} />
    </main>
  );
}
