import type {
  ConfidenceLevel,
  IntelligenceCategory,
  UserProfile,
} from "@/types/intelligence";

export type CenterGraphNode = {
  id: string;
  kind: "center";
  profile: UserProfile;
  fx: number;
  fy: number;
};
export type CategoryGraphNode = {
  id: string;
  kind: "category";
  nodeId: string;
  category: IntelligenceCategory;
  label: string;
  confidence: ConfidenceLevel;
};
export type LeafGraphNode = {
  id: string;
  kind: "leaf";
  nodeId: string;
  category: IntelligenceCategory;
  label: string;
  confidence: ConfidenceLevel;
  imageUrl?: string;
};
export type GraphNode = CenterGraphNode | CategoryGraphNode | LeafGraphNode;

export type GraphLink = {
  id: string;
  source: string;
  target: string;
  strength: number;
  confidence: ConfidenceLevel;
  category: IntelligenceCategory;
  kind: "hierarchy" | "related";
};

/**
 * Pure function: given a user's full mock graph plus the active category
 * filter, returns the complete node/link set for this render (every
 * category and every leaf is included — no expand/collapse). Positions are
 * left entirely to the force simulation (react-force-graph).
 */
export function computeGraph(
  profile: UserProfile,
  activeCategories: "all" | ReadonlySet<IntelligenceCategory>
): { nodes: GraphNode[]; links: GraphLink[] } {
  const centerId = `${profile.id}-center`;
  const categoryNodes = profile.nodes.filter((n) => n.kind === "category");
  const visibleCategories =
    activeCategories === "all"
      ? categoryNodes
      : categoryNodes.filter((n) => activeCategories.has(n.category));

  const nodes: GraphNode[] = [
    { id: centerId, kind: "center", profile, fx: 0, fy: 0 },
  ];
  const links: GraphLink[] = [];

  visibleCategories.forEach((categoryNode) => {
    nodes.push({
      id: categoryNode.id,
      kind: "category",
      nodeId: categoryNode.id,
      category: categoryNode.category,
      label: categoryNode.label,
      confidence: categoryNode.confidence,
    });

    const categoryEdge = profile.edges.find(
      (e) => e.source === centerId && e.target === categoryNode.id
    );
    links.push({
      id: categoryEdge?.id ?? `${profile.id}-edge-${categoryNode.id}`,
      source: centerId,
      target: categoryNode.id,
      strength: categoryEdge?.strength ?? 0.5,
      confidence: categoryNode.confidence,
      category: categoryNode.category,
      kind: "hierarchy",
    });

    const leaves = profile.nodes.filter(
      (n) => n.kind === "leaf" && n.category === categoryNode.category
    );
    leaves.forEach((leaf) => {
      nodes.push({
        id: leaf.id,
        kind: "leaf",
        nodeId: leaf.id,
        category: leaf.category,
        label: leaf.label,
        confidence: leaf.confidence,
        imageUrl: leaf.imageUrl,
      });

      const leafEdge = profile.edges.find(
        (e) => e.source === categoryNode.id && e.target === leaf.id
      );
      links.push({
        id: leafEdge?.id ?? `${profile.id}-edge-${leaf.id}`,
        source: categoryNode.id,
        target: leaf.id,
        strength: leafEdge?.strength ?? 0.5,
        confidence: leaf.confidence,
        category: leaf.category,
        kind: "hierarchy",
      });
    });
  });

  const visibleNodeIds = new Set(nodes.map((n) => n.id));
  const seenRelatedPairs = new Set<string>();
  nodes.forEach((node) => {
    if (node.kind !== "leaf") return;
    const sourceLeaf = profile.nodes.find((n) => n.id === node.id);
    sourceLeaf?.relatedNodeIds?.forEach((targetId) => {
      if (!visibleNodeIds.has(targetId) || targetId === node.id) return;
      const pairKey = [node.id, targetId].sort().join("::");
      if (seenRelatedPairs.has(pairKey)) return;
      seenRelatedPairs.add(pairKey);
      links.push({
        id: `${profile.id}-related-${pairKey}`,
        source: node.id,
        target: targetId,
        strength: 0.25,
        confidence: node.confidence,
        category: node.category,
        kind: "related",
      });
    });
  });

  return { nodes, links };
}
