import type { Node, Edge } from "@xyflow/react";
import type {
  ConfidenceLevel,
  IntelligenceCategory,
  UserProfile,
} from "@/types/intelligence";
import { CATEGORY_ACCENT_RGB } from "@/config/intelligenceColors";

export type CenterNodeData = { kind: "center"; profile: UserProfile };
export type CategoryNodeData = {
  kind: "category";
  nodeId: string;
  category: IntelligenceCategory;
  label: string;
  confidence: ConfidenceLevel;
  expanded: boolean;
};
export type LeafNodeData = {
  kind: "leaf";
  nodeId: string;
  category: IntelligenceCategory;
  label: string;
  confidence: ConfidenceLevel;
};
export type GraphNodeData = CenterNodeData | CategoryNodeData | LeafNodeData;

const CATEGORY_RADIUS = 320;
const LEAF_RADIUS = 170;
const LEAF_SPREAD = Math.PI / 5; // ~36 degrees total arc per expanded category

function categoryAngle(index: number, total: number): number {
  return (index / total) * Math.PI * 2 - Math.PI / 2;
}

function edgeStyle(strength: number, confidence: ConfidenceLevel, category: IntelligenceCategory) {
  const strokeWidth = 1 + Math.round(Math.max(0, Math.min(1, strength)) * 3); // 1-4px
  const strokeDasharray =
    confidence === "confirmed" ? undefined : confidence === "inferred" ? "6 4" : "2 3";
  return {
    strokeWidth,
    stroke: `rgb(${CATEGORY_ACCENT_RGB[category]})`,
    strokeDasharray,
  };
}

/**
 * Pure function: given a user's full mock graph plus current UI state
 * (which category clusters are expanded, which categories are visible),
 * returns positioned React Flow nodes/edges for this render.
 */
export function computeGraph(
  profile: UserProfile,
  expandedCategoryIds: ReadonlySet<string>,
  activeCategories: "all" | ReadonlySet<IntelligenceCategory>
): { nodes: Node<GraphNodeData>[]; edges: Edge[] } {
  const centerId = `${profile.id}-center`;
  const categoryNodes = profile.nodes.filter((n) => n.kind === "category");
  const visibleCategories =
    activeCategories === "all"
      ? categoryNodes
      : categoryNodes.filter((n) => activeCategories.has(n.category));

  const nodes: Node<GraphNodeData>[] = [
    {
      id: centerId,
      type: "center",
      position: { x: 0, y: 0 },
      data: { kind: "center", profile },
      draggable: false,
      selectable: false,
    },
  ];
  const edges: Edge[] = [];

  visibleCategories.forEach((categoryNode, index) => {
    const angle = categoryAngle(index, visibleCategories.length);
    const x = Math.cos(angle) * CATEGORY_RADIUS;
    const y = Math.sin(angle) * CATEGORY_RADIUS;
    const expanded = expandedCategoryIds.has(categoryNode.id);

    nodes.push({
      id: categoryNode.id,
      type: "category",
      position: { x, y },
      data: {
        kind: "category",
        nodeId: categoryNode.id,
        category: categoryNode.category,
        label: categoryNode.label,
        confidence: categoryNode.confidence,
        expanded,
      },
    });

    const categoryEdge = profile.edges.find(
      (e) => e.source === centerId && e.target === categoryNode.id
    );
    edges.push({
      id: categoryEdge?.id ?? `${profile.id}-edge-${categoryNode.id}`,
      source: centerId,
      target: categoryNode.id,
      style: edgeStyle(categoryEdge?.strength ?? 0.5, categoryNode.confidence, categoryNode.category),
    });

    if (!expanded) return;

    const leaves = profile.nodes.filter(
      (n) => n.kind === "leaf" && n.category === categoryNode.category
    );
    leaves.forEach((leaf, leafIndex) => {
      const t = leaves.length === 1 ? 0.5 : leafIndex / (leaves.length - 1);
      const leafAngle = angle - LEAF_SPREAD / 2 + LEAF_SPREAD * t;
      const radius = CATEGORY_RADIUS + LEAF_RADIUS;

      nodes.push({
        id: leaf.id,
        type: "leaf",
        position: { x: Math.cos(leafAngle) * radius, y: Math.sin(leafAngle) * radius },
        data: {
          kind: "leaf",
          nodeId: leaf.id,
          category: leaf.category,
          label: leaf.label,
          confidence: leaf.confidence,
        },
      });

      const leafEdge = profile.edges.find(
        (e) => e.source === categoryNode.id && e.target === leaf.id
      );
      edges.push({
        id: leafEdge?.id ?? `${profile.id}-edge-${leaf.id}`,
        source: categoryNode.id,
        target: leaf.id,
        style: edgeStyle(leafEdge?.strength ?? 0.5, leaf.confidence, leaf.category),
      });
    });
  });

  return { nodes, edges };
}
