import type { PerformancePeriod } from "@/types/finance";

export const PERFORMANCE_PERIODS: PerformancePeriod[] = [
  { id: "today", label: "بازده امروز", changePercentage: 1.8, points: [100, 101, 100.5, 102, 101.8] },
  { id: "week", label: "بازده هفته", changePercentage: 5.4, points: [100, 97, 99, 102, 105.4] },
  { id: "month", label: "بازده ماه", changePercentage: -2.3, points: [100, 103, 101, 98.5, 97.7] },
  { id: "year", label: "بازده سال", changePercentage: 21.6, points: [100, 108, 104, 115, 121.6] },
];
