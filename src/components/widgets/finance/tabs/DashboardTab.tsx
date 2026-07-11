"use client";

import { AssetCompositionCard } from "@/components/widgets/finance/AssetCompositionCard";
import { AssetValueChart } from "@/components/widgets/finance/AssetValueChart";
import { FinanceMessageCard } from "@/components/widgets/finance/FinanceMessageCard";
import { PortfolioAnalysisPanel } from "@/components/widgets/finance/PortfolioAnalysisPanel";
import { SpendingWidget } from "@/components/widgets/finance/SpendingWidget";
import { ASSET_COMPOSITION_DATA, PORTFOLIO_RISK_ANALYSIS, PORTFOLIO_VALUE_DATA } from "@/lib/mocks/financeDashboard";
import { FINANCE_MESSAGES } from "@/lib/mocks/financeMessages";
import { SPENDING_DATA } from "@/lib/mocks/spending";
import styles from "./tabs.module.css";

export function DashboardTab() {
  return (
    <div className={styles.stack}>
      <SpendingWidget data={SPENDING_DATA} />
      <FinanceMessageCard messages={FINANCE_MESSAGES.slice(0, 2)} />
      <AssetValueChart data={PORTFOLIO_VALUE_DATA} />
      <AssetCompositionCard slices={ASSET_COMPOSITION_DATA} />
      <PortfolioAnalysisPanel data={PORTFOLIO_RISK_ANALYSIS} />
    </div>
  );
}
