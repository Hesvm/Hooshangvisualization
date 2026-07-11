import { CloseCircle } from "iconsax-react";
import type { IntelligenceNode, UserProfile } from "@/types/intelligence";
import { CATEGORY_ACCENT_RGB, CATEGORY_LABELS } from "@/config/intelligenceColors";
import styles from "./InspectorPanel.module.css";

type InspectorPanelProps = {
  profile: UserProfile;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onClose: () => void;
};

const CONFIDENCE_LABELS: Record<IntelligenceNode["confidence"], string> = {
  confirmed: "تایید شده",
  inferred: "استنتاج شده",
  weak: "ضعیف",
};

export function InspectorPanel({ profile, selectedNodeId, onSelectNode, onClose }: InspectorPanelProps) {
  const node = selectedNodeId ? profile.nodes.find((n) => n.id === selectedNodeId) ?? null : null;

  if (!node) return <div className={styles.panelCollapsed} />;

  const accent = CATEGORY_ACCENT_RGB[node.category];
  const relatedNodes = (node.relatedNodeIds ?? [])
    .map((id) => profile.nodes.find((n) => n.id === id))
    .filter((n): n is IntelligenceNode => Boolean(n));

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.categoryChip} style={{ ["--node-accent" as string]: accent }}>
            {CATEGORY_LABELS[node.category]}
          </span>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="بستن">
            <CloseCircle variant="Bold" size={18} color="currentColor" />
          </button>
        </div>
        <h2 className={styles.title}>{node.label}</h2>
        <span className={`${styles.confidenceBadge} ${styles[node.confidence]}`}>
          {CONFIDENCE_LABELS[node.confidence]} · {node.confidenceScore}٪
        </span>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>خلاصه</h3>
        <p className={styles.body}>{node.summary}</p>
      </section>

      {node.evidence.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>شواهد</h3>
          <ul className={styles.list}>
            {node.evidence.map((item, index) => (
              <li key={index} className={styles.listItem}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>آخرین به‌روزرسانی</h3>
        <p className={styles.body}>{node.lastUpdated}</p>
      </section>

      {relatedNodes.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>گره‌های مرتبط</h3>
          <div className={styles.relatedChips}>
            {relatedNodes.map((related) => (
              <button
                key={related.id}
                type="button"
                className={styles.relatedChip}
                onClick={() => onSelectNode(related.id)}
              >
                {related.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {node.aiRecommendation && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>پیشنهاد هوش مصنوعی</h3>
          <p className={styles.body}>{node.aiRecommendation}</p>
        </section>
      )}
    </aside>
  );
}
