import type { NodeTypes } from "@xyflow/react";
import { CenterNode } from "./CenterNode";
import { CategoryNode } from "./CategoryNode";
import { LeafNode } from "./LeafNode";

export const nodeTypes: NodeTypes = {
  center: CenterNode,
  category: CategoryNode,
  leaf: LeafNode,
};
