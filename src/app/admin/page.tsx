"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { IntelligenceCategory } from "@/types/intelligence";
import { intelligenceUsers } from "@/lib/mocks/userIntelligence";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { FilterChips } from "@/components/admin/FilterChips";
import { InspectorPanel } from "@/components/admin/InspectorPanel";
import styles from "./page.module.css";

const IntelligenceGraph = dynamic(
  () => import("@/components/admin/IntelligenceGraph").then((mod) => mod.IntelligenceGraph),
  { ssr: false }
);

export default function AdminIntelligencePage() {
  const [selectedUserId, setSelectedUserId] = useState(intelligenceUsers[0].id);
  const [activeCategories, setActiveCategories] = useState<"all" | Set<IntelligenceCategory>>("all");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const profile = useMemo(
    () => intelligenceUsers.find((u) => u.id === selectedUserId) ?? intelligenceUsers[0],
    [selectedUserId]
  );

  function handleSelectUser(userId: string) {
    setSelectedUserId(userId);
    setActiveCategories("all");
    setSelectedNodeId(null);
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
        />

        <IntelligenceGraph
          profile={profile}
          activeCategories={activeCategories}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />
      </div>

      <InspectorPanel
        profile={profile}
        selectedNodeId={selectedNodeId}
        activeCategories={activeCategories}
        onSelectNode={setSelectedNodeId}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  );
}
