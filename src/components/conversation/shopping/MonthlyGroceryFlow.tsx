"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Add, ArrowLeft2, Minus, TickCircle, Trash, TruckFast } from "iconsax-react";
import { BottomSheet } from "@/components/BottomSheet";
import { ComponentHeader } from "@/components/ComponentHeader";
import { useVirtualNotifications } from "@/components/notifications/VirtualNotificationProvider";
import { ThinkingBeat } from "@/components/conversation/HooshangThinkingState";
import { QuestionOptionIcon } from "@/components/conversation/QuestionOptionIcon";
import { AssistantText, UserBubble } from "@/components/conversation/blocks";
import { faNum, formatPersianNumber } from "@/lib/faNum";
import { Price } from "@/components/Price";
import {
  DIGI_JET_LOGO_SRC,
  groceryContext,
  groceryItems,
  groceryQuestions,
  type GroceryItem,
  type GroceryQuestion,
  type GroceryReplacement,
} from "@/lib/mocks/monthlyGrocery";
import { GROCERY_BASKET_PIPELINE, GROCERY_INITIAL_PIPELINE } from "@/lib/thinking/pipelines/grocery";
import { ChipRow } from "./ChipRow";
import { Reveal } from "./Reveal";
import styles from "./MonthlyGroceryFlow.module.css";

const QUICK_ACTIONS = [
  { id: "cheaper", label: "ارزان‌ترش کن" },
  { id: "remove-extra", label: "چیزهای غیرضروری رو حذف کن" },
  { id: "iranian", label: "کالاهای ایرانی انتخاب کن" },
  { id: "less", label: "مقدارها رو کمتر کن" },
];

type AnswerMap = Record<string, string[]>;
type FlowStep = "initialThinking" | "setup" | "basketThinking" | "basket" | "handoff" | "postPurchase" | "routineSaved";

function rowTotal(item: GroceryItem) {
  return item.availability === "out_of_stock" ? 0 : item.price * item.quantity;
}

function basketTotal(items: GroceryItem[]) {
  return items.reduce((sum, item) => sum + rowTotal(item), 0);
}

function getAnswerLabel(question: GroceryQuestion, ids: string[]) {
  return ids.map((id) => question.options.find((option) => option.id === id)?.label ?? id).join("، ");
}

function buildConsolidatedUserMessage(answers: AnswerMap) {
  const duration = getAnswerLabel(groceryQuestions[1], answers.duration ?? ["one-month"]);
  const budget = getAnswerLabel(groceryQuestions[2], answers.budget ?? ["twelve"]);
  const preferences = getAnswerLabel(groceryQuestions[3], answers.preferences ?? ["none"]);
  const location = getAnswerLabel(groceryQuestions[0], answers.location ?? ["larrestan-office"]);
  const inventory = answers.inventory?.includes("from-zero") ? "از صفر شروع کن" : getAnswerLabel(groceryQuestions[4], answers.inventory ?? []);
  const preferenceCopy = preferences === "مورد خاصی نداریم" ? "بدون محدودیت غذایی" : `با رعایت ${preferences}`;

  return `برای ${duration}، خانواده ${faNum(groceryContext.householdSize)} نفره، با بودجه ${budget} و ${preferenceCopy} بچین. خرید رو برای ${location} انجام بده و ${inventory}.`;
}

function SetupQuestionnaire({ onComplete }: { onComplete: (answers: AnswerMap) => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(() =>
    Object.fromEntries(groceryQuestions.map((question) => [question.id, question.scriptedAnswerIds])),
  );
  const [submitted, setSubmitted] = useState(false);
  const question = groceryQuestions[stepIndex];
  const selectedIds = answers[question.id] ?? [];
  const isMulti = question.type === "multi";
  const customSelected = selectedIds.includes("custom");
  const canSubmit = selectedIds.length > 0 && !submitted;

  function setAnswer(ids: string[]) {
    setAnswers((current) => ({ ...current, [question.id]: ids }));
  }

  function pick(id: string) {
    if (!isMulti) {
      setAnswer([id]);
      return;
    }
    if (id === "none") {
      setAnswer(["none"]);
      return;
    }
    const next = selectedIds.filter((item) => item !== "none");
    setAnswer(next.includes(id) ? next.filter((item) => item !== id) : [...next, id]);
  }

  function next() {
    if (!canSubmit) return;
    if (stepIndex < groceryQuestions.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }
    setSubmitted(true);
    onComplete(answers);
  }

  return (
    <div className={`${styles.questionCard} ${submitted ? styles.questionCardComplete : ""}`}>
      <div className={styles.questionHead}>
        <span className={styles.questionTitle}>{submitted ? "پاسخ‌ها ثبت شد" : question.question}</span>
        <span className={styles.questionProgress}>
          {faNum(stepIndex + 1)} / {faNum(groceryQuestions.length)}
        </span>
      </div>

      <div key={question.id} className={styles.questionBody}>
        {submitted ? (
          <p className={styles.completedQuestionText}>دارم بر اساس همین جواب‌ها سبد رو آماده می‌کنم.</p>
        ) : (
          <>
            <div className={styles.optionStack}>
              {question.options.map((option) => {
                const selected = selectedIds.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`${styles.optionButton} ${selected ? styles.optionSelected : ""}`}
                    onClick={() => pick(option.id)}
                  >
                    <QuestionOptionIcon icon={option.icon} />
                    <span>{option.label}</span>
                    {isMulti && selected && <TickCircle variant="Bold" size={18} color="currentColor" />}
                  </button>
                );
              })}
            </div>
            {customSelected && <input className={styles.customInput} inputMode="numeric" placeholder="مثلاً ۱۰ میلیون تومان" />}
          </>
        )}
      </div>

      {!submitted && (
        <div className={styles.questionFooter}>
          <button type="button" className={styles.nextButton} disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.45 }} onClick={next}>
            بعدی
            <ArrowLeft2 variant="Linear" size={16} color="currentColor" />
          </button>
          <button
            type="button"
            className={styles.backButton}
            disabled={stepIndex === 0}
            style={{ visibility: stepIndex > 0 ? "visible" : "hidden" }}
            aria-label="قبلی"
            onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
          >
            <ArrowLeft2 variant="Linear" size={18} color="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
}

function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className={styles.quantityControl}>
      <button type="button" aria-label={quantity === 1 ? "حذف" : "کم کردن"} onClick={onDecrease}>
        {quantity === 1 ? <Trash variant="Linear" size={16} color="currentColor" /> : <Minus variant="Linear" size={16} color="currentColor" />}
      </button>
      <span>{faNum(quantity)}</span>
      <button type="button" aria-label="زیاد کردن" onClick={onIncrease}>
        <Add variant="Linear" size={16} color="currentColor" />
      </button>
    </div>
  );
}

function GroceryRow({
  item,
  onDecrease,
  onIncrease,
  onReplace,
}: {
  item: GroceryItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onReplace: () => void;
}) {
  const unavailable = item.availability === "out_of_stock";

  return (
    <div className={`${styles.groceryRow} ${unavailable ? styles.unavailableRow : ""}`}>
      <div className={styles.rowActionSlot}>
        {unavailable ? (
          <button type="button" className={styles.replaceButton} onClick={onReplace}>
            جایگزین
          </button>
        ) : (
          <QuantityControl quantity={item.quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
        )}
      </div>
      <div className={styles.productBody}>
        <div className={styles.productName}>{item.title}</div>
        <div className={unavailable ? styles.unavailableText : styles.productPrice}>
          {unavailable ? "ناموجود!" : <Price amount={formatPersianNumber(rowTotal(item))} />}
        </div>
      </div>
      <div className={styles.productImageFrame}>
        <Image src={item.image} alt={item.title} width={72} height={72} className={styles.productImage} />
      </div>
    </div>
  );
}

function GroceryBasket({
  items,
  onDecrease,
  onIncrease,
  onReplace,
  onQuickAction,
  onAddItem,
  onCheckout,
}: {
  items: GroceryItem[];
  onDecrease: (itemId: string) => void;
  onIncrease: (itemId: string) => void;
  onReplace: (item: GroceryItem) => void;
  onQuickAction: (actionId: string) => void;
  onAddItem: () => void;
  onCheckout: () => void;
}) {
  const visibleItems = items.filter((item) => item.quantity > 0);

  return (
    <div className={styles.assistantPost}>
      <div className={styles.basketCard}>
        <ComponentHeader
          className={styles.cartHeader}
          titleAs="h2"
          logo={DIGI_JET_LOGO_SRC}
          title={
            <>
              <span>خرید راحت </span>
              <span className={styles.jetTitle}>دیجی‌جت</span>
            </>
          }
        />

        <div className={styles.flatList}>
          {visibleItems.map((item) => (
            <GroceryRow
              key={item.id}
              item={item}
              onDecrease={() => onDecrease(item.id)}
              onIncrease={() => onIncrease(item.id)}
              onReplace={() => onReplace(item)}
            />
          ))}
        </div>

        <button type="button" className={styles.addItemButton} onClick={onAddItem}>
          <Add variant="Linear" size={22} color="currentColor" />
          چیز جدید اضافه کن!
        </button>

        <div className={styles.cartFooter}>
          <div className={styles.footerSummary}>
            <div className={styles.footerTotal}>
              <span>جمع سبد:</span>
              <strong>
                <Price amount={formatPersianNumber(basketTotal(items))} />
              </strong>
            </div>
            <div className={styles.footerDelivery}>
              <span>{groceryContext.deliveryEstimate}</span>
              <span className={styles.footerDeliveryCost}>
                <TruckFast variant="Linear" size={15} color="currentColor" />
                ارسال رایگان
              </span>
            </div>
          </div>

          <button type="button" className={styles.checkoutButton} onClick={onCheckout}>
            بررسی و ثبت سفارش
            <ArrowLeft2 variant="Linear" size={22} color="currentColor" />
          </button>
        </div>
      </div>

      <div className={styles.bottomChips}>
        <ChipRow chips={QUICK_ACTIONS} onPick={onQuickAction} />
      </div>
    </div>
  );
}

export function MonthlyGroceryFlow() {
  const [step, setStep] = useState<FlowStep>("initialThinking");
  const [answers, setAnswers] = useState<AnswerMap | null>(null);
  const [items, setItems] = useState<GroceryItem[]>(groceryItems);
  const [replacementTarget, setReplacementTarget] = useState<GroceryItem | null>(null);
  const [routineChoice, setRoutineChoice] = useState<string | null>(null);
  const { showNotification } = useVirtualNotifications();

  const consolidatedUserMessage = useMemo(() => (answers ? buildConsolidatedUserMessage(answers) : ""), [answers]);

  function completeSetup(nextAnswers: AnswerMap) {
    setAnswers(nextAnswers);
    setStep("basketThinking");
  }

  function updateQuantity(itemId: string, delta: number) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }),
    );
  }

  function applyReplacement(replacement: GroceryReplacement) {
    if (!replacementTarget) return;
    setItems((current) =>
      current.map((item) =>
        item.id === replacementTarget.id
          ? {
              ...item,
              title: replacement.title,
              image: replacement.image,
              price: replacement.price,
              availability: "replaced",
              selectedReplacementId: replacement.id,
            }
          : item,
      ),
    );
    setReplacementTarget(null);
  }

  function applyQuickAction(actionId: string) {
    if (actionId !== "cheaper" && actionId !== "less" && actionId !== "remove-extra") return;
    setItems((current) =>
      current.map((item) => {
        if (item.availability === "out_of_stock") return item;
        if (actionId === "remove-extra" && !item.isEssential) return { ...item, quantity: 0 };
        if ((actionId === "cheaper" || actionId === "less") && !item.isEssential && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }),
    );
  }

  function focusComposerForAddItem() {
    document.querySelector<HTMLInputElement>("input[placeholder]")?.focus();
  }

  function completeCheckout() {
    setStep("handoff");
    showNotification({
      sourceName: "DigiJet",
      title: "سفارش شما ثبت شد",
      body: "تحویل حدود ۲۰ تا ۳۰ دقیقه",
      icon: DIGI_JET_LOGO_SRC,
      timestampLabel: "now",
      kind: "success",
    });
  }

  return (
    <div className={styles.flowColumn}>
      <ThinkingBeat
        show={step === "initialThinking"}
        pipeline={GROCERY_INITIAL_PIPELINE}
        onComplete={() => setStep("setup")}
      />

      {step !== "initialThinking" && (
        <Reveal>
          <AssistantText
            paragraphs={[
              "حتماً. اول چندتا چیز کوتاه رو مشخص کنیم تا سبدی بچینم که هم برای یک ماه کافی باشه، هم با بودجه و سبک مصرفتون جور دربیاد.",
            ]}
          />
        </Reveal>
      )}

      {step === "setup" && (
        <Reveal>
          <SetupQuestionnaire onComplete={completeSetup} />
        </Reveal>
      )}

      {answers && (
        <Reveal>
          <div className={styles.userAnswerRow}>
            <UserBubble text={consolidatedUserMessage} />
          </div>
        </Reveal>
      )}

      <ThinkingBeat
        show={step === "basketThinking"}
        pipeline={GROCERY_BASKET_PIPELINE}
        onComplete={() => setStep("basket")}
      />

      {(step === "basket" || step === "handoff" || step === "postPurchase" || step === "routineSaved") && (
        <Reveal>
          <AssistantText paragraphs={["سبد خرید ماهانه‌تون آماده‌ست. مقدارها رو بر اساس تعداد نفرات، بودجه و موجودی همین محدوده تنظیم کردم."]} />
        </Reveal>
      )}

      {(step === "basket" || step === "handoff" || step === "postPurchase" || step === "routineSaved") && (
        <Reveal>
          <GroceryBasket
            items={items}
            onDecrease={(itemId) => updateQuantity(itemId, -1)}
            onIncrease={(itemId) => updateQuantity(itemId, 1)}
            onReplace={setReplacementTarget}
            onQuickAction={applyQuickAction}
            onAddItem={focusComposerForAddItem}
            onCheckout={completeCheckout}
          />
        </Reveal>
      )}

      {step === "handoff" && (
        <Reveal>
          <div className={styles.successCard}>
            <TickCircle variant="Bold" size={28} color="rgb(245, 112, 34)" />
            <p>خرید ماهانه‌تون ثبت شد. وضعیت سفارش رو از اینجا برات پیگیری می‌کنم.</p>
            <button type="button" className={styles.secondaryCta} onClick={() => setStep("postPurchase")}>
              ذخیره روتین ماهانه
            </button>
          </div>
        </Reveal>
      )}

      {(step === "postPurchase" || step === "routineSaved") && (
        <Reveal>
          <div className={styles.routineCard}>
            <ComponentHeader
              title="می‌خوای این خرید رو به‌عنوان روتین ماهانه ذخیره کنم؟"
              className={styles.routineHeader}
            />
            {["هر ماه آماده‌اش کن", "۳ روز قبل یادآوری کن", "هر بار اول ازم بپرس", "فقط همین بار"].map((option) => (
              <button
                key={option}
                type="button"
                className={routineChoice === option ? styles.routineSelected : ""}
                onClick={() => {
                  setRoutineChoice(option);
                  setStep("routineSaved");
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </Reveal>
      )}

      {step === "routineSaved" && (
        <Reveal>
          <AssistantText paragraphs={["انجام شد. ماه بعد قبل از خرید، سبد رو با مصرف و خرید این ماه به‌روز می‌کنم."]} />
        </Reveal>
      )}

      <BottomSheet open={Boolean(replacementTarget)} onClose={() => setReplacementTarget(null)} ariaLabel="جایگزین این محصول">
        <div className={styles.replacementSheet}>
          <h3>جایگزین این محصول</h3>
          <p>این گزینه‌ها از نظر قیمت و نوع محصول به انتخاب قبلی نزدیک‌ترن.</p>
          {replacementTarget?.replacementOptions?.map((replacement) => (
            <div key={replacement.id} className={styles.replacementOption}>
              <Image src={replacement.image} alt={replacement.title} width={58} height={58} className={styles.replacementImage} />
              <div className={styles.replacementBody}>
                <span className={styles.replacementBadge}>{replacement.badge}</span>
                <strong>{replacement.title}</strong>
                <small>
                  <Price amount={formatPersianNumber(replacement.price)} />
                </small>
                <em>{replacement.reason}</em>
              </div>
              <button type="button" onClick={() => applyReplacement(replacement)}>
                جایگزین کن
              </button>
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
