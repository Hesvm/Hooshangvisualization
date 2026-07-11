import type { AISummaryInsight, ConversationPreview } from "@/types/home";
import { RENTAL_HOUSE_CONVERSATION_ID, RENTAL_HOUSE_SPACE_ID } from "@/lib/mocks/rentalHouse";
import { MONTHLY_GROCERY_CONVERSATION_ID } from "@/lib/mocks/monthlyGrocery";
import { CRYPTO_ANALYSIS_CONVERSATION_ID } from "@/lib/mocks/financeCopy";

export const AI_SUMMARY_INSIGHTS: AISummaryInsight[] = [
  { id: "rental", text: "۳ خونه جدید توی یوسف‌آباد پیدا کردم که با بودجه‌ات جوره." },
  { id: "grocery", text: "سبد خرید ماهانه‌ات آماده تأییده، ۳۱ قلم کالا." },
  { id: "gold", text: "قیمت طلای آبشده امروز ۱.۸٪ کاهش داشته، وقت خوبیه." },
  { id: "reminder", text: "بازدید آپارتمان فاطمی فردا عصر هماهنگ شده." },
];

export const LATEST_CONVERSATIONS: ConversationPreview[] = [
  {
    id: "rental",
    icon: "🏠",
    title: "پیدا کردن خانه",
    preview: "۳ گزینه جدید نزدیک یوسف‌آباد پیدا کردم.",
    relativeTime: "۲ ساعت پیش",
    href: `/spaces/${RENTAL_HOUSE_SPACE_ID}/conversations/${RENTAL_HOUSE_CONVERSATION_ID}`,
  },
  {
    id: "grocery",
    icon: "🛒",
    title: "خرید سوپرمارکت",
    preview: "سبد خریدت آماده تأییده.",
    relativeTime: "۱ روز پیش",
    href: `/spaces/kharid-supermarketi/conversations/${MONTHLY_GROCERY_CONVERSATION_ID}`,
  },
  {
    id: "gold",
    icon: "💰",
    title: "خرید طلای آبشده",
    preview: "امروز قیمت ۱.۸٪ کاهش داشته.",
    relativeTime: "۳ ساعت پیش",
    href: `/spaces/modiriat-mali/conversations/${CRYPTO_ANALYSIS_CONVERSATION_ID}`,
  },
];
