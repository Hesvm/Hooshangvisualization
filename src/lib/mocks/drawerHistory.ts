export type DrawerThreadType = "chat" | "media";

export type DrawerHistoryItem = {
  id: string;
  title: string;
  threadType: DrawerThreadType;
  href?: string;
};

export type DrawerHistoryGroup = {
  label: string;
  items: DrawerHistoryItem[];
};

export const drawerHistoryGroups: DrawerHistoryGroup[] = [
  {
    label: "امروز",
    items: [
      {
        id: "h1",
        title: "خطرات گلوکز بالای ۷٫۹ میلی‌گرم",
        threadType: "chat",
        href: "/spaces/badan/conversations/blood-test",
      },
      {
        id: "h2",
        title: "برنامه ورزشی کاهش وزن و چربی",
        threadType: "chat",
        href: "/spaces/badan/conversations/workout",
      },
      { id: "h3", title: "مقایسه قیمت هدفون‌های بی‌سیم", threadType: "media" },
    ],
  },
  {
    label: "دیروز",
    items: [
      { id: "h4", title: "گزارش مقایسه بودجه ماه گذشته", threadType: "media" },
      { id: "h5", title: "کیفیت خواب هفته گذشته بهتر شده", threadType: "chat" },
    ],
  },
  {
    label: "۳ روز پیش",
    items: [{ id: "h6", title: "چیدمان سفر آخر هفته به شمال", threadType: "chat" }],
  },
];
