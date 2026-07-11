"use client";

import { useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { motion } from "motion/react";
import { FinanceTabChips } from "./FinanceTabChips";
import { DEFAULT_FINANCE_TAB, type FinanceTabId } from "./financeTabs";
import { AccountsTab } from "./tabs/AccountsTab";
import { AssetsTab } from "./tabs/AssetsTab";
import { ChatTab } from "./tabs/ChatTab";
import { DashboardTab } from "./tabs/DashboardTab";
import { InsuranceTab } from "./tabs/InsuranceTab";
import { LoansTab } from "./tabs/LoansTab";
import { MessagesTab } from "./tabs/MessagesTab";
import { PerformanceTab } from "./tabs/PerformanceTab";
import { PortfolioTab } from "./tabs/PortfolioTab";
import { SpendingTab } from "./tabs/SpendingTab";
import { TaxesTab } from "./tabs/TaxesTab";
import styles from "./FinanceSpaceHome.module.css";

const TAB_COMPONENT: Record<FinanceTabId, ComponentType> = {
  dashboard: DashboardTab,
  chat: ChatTab,
  accounts: AccountsTab,
  messages: MessagesTab,
  assets: AssetsTab,
  spending: SpendingTab,
  portfolio: PortfolioTab,
  performance: PerformanceTab,
  insurance: InsuranceTab,
  loans: LoansTab,
  taxes: TaxesTab,
};

const FADE_MS = 160;

export function FinanceSpaceHome() {
  const [selectedTab, setSelectedTab] = useState<FinanceTabId>(DEFAULT_FINANCE_TAB);
  const [displayedTab, setDisplayedTab] = useState<FinanceTabId>(DEFAULT_FINANCE_TAB);
  const [visitedTabs, setVisitedTabs] = useState<Set<FinanceTabId>>(() => new Set([DEFAULT_FINANCE_TAB]));
  const [visible, setVisible] = useState(true);

  const scrollPositions = useRef<Map<FinanceTabId, number>>(new Map());
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function getScrollArea() {
    return rootRef.current?.parentElement ?? null;
  }

  function handlePick(nextTab: FinanceTabId) {
    if (nextTab === selectedTab) return;

    const scrollArea = getScrollArea();
    if (scrollArea) scrollPositions.current.set(displayedTab, scrollArea.scrollTop);

    setSelectedTab(nextTab);
    setVisible(false);

    if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
    pendingTimeout.current = setTimeout(() => {
      setVisitedTabs((prev) => (prev.has(nextTab) ? prev : new Set(prev).add(nextTab)));
      setDisplayedTab(nextTab);
      setVisible(true);
    }, FADE_MS);
  }

  useLayoutEffect(() => {
    const scrollArea = getScrollArea();
    if (!scrollArea) return;
    scrollArea.scrollTop = scrollPositions.current.get(displayedTab) ?? 0;
  }, [displayedTab]);

  return (
    <div ref={rootRef} className={styles.root}>
      <FinanceTabChips activeId={selectedTab} onPick={handlePick} />

      <motion.div layout className={styles.panelsWrap} transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}>
        <motion.div
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: FADE_MS / 1000, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {Array.from(visitedTabs).map((tabId) => {
            const TabComponent = TAB_COMPONENT[tabId];
            return (
              <div key={tabId} style={{ display: tabId === displayedTab ? "block" : "none" }}>
                <TabComponent />
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
