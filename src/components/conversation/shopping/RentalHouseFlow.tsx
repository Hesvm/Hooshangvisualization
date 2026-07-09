"use client";

import { useEffect, useRef, useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { ThinkingBeat } from "@/components/conversation/HooshangThinkingState";
import { AssistantText, UserBubble } from "@/components/conversation/blocks";
import { useVirtualNotifications } from "@/components/notifications/VirtualNotificationProvider";
import {
  RENTAL_BEST_MATCH_THINKING_MESSAGES,
  RENTAL_INTRO_TEXT,
  RENTAL_NEGOTIATION_TIPS,
  RENTAL_RESULT_INTRO_TEXT,
  RENTAL_THINKING_MESSAGES,
  RENTAL_VIEW_CHIPS,
  buildRentalSummaryMessage,
  type RentalAnswers,
} from "@/lib/mocks/rentalHouse";
import { ChipRow } from "./ChipRow";
import { Reveal } from "./Reveal";
import { RentalQuestionnaire } from "./RentalQuestionnaire";
import { RentalResultList } from "./RentalResultList";
import { RentalMapResult } from "./RentalMapResult";
import { RentalComparisonTable } from "./RentalComparisonTable";
import { RentalBestMatchCard } from "./RentalBestMatchCard";
import { RentalPropertyDetailSheet } from "./RentalPropertyDetailSheet";
import { RentalVisitScheduler } from "./RentalVisitScheduler";
import { RentalAutoSearchCard } from "./RentalAutoSearchCard";
import styles from "./RentalHouseFlow.module.css";

type ViewMode = (typeof RENTAL_VIEW_CHIPS)[number]["id"];
type Phase = "intro" | "questionnaire" | "thinking" | "results";

const FOLLOW_UP_BEST_MATCH = "best-match";
const FOLLOW_UP_AUTO_SEARCH = "auto-search";
const FOLLOW_UP_NEGOTIATION = "negotiation";

export function RentalHouseFlow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<RentalAnswers | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("smart");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [bestMatchThinking, setBestMatchThinking] = useState(false);
  const [bestMatchRevealed, setBestMatchRevealed] = useState(false);
  const [visitFor, setVisitFor] = useState<string | null>(null);
  const [visitConfirmedLabel, setVisitConfirmedLabel] = useState<string | null>(null);
  const [autoSearchEnabled, setAutoSearchEnabled] = useState(false);
  const [negotiationTipsShown, setNegotiationTipsShown] = useState(false);
  const timers = useRef<number[]>([]);
  const { showNotification } = useVirtualNotifications();

  function schedule(next: () => void, ms: number) {
    const timer = window.setTimeout(next, ms);
    timers.current.push(timer);
  }

  useEffect(() => {
    const activeTimers = timers.current;
    schedule(() => setPhase("questionnaire"), 900);
    return () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function completeQuestionnaire(nextAnswers: RentalAnswers) {
    setAnswers(nextAnswers);
    setPhase("thinking");
    schedule(() => setPhase("results"), 3200);
  }

  function handleBestMatch() {
    setBestMatchThinking(true);
    schedule(() => {
      setBestMatchThinking(false);
      setBestMatchRevealed(true);
    }, 1600);
  }

  function handleFollowUp(id: string) {
    if (id === FOLLOW_UP_BEST_MATCH) handleBestMatch();
    if (id === FOLLOW_UP_AUTO_SEARCH) setAutoSearchEnabled(true);
    if (id === FOLLOW_UP_NEGOTIATION) setNegotiationTipsShown(true);
  }

  function handleScheduleVisit(propertyId: string) {
    setSelectedPropertyId(null);
    setVisitFor(propertyId);
  }

  function confirmVisit(label: string) {
    if (!label) return;
    setVisitConfirmedLabel(label);
    setVisitFor(null);
    showNotification({
      sourceName: "هوشنگ",
      title: "بازدید هماهنگ شد",
      body: `بازدید برای ${label} ثبت شد.`,
      kind: "success",
    });
  }

  const followUpChips = [
    ...(!bestMatchRevealed ? [{ id: FOLLOW_UP_BEST_MATCH, label: "کدومش بیشتر به من می‌خوره؟" }] : []),
    ...(!autoSearchEnabled ? [{ id: FOLLOW_UP_AUTO_SEARCH, label: "هر چند ساعت گزینه‌های جدید رو چک کن" }] : []),
    ...(!negotiationTipsShown ? [{ id: FOLLOW_UP_NEGOTIATION, label: "راهنمای بازدید و چانه‌زنی" }] : []),
  ];

  return (
    <div className={styles.flowColumn}>
      {phase !== "intro" && (
        <Reveal>
          <AssistantText paragraphs={[RENTAL_INTRO_TEXT]} />
        </Reveal>
      )}

      {phase === "intro" && <ThinkingBeat show messages={["دارم چندتا سؤال کوتاه آماده می‌کنم..."]} />}

      {phase === "questionnaire" && (
        <Reveal>
          <RentalQuestionnaire onComplete={completeQuestionnaire} />
        </Reveal>
      )}

      {answers && (
        <Reveal>
          <UserBubble text={buildRentalSummaryMessage(answers)} />
        </Reveal>
      )}

      <ThinkingBeat show={phase === "thinking"} messages={RENTAL_THINKING_MESSAGES} cycleMs={1500} />

      {phase === "results" && (
        <>
          <Reveal>
            <AssistantText paragraphs={[RENTAL_RESULT_INTRO_TEXT]} />
          </Reveal>

          <Reveal>
            <div className={styles.viewSwitcherRow}>
              <ChipRow
                chips={RENTAL_VIEW_CHIPS.map((chip) => ({ id: chip.id, label: chip.label }))}
                activeId={viewMode}
                ariaLabel="نوع نمایش نتایج"
                onPick={(id) => setViewMode(id as ViewMode)}
              />
            </div>
          </Reveal>

          <Reveal>
            {viewMode === "smart" && <RentalResultList onViewProperty={setSelectedPropertyId} />}
            {viewMode === "map" && <RentalMapResult onViewProperty={setSelectedPropertyId} />}
            {viewMode === "table" && <RentalComparisonTable />}
          </Reveal>

          {followUpChips.length > 0 && (
            <Reveal>
              <div className={styles.followUpRow}>
                <ChipRow chips={followUpChips} ariaLabel="اقدام بعدی" onPick={handleFollowUp} />
              </div>
            </Reveal>
          )}

          <ThinkingBeat show={bestMatchThinking} messages={RENTAL_BEST_MATCH_THINKING_MESSAGES} cycleMs={1200} />

          {bestMatchRevealed && (
            <Reveal>
              <RentalBestMatchCard onViewProperty={setSelectedPropertyId} />
            </Reveal>
          )}

          {autoSearchEnabled && answers && (
            <Reveal>
              <RentalAutoSearchCard answers={answers} />
            </Reveal>
          )}

          {negotiationTipsShown && (
            <Reveal>
              <AssistantText paragraphs={RENTAL_NEGOTIATION_TIPS} />
            </Reveal>
          )}

          {visitFor && (
            <Reveal>
              <RentalVisitScheduler onConfirm={confirmVisit} />
            </Reveal>
          )}

          {visitConfirmedLabel && (
            <Reveal>
              <AssistantText paragraphs={[`عالی، بازدیدت رو برای ${visitConfirmedLabel} هماهنگ کردم. اگه چیزی تغییر کرد بهم بگو.`]} />
            </Reveal>
          )}
        </>
      )}

      <BottomSheet
        open={Boolean(selectedPropertyId)}
        onClose={() => setSelectedPropertyId(null)}
        ariaLabel="جزئیات خونه"
      >
        {selectedPropertyId && (
          <RentalPropertyDetailSheet
            propertyId={selectedPropertyId}
            onScheduleVisit={handleScheduleVisit}
            onShowSimilar={() => {
              setSelectedPropertyId(null);
              setViewMode("smart");
            }}
          />
        )}
      </BottomSheet>
    </div>
  );
}
