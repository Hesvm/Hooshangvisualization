"use client";

import { useState } from "react";
import { SpaceHeader } from "@/components/SpaceHeader";
import { Composer } from "@/components/Composer";
import type { ComposerSuggestion } from "@/types/space";
import type { Conversation } from "@/types/conversation";
import layout from "@/components/SpacePageLayout.module.css";
import styles from "./conversation.module.css";
import { renderBlock } from "./blocks";

type ConversationViewProps = {
  conversation: Conversation;
  title: string;
  iconSrc: string;
  accentRgb: string;
  suggestions?: ComposerSuggestion[];
};

export function ConversationView({
  conversation,
  title,
  iconSrc,
  accentRgb,
  suggestions,
}: ConversationViewProps) {
  // Locally appended user messages (from the composer). The mock stream is the
  // base; sending a message adds a user bubble at the end.
  const [sent, setSent] = useState<{ id: string; text: string }[]>([]);

  return (
    <main className={layout.frame}>
      <div className={layout.scrollArea}>
        <div className={styles.stream}>
          {conversation.blocks.map((b) => renderBlock(b))}
          {sent.map((m) => renderBlock({ id: m.id, kind: "userText", text: m.text }))}
        </div>
      </div>

      <div className={layout.topEdge} aria-hidden />

      <SpaceHeader title={title} iconSrc={iconSrc} accentRgb={accentRgb} />

      <Composer
        suggestions={suggestions}
        onSend={(text) => setSent((prev) => [...prev, { id: `sent-${prev.length}`, text }])}
      />
    </main>
  );
}
