import type { AccountBalance } from "@/types/finance";

export const FINANCE_ACCOUNTS: AccountBalance[] = [
  { id: "bank-saman", kind: "bank", label: "بانک سامان", amount: 24_000_000, maskedNumber: "•••• ۴۸۳۲" },
  { id: "wallet", kind: "wallet", label: "کیف پول", amount: 8_300_000 },
  { id: "invest", kind: "invest", label: "سرمایه‌گذاری", amount: 115_000_000 },
];
