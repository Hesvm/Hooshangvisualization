import type { IntelligenceCategory, IntelligenceNode, UserProfile } from "@/types/intelligence";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/config/intelligenceColors";

export type CategoryVolume = {
  category: IntelligenceCategory;
  count: number;
  avgScore: number;
};

export type UserOverview = {
  confidenceScore: number;
  memoryCount: number;
  summarySentence: string;
  profileBullets: ProfileBullet[];
  categoryVolumes: CategoryVolume[];
  completeness: number;
  missingCategories: IntelligenceCategory[];
  topInterests: IntelligenceNode[];
};

export type ProfileBullet = {
  category: IntelligenceCategory | null;
  text: string;
  tone: "default" | "warning";
};

function leavesOf(profile: UserProfile) {
  return profile.nodes.filter((n) => n.kind === "leaf");
}

export function getCategoryVolumes(profile: UserProfile): CategoryVolume[] {
  const leaves = leavesOf(profile);
  const byCategory = new Map<IntelligenceCategory, IntelligenceNode[]>();
  leaves.forEach((leaf) => {
    const list = byCategory.get(leaf.category) ?? [];
    list.push(leaf);
    byCategory.set(leaf.category, list);
  });

  return CATEGORY_ORDER.filter((category) => byCategory.has(category))
    .map((category) => {
      const items = byCategory.get(category)!;
      const avgScore = Math.round(items.reduce((sum, item) => sum + item.confidenceScore, 0) / items.length);
      return { category, count: items.length, avgScore };
    })
    .sort((a, b) => b.count - a.count || b.avgScore - a.avgScore);
}

export function getUserOverview(profile: UserProfile): UserOverview {
  const leaves = leavesOf(profile);
  const categoryVolumes = getCategoryVolumes(profile);

  const confidenceScore = leaves.length
    ? Math.round(leaves.reduce((sum, leaf) => sum + leaf.confidenceScore, 0) / leaves.length)
    : 0;

  const memoryCount = leaves.reduce((sum, leaf) => sum + Math.max(leaf.evidence.length, 1), 0);

  const presentCategories = new Set(categoryVolumes.map((c) => c.category));
  const missingCategories = CATEGORY_ORDER.filter((category) => !presentCategories.has(category));
  const completeness = Math.round((presentCategories.size / CATEGORY_ORDER.length) * 100);

  const topInterests = [...leaves].sort((a, b) => b.confidenceScore - a.confidenceScore).slice(0, 6);

  const topThree = categoryVolumes.slice(0, 3).map((c) => CATEGORY_LABELS[c.category]);
  const summarySentence =
    topThree.length >= 2
      ? `این کاربر در حال حاضر روی «${topThree[0]}»${
          topThree.length > 1 ? `، «${topThree.slice(1, -1).join("»، «")}${topThree.length > 2 ? "»" : ""}` : ""
        }${topThree.length > 2 ? ` و «${topThree[topThree.length - 1]}»` : topThree.length === 2 ? ` و «${topThree[1]}»` : ""} تمرکز کرده است.`
      : topThree.length === 1
        ? `این کاربر در حال حاضر بیشتر روی «${topThree[0]}» تمرکز کرده است.`
        : "هنوز اطلاعات کافی برای خلاصه‌سازی تمرکز این کاربر جمع نشده است.";

  const bullets: ProfileBullet[] = [];

  bullets.push({
    category: null,
    text: `این کاربر طی ۶ ماه اخیر ${memoryCount} مموری ثبت کرده.`,
    tone: "default",
  });

  if (categoryVolumes[0]) {
    bullets.push({
      category: categoryVolumes[0].category,
      text: `بیشترین اطلاعات مربوط به «${CATEGORY_LABELS[categoryVolumes[0].category]}» است.`,
      tone: "default",
    });
  }

  if (categoryVolumes[1]) {
    bullets.push({
      category: categoryVolumes[1].category,
      text: `بعد از آن، «${CATEGORY_LABELS[categoryVolumes[1].category]}».`,
      tone: "default",
    });
  }

  const emerging = [...leaves]
    .filter((leaf) => leaf.confidence === "inferred")
    .sort((a, b) => b.confidenceScore - a.confidenceScore)[0];
  if (emerging) {
    bullets.push({
      category: emerging.category,
      text: `اخیراً به «${emerging.label}» علاقه نشان داده.`,
      tone: "default",
    });
  }

  const goal = leaves.find((leaf) => leaf.category === "ahdaf") ?? leaves.find((leaf) => leaf.category === "makanha");
  if (goal) {
    bullets.push({
      category: goal.category,
      text: `در حال حاضر به دنبال «${goal.label}» است.`,
      tone: "default",
    });
  }

  const weakCategory =
    categoryVolumes.find((c) => c.avgScore < 55) ?? (missingCategories.length ? { category: missingCategories[0] } : null);
  if (weakCategory) {
    bullets.push({
      category: weakCategory.category,
      text: `اطلاعات «${CATEGORY_LABELS[weakCategory.category]}» هنوز ناقص است.`,
      tone: "warning",
    });
  }

  return {
    confidenceScore,
    memoryCount,
    summarySentence,
    profileBullets: bullets.slice(0, 6),
    categoryVolumes,
    completeness,
    missingCategories,
    topInterests,
  };
}
