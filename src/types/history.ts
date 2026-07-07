export type HistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  isUnread: boolean;
  /** When set, the card links to this conversation. */
  href?: string;
};
