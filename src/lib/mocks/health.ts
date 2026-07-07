export type MovementData = {
  calories: number;
  calorieGoal: number;
  exerciseMinutes: string;
  standHours: string;
};

export type HeartData = {
  bpm: number;
  restingBpm: number;
  normalRange: string;
};

export type SleepData = {
  score: number;
  quality: string;
  duration: string;
};

export type StepsData = {
  count: string;
  distanceKm: number;
  activeTime: string;
};

export const healthWidgetData = {
  movement: {
    calories: 735,
    calorieGoal: 1070,
    exerciseMinutes: "۴۴/۵۰",
    standHours: "۱۰/۱۲",
  } satisfies MovementData,
  heart: {
    bpm: 62,
    restingBpm: 62,
    normalRange: "۳۸–۱۸۷",
  } satisfies HeartData,
  sleep: {
    score: 98,
    quality: "عالی",
    duration: "۴ ساعت و ۱۹ دقیقه",
  } satisfies SleepData,
  steps: {
    count: "۱۳.۴k",
    distanceKm: 10.2,
    activeTime: "۵ ساعت و ۲۱ دقیقه",
  } satisfies StepsData,
};

export const healthHistory = [
  {
    id: "1",
    title: "خطرات گلوکز بالای ۷.۹ میلی‌گرم",
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
