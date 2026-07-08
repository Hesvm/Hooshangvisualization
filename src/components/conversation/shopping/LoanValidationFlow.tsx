"use client";

import { useEffect, useRef, useState } from "react";
import { DocumentText } from "iconsax-react";
import type { ValidationStage } from "@/types/shopping";
import styles from "./LoanValidationFlow.module.css";

type LoanValidationFlowProps = {
  stages: ValidationStage[];
  onAllComplete: () => void;
};

export function LoanValidationFlow({ stages: initialStages, onAllComplete }: LoanValidationFlowProps) {
  const [stages, setStages] = useState<ValidationStage[]>(() =>
    initialStages.map((stage, index) =>
      index === 0 ? { ...stage, status: "active", startedAt: Date.now() } : stage,
    ),
  );
  const [now, setNow] = useState(() => Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    let frame: number;
    const tick = () => {
      const nowTs = Date.now();
      setNow(nowTs);
      setStages((current) => {
        const activeIndex = current.findIndex((s) => s.status === "active");
        if (activeIndex === -1) return current;
        const active = current[activeIndex];
        if (!active.startedAt || nowTs - active.startedAt < active.durationMs) return current;
        return current.map((stage, index) => {
          if (index === activeIndex) return { ...stage, status: "completed" };
          if (index === activeIndex + 1) return { ...stage, status: "active", startedAt: nowTs };
          return stage;
        });
      });
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (completedRef.current) return;
    if (stages.length > 0 && stages.every((s) => s.status === "completed")) {
      completedRef.current = true;
      onAllComplete();
    }
  }, [stages, onAllComplete]);

  const completedCount = stages.filter((s) => s.status === "completed").length;
  const activeStage = stages.find((s) => s.status === "active");
  const activeElapsed = activeStage?.startedAt ? Math.max(0, now - activeStage.startedAt) : 0;
  const activeProgress = activeStage ? Math.min(1, activeElapsed / activeStage.durationMs) : 0;
  const progress = stages.length > 0 ? Math.min(1, (completedCount + activeProgress) / stages.length) : 0;
  const allComplete = stages.length > 0 && completedCount === stages.length;
  const ringRadius = 92;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  return (
    <div className={styles.card}>
      <div className={styles.progressRing} aria-hidden="true">
        <svg className={styles.ringSvg} viewBox="0 0 220 220">
          <circle className={styles.ringTrack} cx="110" cy="110" r={ringRadius} />
          <circle
            className={styles.ringFill}
            cx="110"
            cy="110"
            r={ringRadius}
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
          />
        </svg>
        <div className={styles.iconShell}>
          <DocumentText variant="Bulk" size={64} color="currentColor" />
        </div>
      </div>

      <h3 className={styles.title}>{allComplete ? "رتبه سنجی تکمیل شد" : "در حال رتبه سنجی سمات..."}</h3>
      <p key={allComplete ? "complete" : activeStage?.id} className={styles.remaining}>
        {allComplete ? "همه مراحل با موفقیت انجام شد" : activeStage?.processingText}
      </p>
    </div>
  );
}
