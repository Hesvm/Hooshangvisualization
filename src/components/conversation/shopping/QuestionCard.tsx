"use client";

import { useState } from "react";
import { ChevronLeft } from "@/components/icons/line";
import { QuestionOptionIcon } from "@/components/conversation/QuestionOptionIcon";
import { faNum } from "@/lib/faNum";
import type { QuestionDef } from "@/lib/mocks/shoppingScript";
import styles from "@/components/conversation/conversation.module.css";

export type QuestionAnswer = { id: string | null; label: string };

type QuestionCardProps = {
  step: number;
  total: number;
  definition: QuestionDef;
  initialAnswer?: QuestionAnswer;
  onBack?: () => void;
  onNext: (answer: QuestionAnswer) => void;
};

/**
 * A real working version of the existing Questionnaire pattern — the shared
 * `Questionnaire` in blocks.tsx has a non-functional Next button, so this
 * reuses its exact CSS classes but wires select/custom/back/next for real.
 */
export function QuestionCard({ step, total, definition, initialAnswer, onBack, onNext }: QuestionCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialAnswer?.id ?? null);
  const [customText, setCustomText] = useState(
    initialAnswer && initialAnswer.id === null ? initialAnswer.label : "",
  );
  const [submitted, setSubmitted] = useState(false);

  const hasCustomText = customText.trim().length > 0;
  const canSubmit = (selectedId !== null || hasCustomText) && !submitted;

  function pickOption(id: string) {
    setSelectedId(id);
    setCustomText("");
  }

  function handleCustomChange(value: string) {
    setCustomText(value);
    if (value.trim().length > 0) setSelectedId(null);
  }

  function handleNext() {
    if (!canSubmit) return;
    setSubmitted(true);
    if (selectedId !== null) {
      const option = definition.options.find((o) => o.id === selectedId);
      onNext({ id: selectedId, label: option?.label ?? selectedId });
    } else {
      onNext({ id: null, label: customText.trim() });
    }
  }

  return (
    <div className={styles.qCard}>
      <div className={styles.qHead}>
        <span className={styles.qQuestion}>{definition.question}</span>
        <span className={styles.qProgress}>
          {faNum(step)} / {faNum(total)}
        </span>
      </div>

      <div className={styles.qOptions}>
        {definition.options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`${styles.qOption} ${selectedId === o.id ? styles.qOptionSelected : ""}`}
            disabled={submitted}
            onClick={() => pickOption(o.id)}
          >
            <QuestionOptionIcon icon={o.icon} />
            <span className={styles.qOptionLabel}>{o.label}</span>
          </button>
        ))}
        {definition.allowCustom && (
          <input
            className={styles.qCustom}
            placeholder={definition.customPlaceholder}
            value={customText}
            disabled={submitted}
            onChange={(e) => handleCustomChange(e.target.value)}
          />
        )}
      </div>

      <div className={styles.qFooter}>
        <button
          type="button"
          className={styles.qNext}
          disabled={!canSubmit}
          style={{ opacity: canSubmit ? 1 : 0.45 }}
          onClick={handleNext}
        >
          بعدی
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          className={styles.qBack}
          aria-label="قبلی"
          disabled={!onBack || submitted}
          style={{ visibility: onBack ? "visible" : "hidden" }}
          onClick={() => onBack?.()}
        >
          <ChevronLeft size={18} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
