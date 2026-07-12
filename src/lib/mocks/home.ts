import type { AISummaryInsight, ConversationPreview } from "@/types/home";
import { RENTAL_HOUSE_CONVERSATION_ID, RENTAL_HOUSE_SPACE_ID } from "@/lib/mocks/rentalHouse";
import { MONTHLY_GROCERY_CONVERSATION_ID } from "@/lib/mocks/monthlyGrocery";
import { CRYPTO_ANALYSIS_CONVERSATION_ID } from "@/lib/mocks/financeCopy";

export const AI_SUMMARY_INSIGHTS: AISummaryInsight[] = [
  { id: "rental", text: "۳ خونه جدید توی یوسف‌آباد پیدا کردم که با بودجه‌ات جوره؛ یکیشون پارکینگ اختصاصی هم داره." },
  { id: "grocery", text: "سبد خرید ماهانه‌ات آماده تأییده، ۳۱ قلم کالا با قیمت به‌صرفه‌تر از فروشگاه‌های نزدیکت." },
  { id: "gold", text: "قیمت طلای آبشده امروز ۱.۸٪ کاهش داشته، وقت خوبیه برای خریدی که مدتیه مد نظرته." },
  { id: "reminder", text: "بازدید آپارتمان فاطمی فردا عصر ساعت ۵ هماهنگ شده، مدارک اجاره رو هم همراه ببر." },
];

export const LATEST_CONVERSATIONS: ConversationPreview[] = [
  {
    id: "rental",
    icon: "🏠",
    iconSrc: "/images/spaces/new-icons-symbol-130/house.png",
    iconScale: 1.86,
    title: "پیدا کردن خانه",
    preview: "۳ گزینه جدید نزدیک یوسف‌آباد پیدا کردم.",
    relativeTime: "۲ ساعت پیش",
    href: `/spaces/${RENTAL_HOUSE_SPACE_ID}/conversations/${RENTAL_HOUSE_CONVERSATION_ID}`,
    unreadCount: 1,
  },
  {
    id: "grocery",
    icon: "🛒",
    iconSrc: "/images/spaces/new-icons-symbol-130/grocery.png",
    title: "خرید سوپرمارکت",
    preview: "سبد خریدت آماده تأییده.",
    relativeTime: "۱ روز پیش",
    href: `/spaces/kharid-supermarketi/conversations/${MONTHLY_GROCERY_CONVERSATION_ID}`,
    needsApproval: true,
  },
  {
    id: "gold",
    icon: "💰",
    iconSrc: "/images/spaces/new-icons-symbol-130/finance.png",
    iconScale: 1.44,
    title: "خرید طلای آبشده",
    preview: "امروز قیمت ۱.۸٪ کاهش داشته.",
    relativeTime: "۳ ساعت پیش",
    href: `/spaces/modiriat-mali/conversations/${CRYPTO_ANALYSIS_CONVERSATION_ID}`,
  },
];
