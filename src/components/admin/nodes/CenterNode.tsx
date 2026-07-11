import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { CenterNodeData } from "@/lib/intelligenceLayout";
import styles from "./CenterNode.module.css";

type CenterFlowNode = Node<CenterNodeData, "center">;

export function CenterNode({ data }: NodeProps<CenterFlowNode>) {
  const initial = data.profile.name.charAt(0);
  return (
    <div className={styles.node}>
      <Handle type="target" position={Position.Top} isConnectable={false} className={styles.handle} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} className={styles.handle} />
      <div className={styles.avatar}>{initial}</div>
      <div className={styles.name}>{data.profile.name}</div>
      <div className={styles.status}>{data.profile.statusLine}</div>
    </div>
  );
}
