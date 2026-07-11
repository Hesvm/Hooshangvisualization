import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { CategoryNodeData } from "@/lib/intelligenceLayout";
import { CATEGORY_ACCENT_RGB } from "@/config/intelligenceColors";
import styles from "./CategoryNode.module.css";

type CategoryFlowNode = Node<CategoryNodeData, "category">;

export function CategoryNode({ data }: NodeProps<CategoryFlowNode>) {
  const accent = CATEGORY_ACCENT_RGB[data.category];
  return (
    <div
      className={`${styles.node} ${styles[data.confidence]} ${data.expanded ? styles.expanded : ""}`}
      style={{ ["--node-accent" as string]: accent }}
    >
      <Handle type="target" position={Position.Top} isConnectable={false} className={styles.handle} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} className={styles.handle} />
      <span className={styles.label}>{data.label}</span>
    </div>
  );
}
