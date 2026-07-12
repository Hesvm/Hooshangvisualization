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

/* Single shared spring for every part of the dock (keyboard-follow, grid
   collapse, and the composer's own pill morph in Composer.tsx) so the whole
   thing reads as one object changing shape, not several independently-timed
   animations. Keep this value in sync with EMBEDDED_MORPH_SPRING there. */
const DOCK_MORPH_SPRING = { type: "spring" as const, stiffness: 380, damping: 36, mass: 0.9 };
const KEYBOARD_SPRING = DOCK_MORPH_SPRING;
const GRID_SPRING = DOCK_MORPH_SPRING;

/* Height animated to/from "auto" (not mounted/unmounted) so the grid keeps its
   scroll/expand state intact underneath — collapsing it is purely visual. */
const gridVariants = {
  visible: { height: "auto", opacity: 1, y: 0 },
  hidden: { height: 0, opacity: 0, y: -6 },
};

export function BottomDock({ onComposerStateChange }: BottomDockProps) {
  const [state, setState] = useState<DockState>("collapsed");
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [composerState, setComposerState] = useState<ComposerState>("idle");

  /* Any non-idle composer state (focused typing, voice recording, ...) means
     the composer is the primary focus — the apps grid steps out of the way. */
  const composerActive = composerState !== "idle";

  return (
    <motion.div
      className={`${styles.dock} ${composerActive ? styles.editing : ""}`}
      animate={{ y: -keyboardInset }}
      transition={KEYBOARD_SPRING}
    >
      <motion.div
        className={styles.gridClip}
        variants={gridVariants}
        animate={composerActive ? "hidden" : "visible"}
        initial={false}
        transition={GRID_SPRING}
      >
        <DockGrid
          apps={DOCK_APPS}
          collapsedCount={DOCK_COLLAPSED_COUNT}
          state={state}
          onToggle={() => setState((prev) => (prev === "collapsed" ? "expanded" : "collapsed"))}
        />
      </motion.div>
      <Composer
        variant="embedded"
        suggestions={homeComposerSuggestions}
        onStateChange={(next) => {
          setComposerState(next);
          onComposerStateChange(next);
        }}
        onKeyboardInsetChange={setKeyboardInset}
      />
    </motion.div>
  );
}

export type { ComposerState };
