"use client";

import { motion } from "motion/react";
import type { DockAppEntry } from "@/types/home";
import { DockAppIcon, MoreTile } from "./DockAppIcon";
import styles from "./DockGrid.module.css";

type DockState = "collapsed" | "expanded";

type DockGridProps = {
  apps: DockAppEntry[];
  collapsedCount: number;
  state: DockState;
  onToggle: () => void;
};

const COLUMNS = 5;

const ROW_SPRING = { type: "spring" as const, stiffness: 340, damping: 32, mass: 0.9 };

const rowVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
};

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

/** Last slot of the last collapsed row is permanently the expand/collapse arrow — never another app. */
export function DockGrid({ apps, collapsedCount, state, onToggle }: DockGridProps) {
  const expanded = state === "expanded";
  const collapsedRows = chunk(apps.slice(0, collapsedCount), COLUMNS);
  const restRows = chunk(apps.slice(collapsedCount), COLUMNS);

  return (
    <div className={styles.grid}>
      {collapsedRows.map((row, index) => (
        <div className={styles.row} key={`collapsed-${index}`}>
          {row.map((app) => (
            <DockAppIcon key={app.id} app={app} />
          ))}
          {index === collapsedRows.length - 1 && <MoreTile expanded={expanded} onToggle={onToggle} />}
        </div>
      ))}

      {restRows.map((row, index) => (
        <motion.div
          key={index}
          className={styles.rowClip}
          variants={rowVariants}
          animate={expanded ? "expanded" : "collapsed"}
          initial={false}
          transition={{ ...ROW_SPRING, delay: expanded ? index * 0.06 : 0 }}
        >
          <div className={styles.row}>
            {row.map((app) => (
              <DockAppIcon key={app.id} app={app} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
