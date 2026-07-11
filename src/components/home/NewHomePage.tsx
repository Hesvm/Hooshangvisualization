"use client";

import { useState } from "react";
import { GreetingPill } from "./GreetingPill";
import { TopWidgets } from "./TopWidgets";
import { AISummary } from "./AISummary";
import { ConversationList } from "./ConversationList";
import { FinanceSection } from "./FinanceSection";
import { BottomDock, type ComposerState } from "./BottomDock";
import { AI_SUMMARY_INSIGHTS, LATEST_CONVERSATIONS } from "@/lib/mocks/home";
import { PORTFOLIO_VALUE_DATA, PORTFOLIO_RISK_ANALYSIS } from "@/lib/mocks/portfolioValue";
import styles from "./NewHomePage.module.css";

export function NewHomePage() {
  const [composerState, setComposerState] = useState<ComposerState>("idle");
  const isComposerFocused = composerState === "focused";

  return (
    <main className={styles.frame}>
      <GreetingPill />

      <div className={`${styles.scrollArea} ${isComposerFocused ? styles.scrollAreaRaised : ""}`}>
        <div className={styles.topWidgetsRow}>
          <TopWidgets />
        </div>
        <AISummary insights={AI_SUMMARY_INSIGHTS} />
        <ConversationList items={LATEST_CONVERSATIONS} />
        <FinanceSection valueData={PORTFOLIO_VALUE_DATA} riskData={PORTFOLIO_RISK_ANALYSIS} />
      </div>

      <BottomDock onComposerStateChange={setComposerState} />
    </main>
  );
}
