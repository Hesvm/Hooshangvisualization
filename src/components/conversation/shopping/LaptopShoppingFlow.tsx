"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AssistantText, UserBubble } from "@/components/conversation/blocks";
import { ThinkingBeat } from "@/components/conversation/HooshangThinkingState";
import { BottomSheet } from "@/components/BottomSheet";
import { useVirtualNotifications } from "@/components/notifications/VirtualNotificationProvider";
import { buildLoanOffers, clampLoanAmount, productPriceToman } from "@/lib/loan";
import { isFastPreviewMode, makeInitialValidationStages } from "@/lib/mocks/validationStages";
import {
  ASSISTANT_INTRO,
  QUESTIONS,
  TIMING,
  SHORTLIST_INTRO,
  RECOMMENDATION_REASONING,
  DECISION_CHIPS,
  TIMING_RESPONSES,
  LOAN_INTRO_TEXT,
  LOAN_OFFER_INTRO,
  LOAN_OFFER_INTRO_SUPPORT,
  LOAN_OFFER_CONTINUE_CTA,
  LOAN_VALIDATION_INTRO,
  LOAN_VALIDATION_INTRO_SUPPORT,
  LOAN_VALIDATION_SUCCESS,
  LOAN_VALIDATION_SUCCESS_SUPPORT,
  LOAN_INVOICE_INTRO,
  ORDER_SUMMARY_INTRO,
  ADDRESS_SELECTION_INTRO,
  DELIVERY_SELECTION_INTRO,
  buildLoanRequestMessage,
  buildOfferSelectionMessage,
  buildOrderCode,
} from "@/lib/mocks/shoppingScript";
import {
  LAPTOP_ADDRESS_PREP_PIPELINE,
  LAPTOP_DELIVERY_PREP_PIPELINE,
  LAPTOP_INITIAL_PIPELINE,
  LAPTOP_INVOICE_PREP_PIPELINE,
  LAPTOP_LOAN_ENTRY_PIPELINE,
  LAPTOP_OFFER_PREP_PIPELINE,
  LAPTOP_OFFER_SEARCH_PIPELINE,
  LAPTOP_ORDER_PREP_PIPELINE,
  LAPTOP_PAYMENT_PROCESSING_PIPELINE,
  LAPTOP_RECOMMENDATION_PIPELINE,
  LAPTOP_SEARCH_PIPELINE,
} from "@/lib/thinking/pipelines/laptopShopping";
import { ADDRESSES, DELIVERY_SLOTS } from "@/lib/mocks/addresses";
import { faNum } from "@/lib/faNum";
import { PRODUCT_ROLE_LABEL, type LoanOffer, type ShoppingProduct, type ValidationStage } from "@/types/shopping";
import { ChipRow } from "./ChipRow";
import { QuestionCard, type QuestionAnswer } from "./QuestionCard";
import { ProductCard } from "./ProductCard";
import { DeepDiveSheet } from "./DeepDiveSheet";
import { FinalRecommendationCard } from "./FinalRecommendationCard";
import { LoanPreferenceCard } from "./LoanPreferenceCard";
import { LoanOfferCard } from "./LoanOfferCard";
import { LoanValidationFlow } from "./LoanValidationFlow";
import { LoanInvoice } from "./LoanInvoice";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { AddressSelectionCard } from "./AddressSelectionCard";
import { DeliveryDaySelector } from "./DeliveryDaySelector";
import { ReceiptCard } from "./ReceiptCard";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import { MessageSuggestionStack, type MessageSuggestion } from "./MessageSuggestionStack";
import { Reveal } from "./Reveal";
import styles from "./LaptopShoppingFlow.module.css";

type LaptopShoppingFlowProps = {
  products: ShoppingProduct[];
  recommendedProductId: string;
};

type LoanStep =
  | "closed"
  | "introThinking"
  | "preference"
  | "offerThinking"
  | "offerIntro"
  | "offers"
  | "offerContinueThinking"
  | "validationIntro"
  | "validating"
  | "validationDone"
  | "invoiceThinking"
  | "invoice"
  | "orderThinking"
  | "order"
  | "addressThinking"
  | "address"
  | "deliveryThinking"
  | "delivery"
  | "paymentProcessing"
  | "paymentDone";

/* Ordered so "is this step visible yet" can be answered with a single index
   comparison instead of an ever-growing OR chain per render gate. */
const LOAN_STEP_ORDER: LoanStep[] = [
  "closed",
  "introThinking",
  "preference",
  "offerThinking",
  "offerIntro",
  "offers",
  "offerContinueThinking",
  "validationIntro",
  "validating",
  "validationDone",
  "invoiceThinking",
  "invoice",
  "orderThinking",
  "order",
  "addressThinking",
  "address",
  "deliveryThinking",
  "delivery",
  "paymentProcessing",
  "paymentDone",
];

function isLoanStepAtLeast(current: LoanStep, target: LoanStep): boolean {
  return LOAN_STEP_ORDER.indexOf(current) >= LOAN_STEP_ORDER.indexOf(target);
}

type ShortlistViewMode = "suggestions" | "quickCompare" | "fullTable";

const SHORTLIST_VIEW_CHIPS: { id: ShortlistViewMode; label: string }[] = [
  { id: "suggestions", label: "پیشنهادها" },
  { id: "quickCompare", label: "مقایسه سریع" },
  { id: "fullTable", label: "جدول کامل" },
];

const DECISION_SUGGESTIONS: MessageSuggestion[] = DECISION_CHIPS.map((chip) => ({
  id: chip.id,
  label: chip.label,
  prompt: chip.label,
}));

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
  loanAmount: number | null;
  loanMonths: number | null;
  loanOffers: LoanOffer[];
  selectedOfferId: string | null;
  validationStages: ValidationStage[];
  confirmationOpen: boolean;

  orderQuantity: number;
  selectedAddressId: string | null;
  selectedDeliverySlotId: string | null;
  orderCode: string | null;
};

type ProductShortlistCarouselProps = {
  products: ShoppingProduct[];
  onOpenDeepDive: (productId: string) => void;
};

type ProductValueMap = Record<string, string>;

type ComparisonRow = {
  id: string;
  label: string;
  values: ProductValueMap;
  highlightProductId?: string;
};

type ShoppingShortlistBlockProps = {
  products: ShoppingProduct[];
  activeView: ShortlistViewMode;
  recommendedProductId: string;
  showDecision: boolean;
  onViewChange: (view: ShortlistViewMode) => void;
  onOpenDeepDive: (productId: string) => void;
  onAskBest: () => void;
};

type ShortlistContentProps = {
  products: ShoppingProduct[];
  activeView: ShortlistViewMode;
  recommendedProductId: string;
  onOpenDeepDive: (productId: string) => void;
};

function mapProductValues(products: ShoppingProduct[], getValue: (product: ShoppingProduct) => string): ProductValueMap {
  return products.reduce<ProductValueMap>((values, product) => {
    values[product.id] = getValue(product);
    return values;
  }, {});
}

function getLowestPriceProductId(products: ShoppingProduct[]) {
  if (products.length === 0) return undefined;
  return products.reduce((lowest, product) => (product.price < lowest.price ? product : lowest), products[0]).id;
}

function getMatchVerdict(product: ShoppingProduct, label: string) {
  return product.matchBreakdown.find((item) => item.label === label)?.verdict ?? "—";
}

function makeQuickComparisonRows(products: ShoppingProduct[], recommendedProductId: string): ComparisonRow[] {
  const matchLabels = products[0]?.matchBreakdown.map((item) => item.label) ?? [];

  return [
    {
      id: "price",
      label: "قیمت",
      values: mapProductValues(products, (product) => `${faNum(product.price)} میلیون تومان`),
      highlightProductId: getLowestPriceProductId(products),
    },
    ...matchLabels.map((label) => ({
      id: `match-${label}`,
      label,
      values: mapProductValues(products, (product) => getMatchVerdict(product, label)),
      highlightProductId: label === "محدودیت‌ها" ? undefined : recommendedProductId,
    })),
  ];
}

function makeFullTableRows(products: ShoppingProduct[]): ComparisonRow[] {
  return [
    {
      id: "name",
      label: "مدل",
      values: mapProductValues(products, (product) => product.name),
    },
    {
      id: "price",
      label: "قیمت",
      values: mapProductValues(products, (product) => `${faNum(product.price)} میلیون تومان`),
      highlightProductId: getLowestPriceProductId(products),
    },
    {
      id: "configuration",
      label: "پیکربندی",
      values: mapProductValues(products, (product) => product.configuration),
    },
    {
      id: "role",
      label: "نقش",
      values: mapProductValues(products, (product) => PRODUCT_ROLE_LABEL[product.role]),
    },
    {
      id: "fit",
      label: "مناسب برای",
      values: mapProductValues(products, (product) => product.suitableFor),
    },
    {
      id: "rating",
      label: "امتیاز کاربران",
      values: mapProductValues(products, (product) => `${faNum(product.rating)} از ۵`),
    },
    {
      id: "reviews",
      label: "تعداد نظر",
      values: mapProductValues(products, (product) => `${faNum(product.reviewCount)} نظر`),
    },
    {
      id: "seller",
      label: "فروشنده",
      values: mapProductValues(products, (product) => product.seller),
    },
    {
      id: "sellerSatisfaction",
      label: "رضایت فروشنده",
      values: mapProductValues(products, (product) => `${faNum(product.sellerSatisfaction)}٪`),
    },
    {
      id: "delivery",
      label: "ارسال",
      values: mapProductValues(products, (product) => `${product.fulfilledByDigikala ? "دیجی‌کالا" : "فروشنده"} · ${product.deliveryEstimate}`),
    },
    {
      id: "authenticity",
      label: "اصالت",
      values: mapProductValues(products, (product) => (product.authenticityGuarantee ? "تضمین اصالت کالا" : "ثبت نشده")),
    },
    {
      id: "return",
      label: "بازگشت",
      values: mapProductValues(products, (product) => `${faNum(product.returnWindowDays)} روز`),
    },
  ];
}

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

function ShoppingShortlistBlock({
  products,
  activeView,
  recommendedProductId,
  showDecision,
  onViewChange,
  onOpenDeepDive,
  onAskBest,
}: ShoppingShortlistBlockProps) {
  return (
    <div className={styles.shortlistBlock}>
      <div className={styles.viewChipBar}>
        <ChipRow
          chips={SHORTLIST_VIEW_CHIPS}
          activeId={activeView}
          ariaLabel="انتخاب نوع نمایش پیشنهادها"
          onPick={(id) => onViewChange(id as ShortlistViewMode)}
        />
      </div>

      <ShortlistContent products={products} activeView={activeView} recommendedProductId={recommendedProductId} onOpenDeepDive={onOpenDeepDive} />

      {showDecision && (
        <div className={styles.shortlistDecision}>
          <p className={styles.shortlistSupport}>
            این سه مدل از بین گزینه‌هایی که بررسی کردم، بیشترین تطابق رو با بودجه و نوع استفاده‌ات دارن. اگه بخوای، می‌تونم بینشون جمع‌بندی کنم و بگم کدوم بیشتر به کارت میاد.
          </p>
          <button type="button" className={styles.ctaButton} onClick={onAskBest}>
            کدوم برای من بهتره؟
          </button>
        </div>
      )}
    </div>
  );
}

function ShortlistContent({ products, activeView, recommendedProductId, onOpenDeepDive }: ShortlistContentProps) {
  return (
    <div className={styles.shortlistContentShell}>
      <div
        className={`${styles.shortlistViewPanel} ${activeView === "suggestions" ? styles.shortlistViewActive : styles.shortlistViewHidden}`}
        aria-hidden={activeView !== "suggestions"}
      >
        <ProductShortlistCarousel products={products} onOpenDeepDive={onOpenDeepDive} />
      </div>

      <div
        className={`${styles.shortlistViewPanel} ${activeView === "quickCompare" ? styles.shortlistViewActive : styles.shortlistViewHidden}`}
        aria-hidden={activeView !== "quickCompare"}
      >
        <QuickCompareView products={products} recommendedProductId={recommendedProductId} />
      </div>

      <div
        className={`${styles.shortlistViewPanel} ${activeView === "fullTable" ? styles.shortlistViewActive : styles.shortlistViewHidden}`}
        aria-hidden={activeView !== "fullTable"}
      >
        <FullTableView products={products} recommendedProductId={recommendedProductId} />
      </div>
    </div>
  );
}

function QuickCompareView({ products, recommendedProductId }: { products: ShoppingProduct[]; recommendedProductId: string }) {
  const rows = makeQuickComparisonRows(products, recommendedProductId);

  return (
    <div className={styles.comparisonScroller} dir="rtl" aria-label="مقایسه سریع پیشنهادها">
      <div className={styles.quickCompareGrid}>
        <div className={`${styles.compareHeaderCell} ${styles.compareLabelCell}`}>معیار</div>
        {products.map((product) => (
          <div
            key={product.id}
            className={`${styles.compareHeaderCell} ${styles.productHeaderCell} ${product.id === recommendedProductId ? styles.recommendedColumn : ""}`}
          >
            <span className={styles.compareProductRole}>{PRODUCT_ROLE_LABEL[product.role]}</span>
            <span className={styles.compareProductTitle}>
              <span className={styles.compareProductImage}>
                <Image
                  className={styles.compareProductPhoto}
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  width={34}
                  height={34}
                  sizes="34px"
                />
              </span>
              <span className={styles.compareProductName}>{product.name}</span>
            </span>
          </div>
        ))}

        {rows.map((row) => (
          <div key={row.id} className={styles.compareRow}>
            <div className={`${styles.compareCell} ${styles.compareLabelCell}`}>{row.label}</div>
            {products.map((product) => (
              <div
                key={product.id}
                className={`${styles.compareCell} ${styles.compareValueCell} ${row.highlightProductId === product.id ? styles.compareValueHighlighted : ""} ${
                  product.id === recommendedProductId ? styles.recommendedColumn : ""
                }`}
              >
                {row.values[product.id]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FullTableView({ products, recommendedProductId }: { products: ShoppingProduct[]; recommendedProductId: string }) {
  const rows = makeFullTableRows(products);

  return (
    <div className={styles.tableScroller} dir="rtl" aria-label="جدول کامل پیشنهادها">
      <div className={styles.fullTableGrid}>
        <div className={`${styles.tableHeaderCell} ${styles.tableLabelCell}`}>جزئیات</div>
        {products.map((product) => (
          <div key={product.id} className={`${styles.tableHeaderCell} ${product.id === recommendedProductId ? styles.recommendedColumn : ""}`}>
            <span className={styles.tableProductRole}>{PRODUCT_ROLE_LABEL[product.role]}</span>
            <span className={styles.tableProductTitle}>
              <span className={styles.tableProductImage}>
                <Image
                  className={styles.tableProductPhoto}
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  width={34}
                  height={34}
                  sizes="34px"
                />
              </span>
              <span className={styles.tableProductName}>{product.name}</span>
            </span>
          </div>
        ))}

        {rows.map((row) => (
          <div key={row.id} className={styles.tableRow}>
            <div className={`${styles.tableCell} ${styles.tableLabelCell}`}>{row.label}</div>
            {products.map((product) => (
              <div
                key={product.id}
                className={`${styles.tableCell} ${row.highlightProductId === product.id ? styles.compareValueHighlighted : ""} ${
                  product.id === recommendedProductId ? styles.recommendedColumn : ""
                }`}
              >
                {row.values[product.id]}
              </div>
            ))}
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
    loanAmount: null,
    loanMonths: null,
    loanOffers: [],
    selectedOfferId: null,
    validationStages: [],
    confirmationOpen: false,

    orderQuantity: 1,
    selectedAddressId: null,
    selectedDeliverySlotId: null,
    orderCode: null,
  };
}

export function LaptopShoppingFlow({ products, recommendedProductId }: LaptopShoppingFlowProps) {
  const [state, setState] = useState<FlowState>(() => makeInitialState(recommendedProductId));
  const [activeShortlistView, setActiveShortlistView] = useState<ShortlistViewMode>("suggestions");
  const timers = useRef<number[]>([]);
  const { showNotification } = useVirtualNotifications();

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

  function handleInitialThinkingComplete() {
    patch({ initialThinking: false });
    schedule(() => {
      patch({ introVisible: true });
      schedule(() => {
        patch({ currentQuestionIndex: 0 });
      }, TIMING.q1AfterIntro);
    }, TIMING.introAfterThinking);
  }

  const recommendedProduct = products.find((p) => p.id === state.recommendedProductId) ?? products[0];
  const deepDiveProduct = products.find((p) => p.id === state.deepDiveProductId) ?? null;
  const recommendedProductPriceToman = productPriceToman(recommendedProduct.price);

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
    }
  }

  function handleSearchThinkingComplete() {
    patch({ searchThinking: false, shortlistIntroVisible: true });
    schedule(() => {
      patch({ shortlistVisible: true });
    }, TIMING.shortlistAfterSearch);
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
  }

  function handleRecommendationThinkingComplete() {
    patch({ recommendationThinking: false, reasoningVisible: true });
    schedule(() => {
      patch({ finalRecommendationVisible: true });
    }, TIMING.reasoningAfterThinking);
  }

  function handleSelectAsFinalFromDeepDive(productId: string) {
    patch({ isDeepDiveOpen: false });
    schedule(() => revealFinalRecommendation(productId), 300);
  }

  function handleDecisionChip(chipId: string) {
    if (state.answeredChips.includes(chipId)) return;
    if (chipId === "loan") {
      patch({ answeredChips: [...state.answeredChips, chipId], loanStep: "introThinking" });
      return;
    }
    patch({ answeredChips: [...state.answeredChips, chipId], chipResponses: [...state.chipResponses, chipId] });
  }

  function handleLoanEntryThinkingComplete() {
    patch({ loanStep: "preference" });
  }

  function handleLoanPreferenceComplete(amount: number, months: number) {
    const clampedAmount = clampLoanAmount(amount, recommendedProductPriceToman);
    const offers = buildLoanOffers(clampedAmount, months);
    patch({
      loanAmount: clampedAmount,
      loanMonths: months,
      loanOffers: offers,
      loanStep: "offerThinking",
    });
  }

  function handleOfferThinkingComplete() {
    patch({ loanStep: "offerIntro" });
    schedule(() => patch({ loanStep: "offers" }), TIMING.offersAfterIntro);
  }

  function handleSelectOffer(offerId: string) {
    patch({ selectedOfferId: offerId });
  }

  function handleOfferContinue() {
    if (!state.selectedOfferId) return;
    patch({ loanStep: "offerContinueThinking" });
  }

  function handleOfferContinueThinkingComplete() {
    patch({
      loanStep: "validationIntro",
      validationStages: makeInitialValidationStages(isFastPreviewMode()),
    });
    schedule(() => patch({ loanStep: "validating" }), TIMING.validationIntroAfterThinking);
  }

  function handleValidationComplete() {
    patch({ loanStep: "validationDone" });
    schedule(() => {
      patch({ loanStep: "invoiceThinking" });
    }, TIMING.invoiceAfterThinking);
  }

  function handleInvoiceThinkingComplete() {
    patch({ loanStep: "invoice" });
  }

  function handleInvoiceContinue() {
    patch({ loanStep: "orderThinking" });
  }

  function handleOrderThinkingComplete() {
    patch({ loanStep: "order" });
  }

  function handleOrderQuantityChange(quantity: number) {
    patch({ orderQuantity: quantity });
  }

  function handleOrderNext() {
    patch({ loanStep: "addressThinking" });
  }

  function handleAddressThinkingComplete() {
    patch({ loanStep: "address" });
  }

  function handleSelectAddress(addressId: string) {
    patch({ selectedAddressId: addressId });
  }

  function handleAddressNext() {
    patch({ loanStep: "deliveryThinking" });
  }

  function handleDeliveryThinkingComplete() {
    patch({ loanStep: "delivery" });
  }

  function handleSelectDeliverySlot(slotId: string) {
    patch({ selectedDeliverySlotId: slotId });
  }

  function handleOpenConfirmation() {
    patch({ confirmationOpen: true });
  }

  function handleCloseConfirmation() {
    patch({ confirmationOpen: false });
  }

  function handleConfirmPayment() {
    patch({ confirmationOpen: false, loanStep: "paymentProcessing" });
  }

  function handlePaymentProcessingComplete() {
    const orderCode = buildOrderCode();
    patch({ loanStep: "paymentDone", orderCode });
    showNotification({
      sourceName: "دیجی‌کالا",
      title: `سفارش ${recommendedProduct.name} ثبت شد`,
      body: `کد پیگیری: ${orderCode}`,
      icon: "/images/brands/digikala-logo.svg",
      timestampLabel: "now",
      kind: "success",
    });
  }

  const currentQuestionDef =
    state.currentQuestionIndex >= 0 && state.currentQuestionIndex < QUESTIONS.length
      ? QUESTIONS[state.currentQuestionIndex]
      : null;

  return (
    <div className={styles.column}>
      <ThinkingBeat show={state.initialThinking} pipeline={LAPTOP_INITIAL_PIPELINE} onComplete={handleInitialThinkingComplete} />

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

      <ThinkingBeat show={state.searchThinking} pipeline={LAPTOP_SEARCH_PIPELINE} onComplete={handleSearchThinkingComplete} />

      {state.shortlistIntroVisible && (
        <Reveal>
          <AssistantText paragraphs={[SHORTLIST_INTRO]} />
        </Reveal>
      )}

      {state.shortlistVisible && (
        <Reveal>
          <ShoppingShortlistBlock
            products={products}
            activeView={activeShortlistView}
            recommendedProductId={state.recommendedProductId}
            showDecision={!state.finalRecommendationRequested}
            onViewChange={setActiveShortlistView}
            onOpenDeepDive={openDeepDive}
            onAskBest={() => revealFinalRecommendation()}
          />
        </Reveal>
      )}

      <ThinkingBeat show={state.recommendationThinking} pipeline={LAPTOP_RECOMMENDATION_PIPELINE} onComplete={handleRecommendationThinkingComplete} />

      {state.reasoningVisible && (
        <Reveal>
          <AssistantText paragraphs={[RECOMMENDATION_REASONING]} />
        </Reveal>
      )}

      {state.finalRecommendationVisible && (
        <Reveal>
          <div>
            <FinalRecommendationCard product={recommendedProduct} />
            <MessageSuggestionStack
              suggestions={DECISION_SUGGESTIONS}
              disabledIds={state.answeredChips}
              onSelect={(suggestion) => handleDecisionChip(suggestion.id)}
            />
          </div>
        </Reveal>
      )}

      {state.chipResponses.map((chipId) => (
        <Reveal key={`chip-response-${chipId}`}>
          <AssistantText paragraphs={[TIMING_RESPONSES[chipId]]} />
        </Reveal>
      ))}

      <ThinkingBeat show={state.loanStep === "introThinking"} pipeline={LAPTOP_LOAN_ENTRY_PIPELINE} onComplete={handleLoanEntryThinkingComplete} />

      {state.loanStep !== "closed" && state.loanStep !== "introThinking" && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_INTRO_TEXT]} />
        </Reveal>
      )}

      {state.loanStep === "preference" && (
        <Reveal>
          <LoanPreferenceCard
            productPrice={recommendedProductPriceToman}
            initialAmount={state.loanAmount ?? undefined}
            initialMonths={state.loanMonths ?? undefined}
            onComplete={handleLoanPreferenceComplete}
          />
        </Reveal>
      )}

      {state.loanAmount !== null && state.loanMonths !== null && state.loanStep !== "preference" && state.loanStep !== "introThinking" && (
        <Reveal>
          <UserBubble text={buildLoanRequestMessage(state.loanAmount, state.loanMonths)} />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "offerThinking"} pipeline={LAPTOP_OFFER_SEARCH_PIPELINE} onComplete={handleOfferThinkingComplete} />

      {(state.loanStep === "offerIntro" || state.loanStep === "offers") && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_OFFER_INTRO, LOAN_OFFER_INTRO_SUPPORT]} />
        </Reveal>
      )}

      {state.loanStep === "offers" && (
        <Reveal>
          <div className={styles.offerList}>
            {state.loanOffers.map((offer) => (
              <LoanOfferCard
                key={offer.id}
                offer={offer}
                selected={state.selectedOfferId === offer.id}
                onSelect={() => handleSelectOffer(offer.id)}
              />
            ))}
            <button
              type="button"
              className={styles.ctaButton}
              disabled={!state.selectedOfferId}
              style={{ opacity: state.selectedOfferId ? 1 : 0.5 }}
              onClick={handleOfferContinue}
            >
              {LOAN_OFFER_CONTINUE_CTA}
            </button>
          </div>
        </Reveal>
      )}

      {state.selectedOfferId && isLoanStepAtLeast(state.loanStep, "offerContinueThinking") && (
        <Reveal>
          <UserBubble
            text={buildOfferSelectionMessage(state.loanOffers.find((o) => o.id === state.selectedOfferId)?.providerName ?? "")}
          />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "offerContinueThinking"} pipeline={LAPTOP_OFFER_PREP_PIPELINE} onComplete={handleOfferContinueThinkingComplete} />

      {isLoanStepAtLeast(state.loanStep, "validationIntro") && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_VALIDATION_INTRO, LOAN_VALIDATION_INTRO_SUPPORT]} />
        </Reveal>
      )}

      {isLoanStepAtLeast(state.loanStep, "validating") && (
        <Reveal>
          <LoanValidationFlow stages={state.validationStages} onAllComplete={handleValidationComplete} />
        </Reveal>
      )}

      {isLoanStepAtLeast(state.loanStep, "validationDone") && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_VALIDATION_SUCCESS, LOAN_VALIDATION_SUCCESS_SUPPORT]} />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "invoiceThinking"} pipeline={LAPTOP_INVOICE_PREP_PIPELINE} onComplete={handleInvoiceThinkingComplete} />

      {isLoanStepAtLeast(state.loanStep, "invoice") && state.selectedOfferId && (
        <Reveal>
          <AssistantText paragraphs={[LOAN_INVOICE_INTRO]} />
          <LoanInvoice
            product={recommendedProduct}
            offer={state.loanOffers.find((o) => o.id === state.selectedOfferId)!}
            onConfirm={handleInvoiceContinue}
          />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "orderThinking"} pipeline={LAPTOP_ORDER_PREP_PIPELINE} onComplete={handleOrderThinkingComplete} />

      {isLoanStepAtLeast(state.loanStep, "order") && (
        <Reveal>
          <AssistantText paragraphs={[ORDER_SUMMARY_INTRO]} />
          <OrderSummaryCard
            product={recommendedProduct}
            unitPriceToman={recommendedProductPriceToman}
            quantity={state.orderQuantity}
            onQuantityChange={handleOrderQuantityChange}
            onNext={handleOrderNext}
          />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "addressThinking"} pipeline={LAPTOP_ADDRESS_PREP_PIPELINE} onComplete={handleAddressThinkingComplete} />

      {isLoanStepAtLeast(state.loanStep, "address") && (
        <Reveal>
          <AssistantText paragraphs={[ADDRESS_SELECTION_INTRO]} />
          <AddressSelectionCard
            addresses={ADDRESSES}
            selectedId={state.selectedAddressId}
            onSelect={handleSelectAddress}
            onNext={handleAddressNext}
          />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "deliveryThinking"} pipeline={LAPTOP_DELIVERY_PREP_PIPELINE} onComplete={handleDeliveryThinkingComplete} />

      {isLoanStepAtLeast(state.loanStep, "delivery") && (
        <Reveal>
          <AssistantText paragraphs={[DELIVERY_SELECTION_INTRO]} />
          <DeliveryDaySelector
            slots={DELIVERY_SLOTS}
            selectedId={state.selectedDeliverySlotId}
            onSelect={handleSelectDeliverySlot}
            onConfirm={handleOpenConfirmation}
          />
        </Reveal>
      )}

      <ThinkingBeat show={state.loanStep === "paymentProcessing"} pipeline={LAPTOP_PAYMENT_PROCESSING_PIPELINE} onComplete={handlePaymentProcessingComplete} />

      {state.loanStep === "paymentDone" && state.selectedOfferId && state.orderCode && (
        <Reveal>
          <ReceiptCard
            product={recommendedProduct}
            offer={state.loanOffers.find((o) => o.id === state.selectedOfferId)!}
            address={ADDRESSES.find((a) => a.id === state.selectedAddressId) ?? ADDRESSES[0]}
            deliverySlot={DELIVERY_SLOTS.find((s) => s.id === state.selectedDeliverySlotId) ?? DELIVERY_SLOTS[0]}
            immediatePayment={recommendedProductPriceToman - (state.loanAmount ?? 0)}
            orderCode={state.orderCode}
          />
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

      <BottomSheet open={state.confirmationOpen} onClose={handleCloseConfirmation} ariaLabel="تایید نهایی پرداخت">
        {state.selectedOfferId && (
          <PaymentConfirmationModal
            product={recommendedProduct}
            offer={state.loanOffers.find((o) => o.id === state.selectedOfferId)!}
            immediatePayment={recommendedProductPriceToman - (state.loanAmount ?? 0)}
            onConfirm={handleConfirmPayment}
            onCancel={handleCloseConfirmation}
          />
        )}
      </BottomSheet>
    </div>
  );
}
