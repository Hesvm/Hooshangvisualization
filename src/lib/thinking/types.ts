/**
 * A single beat of an investigation pipeline: how long it stays on screen and
 * which phrase variations it can show. `useThinkingPipeline` walks a list of
 * these in order, picking one message per step and waiting a random duration
 * in [minDuration, maxDuration] before advancing.
 */
export type ThinkingStep = {
  id: string;
  minDuration: number;
  maxDuration: number;
  messages: string[];
};

export type ThinkingPipeline = ThinkingStep[];
