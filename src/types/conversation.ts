/**
 * Minimal rich-response schema for conversation pages. The main-project "rich
 * response schema" referenced in the build prompt doesn't exist in this repo,
 * so this is defined from scratch, shaped to the two Health reference mocks.
 * Blocks render in document order; user/assistant role is encoded per block.
 */

import type { ShoppingProduct } from "@/types/shopping";

export type ComparisonStatus = "up" | "down" | "borderline";

export type ComparisonRow = {
  /** metric name (شاخص) */
  label: string;
  previous: string;
  current: string;
  /** drives the status pill colour/label, not hardcoded per row */
  status: ComparisonStatus;
};

export type QuestionOption = {
  id: string;
  icon: string;
  label: string;
};

export type ExerciseRow = {
  move: string;
  setsReps: string;
  rest: string;
};

export type WorkoutDay = {
  id: string;
  /** e.g. "روز ۱ :: سینه" */
  label: string;
  /** muscle group name shown in the (placeholder) diagram */
  muscle: string;
  exercises: ExerciseRow[];
};

export type ConversationBlock =
  | { id: string; kind: "file"; fileName: string }
  | { id: string; kind: "userText"; text: string }
  | { id: string; kind: "assistantText"; paragraphs: string[] }
  | {
      id: string;
      kind: "comparisonTable";
      title: string;
      /** metric / previous / current / status header labels, RTL order */
      columns: { metric: string; previous: string; current: string; status: string };
      rows: ComparisonRow[];
    }
  | {
      id: string;
      kind: "questionnaire";
      step: number;
      total: number;
      question: string;
      options: QuestionOption[];
      selectedId: string;
      customPlaceholder: string;
    }
  | {
      id: string;
      kind: "permission";
      primaryLabel: string;
      secondaryLabel: string;
    }
  | {
      id: string;
      kind: "workoutPlan";
      exerciseTitle: string;
      columns: { move: string; setsReps: string; rest: string };
      days: WorkoutDay[];
    }
  | {
      id: string;
      kind: "weightChart";
      /** placeholder projection: weekly weights, single line */
      title: string;
      unit: string;
      points: { week: string; weight: number }[];
      note: string;
    }
  | {
      id: string;
      kind: "shoppingRecommendation";
      products: ShoppingProduct[];
      /** id of the product the assistant will reveal as the personalized pick */
      recommendedProductId: string;
    }
  | {
      id: string;
      kind: "monthlyGroceryShopping";
    }
  | {
      id: string;
      kind: "financeCryptoAnalysis";
    }
  | {
      id: string;
      kind: "rentalHouseSearch";
    };

export type Conversation = {
  id: string;
  spaceId: string;
  headerAccentRgb?: string;
  blocks: ConversationBlock[];
};
