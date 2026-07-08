"use client";

import styles from "./MessageSuggestionStack.module.css";

export type MessageSuggestion = {
  id: string;
  label: string;
  prompt: string;
};

type MessageSuggestionStackProps = {
  suggestions: MessageSuggestion[];
  disabledIds?: string[];
  onSelect: (suggestion: MessageSuggestion) => void;
};

const MAX_VISIBLE_SUGGESTIONS = 3;

export function MessageSuggestionStack({ suggestions, disabledIds = [], onSelect }: MessageSuggestionStackProps) {
  const visibleSuggestions = suggestions.slice(0, MAX_VISIBLE_SUGGESTIONS);

  if (visibleSuggestions.length === 0) return null;

  return (
    <div className={styles.stack} aria-label="پیشنهادهای بعدی">
      {visibleSuggestions.map((suggestion) => {
        const disabled = disabledIds.includes(suggestion.id);
        return (
          <button
            key={suggestion.id}
            type="button"
            className={styles.suggestion}
            disabled={disabled}
            onClick={() => {
              if (!disabled) onSelect(suggestion);
            }}
          >
            <bdi>{suggestion.label}</bdi>
          </button>
        );
      })}
    </div>
  );
}
