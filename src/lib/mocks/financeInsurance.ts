import type { InsurancePolicy } from "@/types/finance";

export const INSURANCE_POLICIES: InsurancePolicy[] = [
  { id: "car", label: "بیمه خودرو", icon: "car", coverage: "بدنه و شخص ثالث", renewalDate: "۱۲ مرداد ۱۴۰۴", premium: 4_200_000 },
  { id: "health", label: "بیمه درمان", icon: "health", coverage: "درمان تکمیلی خانواده", renewalDate: "۳ آبان ۱۴۰۴", premium: 6_800_000 },
  { id: "life", label: "بیمه عمر", icon: "life", coverage: "پس‌انداز و سرمایه‌گذاری", renewalDate: "۲۰ دی ۱۴۰۴", premium: 3_500_000 },
];
