"use client";

import type { ComponentType } from "react";
import { Chart2, Clock, Convertshape2, ShieldTick } from "iconsax-react";
import { ComponentHeader } from "@/components/ComponentHeader";
import { NumericText } from "@/components/NumericText";
import { faNum, formatTomanCompact } from "@/lib/faNum";
import { TOTAL_INVESTABLE_AMOUNT } from "@/lib/allocation";
import { ALLOCATION_EDITOR_COPY } from "@/lib/mocks/financeCopy";
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
};

const PRESET_CHIPS: { id: string; label: string }[] = [
  { id: "conservative", label: ALLOCATION_EDITOR_COPY.presetLabels.conservative },
  { id: "balanced", label: ALLOCATION_EDITOR_COPY.presetLabels.balanced },
  { id: "aggressive", label: ALLOCATION_EDITOR_COPY.presetLabels.aggressive },
];

const RISK_LABEL: Record<RiskLevel, string> = { low: "کم", medium: "متوسط", high: "بالا" };
const LIQUIDITY_LABEL: Record<LiquidityLevel, string> = { low: "کم", medium: "متوسط", high: "بالا" };

type IconComponent = ComponentType<{ variant?: "Linear" | "Bold"; size?: number; color?: string }>;

function SummaryStat({ label, value, icon: Icon }: { label: string; value: string; icon: IconComponent }) {
  return (
    <div className={styles.summaryStat}>
      <span className={styles.summaryStatIcon} aria-hidden>
        <Icon variant="Bold" size={15} color="currentColor" />
      </span>
      <div className={styles.summaryStatLabel}>{label}</div>
      <div className={styles.summaryStatValue}>{value}</div>
    </div>
  );
}

export function AllocationEditor({ items, activePresetId, onSliderChange, onPresetPick }: AllocationEditorProps) {
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
          <SummaryStat label="سطح ریسک" value={RISK_LABEL[riskSummary.riskLevel]} icon={ShieldTick} />
          <SummaryStat label="نقدشوندگی" value={LIQUIDITY_LABEL[riskSummary.liquidityLevel]} icon={Convertshape2} />
          <SummaryStat label="بازه نوسان مورد انتظار" value={riskSummary.expectedVolatilityRange} icon={Chart2} />
          <SummaryStat label="افق زمانی پیشنهادی" value={riskSummary.recommendedMinimumHorizon} icon={Clock} />
        </div>
      </div>

      <p className={styles.disclaimer}>{ALLOCATION_EDITOR_COPY.disclaimer}</p>
    </div>
  );
}
