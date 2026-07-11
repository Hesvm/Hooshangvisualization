"use client";

import { useMemo } from "react";
import { ReactFlow, Background, Controls, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { IntelligenceCategory, UserProfile } from "@/types/intelligence";
import { computeGraph, type GraphNodeData } from "@/lib/intelligenceLayout";
import { nodeTypes } from "./nodes/nodeTypes";
import styles from "./IntelligenceGraph.module.css";

type IntelligenceGraphProps = {
  profile: UserProfile;
  expandedCategoryIds: ReadonlySet<string>;
  activeCategories: "all" | ReadonlySet<IntelligenceCategory>;
  onToggleCategory: (categoryNodeId: string) => void;
  onSelectLeaf: (leafNodeId: string) => void;
};

export function IntelligenceGraph({
  profile,
  expandedCategoryIds,
  activeCategories,
  onToggleCategory,
  onSelectLeaf,
}: IntelligenceGraphProps) {
  const { nodes, edges } = useMemo(
    () => computeGraph(profile, expandedCategoryIds, activeCategories),
    [profile, expandedCategoryIds, activeCategories]
  );

  function handleNodeClick(_event: React.MouseEvent, node: Node<GraphNodeData>) {
    if (node.data.kind === "category") {
      onToggleCategory(node.data.nodeId);
    } else if (node.data.kind === "leaf") {
      onSelectLeaf(node.data.nodeId);
    }
  }

  return (
    <div className={styles.canvas}>
      <ReactFlow
        key={profile.id}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} color="var(--color-border-soft)" />
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>
    </div>
  );
}
