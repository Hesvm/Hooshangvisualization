export type FinanceTabId =
  | "dashboard"
  | "chat"
  | "accounts"
  | "messages"
  | "assets"
  | "spending"
  | "portfolio"
  | "performance"
  | "insurance"
  | "loans"
  | "taxes";

export type FinanceTabDef = {
  id: FinanceTabId;
  label: string;
};

export const FINANCE_TABS: FinanceTabDef[] = [
  { id: "dashboard", label: "داشبورد" },
  { id: "chat", label: "چت‌ها" },
  { id: "accounts", label: "حساب‌ها" },
  { id: "messages", label: "پیام‌های هوشنگ" },
  { id: "assets", label: "دارایی‌ها" },
  { id: "spending", label: "مخارج" },
  { id: "portfolio", label: "پرتفو" },
  { id: "performance", label: "عملکرد" },
  { id: "insurance", label: "بیمه" },
  { id: "loans", label: "وام" },
  { id: "taxes", label: "مالیات" },
];

export const DEFAULT_FINANCE_TAB: FinanceTabId = "dashboard";
