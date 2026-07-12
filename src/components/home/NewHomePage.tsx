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
  /* Editing mode covers the whole composer lifecycle (typing, voice, ...) —
     the content recedes for as long as the dock is the primary focus, not
     just while the text input specifically has focus. */
  const isEditing = composerState !== "idle";

  return (
    <main id="app-frame" className={styles.frame}>
      <GreetingPill />

      <div className={`${styles.scrollArea} ${isEditing ? styles.scrollAreaRaised : ""}`}>
        <div className={styles.topWidgetsRow}>
          <TopWidgets />
        </div>
        <AISummary insights={AI_SUMMARY_INSIGHTS} />
        <ConversationList items={LATEST_CONVERSATIONS} />
        <FinanceSection valueData={PORTFOLIO_VALUE_DATA} riskData={PORTFOLIO_RISK_ANALYSIS} />
      </div>

      {/* Decorative bottom fade/blur — sits above the scroll content, below the dock,
          same top-edge technique as SpacePageLayout's header, mirrored. */}
      <div className={styles.bottomEdge} aria-hidden />

      <BottomDock onComposerStateChange={setComposerState} />
    </main>
  );
}
