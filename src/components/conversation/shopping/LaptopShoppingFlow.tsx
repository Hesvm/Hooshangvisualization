"use client";

import { useEffect, useRef, useState } from "react";
import { AssistantText } from "@/components/conversation/blocks";
import { ThinkingBeat } from "@/components/conversation/HooshangThinkingState";
import { BottomSheet } from "@/components/BottomSheet";
import { computeLoanEstimate } from "@/lib/loan";
import { computeDeal, DEAL_DURATION_MS, type Deal } from "@/lib/deal";
import {
  ASSISTANT_INTRO,
  QUESTIONS,
  THINKING_TEXT,
  TIMING,
  SHORTLIST_INTRO,
  RECOMMENDATION_REASONING,
  DECISION_CHIPS,
  TIMING_RESPONSES,
  LOAN_INTRO_PREFIX,
  LOAN_INTRO_SUFFIX,
  HESITATION_QUESTION,
  HESITATION_OPTIONS,
  HESITATION_THINKING_REPLY,
  HANDOFF_TEXT,
  HANDOFF_CTA,
  POST_PURCHASE_TEXT,
} from "@/lib/mocks/shoppingScript";
import { faNum } from "@/lib/faNum";
import type { ShoppingProduct } from "@/types/shopping";
import { ChipRow } from "./ChipRow";
import { QuestionCard, type QuestionAnswer } from "./QuestionCard";
import { ProductCard } from "./ProductCard";
import { DeepDiveSheet } from "./DeepDiveSheet";
import { FinalRecommendationCard } from "./FinalRecommendationCard";
import { DownPaymentQuestion, MonthsQuestion, LoanResultCard } from "./LoanFlow";
import { DealCard } from "./DealCard";
import { Reveal } from "./Reveal";
import styles from "./LaptopShoppingFlow.module.css";

type LaptopShoppingFlowProps = {
  products: ShoppingProduct[];
  recommendedProductId: string;
};

type LoanStep = "closed" | "introThinking" | "downPayment" | "monthsThinking" | "months" | "resultThinking" | "result";

type FlowState = {
  initialThinking: boolean;
  introVisible: boolean;
  currentQuestionIndex: number; // -1 = not started, QUESTIONS.length = all answered
  answers: (QuestionAnswer | null)[];
  searchThinking: boolean;
  shortlistIntroVisible: boolean;
  shortlistVisible: boolean;

  deepDiveProductId: string | null;
  isDeepDiveOpen: boolean;

  finalRecommendationRequested: boolean;
  recommendationThinking: boolean;
  reasoningVisible: boolean;
  finalRecommendationVisible: boolean;
  recommendedProductId: string;

  answeredChips: string[];
  chipResponses: string[];

  loanStep: LoanStep;
  loanDownPayment: number | null;
  loanMonths: number | null;

  hesitationVisible: boolean;
  hesitationResponse: string | null;

  dealThinking: boolean;
  dealActivated: boolean;
  deal: Deal | null;
  dealExpiresAt: number | null;

  purchaseCtaShown: boolean;
  handoffThinking: boolean;
  purchaseCompleted: boolean;
  trackingVisible: boolean;
};

type ProductShortlistCarouselProps = {
  products: ShoppingProduct[];
  onOpenDeepDive: (productId: string) => void;
};

function ProductShortlistCarousel({ products, onOpenDeepDive }: ProductShortlistCarouselProps) {
  return (
    <div className={styles.shortlist}>
      <div className={styles.shortlistCarousel} dir="rtl" aria-label="سه گزینه پیشنهادی">
        {products.map((product) => (
          <div key={product.id} className={styles.shortlistItem}>
            <ProductCard product={product} onOpenDeepDive={onOpenDeepDive} />
          </div>
        ))}
      </div>
    </div>
  );
}

function makeInitialState(recommendedProductId: string): FlowState {
  return {
    initialThinking: true,
    introVisible: false,
    currentQuestionIndex: -1,
    answers: [null, null, null],
    searchThinking: false,
    shortlistIntroVisible: false,
    shortlistVisible: false,

    deepDiveProductId: null,
    isDeepDiveOpen: false,

    finalRecommendationRequested: false,
    recommendationThinking: false,
    reasoningVisible: false,
    finalRecommendationVisible: false,
    recommendedProductId,

    answeredChips: [],
    chipResponses: [],

    loanStep: "closed",
    loanDownPayment: null,
    loanMonths: null,

    hesitationVisible: false,
    hesitationResponse: null,

    dealThinking: false,
    dealActivated: false,
    deal: null,
    dealExpiresAt: null,

    purchaseCtaShown: false,
    handoffThinking: false,
    purchaseCompleted: false,
    trackingVisible: false,
  };
}

export function LaptopShoppingFlow({ products, recommendedProductId }: LaptopShoppingFlowProps) {
  const [state, setState] = useState<FlowState>(() => makeInitialState(recommendedProductId));
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

  // Stage 5 → 7: initialThinking starts true (see makeInitialState) the moment
  // the pre-baked user message is on screen; this effect just advances it forward.
  useEffect(() => {
    schedule(() => {
      patch({ initialThinking: false });
      schedule(() => {
        patch({ introVisible: true });
        schedule(() => {
          patch({ currentQuestionIndex: 0 });
        }, TIMING.q1AfterIntro);
      }, TIMING.introAfterThinking);
    }, TIMING.initialThinking);
  }, []);

  const recommendedProduct = products.find((p) => p.id === state.recommendedProductId) ?? products[0];
  const loanEstimate =
    state.loanDownPayment !== null && state.loanMonths !== null
      ? computeLoanEstimate(recommendedProduct.price, state.loanDownPayment, state.loanMonths)
      : null;
  const deepDiveProduct = products.find((p) => p.id === state.deepDiveProductId) ?? null;

  function handleQuestionAnswer(index: number, answer: QuestionAnswer) {
    setState((prev) => {
      const answers = [...prev.answers];
      answers[index] = answer;
      return { ...prev, answers };
    });

    if (index < QUESTIONS.length - 1) {
      // Question-batch continuation — NOT a thinking boundary. This is one
      // continuous form (< 10 questions), so we advance straight to the next
      // question with only a brief transition beat; the Hooshang thinking state
      // must never interrupt between question cards.
      schedule(() => {
        patch({ currentQuestionIndex: index + 1 });
      }, TIMING.betweenQuestions);
    } else {
      // True boundary: the whole batch is answered and Hooshang is now actually
      // processing the shortlist — this is where the thinking state belongs.
      patch({ currentQuestionIndex: QUESTIONS.length, searchThinking: true });
      schedule(() => {
        patch({ searchThinking: false, shortlistIntroVisible: true });
        schedule(() => {
          patch({ shortlistVisible: true });
        }, TIMING.shortlistAfterSearch);
      }, TIMING.searchThinking);
    }
  }

  function handleQuestionBack() {
    setState((prev) => ({ ...prev, currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1) }));
  }

  function openDeepDive(productId: string) {
    patch({ deepDiveProductId: productId, isDeepDiveOpen: true });
  }

  function closeDeepDive() {
    patch({ isDeepDiveOpen: false });
  }

  function revealFinalRecommendation(productId?: string) {
    if (state.finalRecommendationRequested) return; // never produce a second final card
    patch({
      finalRecommendationRequested: true,
      recommendationThinking: true,
      ...(productId ? { recommendedProductId: productId } : {}),
    });
    schedule(() => {
      patch({ recommendationThinking: false, reasoningVisible: true });
      schedule(() => {
        patch({ finalRecommendationVisible: true });
      }, TIMING.reasoningAfterThinking);
    }, TIMING.recommendationThinking);
  }

  function handleSelectAsFinalFromDeepDive(productId: string) {
    patch({ isDeepDiveOpen: false });
    schedule(() => revealFinalRecommendation(productId), 300);
  }

  function handleDecisionChip(chipId: string) {
    if (state.answeredChips.includes(chipId)) return;
    if (chipId === "loan") {
      patch({ answeredChips: [...state.answeredChips, chipId], loanStep: "introThinking" });
      schedule(() => patch({ loanStep: "downPayment" }), TIMING.loanIntroThinking);
      return;
    }
    patch({ answeredChips: [...state.answeredChips, chipId], chipResponses: [...state.chipResponses, chipId] });
  }

  function handleDownPaymentSubmit(amount: number) {
    patch({ loanDownPayment: amount, loanStep: "monthsThinking" });
    schedule(() => patch({ loanStep: "months" }), TIMING.loanQ2Thinking);
  }

  function handleMonthsSubmit(months: number) {
    patch({ loanMonths: months, loanStep: "resultThinking" });
    schedule(() => {
      patch({ loanStep: "result" });
      setState((prev) => {
        if (prev.hesitationVisible || prev.hesitationResponse) return prev;
        schedule(() => patch({ hesitationVisible: true }), TIMING.hesitationAfterResult);
        return prev;
      });
    }, TIMING.loanResultThinking);
  }

  function handleLoanRestart() {
    patch({ loanStep: "downPayment", loanDownPayment: null, loanMonths: null });
  }

  function handleHesitationPick(id: string) {
    if (state.hesitationResponse) return;
    patch({ hesitationResponse: id });
    if (id === "expensive") {
      patch({ dealThinking: true });
      schedule(() => {
        const deal = computeDeal(recommendedProduct.price);
        patch({ dealThinking: false, dealActivated: true, deal, dealExpiresAt: Date.now() + DEAL_DURATION_MS });
      }, TIMING.dealThinking);
    } else if (id === "good") {
      patch({ purchaseCtaShown: true });
    }
  }

  function handleDealPurchase() {
    patch({ purchaseCtaShown: true });
  }

  function handleHandoffCta() {
    if (state.handoffThinking || state.purchaseCompleted) return;
    patch({ handoffThinking: true });
    schedule(() => {
      patch({ handoffThinking: false, purchaseCompleted: true });
      schedule(() => {
        patch({ trackingVisible: true });
      }, TIMING.postPurchaseAfterHandoff);
    }, TIMING.handoffThinking);
  }

  const currentQuestionDef =
    state.currentQuestionIndex >= 0 && state.currentQuestionIndex < QUESTIONS.length
      ? QUESTIONS[state.currentQuestionIndex]
      : null;

  return (
    <div className={styles.column}>
      <ThinkingBeat show={state.initialThinking} messages={THINKING_TEXT.initial} cycleMs={TIMING.searchThinkingTextSwitch} />

      {state.introVisible && (
        <Reveal>
          <AssistantText paragraphs={[ASSISTANT_INTRO]} />
        </Reveal>
      )}

      {currentQuestionDef && (
        <Reveal key={`q-${state.currentQuestionIndex}`}>
          <QuestionCard
            step={state.currentQuestionIndex + 1}
            total={QUESTIONS.length}
            definition={currentQuestionDef}
            initialAnswer={state.answers[state.currentQuestionIndex] ?? undefined}
            onBack={state.currentQuestionIndex > 0 ? handleQuestionBack : undefined}
            onNext={(answer) => handleQuestionAnswer(state.currentQuestionIndex, answer)}
          />
        </Reveal>
      )}

      <ThinkingBeat show={state.searchThinking} messages={THINKING_TEXT.search} cycleMs={TIMING.searchThinkingTextSwitch} />

      {state.shortlistIntroVisible && (
        <Reveal>
          <AssistantText paragraphs={[SHORTLIST_INTRO]} />
        </Reveal>
      )}

      {state.shortlistVisible && (
        <Reveal>
          <ProductShortlistCarousel products={products} onOpenDeepDive={openDeepDive} />
        </Reveal>
      )}

      {state.shortlistVisible && !state.finalRecommendationRequested && (
        <Reveal>
          <div className={styles.shortlistDecision}>
            <p className={styles.shortlistSupport}>
              این سه مدل از بین گزینه‌هایی که بررسی کردم، به نیاز و بودجه‌ات نزدیک‌ترن. اگه بخوای، می‌تونم بینشون دقیق‌تر جمع‌بندی کنم و بگم کدوم بیشتر به کارت میاد.
            </p>
            <button type="button" className={styles.ctaButton} onClick={() => revealFinalRecommendation()}>
              کدوم برای من بهتره؟
            </button>
          </div>
        </Reveal>
      )}

      <ThinkingBeat show={state.recommendationThinking} messages={THINKING_TEXT.recommendation} />

      {state.reasoningVisible && (
        <Reveal>
          <AssistantText paragraphs={[RECOMMENDATION_REASONING]} />
        </Reveal>
      )}

      {state.finalRecommendationVisible && (
        <Reveal>
          <FinalRecommendationCard product={recommendedProduct} />
        </Reveal>
      )}

      {state.finalRecommendationVisible && (
        <Reveal>
          <ChipRow chips={DECISION_CHIPS.map((c) => ({ id: c.id, label: c.label }))} doneIds={state.answeredChips} primaryId="loan" onPick={handleDecisionChip} />
        </Reveal>
      )}

      {state.chipResponses.map((chipId) => (
        <Reveal key={`chip-response-${chipId}`}>
          <AssistantText paragraphs={[TIMING_RESPONSES[chipId]]} />
        </Reveal>
      ))}

      <ThinkingBeat show={state.loanStep === "introThinking"} messages={THINKING_TEXT.loanIntro} />

      {state.loanStep !== "closed" && state.loanStep !== "introThinking" && (
        <Reveal>
          <AssistantText paragraphs={[`${LOAN_INTRO_PREFIX} ${faNum(recommendedProduct.price)} ${LOAN_INTRO_SUFFIX}`]} />
        </Reveal>
      )}

      {state.loanStep === "downPayment" && (
        <Reveal>
          <DownPaymentQuestion price={recommendedProduct.price} onSubmit={handleDownPaymentSubmit} />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "monthsThinking"} messages={THINKING_TEXT.loanQ2} />

      {state.loanStep === "months" && (
        <Reveal>
          <MonthsQuestion onSubmit={handleMonthsSubmit} />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "resultThinking"} messages={THINKING_TEXT.loanResult} />

      {state.loanStep === "result" && loanEstimate && (
        <Reveal>
          <LoanResultCard price={recommendedProduct.price} estimate={loanEstimate} onRestart={handleLoanRestart} />
        </Reveal>
      )}

      {state.hesitationVisible && (
        <Reveal>
          <div>
            <AssistantText paragraphs={[HESITATION_QUESTION]} />
            <div style={{ marginTop: 16 }}>
              <ChipRow
                chips={HESITATION_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
                doneIds={state.hesitationResponse ? HESITATION_OPTIONS.map((o) => o.id) : []}
                onPick={handleHesitationPick}
              />
            </div>
          </div>
        </Reveal>
      )}

      {state.hesitationResponse === "thinking" && (
        <Reveal>
          <AssistantText paragraphs={[HESITATION_THINKING_REPLY]} />
        </Reveal>
      )}

      <ThinkingBeat show={state.dealThinking} messages={THINKING_TEXT.deal} cycleMs={TIMING.searchThinkingTextSwitch} />

      {state.dealActivated && state.deal && state.dealExpiresAt && (
        <Reveal>
          <DealCard price={recommendedProduct.price} deal={state.deal} expiresAt={state.dealExpiresAt} onPurchase={handleDealPurchase} />
        </Reveal>
      )}

      {state.purchaseCtaShown && (
        <Reveal>
          <div>
            <AssistantText paragraphs={[HANDOFF_TEXT]} />
            <button
              type="button"
              className={styles.ctaButton}
              style={{ marginTop: 16 }}
              disabled={state.handoffThinking || state.purchaseCompleted}
              onClick={handleHandoffCta}
            >
              {HANDOFF_CTA}
            </button>
          </div>
        </Reveal>
      )}

      <ThinkingBeat show={state.handoffThinking} messages={THINKING_TEXT.handoff} />

      {state.trackingVisible && (
        <Reveal>
          <AssistantText paragraphs={[POST_PURCHASE_TEXT]} />
        </Reveal>
      )}

      <BottomSheet open={state.isDeepDiveOpen} onClose={closeDeepDive} ariaLabel="بررسی کامل محصول">
        {deepDiveProduct && (
          <DeepDiveSheet
            product={deepDiveProduct}
            otherProducts={products.filter((p) => p.id !== deepDiveProduct.id)}
            onSelectAsFinal={handleSelectAsFinalFromDeepDive}
          />
        )}
      </BottomSheet>
    </div>
  );
}
