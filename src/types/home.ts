export type AISummaryInsight = {
  id: string;
  text: string;
};

export type ConversationPreview = {
  id: string;
  /** Emoji shown in the card's leading avatar swatch. */
  icon: string;
  /** Path to the app's own illustration, shown instead of the emoji when set. */
  iconSrc?: string;
  /** Illustration size in px; defaults to 44. */
  iconSize?: number;
  /** Scales the illustration within its 44px frame to compensate for built-in padding; defaults to 1. */
  iconScale?: number;
  title: string;
  preview: string;
  relativeTime: string;
  href?: string;
  /** Count shown in the unread badge; omit or 0 to hide the badge. */
  unreadCount?: number;
  /** Shows a "نیاز به تایید" pill instead of the badge/time when true. */
  needsApproval?: boolean;
};

export type DockAppEntry = {
  id: string;
  label: string;
  iconSrc: string;
  accentRgb: string;
  href?: string;
  hasNotification?: boolean;
};
