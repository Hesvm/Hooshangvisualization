"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Composer, type ComposerState } from "@/components/Composer";
import { homeComposerSuggestions } from "@/config/spaces";
import { DOCK_APPS, DOCK_COLLAPSED_COUNT } from "@/config/dockApps";
import { DockGrid } from "./DockGrid";
import styles from "./BottomDock.module.css";

type DockState = "collapsed" | "expanded";

type BottomDockProps = {
  onComposerStateChange: (state: ComposerState) => void;
};

const DOCK_SPRING = { type: "spring" as const, stiffness: 340, damping: 32, mass: 0.9 };
const KEYBOARD_SPRING = { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.9 };

export function BottomDock({ onComposerStateChange }: BottomDockProps) {
  const [state, setState] = useState<DockState>("collapsed");
  const [keyboardInset, setKeyboardInset] = useState(0);

  return (
    <motion.div
      className={styles.dock}
      layout
      animate={{ y: -keyboardInset }}
      transition={{ ...DOCK_SPRING, y: KEYBOARD_SPRING }}
    >
      <DockGrid
        apps={DOCK_APPS}
        collapsedCount={DOCK_COLLAPSED_COUNT}
        state={state}
        onToggle={() => setState((prev) => (prev === "collapsed" ? "expanded" : "collapsed"))}
      />
      <Composer
        variant="embedded"
        suggestions={homeComposerSuggestions}
        onStateChange={onComposerStateChange}
        onKeyboardInsetChange={setKeyboardInset}
      />
    </motion.div>
  );
}

export type { ComposerState };
