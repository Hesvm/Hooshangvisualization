export type MovementData = {
  moveValue: number;
  moveGoal: number;
  exerciseValue: number;
  exerciseGoal: number;
  standValue: number;
  standGoal: number;
};

export type HeartData = {
  bpm: number;
  minutesAgo: number;
  restingBpm: number;
  rangeLow: number;
  rangeHigh: number;
  hrv: number;
};

export type SleepData = {
  score: number;
  quality: string;
  sleepDuration: string;
  inBed: string;
  wakeUps: number;
};

export type StepsData = {
  count: string;
  percent: number;
  distanceKm: number;
  climbedFlights: number;
  activeTime: string;
};

export const healthWidgetData = {
  movement: {
    moveValue: 1013,
    moveGoal: 700,
    exerciseValue: 52,
    exerciseGoal: 45,
    standValue: 17,
    standGoal: 12,
  } satisfies MovementData,
  heart: {
    bpm: 74,
    minutesAgo: 5,
    restingBpm: 59,
    rangeLow: 47,
    rangeHigh: 163,
    hrv: 29,
  } satisfies HeartData,
  sleep: {
    score: 61,
    quality: "متوسط",
    sleepDuration: "۴:۳۳ ساعت",
    inBed: "۴:۵۶ ساعت",
    wakeUps: 5,
  } satisfies SleepData,
  steps: {
    count: "8.1k",
    percent: 81,
    distanceKm: 6.2,
    climbedFlights: 1,
    activeTime: "۹:۴۲ ساعت",
  } satisfies StepsData,
};

export const healthHistory = [
  {
    id: "1",
    title: "خطرات گلوکز بالای ۷٫۹ میلی‌گرم",
    subtitle: "ببین این خیلی بده. لطفا زودتر برو دکتر...",
    isUnread: true,
    href: "/spaces/badan/conversations/blood-test",
  },
  {
    id: "2",
    title: "برنامه ورزشی کاهش وزن و چربی",
    subtitle: "برنامه ۴ روزه‌ات آماده‌ست — روز اول: سینه",
    isUnread: false,
    href: "/spaces/badan/conversations/workout",
  },
  {
    id: "3",
    title: "کیفیت خواب هفته گذشته بهتر شده",
    subtitle: "میانگین خواب عمیق ۱۸٪ نسبت به هفته قبل رشد داشته",
    isUnread: false,
  },
];
