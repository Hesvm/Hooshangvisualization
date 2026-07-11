import { notFound } from "next/navigation";
import { SpacePageLayout } from "@/components/SpacePageLayout";
import { SpaceHeader } from "@/components/SpaceHeader";
import { WidgetGrid } from "@/components/WidgetGrid";
import { HistoryList } from "@/components/HistoryList";
import { QuickStartSection } from "@/components/QuickStartSection";
import { FinanceSpaceHome } from "@/components/widgets/finance/FinanceSpaceHome";
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
  const isFinance = spaceId === "modiriat-mali";

  return (
    <SpacePageLayout
      header={<SpaceHeader title={content.title} iconSrc={content.iconSrc} accentRgb={content.accentRgb} />}
      widgets={
        isFinance ? (
          <FinanceSpaceHome />
        ) : (
          <>
            {content.widgets.length > 0 && <WidgetGrid widgets={content.widgets} />}
            {content.quickStarts && <QuickStartSection title="شروع سریع" suggestions={content.quickStarts} />}
          </>
        )
      }
      history={isFinance ? null : <HistoryList items={content.history} />}
      suggestions={suggestions}
    />
  );
}
