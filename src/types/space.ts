export type ComposerSuggestionIcon =
  | "shopping"
  | "health"
  | "workout"
  | "sleep"
  | "finance"
  | "travel"
  | "learning"
  | "daily";

export type ComposerSuggestion = {
  id: string;
  label: string;
  icon: ComposerSuggestionIcon;
  prompt: string;
  /** When set, picking this suggestion navigates here instead of just filling the composer. */
  href?: string;
};

export type SpaceConfig = {
  id: string;
  label: string;
  iconSrc: string;
  hasNotification: boolean;
  /* Contextual starter prompts shown above the composer when focused.
     Sourced per-space rather than hardcoded in the composer. */
  composerSuggestions?: ComposerSuggestion[];
};
