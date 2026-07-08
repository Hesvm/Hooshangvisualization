"use client";

import { useEffect, useRef, useState } from "react";
import { AssistantText, UserBubble } from "@/components/conversation/blocks";
import { ThinkingBeat } from "@/components/conversation/HooshangThinkingState";
import { BottomSheet } from "@/components/BottomSheet";
import { EXCHANGES } from "@/lib/mocks/exchanges";
import { PORTFOLIO_DATA } from "@/lib/mocks/portfolio";
import { PRESETS, redistribute } from "@/lib/allocation";
import {
  ALLOCATION_INTRO_COPY,
  ALLOCATION_THINKING_MESSAGES,
  CHIP_FOLLOWUP_COPY,
  CONNECTING_THINKING_MESSAGES,
  EXCHANGE_SHEET_COPY,
  EXCHANGE_STEP_COPY,
  EXCHANGE_UNAVAILABLE_NOTE,
  INITIAL_THINKING_MESSAGES,
  PORTFOLIO_CHIPS,
  PORTFOLIO_RESULT_COPY,
  RISK_QUESTIONS,
  TIMING,
} from "@/lib/mocks/financeCopy";
import type { AllocationItem, AllocationPresetId, MarketId } from "@/types/finance";
import { ChipRow } from "./ChipRow";
import { QuestionCard, type QuestionAnswer } from "./QuestionCard";
import { Reveal } from "./Reveal";
import { ExchangeSelectionList } from "./ExchangeSelectionList";
import { ExchangeConnectionSheet } from "./ExchangeConnectionSheet";
import { PortfolioSummaryCard } from "./PortfolioSummaryCard";
import { PortfolioInsights } from "./PortfolioInsights";
import { AllocationEditor } from "./AllocationEditor";
import styles from "./CryptoPortfolioFlow.module.css";

const PORTFOLIO_CHIP_LIST = [PORTFOLIO_CHIPS.crossMarketAllocation, PORTFOLIO_CHIPS.rebalanceTips];

type FlowState = {
  initialThinking: boolean;
  promptVisible: boolean;
  exchangeListVisible: boolean;
  selectedExchangeId: string | null;
  sheetOpen: boolean;
  unavailableNoticeVisible: boolean;
  connecting: boolean;
  portfolioIntroVisible: boolean;
  portfolioResultVisible: boolean;

  answeredChips: string[];
  chipResponses: Record<string, string>;

  allocationUserMessageVisible: boolean;
  allocationPromptVisible: boolean;
  currentQuestionIndex: number; // -1 = not started, RISK_QUESTIONS.length = all answered
  riskAnswers: (QuestionAnswer | null)[];
  allocationThinking: boolean;
  allocationEditorVisible: boolean;
  allocationItems: AllocationItem[];
  allocationPresetId: AllocationPresetId | null;
  recommendedPresetId: AllocationPresetId | null;
};

function makeInitialState(): FlowState {
  return {
    initialThinking: true,
    promptVisible: false,
    exchangeListVisible: false,
    selectedExchangeId: null,
    sheetOpen: false,
    unavailableNoticeVisible: false,
    connecting: false,
    portfolioIntroVisible: false,
    portfolioResultVisible: false,

    answeredChips: [],
    chipResponses: {},

    allocationUserMessageVisible: false,
    allocationPromptVisible: false,
    currentQuestionIndex: -1,
    riskAnswers: RISK_QUESTIONS.map(() => null),
    allocationThinking: false,
    allocationEditorVisible: false,
    allocationItems: [],
    allocationPresetId: null,
    recommendedPresetId: null,
  };
}

/** Derives a starting preset from the two risk-questionnaire answers — a
 * simple deterministic mock rule, not a real risk-scoring model. */
function pickPreset(answers: (QuestionAnswer | null)[]): AllocationPresetId {
  const horizon = answers[0]?.id;
  const risk = answers[1]?.id;
  if (risk === "high") return "aggressive";
  if (risk === "low") return "conservative";
  if (horizon === "long") return "aggressive";
  if (horizon === "short") return "conservative";
  return "balanced";
}

/** Orchestrates the scripted crypto-portfolio-analysis conversation: exchange
 * connect → thinking → portfolio results → follow-up chips, one of which
 * (cross-market allocation) opens a risk questionnaire + allocation editor.
 * Mirrors the flat FlowState/patch/schedule architecture of `LaptopShoppingFlow`. */
export function CryptoPortfolioFlow() {
  const [state, setState] = useState<FlowState>(() => makeInitialState());
  const timers = useRef<number[]>([]);

  function schedule(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id);
      fn();
    }, ms);
    timers.current.push(id);
  }

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, []);

  function patch(partial: Partial<FlowState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  useEffect(() => {
    schedule(() => {
      patch({ initialThinking: false, promptVisible: true });
      schedule(() => {
        patch({ exchangeListVisible: true });
      }, TIMING.promptToListMs);
    }, TIMING.initialThinkingMs);
  }, []);

  function handleSelectExchange(id: string) {
    if (id !== "bitpin") {
      patch({ selectedExchangeId: id, unavailableNoticeVisible: true });
      return;
    }
    patch({ selectedExchangeId: id, sheetOpen: true, unavailableNoticeVisible: false });
  }

  function handleCancelConnection() {
    patch({ sheetOpen: false, selectedExchangeId: null });
  }

  function handleConfirmConnection() {
    patch({ sheetOpen: false, connecting: true });
    schedule(() => {
      patch({ connecting: false });
      schedule(() => {
        patch({ portfolioIntroVisible: true });
        schedule(() => {
          patch({ portfolioResultVisible: true });
        }, TIMING.portfolioResultDelayMs);
      }, TIMING.portfolioIntroDelayMs);
    }, TIMING.connectionThinkingMs);
  }

  function handleChipPick(chipId: string) {
    if (state.answeredChips.includes(chipId)) return;
    patch({ answeredChips: [...state.answeredChips, chipId] });

    if (chipId === PORTFOLIO_CHIPS.crossMarketAllocation.id) {
      schedule(() => {
        patch({ allocationUserMessageVisible: true });
        schedule(() => {
          patch({ allocationPromptVisible: true });
          schedule(() => {
            patch({ currentQuestionIndex: 0 });
          }, TIMING.questionAdvanceMs);
        }, TIMING.allocationPromptDelayMs);
      }, TIMING.allocationUserMessageDelayMs);
      return;
    }

    schedule(() => {
      setState((prev) => ({
        ...prev,
        chipResponses: { ...prev.chipResponses, [chipId]: CHIP_FOLLOWUP_COPY[chipId] },
      }));
    }, TIMING.chipFollowupDelayMs);
  }

  function handleRiskAnswer(index: number, answer: QuestionAnswer) {
    setState((prev) => {
      const riskAnswers = [...prev.riskAnswers];
      riskAnswers[index] = answer;
      return { ...prev, riskAnswers };
    });

    if (index < RISK_QUESTIONS.length - 1) {
      schedule(() => patch({ currentQuestionIndex: index + 1 }), TIMING.questionAdvanceMs);
      return;
    }

    schedule(() => {
      patch({ currentQuestionIndex: RISK_QUESTIONS.length, allocationThinking: true });
      schedule(() => {
        setState((prev) => {
          const presetId = pickPreset(prev.riskAnswers);
          return {
            ...prev,
            allocationThinking: false,
            recommendedPresetId: presetId,
            allocationPresetId: presetId,
            allocationItems: PRESETS[presetId].map((item) => ({ ...item })),
          };
        });
        schedule(() => patch({ allocationEditorVisible: true }), TIMING.allocationEditorDelayMs);
      }, TIMING.allocationThinkingMs);
    }, TIMING.questionAdvanceMs);
  }

  function handleRiskQuestionBack() {
    setState((prev) => ({ ...prev, currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1) }));
  }

  function handleSliderChange(marketId: MarketId, value: number) {
    setState((prev) => ({
      ...prev,
      allocationItems: redistribute(prev.allocationItems, marketId, value),
      allocationPresetId: null,
    }));
  }

  function handlePresetPick(presetId: AllocationPresetId) {
    patch({
      allocationItems: PRESETS[presetId].map((item) => ({ ...item })),
      allocationPresetId: presetId,
    });
  }

  function handleResetAllocation() {
    if (!state.recommendedPresetId) return;
    patch({
      allocationItems: PRESETS[state.recommendedPresetId].map((item) => ({ ...item })),
      allocationPresetId: state.recommendedPresetId,
    });
  }

  const selectedExchange = EXCHANGES.find((e) => e.id === state.selectedExchangeId) ?? null;
  const currentRiskQuestion =
    state.currentQuestionIndex >= 0 && state.currentQuestionIndex < RISK_QUESTIONS.length
      ? RISK_QUESTIONS[state.currentQuestionIndex]
      : null;
  const allocationStarted = state.answeredChips.includes(PORTFOLIO_CHIPS.crossMarketAllocation.id);

  return (
    <div className={styles.column}>
      <ThinkingBeat show={state.initialThinking} messages={INITIAL_THINKING_MESSAGES} cycleMs={TIMING.thinkingCycleMs} />

      {state.promptVisible && (
        <Reveal>
          <AssistantText paragraphs={[EXCHANGE_STEP_COPY.assistantPrompt]} />
        </Reveal>
      )}

      {state.exchangeListVisible && (
        <Reveal>
          <ExchangeSelectionList
            selectedId={state.selectedExchangeId}
            disabled={state.connecting || state.portfolioIntroVisible}
            onSelect={handleSelectExchange}
          />
        </Reveal>
      )}

      {state.unavailableNoticeVisible && !state.sheetOpen && (
        <Reveal>
          <div className={styles.unavailableNote}>{EXCHANGE_UNAVAILABLE_NOTE}</div>
        </Reveal>
      )}

      <ThinkingBeat show={state.connecting} messages={CONNECTING_THINKING_MESSAGES} cycleMs={TIMING.thinkingCycleMs} />

      {state.portfolioIntroVisible && (
        <Reveal>
          <AssistantText paragraphs={[PORTFOLIO_RESULT_COPY.intro]} />
        </Reveal>
      )}

      {state.portfolioResultVisible && (
        <Reveal>
          <PortfolioSummaryCard data={PORTFOLIO_DATA} />
        </Reveal>
      )}

      {state.portfolioResultVisible && (
        <Reveal>
          <PortfolioInsights insights={PORTFOLIO_DATA.insights} />
        </Reveal>
      )}

      {state.portfolioResultVisible && (
        <Reveal>
          <ChipRow chips={PORTFOLIO_CHIP_LIST} doneIds={state.answeredChips} ariaLabel="اقدام‌های بعدی" onPick={handleChipPick} />
        </Reveal>
      )}

      {state.chipResponses[PORTFOLIO_CHIPS.fullSpendingAnalysis.id] && (
        <Reveal>
          <AssistantText paragraphs={[state.chipResponses[PORTFOLIO_CHIPS.fullSpendingAnalysis.id]]} />
        </Reveal>
      )}

      {state.chipResponses[PORTFOLIO_CHIPS.rebalanceTips.id] && (
        <Reveal>
          <AssistantText paragraphs={[state.chipResponses[PORTFOLIO_CHIPS.rebalanceTips.id]]} />
        </Reveal>
      )}

      {allocationStarted && state.allocationUserMessageVisible && (
        <Reveal>
          <UserBubble text={ALLOCATION_INTRO_COPY.userMessage} />
        </Reveal>
      )}

      {state.allocationPromptVisible && (
        <Reveal>
          <AssistantText paragraphs={[ALLOCATION_INTRO_COPY.assistantPrompt]} />
        </Reveal>
      )}

      {currentRiskQuestion && (
        <Reveal key={`risk-q-${state.currentQuestionIndex}`}>
          <QuestionCard
            step={state.currentQuestionIndex + 1}
            total={RISK_QUESTIONS.length}
            definition={currentRiskQuestion}
            initialAnswer={state.riskAnswers[state.currentQuestionIndex] ?? undefined}
            onBack={state.currentQuestionIndex > 0 ? handleRiskQuestionBack : undefined}
            onNext={(answer) => handleRiskAnswer(state.currentQuestionIndex, answer)}
          />
        </Reveal>
      )}

      <ThinkingBeat show={state.allocationThinking} messages={ALLOCATION_THINKING_MESSAGES} cycleMs={TIMING.thinkingCycleMs} />

      {state.allocationEditorVisible && (
        <Reveal>
          <AllocationEditor
            items={state.allocationItems}
            activePresetId={state.allocationPresetId}
            onSliderChange={handleSliderChange}
            onPresetPick={handlePresetPick}
            onReset={handleResetAllocation}
          />
        </Reveal>
      )}

      <BottomSheet open={state.sheetOpen} onClose={handleCancelConnection} ariaLabel={EXCHANGE_SHEET_COPY.title}>
        {selectedExchange && (
          <ExchangeConnectionSheet exchange={selectedExchange} onConfirm={handleConfirmConnection} onCancel={handleCancelConnection} />
        )}
      </BottomSheet>
    </div>
  );
}
