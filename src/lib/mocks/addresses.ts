import type { Address, DeliverySlot } from "@/types/shopping";

export const ADDRESSES: Address[] = [
  {
    id: "home",
    label: "خانه",
    recipientName: "حسام رضایی",
    fullAddress: "تهران، خیابان ولیعصر، بالاتر از میدان ونک، کوچه بهار، پلاک ۱۲، واحد ۴",
    postalCode: "۱۹۳۸۹۴۵۶۷۸",
  },
  {
    id: "work",
    label: "محل کار",
    recipientName: "حسام رضایی",
    fullAddress: "تهران، خیابان شریعتی، نرسیده به پل سیدخندان، برج آفتاب، طبقه ۶، واحد ۱۱",
    postalCode: "۱۶۵۱۷۸۹۰۱۲",
  },
];

export const DELIVERY_SLOTS: DeliverySlot[] = [
  {
    id: "today",
    dayLabel: "امروز",
    dateLabel: "۱۸ تیر",
    timeWindow: "۱۶ تا ۲۰",
    isExpress: true,
  },
  {
    id: "tomorrow",
    dayLabel: "فردا",
    dateLabel: "۱۹ تیر",
    timeWindow: "۸ تا ۱۲",
  },
  {
    id: "day-after",
    dayLabel: "پس‌فردا",
    dateLabel: "۲۰ تیر",
    timeWindow: "۱۲ تا ۱۶",
  },
];
