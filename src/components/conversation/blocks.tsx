"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft } from "@/components/icons/line";
import { ComponentHeader } from "@/components/ComponentHeader";
import { faNum } from "@/lib/faNum";
import type {
  ComparisonStatus,
  ConversationBlock,
  WorkoutDay,
} from "@/types/conversation";
import { QuestionOptionIcon } from "@/components/conversation/QuestionOptionIcon";
import { LaptopShoppingFlow } from "@/components/conversation/shopping/LaptopShoppingFlow";
import { MonthlyGroceryFlow } from "@/components/conversation/shopping/MonthlyGroceryFlow";
import { CryptoPortfolioFlow } from "@/components/conversation/shopping/CryptoPortfolioFlow";
import { RentalHouseFlow } from "@/components/conversation/shopping/RentalHouseFlow";
import styles from "./conversation.module.css";

const STATUS_LABEL: Record<ComparisonStatus, string> = {
  up: "بالاتر",
  down: "پایین‌تر",
  borderline: "مرزی",
};

const STATUS_CLASS: Record<ComparisonStatus, string> = {
  up: styles.statusUp,
  down: styles.statusDown,
  borderline: styles.statusBorderline,
};

function FileBlock({ fileName }: { fileName: string }) {
  return (
    <div className={styles.fileBlock}>
      <div className={styles.fileCard}>
        <div className={styles.fileThumb}>
          <div className={styles.fileThumbBar} />
          <div className={`${styles.fileThumbBar} ${styles.short}`} />
          <div className={styles.fileThumbBar} />
          <div className={styles.fileThumbBar} />
          <div className={`${styles.fileThumbBar} ${styles.short}`} />
          <div className={styles.fileThumbBar} />
          <div className={`${styles.fileThumbBar} ${styles.tiny}`} />
          <div className={styles.pdfBadge}>PDF</div>
        </div>
        <div className={styles.fileName}>{fileName}</div>
      </div>
    </div>
  );
}

/* fit-content only shrink-wraps a *single* rendered line — once the text wraps
   to 2+ lines it collapses to the full available width, since CSS sizing only
   knows the unwrapped max-content, not the width of the lines that result
   after wrapping. Measuring the real line boxes with Range.getClientRects()
   (not a canvas estimate) gets the exact wrapped width, then pins it so the
   bubble hugs the longest actual line instead of stretching to fill. */
export function UserBubble({ text }: { text: string }) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const bubbleEl = bubbleRef.current;
    const textNode = textRef.current?.firstChild;
    if (!bubbleEl || !textNode) return;

    const measure = () => {
      bubbleEl.style.width = "";
      const range = document.createRange();
      range.selectNodeContents(textNode);
      const rects = Array.from(range.getClientRects());
      if (rects.length <= 1) return; // single line — fit-content already hugs it
      const maxLineWidth = Math.max(...rects.map((r) => r.width));
      const cs = getComputedStyle(bubbleEl);
      const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      bubbleEl.style.width = `${Math.ceil(maxLineWidth + paddingX)}px`;
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text]);

  return (
    <div ref={bubbleRef} className={styles.userBubble}>
      <span ref={textRef}>{text}</span>
    </div>
  );
}

export function AssistantText({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className={styles.assistantText}>
      {paragraphs.map((p, i) => (
        <p key={i} className={styles.assistantPara}>
          {p}
        </p>
      ))}
    </div>
  );
}

function Questionnaire({
  step,
  total,
  question,
  options,
  selectedId,
  customPlaceholder,
}: Extract<ConversationBlock, { kind: "questionnaire" }>) {
  const [selected, setSelected] = useState(selectedId);
  return (
    <div className={styles.qCard}>
      <div className={styles.qHead}>
        {/* Question on the right, stepper on the left. */}
        <span className={styles.qQuestion}>{question}</span>
        <span className={styles.qProgress}>
          {faNum(step)} / {faNum(total)}
        </span>
      </div>

      <div className={styles.qOptions}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`${styles.qOption} ${selected === o.id ? styles.qOptionSelected : ""}`}
            onClick={() => setSelected(o.id)}
          >
            <QuestionOptionIcon icon={o.icon} />
            <span className={styles.qOptionLabel}>{o.label}</span>
          </button>
        ))}
        <input className={styles.qCustom} placeholder={customPlaceholder} />
      </div>

      <div className={styles.qFooter}>
        <button type="button" className={styles.qNext}>
          بعدی
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button type="button" className={styles.qBack} aria-label="قبلی">
          <ChevronLeft size={18} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}

function ComparisonTable({
  title,
  columns,
  rows,
}: Extract<ConversationBlock, { kind: "comparisonTable" }>) {
  return (
    <div className={styles.cmpCard}>
      <ComponentHeader title={title} className={styles.cmpHeader} />
      <table className={styles.cmpTable}>
        <thead>
          <tr>
            <th>{columns.metric}</th>
            <th>{columns.previous}</th>
            <th>{columns.current}</th>
            <th>{columns.status}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td className={styles.cmpMetric}>{r.label}</td>
              <td>{r.previous}</td>
              <td>{r.current}</td>
              <td>
                <span className={`${styles.statusPill} ${STATUS_CLASS[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Permission({
  primaryLabel,
  secondaryLabel,
}: Extract<ConversationBlock, { kind: "permission" }>) {
  return (
    <div className={styles.permBlock}>
      <button type="button" className={`${styles.permButton} ${styles.permPrimary}`}>
        {primaryLabel}
      </button>
      <button type="button" className={`${styles.permButton} ${styles.permSecondary}`}>
        {secondaryLabel}
      </button>
    </div>
  );
}

function ExerciseTable({
  title,
  columns,
  day,
}: {
  title: string;
  columns: { move: string; setsReps: string; rest: string };
  day: WorkoutDay;
}) {
  return (
    <div className={styles.exerciseCard}>
      <ComponentHeader title={title} className={styles.exerciseHeader} />
      <table className={styles.exTable}>
        <thead>
          <tr>
            <th>{columns.move}</th>
            <th>{columns.setsReps}</th>
            <th>{columns.rest}</th>
          </tr>
        </thead>
        <tbody>
          {day.exercises.map((e, i) => (
            <tr key={i}>
              <td>{e.move}</td>
              <td>{e.setsReps}</td>
              <td>{e.rest}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkoutPlan({
  exerciseTitle,
  columns,
  days,
}: Extract<ConversationBlock, { kind: "workoutPlan" }>) {
  const [dayId, setDayId] = useState(days[0].id);
  const day = days.find((d) => d.id === dayId) ?? days[0];

  return (
    <div>
      <div className={styles.dayRow}>
        {days.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`${styles.dayChip} ${d.id === dayId ? styles.dayChipSelected : ""}`}
            onClick={() => setDayId(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Placeholder body diagram — no illustrated muscle asset exists yet. */}
      <div className={styles.diagramCard}>
        <div className={styles.diagramGlyph}>🧍</div>
        <div className={styles.diagramMuscle}>عضله‌ی هدف: {day.muscle}</div>
        <div className={styles.diagramNote}>
          نمودار عضلات به‌صورت نمونه‌ی موقت است — تا وقتی اسِت تصویریِ واقعی اضافه بشه.
        </div>
      </div>

      <ExerciseTable title={exerciseTitle} columns={columns} day={day} />
    </div>
  );
}

function WeightChart({
  title,
  points,
  note,
}: Extract<ConversationBlock, { kind: "weightChart" }>) {
  const W = 300;
  const H = 150;
  const padX = 8;
  const padY = 16;
  const weights = points.map((p) => p.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const span = max - min || 1;
  const stepX = (W - padX * 2) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = padX + i * stepX;
    const y = padY + (1 - (p.weight - min) / span) * (H - padY * 2);
    return { x, y };
  });
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1].x.toFixed(1)} ${H - padY} L ${coords[0].x.toFixed(1)} ${H - padY} Z`;

  return (
    <div className={styles.chartCard}>
      <ComponentHeader title={title} className={styles.chartHeader} />
      <svg className={styles.chartSvg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#wt)" />
        <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={coords[0].x} cy={coords[0].y} r="3.5" fill="var(--color-primary)" />
        <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="4" fill="var(--color-primary)" />
      </svg>
      <div className={styles.chartNote}>
        <span aria-hidden>ⓘ</span>
        {note}
      </div>
    </div>
  );
}

export function renderBlock(block: ConversationBlock) {
  switch (block.kind) {
    case "file":
      return <FileBlock key={block.id} fileName={block.fileName} />;
    case "userText":
      return (
        <div key={block.id} className={styles.userBlock}>
          <UserBubble text={block.text} />
        </div>
      );
    case "assistantText":
      return <AssistantText key={block.id} paragraphs={block.paragraphs} />;
    case "comparisonTable":
      return <ComparisonTable key={block.id} {...block} />;
    case "questionnaire":
      return <Questionnaire key={block.id} {...block} />;
    case "permission":
      return <Permission key={block.id} {...block} />;
    case "workoutPlan":
      return <WorkoutPlan key={block.id} {...block} />;
    case "weightChart":
      return <WeightChart key={block.id} {...block} />;
    case "shoppingRecommendation":
      return (
        <LaptopShoppingFlow
          key={block.id}
          products={block.products}
          recommendedProductId={block.recommendedProductId}
        />
      );
    case "monthlyGroceryShopping":
      return <MonthlyGroceryFlow key={block.id} />;
    case "financeCryptoAnalysis":
      return <CryptoPortfolioFlow key={block.id} />;
    case "rentalHouseSearch":
      return <RentalHouseFlow key={block.id} />;
  }
}
