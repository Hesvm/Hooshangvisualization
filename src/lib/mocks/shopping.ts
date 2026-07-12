export type DayActivity = {
  dayIndex: number;
  jalaliMonth: number;
  activityCount: number;
  intensity: 0 | 1 | 2 | 3 | 4;
  tone?: "orange";
};

export const jalaliMonthLabels = [
  "فر",
  "ارد",
  "خرد",
  "تیر",
  "مرد",
  "شهر",
  "مهر",
  "آبا",
  "آذر",
  "دی",
  "بهم",
  "اسف",
];

const jalaliMonthDayCounts = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

const densePurchaseRanges = [
  { start: 38, end: 60 },
  { start: 132, end: 155 },
  { start: 186, end: 216 },
  { start: 271, end: 296 },
];

const orangePurchaseDays = new Set([45, 52, 145, 193, 207, 283, 291, 344]);

function intensityFromPurchaseCount(count: number): DayActivity["intensity"] {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

function purchaseCountForDay(dayIndex: number): number {
  const isDenseRange = densePurchaseRanges.some(
    (range) => dayIndex >= range.start && dayIndex <= range.end,
  );

  if (isDenseRange) {
    if (dayIndex % 6 === 0) return 0;
    return 1 + ((dayIndex * 7) % 6);
  }

  if (dayIndex % 43 === 0) return 5;
  if (dayIndex % 29 === 0) return 3;
  if (dayIndex % 17 === 0) return 2;
  if (dayIndex % 11 === 0) return 1;

  return 0;
}

function buildPurchaseDayActivity(): DayActivity[] {
  let dayIndex = 1;

  return jalaliMonthDayCounts.flatMap((dayCount, monthIndex) =>
    Array.from({ length: dayCount }, () => {
      const activityCount = purchaseCountForDay(dayIndex);

      return {
        dayIndex: dayIndex++,
        jalaliMonth: monthIndex + 1,
        activityCount,
        intensity: intensityFromPurchaseCount(activityCount),
        tone: orangePurchaseDays.has(dayIndex - 1) ? "orange" : undefined,
      };
    }),
  );
}

export const purchaseDayActivity = buildPurchaseDayActivity();

export type ShoppingListPreviewItem = {
  id: string;
  name: string;
  image: string;
  imageFit?: "contain" | "cover";
  imageScale?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
};

export type ShoppingListWidgetData = {
  title: string;
  totalCount: number;
  visibleCount: number;
  items: ShoppingListPreviewItem[];
};

export const shoppingListData = {
  title: "لیست خرید",
  totalCount: 28,
  visibleCount: 3,
  items: [
    {
      id: "camera",
      name: "دوربین فوری",
      image: "/images/shopping/instax-camera.png",
      imageFit: "contain",
      imageScale: 1.12,
      imageOffsetY: 8,
    },
    {
      id: "phone",
      name: "موبایل",
      image: "/images/shopping/orange-phone.png",
      imageFit: "contain",
      imageScale: 1.12,
      imageOffsetY: 9,
    },
    {
      id: "shoe",
      name: "کفش",
      image: "/images/shopping/new-balance-shoe.png",
      imageFit: "contain",
      imageScale: 0.96,
      imageOffsetY: 1,
    },
  ],
} satisfies ShoppingListWidgetData;

export type PurchaseOpportunityItem = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageScale?: number;
  imageOffsetY?: number;
  label: string;
};

export const purchaseOpportunityData: PurchaseOpportunityItem[] = [
  {
    id: "suitcase",
    name: "چمدان دلسی شاتلت ایر",
    price: 38_900_000,
    originalPrice: 45_500_000,
    image: "/images/shopping/opportunity/delsey-suitcase.png",
    imageScale: 1.3,
    imageOffsetY: 8,
    label: "پایین‌ترین حباب",
  },
  {
    id: "moonswatch",
    name: "ساعت امگا × سواچ",
    price: 22_500_000,
    originalPrice: 26_900_000,
    image: "/images/shopping/opportunity/omega-moonswatch.avif",
    imageScale: 1.2,
    imageOffsetY: 8,
    label: "پیشنهاد ویژه",
  },
  {
    id: "gorilla-toy",
    name: "عروسک فشاری گوریل مورتی",
    price: 350_000,
    originalPrice: 490_000,
    image: "/images/shopping/opportunity/gorilla-squeeze-toy.png",
    imageScale: 1.1,
    imageOffsetY: 9,
    label: "کمتر از حد انتظار",
  },
];

export const yourItemsData = {
  badge: "۲۱",
  labels: ["لپ‌تاپ", "گوشی", "کفش"],
};

export const shoppingHistory = [
  {
    id: "1",
    title: "قیمت پاوربانک انتخابی‌ات ۱۵٪ افت کرده",
    subtitle: "الان بهترین زمان خریده. می‌خوای لینکشو بفرستم؟",
    isUnread: true,
  },
  {
    id: "2",
    title: "سفارش کوله‌پشتی دیجی‌کالا تحویل داده شد",
    subtitle: "پیک ساعت ۱۴:۲۰ بسته رو تحویل داد",
    isUnread: false,
  },
  {
    id: "3",
    title: "ضدآفتاب مورد علاقه‌ات دوباره موجود شد",
    subtitle: "موجودی محدود، سه هفته قبل تموم شده بود",
    isUnread: false,
  },
];
