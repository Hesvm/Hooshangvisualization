import { notFound } from "next/navigation";
import { ConversationView } from "@/components/conversation/ConversationView";
import { conversations } from "@/lib/mocks/conversations";
import { spacePages } from "@/config/spacePages";
import { spaces } from "@/config/spaces";

type ConversationPageProps = {
  params: Promise<{ spaceId: string; conversationId: string }>;
};

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { spaceId, conversationId } = await params;
  const conversation = conversations[conversationId];
  const space = spacePages[spaceId];

  if (!conversation || conversation.spaceId !== spaceId || !space) {
    notFound();
  }

  const suggestions = spaces.find((s) => s.id === spaceId)?.composerSuggestions;

  return (
    <ConversationView
      conversation={conversation}
      title={space.title}
      iconSrc={space.iconSrc}
      accentRgb={space.accentRgb}
      suggestions={suggestions}
    />
  );
}
