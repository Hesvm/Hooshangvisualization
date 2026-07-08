"use client";

import { useState } from "react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { NumericText } from "@/components/NumericText";
import { faNum, formatTomanCompact } from "@/lib/faNum";
import { TOTAL_INVESTABLE_AMOUNT } from "@/lib/allocation";
import {
  ALLOCATION_EDITOR_COPY,
  ALLOCATION_SAVED_COPY,
  ALLOCATION_SHARE_COMING_SOON_COPY,
} from "@/lib/mocks/financeCopy";
import { deriveRiskSummary } from "@/lib/allocation";
import type { AllocationItem, AllocationPresetId, LiquidityLevel, MarketId, RiskLevel } from "@/types/finance";
import { ChipRow } from "./ChipRow";
import { RangeSlider } from "./RangeSlider";
import styles from "./AllocationEditor.module.css";

type AllocationEditorProps = {
  items: AllocationItem[];
  activePresetId: AllocationPresetId | null;
  onSliderChange: (marketId: MarketId, value: number) => void;
  onPresetPick: (presetId: AllocationPresetId) => void;
  onReset: () => void;
};

const PRESET_CHIPS: { id: string; label: string }[] = [
  { id: "conservative", label: ALLOCATION_EDITOR_COPY.presetLabels.conservative },
  { id: "balanced", label: ALLOCATION_EDITOR_COPY.presetLabels.balanced },
  { id: "aggressive", label: ALLOCATION_EDITOR_COPY.presetLabels.aggressive },
];

const RISK_LABEL: Record<RiskLevel, string> = { low: "کم", medium: "متوسط", high: "بالا" };
const LIQUIDITY_LABEL: Record<LiquidityLevel, string> = { low: "کم", medium: "متوسط", high: "بالا" };

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className={styles.summaryStatLabel}>{label}</div>
      <div className={styles.summaryStatValue}>{value}</div>
    </div>
  );
}

export function AllocationEditor({ items, activePresetId, onSliderChange, onPresetPick, onReset }: AllocationEditorProps) {
  const [saved, setSaved] = useState(false);
  const [shareNoticeShown, setShareNoticeShown] = useState(false);
  const riskSummary = deriveRiskSummary(items);

  return (
    <div className={styles.card}>
      <ComponentHeader title={ALLOCATION_EDITOR_COPY.title} tone="accent" className={styles.header} />
      <p className={styles.subtitle}>{ALLOCATION_EDITOR_COPY.subtitle}</p>

      <ChipRow
        chips={PRESET_CHIPS}
        activeId={activePresetId ?? undefined}
        ariaLabel="پیش‌فرض تخصیص"
        onPick={(id) => onPresetPick(id as AllocationPresetId)}
      />

      <div className={styles.sliders}>
        {items.map((item) => (
          <div key={item.id} className={styles.sliderRow}>
            <div className={styles.sliderHead}>
              <span className={styles.sliderDot} style={{ background: item.color }} aria-hidden />
              <span className={styles.sliderLabel}>{item.label}</span>
              <span className={styles.sliderPercentage}>
                <NumericText>{faNum(item.percentage)}٪</NumericText>
              </span>
            </div>
            <RangeSlider
              value={item.percentage}
              min={item.min}
              max={item.max}
              accentColor={item.color}
              ariaLabel={item.label}
              onChange={(value) => onSliderChange(item.id, value)}
            />
            <div className={styles.sliderAmount}>
              <NumericText>{formatTomanCompact(Math.round((item.percentage / 100) * TOTAL_INVESTABLE_AMOUNT))}</NumericText>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>{ALLOCATION_EDITOR_COPY.totalAmountLabel}</span>
        <span className={styles.totalValue}>
          <NumericText>{formatTomanCompact(TOTAL_INVESTABLE_AMOUNT)}</NumericText>
        </span>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryTitle}>{ALLOCATION_EDITOR_COPY.summaryTitle}</div>
        <div className={styles.summaryGrid}>
          <SummaryStat label="سطح ریسک" value={RISK_LABEL[riskSummary.riskLevel]} />
          <SummaryStat label="نقدشوندگی" value={LIQUIDITY_LABEL[riskSummary.liquidityLevel]} />
          <SummaryStat label="بازه نوسان مورد انتظار" value={riskSummary.expectedVolatilityRange} />
          <SummaryStat label="افق زمانی پیشنهادی" value={riskSummary.recommendedMinimumHorizon} />
        </div>
      </div>

      <p className={styles.disclaimer}>{ALLOCATION_EDITOR_COPY.disclaimer}</p>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => {
            onReset();
            setSaved(false);
            setShareNoticeShown(false);
          }}
        >
          {ALLOCATION_EDITOR_COPY.secondaryActions.resetToPreset}
        </button>

        <button
          type="button"
          className={styles.actionButton}
          disabled={saved}
          style={{ opacity: saved ? 0.6 : 1 }}
          onClick={() => setSaved(true)}
        >
          {ALLOCATION_EDITOR_COPY.secondaryActions.saveAllocation}
        </button>
        {saved && <div className={styles.ackNote}>{ALLOCATION_SAVED_COPY}</div>}

        <button
          type="button"
          className={styles.actionButton}
          disabled={shareNoticeShown}
          style={{ opacity: shareNoticeShown ? 0.6 : 1 }}
          onClick={() => setShareNoticeShown(true)}
        >
          {ALLOCATION_EDITOR_COPY.secondaryActions.shareAllocation}
        </button>
        {shareNoticeShown && <div className={styles.ackNote}>{ALLOCATION_SHARE_COMING_SOON_COPY}</div>}
      </div>
    </div>
  );
}
