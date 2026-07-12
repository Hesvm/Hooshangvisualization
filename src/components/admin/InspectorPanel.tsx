import Image from "next/image";
import { CloseCircle, MessageText1, MagicStar, Chart21, User, Warning2, Ranking } from "iconsax-react";
import type { ConfidenceLevel, IntelligenceCategory, IntelligenceNode, UserProfile } from "@/types/intelligence";
import { CATEGORY_ACCENT_RGB, CATEGORY_ICONS, CATEGORY_LABELS } from "@/config/intelligenceColors";
import { getCategoryVolumes, getUserOverview } from "@/lib/intelligenceInsights";
import styles from "./InspectorPanel.module.css";

type InspectorPanelProps = {
  profile: UserProfile;
  selectedNodeId: string | null;
  activeCategories: "all" | ReadonlySet<IntelligenceCategory>;
  onSelectNode: (nodeId: string) => void;
  onClose: () => void;
};

const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  confirmed: "تایید شده",
  inferred: "استنتاج شده",
  weak: "ضعیف",
};

const DISTRIBUTION_OPACITY: Record<ConfidenceLevel, number> = {
  confirmed: 0.95,
  inferred: 0.55,
  weak: 0.28,
};

const GAUGE_RADIUS = 26;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

function ConfidenceGauge({ score, accent }: { score: number; accent: string }) {
  const clamped = Math.max(0, Math.min(100, score));
  const dash = (clamped / 100) * GAUGE_CIRCUMFERENCE;
  return (
    <svg className={styles.gauge} width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r={GAUGE_RADIUS} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="6" />
      <circle
        cx="32"
        cy="32"
        r={GAUGE_RADIUS}
        fill="none"
        stroke={`rgb(${accent})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${GAUGE_CIRCUMFERENCE}`}
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="37" textAnchor="middle" className={styles.gaugeText}>
        {clamped}٪
      </text>
    </svg>
  );
}

function DistributionBar({ leaves, accent }: { leaves: IntelligenceNode[]; accent: string }) {
  const total = leaves.length || 1;
  const counts: Record<ConfidenceLevel, number> = { confirmed: 0, inferred: 0, weak: 0 };
  leaves.forEach((leaf) => {
    counts[leaf.confidence] += 1;
  });
  const levels: ConfidenceLevel[] = ["confirmed", "inferred", "weak"];

  return (
    <div className={styles.distribution}>
      <div className={styles.distributionTrack}>
        {levels.map(
          (level) =>
            counts[level] > 0 && (
              <span
                key={level}
                className={styles.distributionSegment}
                style={{
                  width: `${(counts[level] / total) * 100}%`,
                  background: `rgba(${accent}, ${DISTRIBUTION_OPACITY[level]})`,
                }}
              />
            )
        )}
      </div>
      <div className={styles.distributionLegend}>
        {levels.map(
          (level) =>
            counts[level] > 0 && (
              <span key={level} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ background: `rgba(${accent}, ${DISTRIBUTION_OPACITY[level]})` }}
                />
                {CONFIDENCE_LABELS[level]} · <span className={styles.tabular}>{counts[level]}</span>
              </span>
            )
        )}
      </div>
    </div>
  );
}

function UserOverviewView({ profile }: { profile: UserProfile }) {
  const overview = getUserOverview(profile);
  const maxVolume = overview.categoryVolumes[0]?.count ?? 1;

  return (
    <>
      <div className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.avatarFrame}>
            <Image src={profile.avatarUrl} alt="" width={44} height={44} className={styles.avatarImage} />
          </span>
          <div className={styles.identityText}>
            <h2 className={styles.title}>{profile.name}</h2>
            <span className={styles.overviewConfidence}>اطمینان کلی: {overview.confidenceScore}٪</span>
          </div>
        </div>
        <p className={styles.aiSentence}>{overview.summarySentence}</p>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <User variant="Bold" size={14} color="currentColor" />
          خلاصه پروفایل کاربر
        </h3>
        <ul className={styles.bulletList}>
          {overview.profileBullets.map((bullet, index) => {
            const accent = bullet.category ? CATEGORY_ACCENT_RGB[bullet.category] : "120, 130, 145";
            const Icon = bullet.category ? CATEGORY_ICONS[bullet.category] : User;
            return (
              <li key={index} className={`${styles.bulletItem} ${bullet.tone === "warning" ? styles.bulletWarning : ""}`}>
                <span
                  className={styles.bulletIcon}
                  style={{ ["--node-accent" as string]: bullet.tone === "warning" ? "212, 100, 60" : accent }}
                >
                  {bullet.tone === "warning" ? (
                    <Warning2 variant="Bold" size={14} color="currentColor" />
                  ) : (
                    <Icon variant="Bold" size={14} color="currentColor" />
                  )}
                </span>
                <span className={styles.bulletText}>{bullet.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Chart21 variant="Bold" size={14} color="currentColor" />
          کارت‌های بینش
        </h3>

        <div className={styles.insightCard}>
          <h4 className={styles.insightCardTitle}>پراکندگی اطلاعات</h4>
          <div className={styles.volumeChart}>
            {overview.categoryVolumes.slice(0, 6).map((volume) => (
              <div key={volume.category} className={styles.volumeRow}>
                <span className={styles.volumeLabel}>{CATEGORY_LABELS[volume.category]}</span>
                <span className={styles.volumeTrack}>
                  <span
                    className={styles.volumeFill}
                    style={{
                      width: `${(volume.count / maxVolume) * 100}%`,
                      background: `rgb(${CATEGORY_ACCENT_RGB[volume.category]})`,
                    }}
                  />
                </span>
                <span className={styles.volumeCount}>{volume.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.insightCard}>
          <h4 className={styles.insightCardTitle}>کیفیت پروفایل</h4>
          <div className={styles.completenessRow}>
            <span className={styles.completenessValue}>{overview.completeness}٪</span>
            <span className={styles.completenessLabel}>کامل</span>
          </div>
          {overview.missingCategories.length > 0 && (
            <div className={styles.missingList}>
              <span className={styles.missingLabel}>موارد ناقص:</span>
              <div className={styles.missingChips}>
                {overview.missingCategories.slice(0, 5).map((category) => (
                  <span key={category} className={styles.missingChip}>
                    {CATEGORY_LABELS[category]}
                  </span>
                ))}
                {overview.missingCategories.length > 5 && (
                  <span className={styles.missingChip}>+{overview.missingCategories.length - 5} دیگر</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.insightCard}>
          <h4 className={styles.insightCardTitle}>علایق اصلی</h4>
          <div className={styles.interestChips}>
            {overview.topInterests.map((leaf) => (
              <span
                key={leaf.id}
                className={styles.interestChip}
                style={{ ["--node-accent" as string]: CATEGORY_ACCENT_RGB[leaf.category] }}
              >
                {leaf.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryOverviewView({
  profile,
  category,
  onSelectNode,
}: {
  profile: UserProfile;
  category: IntelligenceCategory;
  onSelectNode: (nodeId: string) => void;
}) {
  const accent = CATEGORY_ACCENT_RGB[category];
  const CategoryIcon = CATEGORY_ICONS[category];
  const leaves = profile.nodes.filter((n) => n.kind === "leaf" && n.category === category);
  const sortedLeaves = [...leaves].sort((a, b) => b.confidenceScore - a.confidenceScore);
  const avgScore = leaves.length
    ? Math.round(leaves.reduce((sum, leaf) => sum + leaf.confidenceScore, 0) / leaves.length)
    : 0;

  const volumes = getCategoryVolumes(profile);
  const rank = volumes.findIndex((v) => v.category === category) + 1;
  const maxLeafScore = sortedLeaves[0]?.confidenceScore ?? 1;

  const evidenceItems = sortedLeaves
    .filter((leaf) => leaf.evidence.length > 0)
    .slice(0, 3)
    .flatMap((leaf) => leaf.evidence.slice(0, 2).map((text) => ({ text, source: leaf.label })));

  const recommendation = sortedLeaves.find((leaf) => leaf.aiRecommendation)?.aiRecommendation;

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.categoryChip} style={{ ["--node-accent" as string]: accent }}>
            نمای حوزه
          </span>
        </div>
        <div className={styles.identity}>
          <span className={styles.iconAvatar} style={{ ["--node-accent" as string]: accent }}>
            <CategoryIcon variant="Bold" size={22} color={`rgb(${accent})`} />
          </span>
          <div className={styles.identityText}>
            <h2 className={styles.title}>{CATEGORY_LABELS[category]}</h2>
            {rank > 0 && (
              <span className={styles.rankBadge}>
                رتبه {rank} از {volumes.length} حوزه
              </span>
            )}
          </div>
        </div>
      </div>

      <section className={styles.statsRow}>
        <ConfidenceGauge score={avgScore} accent={accent} />
        <div className={styles.statChips}>
          <div className={styles.statChip}>
            <span className={styles.statValue}>{leaves.length}</span>
            <span className={styles.statLabel}>زیرمجموعه</span>
          </div>
          <div className={styles.statChip}>
            <span className={styles.statValue}>{avgScore}٪</span>
            <span className={styles.statLabel}>میانگین اطمینان</span>
          </div>
        </div>
      </section>

      {leaves.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Chart21 variant="Bold" size={14} color="currentColor" />
            توزیع اطمینان زیرمجموعه‌ها
          </h3>
          <DistributionBar leaves={leaves} accent={accent} />
        </section>
      )}

      {sortedLeaves.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Ranking variant="Bold" size={14} color="currentColor" />
            رتبه‌بندی زیرمجموعه‌ها
          </h3>
          <div className={styles.rankingList}>
            {sortedLeaves.map((leaf, index) => (
              <button
                key={leaf.id}
                type="button"
                className={styles.rankingRow}
                onClick={() => onSelectNode(leaf.id)}
                style={{ ["--node-accent" as string]: accent }}
              >
                <span className={styles.rankingIndex}>{index + 1}</span>
                <span className={styles.rankingLabel}>{leaf.label}</span>
                <span className={styles.rankingTrack}>
                  <span
                    className={styles.rankingFill}
                    style={{ width: `${(leaf.confidenceScore / maxLeafScore) * 100}%` }}
                  />
                </span>
                <span className={styles.rankingScore}>{leaf.confidenceScore}٪</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {evidenceItems.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>شواهد پشتیبان</h3>
          <ul className={styles.list}>
            {evidenceItems.map((item, index) => (
              <li key={index} className={styles.evidenceItem}>
                <span className={styles.evidenceDot} style={{ ["--node-accent" as string]: accent }} />
                <span className={styles.evidenceText}>
                  {item.text}
                  {item.source && <span className={styles.evidenceSource}> · {item.source}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {recommendation && (
        <section className={`${styles.section} ${styles.recommendation}`} style={{ ["--node-accent" as string]: accent }}>
          <h3 className={styles.sectionTitle}>
            <MagicStar variant="Bold" size={14} color="currentColor" />
            پیشنهاد هوش مصنوعی
          </h3>
          <p className={styles.body}>{recommendation}</p>
        </section>
      )}
    </>
  );
}

function NodeDetailView({
  profile,
  node,
  onSelectNode,
  onClose,
}: {
  profile: UserProfile;
  node: IntelligenceNode;
  onSelectNode: (nodeId: string) => void;
  onClose: () => void;
}) {
  const accent = CATEGORY_ACCENT_RGB[node.category];
  const CategoryIcon = CATEGORY_ICONS[node.category];
  const isCategory = node.kind === "category";

  const childLeaves = isCategory
    ? profile.nodes.filter((n) => n.kind === "leaf" && n.category === node.category)
    : [];
  const sortedChildLeaves = [...childLeaves].sort((a, b) => b.confidenceScore - a.confidenceScore);

  const evidenceItems = isCategory
    ? sortedChildLeaves
        .filter((leaf) => leaf.evidence.length > 0)
        .slice(0, 3)
        .flatMap((leaf) => leaf.evidence.slice(0, 2).map((text) => ({ text, source: leaf.label })))
    : node.evidence.map((text) => ({ text, source: null as string | null }));

  const parentEdge = profile.edges.find((edge) => edge.target === node.id);
  const recommendation =
    node.aiRecommendation ?? sortedChildLeaves.find((leaf) => leaf.aiRecommendation)?.aiRecommendation;

  const relatedNodes = (node.relatedNodeIds ?? [])
    .map((id) => profile.nodes.find((n) => n.id === id))
    .filter((n): n is IntelligenceNode => Boolean(n));

  const question = isCategory
    ? `وضعیت من در حوزه «${node.label}» چطوره؟`
    : `چرا فکر می‌کنی من به «${node.label}» علاقه دارم؟`;

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.categoryChip} style={{ ["--node-accent" as string]: accent }}>
            {CATEGORY_LABELS[node.category]}
          </span>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="بستن">
            <CloseCircle variant="Bold" size={18} color="currentColor" />
          </button>
        </div>
        <div className={styles.identity}>
          <span className={styles.iconAvatar} style={{ ["--node-accent" as string]: accent }}>
            <CategoryIcon variant="Bold" size={22} color={`rgb(${accent})`} />
          </span>
          <div className={styles.identityText}>
            <h2 className={styles.title}>{node.label}</h2>
            <span className={`${styles.confidenceBadge} ${styles[node.confidence]}`}>
              {CONFIDENCE_LABELS[node.confidence]}
            </span>
          </div>
        </div>
      </div>

      <section className={styles.statsRow}>
        <ConfidenceGauge score={node.confidenceScore} accent={accent} />
        <div className={styles.statChips}>
          {parentEdge && (
            <div className={styles.statChip}>
              <span className={styles.statValue}>{Math.round(parentEdge.strength * 100)}٪</span>
              <span className={styles.statLabel}>قدرت ارتباط</span>
            </div>
          )}
          {isCategory && (
            <div className={styles.statChip}>
              <span className={styles.statValue}>{childLeaves.length}</span>
              <span className={styles.statLabel}>زیرمجموعه</span>
            </div>
          )}
          <div className={styles.statChip}>
            <span className={styles.statValue}>{node.lastUpdated}</span>
            <span className={styles.statLabel}>به‌روزرسانی</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <MessageText1 variant="Bold" size={14} color="currentColor" />
          گفتگو با هوشنگ
        </h3>
        <div className={styles.transcript}>
          <div className={styles.bubbleUser}>{question}</div>
          <div className={styles.bubbleAssistant} style={{ ["--node-accent" as string]: accent }}>
            {node.summary}
          </div>
        </div>
      </section>

      {isCategory && childLeaves.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Chart21 variant="Bold" size={14} color="currentColor" />
            توزیع اطمینان زیرمجموعه‌ها
          </h3>
          <DistributionBar leaves={childLeaves} accent={accent} />
        </section>
      )}

      {evidenceItems.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>شواهد پشتیبان</h3>
          <ul className={styles.list}>
            {evidenceItems.map((item, index) => (
              <li key={index} className={styles.evidenceItem}>
                <span className={styles.evidenceDot} style={{ ["--node-accent" as string]: accent }} />
                <span className={styles.evidenceText}>
                  {item.text}
                  {item.source && <span className={styles.evidenceSource}> · {item.source}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isCategory && sortedChildLeaves.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>زیرمجموعه‌ها</h3>
          <div className={styles.childList}>
            {sortedChildLeaves.map((leaf) => (
              <button key={leaf.id} type="button" className={styles.childRow} onClick={() => onSelectNode(leaf.id)}>
                <span
                  className={`${styles.childDot} ${styles[leaf.confidence]}`}
                  style={{ ["--node-accent" as string]: accent }}
                />
                <span className={styles.childLabel}>{leaf.label}</span>
                <span className={styles.childScore}>{leaf.confidenceScore}٪</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {!isCategory && relatedNodes.length > 0 && (
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

      {recommendation && (
        <section
          className={`${styles.section} ${styles.recommendation}`}
          style={{ ["--node-accent" as string]: accent }}
        >
          <h3 className={styles.sectionTitle}>
            <MagicStar variant="Bold" size={14} color="currentColor" />
            پیشنهاد هوش مصنوعی
          </h3>
          <p className={styles.body}>{recommendation}</p>
        </section>
      )}
    </>
  );
}

export function InspectorPanel({ profile, selectedNodeId, activeCategories, onSelectNode, onClose }: InspectorPanelProps) {
  const node = selectedNodeId ? profile.nodes.find((n) => n.id === selectedNodeId) ?? null : null;
  const singleActiveCategory =
    !node && activeCategories !== "all" && activeCategories.size === 1
      ? [...activeCategories][0]
      : null;

  const panelKey = node?.id ?? singleActiveCategory ?? profile.id;

  return (
    <aside className={styles.panel} key={panelKey}>
      {node ? (
        <NodeDetailView profile={profile} node={node} onSelectNode={onSelectNode} onClose={onClose} />
      ) : singleActiveCategory ? (
        <CategoryOverviewView profile={profile} category={singleActiveCategory} onSelectNode={onSelectNode} />
      ) : (
        <UserOverviewView profile={profile} />
      )}
    </aside>
  );
}
