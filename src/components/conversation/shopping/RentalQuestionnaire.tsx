"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeft } from "@/components/icons/line";
import { faNum } from "@/lib/faNum";
import {
  RENTAL_BUILDING_AGE_OPTIONS,
  RENTAL_DEAL_BREAKER_OPTIONS,
  RENTAL_DEPOSIT_RANGE,
  RENTAL_FLOOR_MATERIAL_OPTIONS,
  RENTAL_MOVE_IN_OPTIONS,
  RENTAL_MUST_HAVE_OPTIONS,
  RENTAL_RENT_RANGE,
  type RentalAnswers,
} from "@/lib/mocks/rentalHouse";
import { RentalBudgetStep } from "./RentalBudgetStep";
import { RentalMapSelector } from "./RentalMapSelector";
import { RentalAreaBedroomsStep } from "./RentalAreaBedroomsStep";
import { RentalChoiceStep } from "./RentalChoiceStep";
import { RentalVibeSelector } from "./RentalVibeSelector";
import { RentalRoutesStep } from "./RentalRoutesStep";
import styles from "./RentalQuestionnaire.module.css";

const DEFAULT_ANSWERS: RentalAnswers = {
  depositBudget: Math.round((RENTAL_DEPOSIT_RANGE.min + RENTAL_DEPOSIT_RANGE.max) / 2 / RENTAL_DEPOSIT_RANGE.step) * RENTAL_DEPOSIT_RANGE.step,
  rentBudget: Math.round((RENTAL_RENT_RANGE.min + RENTAL_RENT_RANGE.max) / 2 / RENTAL_RENT_RANGE.step) * RENTAL_RENT_RANGE.step,
  budgetPreset: null,
  districtIds: [],
  areaId: "80-100",
  bedroomsId: "2",
  buildingAgeId: "under-10",
  mustHaveIds: [],
  floorMaterialId: "parquet",
  vibeId: "",
  routeIds: [],
  customRoutes: [],
  moveInId: "one-month",
  dealBreakerIds: [],
};

type StepDef = {
  title: string;
  isValid: (answers: RentalAnswers) => boolean;
  render: (answers: RentalAnswers, patch: (patch: Partial<RentalAnswers>) => void) => ReactNode;
};

const STEPS: StepDef[] = [
  {
    title: "بودجه‌ت برای رهن و اجاره چقدره؟",
    isValid: () => true,
    render: (answers, patch) => (
      <RentalBudgetStep
        depositBudget={answers.depositBudget}
        rentBudget={answers.rentBudget}
        budgetPreset={answers.budgetPreset}
        onChange={patch}
      />
    ),
  },
  {
    title: "کدوم محله‌ها برات قابل قبولن؟",
    isValid: (answers) => answers.districtIds.length > 0,
    render: (answers, patch) => (
      <RentalMapSelector selectedIds={answers.districtIds} onChange={(districtIds) => patch({ districtIds })} />
    ),
  },
  {
    title: "متراژ و تعداد خواب مدنظرت چیه؟",
    isValid: (answers) => Boolean(answers.areaId && answers.bedroomsId),
    render: (answers, patch) => (
      <RentalAreaBedroomsStep
        areaId={answers.areaId}
        bedroomsId={answers.bedroomsId}
        onChangeArea={(areaId) => patch({ areaId })}
        onChangeBedrooms={(bedroomsId) => patch({ bedroomsId })}
      />
    ),
  },
  {
    title: "قدمت ساختمون چقدر باشه بهتره؟",
    isValid: (answers) => Boolean(answers.buildingAgeId),
    render: (answers, patch) => (
      <RentalChoiceStep
        options={RENTAL_BUILDING_AGE_OPTIONS}
        selectedIds={[answers.buildingAgeId]}
        onChange={([id]) => patch({ buildingAgeId: id })}
      />
    ),
  },
  {
    title: "کدوم امکانات برات باید حتماً باشه؟",
    isValid: () => true,
    render: (answers, patch) => (
      <RentalChoiceStep
        options={RENTAL_MUST_HAVE_OPTIONS}
        selectedIds={answers.mustHaveIds}
        multiple
        onChange={(mustHaveIds) => patch({ mustHaveIds })}
      />
    ),
  },
  {
    title: "کف خونه چی باشه بیشتر حال می‌کنی؟",
    isValid: (answers) => Boolean(answers.floorMaterialId),
    render: (answers, patch) => (
      <RentalChoiceStep
        options={RENTAL_FLOOR_MATERIAL_OPTIONS}
        selectedIds={[answers.floorMaterialId]}
        onChange={([id]) => patch({ floorMaterialId: id })}
      />
    ),
  },
  {
    title: "حس‌وحال خونه بیشتر به کدوم نزدیک‌تره؟",
    isValid: (answers) => Boolean(answers.vibeId),
    render: (answers, patch) => <RentalVibeSelector vibeId={answers.vibeId} onChange={(vibeId) => patch({ vibeId })} />,
  },
  {
    title: "مسیرهای مهمت رو باهم چک کنیم",
    isValid: () => true,
    render: (answers, patch) => (
      <RentalRoutesStep
        routeIds={answers.routeIds}
        customRoutes={answers.customRoutes}
        onChangeRouteIds={(routeIds) => patch({ routeIds })}
        onChangeCustomRoutes={(customRoutes) => patch({ customRoutes })}
      />
    ),
  },
  {
    title: "کِی می‌خوای اسباب‌کشی کنی؟",
    isValid: (answers) => Boolean(answers.moveInId),
    render: (answers, patch) => (
      <RentalChoiceStep
        options={RENTAL_MOVE_IN_OPTIONS}
        selectedIds={[answers.moveInId]}
        onChange={([id]) => patch({ moveInId: id })}
      />
    ),
  },
  {
    title: "چیزی هست که اصلاً نخوایش؟",
    isValid: () => true,
    render: (answers, patch) => (
      <RentalChoiceStep
        options={RENTAL_DEAL_BREAKER_OPTIONS}
        selectedIds={answers.dealBreakerIds}
        multiple
        onChange={(dealBreakerIds) => patch({ dealBreakerIds })}
      />
    ),
  },
];

type RentalQuestionnaireProps = {
  onComplete: (answers: RentalAnswers) => void;
};

export function RentalQuestionnaire({ onComplete }: RentalQuestionnaireProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<RentalAnswers>(DEFAULT_ANSWERS);
  const [done, setDone] = useState(false);

  const step = STEPS[stepIndex];
  const canGoNext = step.isValid(answers);
  const isLastStep = stepIndex === STEPS.length - 1;

  function patch(value: Partial<RentalAnswers>) {
    setAnswers((prev) => ({ ...prev, ...value }));
  }

  function handleNext() {
    if (!canGoNext) return;
    if (isLastStep) {
      setDone(true);
      onComplete(answers);
      return;
    }
    setStepIndex((prev) => prev + 1);
  }

  function handleBack() {
    setStepIndex((prev) => Math.max(0, prev - 1));
  }

  if (done) {
    return (
      <div className={`${styles.card} ${styles.cardComplete}`}>
        <p className={styles.completedText}>ثبت شد — دارم گزینه‌ها رو برات آماده می‌کنم.</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>{step.title}</span>
        <span className={styles.progress}>
          {faNum(stepIndex + 1)} / {faNum(STEPS.length)}
        </span>
      </div>

      <div key={stepIndex} className={styles.body}>
        {step.render(answers, patch)}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.nextButton}
          disabled={!canGoNext}
          style={{ opacity: canGoNext ? 1 : 0.45 }}
          onClick={handleNext}
        >
          {isLastStep ? "تمومه" : "بعدی"}
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          className={styles.backButton}
          aria-label="قبلی"
          disabled={stepIndex === 0}
          style={{ visibility: stepIndex === 0 ? "hidden" : "visible" }}
          onClick={handleBack}
        >
          <ChevronLeft size={18} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
