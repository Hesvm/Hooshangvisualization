"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { IntelligenceCategory } from "@/types/intelligence";
import { intelligenceUsers } from "@/lib/mocks/userIntelligence";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { FilterChips } from "@/components/admin/FilterChips";
import { InsightCardStrip } from "@/components/admin/InsightCardStrip";
import { InspectorPanel } from "@/components/admin/InspectorPanel";
import styles from "./page.module.css";

const IntelligenceGraph = dynamic(
  () => import("@/components/admin/IntelligenceGraph").then((mod) => mod.IntelligenceGraph),
  { ssr: false }
);

export default function AdminIntelligencePage() {
  const [selectedUserId, setSelectedUserId] = useState(intelligenceUsers[0].id);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(new Set());
  const [activeCategories, setActiveCategories] = useState<"all" | Set<IntelligenceCategory>>("all");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(true);

  const profile = useMemo(
    () => intelligenceUsers.find((u) => u.id === selectedUserId) ?? intelligenceUsers[0],
    [selectedUserId]
  );

  function handleSelectUser(userId: string) {
    setSelectedUserId(userId);
    setExpandedCategoryIds(new Set());
    setActiveCategories("all");
    setSelectedNodeId(null);
  }

  function handleToggleCategoryNode(categoryNodeId: string) {
    setExpandedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryNodeId)) {
        next.delete(categoryNodeId);
      } else {
        next.add(categoryNodeId);
      }
      return next;
    });
  }

  function handleToggleCategoryFilter(category: IntelligenceCategory) {
    setActiveCategories((prev) => {
      const base = prev === "all" ? new Set<IntelligenceCategory>() : new Set(prev);
      if (base.has(category)) {
        base.delete(category);
      } else {
        base.add(category);
      }
      return base.size === 0 ? "all" : base;
    });
  }

  return (
    <div className={styles.page}>
      <AdminSidebar users={intelligenceUsers} selectedUserId={selectedUserId} onSelectUser={handleSelectUser} />

      <div className={styles.main}>
        <FilterChips
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategoryFilter}
          onSelectAll={() => setActiveCategories("all")}
          showInsights={showInsights}
          onToggleInsights={() => setShowInsights((v) => !v)}
        />

        {showInsights && <InsightCardStrip insights={profile.insights} />}

        <IntelligenceGraph
          profile={profile}
          expandedCategoryIds={expandedCategoryIds}
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategoryNode}
          onSelectLeaf={setSelectedNodeId}
        />
      </div>

      <InspectorPanel
        profile={profile}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  );
}
