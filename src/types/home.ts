export type AISummaryInsight = {
  id: string;
  text: string;
};

export type ConversationPreview = {
  id: string;
  /** Emoji shown in the card's leading avatar swatch. */
  icon: string;
  title: string;
  preview: string;
  relativeTime: string;
  href?: string;
};

export type DockAppEntry = {
  id: string;
  label: string;
  iconSrc: string;
  accentRgb: string;
  href?: string;
  hasNotification?: boolean;
};
