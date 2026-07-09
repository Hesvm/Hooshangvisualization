export const MONTHLY_GROCERY_CONVERSATION_ID = "monthly-grocery-shopping";
export const MONTHLY_GROCERY_PROMPT = "خرید ماهانه‌ام رو انجام بده";
export const MONTHLY_GROCERY_USER_MESSAGE = "ما ۴ نفریم و می‌خوام خرید ماهانه خونه رو انجام بدم.";
export const MONTHLY_GROCERY_HEADER_ACCENT_RGB = "245, 112, 34";
export const DIGI_JET_LOGO_SRC = "/images/grocery/digi-jet.webp";

export const groceryReorderItems = [
  {
    id: "milk",
    name: "شیر ماهشام",
    image: "/images/grocery/milk.png",
    status: "احتمالاً ۲ روز تا اتمام",
  },
  {
    id: "eggs",
    name: "تخم‌مرغ",
    image: "/images/grocery/eggs.png",
    status: "برای صبحانه‌های این هفته کمه",
  },
  {
    id: "yogurt",
    name: "ماست",
    image: "/images/grocery/yogurt.png",
    status: "تاریخش نزدیکه",
  },
];

export const groceryMonthlyList = {
  title: "لیست ماهانه",
  count: 31,
  items: [
    { id: "bread", label: "نان", checked: true },
    { id: "milk", label: "شیر", checked: true },
    { id: "eggs", label: "تخم مرغ", checked: false },
    { id: "yogurt", label: "ماست", checked: false },
  ],
};

export const groceryHomeHistory = [
  {
    id: "glucose",
    title: "شیر کم‌قند به لیست ماهانه اضافه شد",
    subtitle: "با توجه به خریدهای قبلی، جایگزین سبک‌تری پیشنهاد شد.",
    isUnread: true,
  },
  {
    id: "delivery",
    title: "سبد صبحانه فردا آماده بررسیه",
    subtitle: "نان، شیر، تخم‌مرغ و موز برای خرید سریع آماده‌ان.",
    isUnread: false,
  },
  {
    id: "restock",
    title: "پنیر مورد علاقه‌ات دوباره موجود شد",
    subtitle: "می‌تونم توی خرید بعدی به‌صورت خودکار اضافه‌اش کنم.",
    isUnread: false,
  },
];

export type GroceryQuestionOption = {
  id: string;
  label: string;
  icon: string;
};

export type GroceryQuestion = {
  id: "location" | "duration" | "budget" | "preferences" | "inventory";
  question: string;
  type: "single" | "multi";
  options: GroceryQuestionOption[];
  scriptedAnswerIds: string[];
};

export type GroceryReplacement = {
  id: string;
  title: string;
  image: string;
  price: number;
  badge: string;
  reason: string;
};

export type GroceryItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  availability: "available" | "out_of_stock" | "replaced";
  replacementOptions?: GroceryReplacement[];
  selectedReplacementId?: string;
  isEssential: boolean;
};

export type GroceryContext = {
  householdSize: number;
  shoppingPeriodDays: number;
  budgetAmount: number;
  deliveryLocation: string;
  deliveryEstimate: string;
};

export const groceryContext: GroceryContext = {
  householdSize: 4,
  shoppingPeriodDays: 30,
  budgetAmount: 12_000_000,
  deliveryLocation: "دفتر لارستان",
  deliveryEstimate: "تحویل حدود ۲۰–۳۰ دقیقه",
};

export const groceryQuestions: GroceryQuestion[] = [
  {
    id: "location",
    question: "خرید رو برای کدوم آدرس انجام بدم؟",
    type: "single",
    options: [
      { id: "larrestan-office", label: "دفتر لارستان", icon: "home" },
      { id: "change-location", label: "تغییر آدرس", icon: "edit" },
    ],
    scriptedAnswerIds: ["larrestan-office"],
  },
  {
    id: "duration",
    question: "این خرید برای چه مدتیه؟",
    type: "single",
    options: [
      { id: "one-week", label: "یک هفته", icon: "calendar" },
      { id: "two-weeks", label: "دو هفته", icon: "calendar" },
      { id: "one-month", label: "یک ماه", icon: "calendar" },
    ],
    scriptedAnswerIds: ["one-month"],
  },
  {
    id: "budget",
    question: "حدوداً چقدر می‌خوای برای این خرید هزینه کنی؟",
    type: "single",
    options: [
      { id: "economic", label: "اقتصادی بچین", icon: "finance" },
      { id: "eight", label: "حدود ۸ میلیون تومان", icon: "finance" },
      { id: "twelve", label: "حدود ۱۲ میلیون تومان", icon: "finance" },
      { id: "unlimited", label: "محدودیت خاصی ندارم", icon: "finance" },
      { id: "custom", label: "خودم می‌نویسم...", icon: "edit" },
    ],
    scriptedAnswerIds: ["twelve"],
  },
  {
    id: "preferences",
    question: "چیزی هست که باید توی این خرید رعایت کنم؟",
    type: "multi",
    options: [
      { id: "low-sugar", label: "رژیمی و کم‌قند", icon: "health" },
      { id: "lactose-free", label: "بدون لاکتوز", icon: "health" },
      { id: "vegetarian", label: "گیاه‌خواری", icon: "leaf" },
      { id: "children", label: "بچه داریم", icon: "family" },
      { id: "pet", label: "حیوان خانگی داریم", icon: "home" },
      { id: "none", label: "مورد خاصی نداریم", icon: "check" },
    ],
    scriptedAnswerIds: ["none"],
  },
  {
    id: "inventory",
    question: "از خرید قبلی چیزی هنوز توی خونه دارید؟",
    type: "single",
    options: [
      { id: "manual", label: "بله، خودم می‌گم", icon: "edit" },
      { id: "photo", label: "از کابینت عکس می‌فرستم", icon: "camera" },
      { id: "from-zero", label: "نه، از صفر بچین", icon: "basket" },
      { id: "skip", label: "فعلاً رد شو", icon: "check" },
    ],
    scriptedAnswerIds: ["from-zero"],
  },
];

export const groceryItems: GroceryItem[] = [
  {
    id: "milk",
    title: "شیر پرچرب ۹۰۰ میلی‌لیتر",
    image: "/images/grocery/milk.png",
    price: 24_000,
    quantity: 2,
    availability: "available",
    isEssential: true,
  },
  {
    id: "eggs",
    title: "تخم‌مرغ ۱۲ عددی",
    image: "/images/grocery/eggs.png",
    price: 77_000,
    quantity: 1,
    availability: "available",
    isEssential: true,
  },
  {
    id: "toast",
    title: "نان تست سفید",
    image: "/images/grocery/toast.png",
    price: 49_000,
    quantity: 1,
    availability: "available",
    isEssential: true,
  },
  {
    id: "banana",
    title: "موز ۱ کیلوگرم",
    image: "/images/grocery/banana.png",
    price: 59_000,
    quantity: 1,
    availability: "available",
    isEssential: false,
  },
  {
    id: "yogurt",
    title: "ماست پرچرب ۹۰۰ گرمی",
    image: "/images/grocery/yogurt.png",
    price: 48_000,
    quantity: 2,
    availability: "available",
    isEssential: true,
  },
  {
    id: "cheese",
    title: "پنیر سفید صباح ۴۰۰ گرمی",
    image: "/images/grocery/cheese.png",
    price: 98_000,
    quantity: 1,
    availability: "out_of_stock",
    replacementOptions: [
      {
        id: "cheese-yogurt-labneh",
        title: "پنیر سفید کم‌نمک ۴۰۰ گرمی",
        image: "/images/grocery/cheese.png",
        price: 92_000,
        badge: "نزدیک‌ترین گزینه",
        reason: "هم‌اندازه و نزدیک به انتخاب قبلی",
      },
      {
        id: "cheese-economy",
        title: "پنیر صبحانه ۳۵۰ گرمی",
        image: "/images/grocery/cheese.png",
        price: 74_000,
        badge: "اقتصادی‌تر",
        reason: "قیمت پایین‌تر برای مصرف روزانه",
      },
    ],
    isEssential: true,
  },
  {
    id: "cucumber",
    title: "خیار ۱ کیلوگرم",
    image: "/images/grocery/cucumber.png",
    price: 42_000,
    quantity: 1,
    availability: "out_of_stock",
    replacementOptions: [
      {
        id: "cucumber-greenhouse",
        title: "خیار گلخانه‌ای ۱ کیلوگرم",
        image: "/images/grocery/cucumber.png",
        price: 46_000,
        badge: "کیفیت بهتر",
        reason: "تازه‌تر و موجود برای ارسال امروز",
      },
      {
        id: "cucumber-half",
        title: "خیار ۵۰۰ گرمی",
        image: "/images/grocery/cucumber.png",
        price: 26_000,
        badge: "اقتصادی‌تر",
        reason: "مقدار کمتر برای کنترل هزینه",
      },
    ],
    isEssential: false,
  },
];
