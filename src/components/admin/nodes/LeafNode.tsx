import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { LeafNodeData } from "@/lib/intelligenceLayout";
import { CATEGORY_ACCENT_RGB } from "@/config/intelligenceColors";
import styles from "./LeafNode.module.css";

type LeafFlowNode = Node<LeafNodeData, "leaf">;

export function LeafNode({ data }: NodeProps<LeafFlowNode>) {
  const accent = CATEGORY_ACCENT_RGB[data.category];
  return (
    <div
      className={`${styles.node} ${styles[data.confidence]}`}
      style={{ ["--node-accent" as string]: accent }}
    >
      <Handle type="target" position={Position.Top} isConnectable={false} className={styles.handle} />
      <span className={styles.label}>{data.label}</span>
    </div>
  );
}
