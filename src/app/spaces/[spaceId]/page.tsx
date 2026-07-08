import { notFound } from "next/navigation";
import { SpacePageLayout } from "@/components/SpacePageLayout";
import { SpaceHeader } from "@/components/SpaceHeader";
import { WidgetGrid } from "@/components/WidgetGrid";
import { HistoryList } from "@/components/HistoryList";
import { QuickStartSection } from "@/components/QuickStartSection";
import { FinanceStartSection } from "@/components/widgets/finance/FinanceStartSection";
import { spacePages } from "@/config/spacePages";
import { spaces } from "@/config/spaces";

type SpacePageProps = {
  params: Promise<{ spaceId: string }>;
};

export default async function SpacePage({ params }: SpacePageProps) {
  const { spaceId } = await params;
  const content = spacePages[spaceId];

  if (!content) {
    notFound();
  }

  const suggestions = spaces.find((s) => s.id === spaceId)?.composerSuggestions;
  const historySlot = spaceId === "modiriat-mali" ? <FinanceStartSection /> : <HistoryList items={content.history} />;

  return (
    <SpacePageLayout
      header={<SpaceHeader title={content.title} iconSrc={content.iconSrc} accentRgb={content.accentRgb} />}
      widgets={
        <>
          <WidgetGrid widgets={content.widgets} />
          {content.quickStarts && <QuickStartSection title="شروع سریع" suggestions={content.quickStarts} />}
        </>
      }
      history={historySlot}
      suggestions={suggestions}
    />
  );
}
