# Admin User Intelligence Console (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone `/admin` route showing a graph-first "AI User Intelligence Console" — sidebar user picker, center React Flow graph of a user's knowledge domains, filter chips, AI insight card strip, and a right inspector panel — all against new mock data, per `docs/superpowers/specs/2026-07-12-admin-intelligence-console-design.md`.

**Architecture:** New `/admin` route (no shared consumer-app chrome — confirmed there is none in root layout to opt out of). State (selected user, expanded categories, active filters, selected node) lives in `src/app/admin/page.tsx` and flows down to four presentational components. A pure function (`computeGraph`) turns mock `UserProfile` data into positioned React Flow nodes/edges each render; three custom React Flow node components render center/category/leaf visuals styled by confidence level and category accent color.

**Tech Stack:** Next.js 16 (app router) + React 19 + TypeScript, CSS Modules (existing convention), `@xyflow/react` v12 (new dependency) for the graph canvas. No test runner exists in this repo — verification is `tsc --noEmit`, `npm run lint`, and manual browser checks via the dev server, per the spec's own Testing section.

**Note on the spec's data model:** the spec's `UserProfile` includes `avatarSrc: string`. This repo has no avatar image assets and its existing pattern for user avatars (`src/components/drawer/Drawer.tsx`) is a text-initial circle, not an image. This plan uses that existing pattern (name-initial avatar) instead of introducing fake image paths — a Phase 1 implementation detail, not a change to the spec's intent. The spec also implies "related nodes" in the inspector without a field to back it — this plan adds `relatedNodeIds?: string[]` to `IntelligenceNode`.

---

## File Structure

- `src/types/intelligence.ts` — new. All shared types.
- `src/config/intelligenceColors.ts` — new. Category labels + accent RGB + display order (mirrors the existing `src/config/spaceColors.ts` pattern).
- `src/lib/mocks/userIntelligence.ts` — new. Mock `intelligenceUsers: UserProfile[]` (3 users).
- `src/lib/intelligenceLayout.ts` — new. Pure `computeGraph()` turning a `UserProfile` + UI state into React Flow `nodes`/`edges`.
- `src/components/admin/nodes/CenterNode.tsx` + `.module.css` — new.
- `src/components/admin/nodes/CategoryNode.tsx` + `.module.css` — new.
- `src/components/admin/nodes/LeafNode.tsx` + `.module.css` — new.
- `src/components/admin/nodes/nodeTypes.ts` — new. Maps React Flow `type` strings to components.
- `src/components/admin/IntelligenceGraph.tsx` + `.module.css` — new. `ReactFlow` wrapper.
- `src/components/admin/AdminSidebar.tsx` + `.module.css` — new.
- `src/components/admin/FilterChips.tsx` + `.module.css` — new.
- `src/components/admin/InsightCardStrip.tsx` + `.module.css` — new.
- `src/components/admin/InspectorPanel.tsx` + `.module.css` — new.
- `src/app/admin/page.tsx` + `page.module.css` — new. Top-level state + composition.
- `package.json` — modify. Add `@xyflow/react`.

---

### Task 1: Install React Flow

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install the dependency**

Run: `cd "/Users/hesam/Code-Projects/Hooshang X DigiKala" && npm install @xyflow/react`

Expected: `package.json` gains `"@xyflow/react": "^12.x.x"` under `dependencies`, no peer-dependency conflict errors (React 19.2.4 satisfies `@xyflow/react`'s `>=17` peer range).

- [ ] **Step 2: Verify install**

Run: `npm ls @xyflow/react`
Expected: prints the installed version with no `UNMET PEER DEPENDENCY` warnings.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add @xyflow/react dependency for admin intelligence graph"
```

---

### Task 2: Shared types

**Files:**
- Create: `src/types/intelligence.ts`

- [ ] **Step 1: Write the file**

```ts
export type ConfidenceLevel = "confirmed" | "inferred" | "weak";

export type IntelligenceCategory =
  | "kharid"
  | "mali"
  | "salamat"
  | "sabkeZendegi"
  | "makanha"
  | "amoozesh"
  | "dastgahha"
  | "appHayeMotasel"
  | "servisha"
  | "ravabet"
  | "goftogooha"
  | "tarjihat"
  | "risk"
  | "ahdaf";

export type IntelligenceNode = {
  id: string;
  kind: "category" | "leaf";
  category: IntelligenceCategory;
  label: string;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0-100
  summary: string;
  evidence: string[];
  lastUpdated: string; // pre-formatted relative Persian string
  aiRecommendation?: string;
  relatedNodeIds?: string[];
};

export type IntelligenceEdge = {
  id: string;
  source: string; // node id
  target: string; // node id
  strength: number; // 0-1, drives stroke width
};

export type AIInsight = {
  id: string;
  text: string;
  trendDelta?: string; // e.g. "+۴۲٪"
};

export type UserProfile = {
  id: string;
  name: string;
  isVip: boolean;
  statusLine: string; // e.g. "۳ گفتگوی فعال"
  nodes: IntelligenceNode[];
  edges: IntelligenceEdge[];
  insights: AIInsight[];
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors (file has no consumers yet, should compile clean on its own).

- [ ] **Step 3: Commit**

```bash
git add src/types/intelligence.ts
git commit -m "Add intelligence console shared types"
```

---

### Task 3: Category config (labels, colors, order)

**Files:**
- Create: `src/config/intelligenceColors.ts`

- [ ] **Step 1: Write the file**

```ts
import type { IntelligenceCategory } from "@/types/intelligence";

/**
 * Display order for the category ring around the center node and for the
 * filter-chip row. Mirrors the domain list from the approved spec.
 */
export const CATEGORY_ORDER: IntelligenceCategory[] = [
  "kharid",
  "mali",
  "salamat",
  "sabkeZendegi",
  "makanha",
  "amoozesh",
  "dastgahha",
  "appHayeMotasel",
  "servisha",
  "ravabet",
  "goftogooha",
  "tarjihat",
  "risk",
  "ahdaf",
];

export const CATEGORY_LABELS: Record<IntelligenceCategory, string> = {
  kharid: "خرید",
  mali: "مالی",
  salamat: "سلامت",
  sabkeZendegi: "سبک زندگی",
  makanha: "مکان‌ها",
  amoozesh: "آموزش",
  dastgahha: "دستگاه‌ها",
  appHayeMotasel: "اپ‌های متصل",
  servisha: "سرویس‌ها",
  ravabet: "روابط",
  goftogooha: "گفتگوها",
  tarjihat: "ترجیحات",
  risk: "ریسک",
  ahdaf: "اهداف",
};

/**
 * RGB channels (no `rgb()` wrapper) so callers can compose `rgba(${accent}, alpha)`,
 * matching the existing SPACE_ACCENT_RGB convention in src/config/spaceColors.ts.
 */
export const CATEGORY_ACCENT_RGB: Record<IntelligenceCategory, string> = {
  kharid: "80, 130, 220",
  mali: "26, 158, 107",
  salamat: "232, 56, 79",
  sabkeZendegi: "154, 111, 224",
  makanha: "196, 130, 74",
  amoozesh: "214, 158, 46",
  dastgahha: "20, 165, 180",
  appHayeMotasel: "245, 112, 34",
  servisha: "91, 146, 166",
  ravabet: "214, 101, 144",
  goftogooha: "99, 110, 125",
  tarjihat: "176, 141, 87",
  risk: "197, 84, 60",
  ahdaf: "122, 163, 95",
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/config/intelligenceColors.ts
git commit -m "Add intelligence category labels, colors, and display order"
```

---

### Task 4: Mock user intelligence data

**Files:**
- Create: `src/lib/mocks/userIntelligence.ts`

- [ ] **Step 1: Write the builder helpers and data**

```ts
import type {
  AIInsight,
  ConfidenceLevel,
  IntelligenceCategory,
  IntelligenceEdge,
  IntelligenceNode,
  UserProfile,
} from "@/types/intelligence";
import { CATEGORY_LABELS } from "@/config/intelligenceColors";

type LeafSpec = {
  slug: string;
  label: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  summary: string;
  evidence: string[];
  lastUpdated: string;
  strength: number;
  aiRecommendation?: string;
  relatedNodeIds?: string[];
};

type CategorySpec = {
  category: IntelligenceCategory;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  summary: string;
  lastUpdated: string;
  centerStrength: number;
  leaves: LeafSpec[];
};

function buildUser(
  id: string,
  name: string,
  isVip: boolean,
  statusLine: string,
  categories: CategorySpec[],
  insights: AIInsight[]
): UserProfile {
  const nodes: IntelligenceNode[] = [];
  const edges: IntelligenceEdge[] = [];
  const centerId = `${id}-center`;

  categories.forEach((cat) => {
    const categoryId = `${id}-cat-${cat.category}`;
    nodes.push({
      id: categoryId,
      kind: "category",
      category: cat.category,
      label: CATEGORY_LABELS[cat.category],
      confidence: cat.confidence,
      confidenceScore: cat.confidenceScore,
      summary: cat.summary,
      evidence: [],
      lastUpdated: cat.lastUpdated,
    });
    edges.push({
      id: `${id}-edge-${cat.category}`,
      source: centerId,
      target: categoryId,
      strength: cat.centerStrength,
    });

    cat.leaves.forEach((leaf) => {
      const leafId = `${id}-leaf-${cat.category}-${leaf.slug}`;
      nodes.push({
        id: leafId,
        kind: "leaf",
        category: cat.category,
        label: leaf.label,
        confidence: leaf.confidence,
        confidenceScore: leaf.confidenceScore,
        summary: leaf.summary,
        evidence: leaf.evidence,
        lastUpdated: leaf.lastUpdated,
        aiRecommendation: leaf.aiRecommendation,
        relatedNodeIds: leaf.relatedNodeIds,
      });
      edges.push({
        id: `${id}-edge-${cat.category}-${leaf.slug}`,
        source: categoryId,
        target: leafId,
        strength: leaf.strength,
      });
    });
  });

  return { id, name, isVip, statusLine, nodes, edges, insights };
}

const u1: UserProfile = buildUser(
  "u1",
  "سارا احمدی",
  true,
  "۳ گفتگوی فعال",
  [
    {
      category: "kharid",
      confidence: "confirmed",
      confidenceScore: 92,
      summary: "کاربر خریدار فعال با تمرکز بر کالای دیجیتال و خواروبار است.",
      lastUpdated: "۲ روز پیش",
      centerStrength: 0.9,
      leaves: [
        { slug: "supermarket", label: "خرید هفتگی سوپرمارکت", confidence: "confirmed", confidenceScore: 90, summary: "الگوی خرید منظم هفتگی از سوپرمارکت آنلاین.", evidence: ["گفتگوی خرید هفتگی - ۱۲ تیر"], lastUpdated: "۲ روز پیش", strength: 0.8, aiRecommendation: "پیشنهاد فعال‌سازی سبد خرید هوشمند هفتگی." },
        { slug: "digital", label: "علاقه به محصولات دیجیتال", confidence: "inferred", confidenceScore: 68, summary: "بازدید مکرر از صفحات موبایل و لپ‌تاپ بدون خرید نهایی.", evidence: ["مشاهده ۱۴ محصول موبایل در یک هفته"], lastUpdated: "۵ روز پیش", strength: 0.6 },
        { slug: "seasonal", label: "تخفیف‌های فصلی", confidence: "weak", confidenceScore: 40, summary: "واکنش نامشخص به کمپین‌های تخفیف فصلی.", evidence: ["کلیک روی بنر حراج تابستانه"], lastUpdated: "۱۲ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "mali",
      confidence: "confirmed",
      confidenceScore: 88,
      summary: "پرتفوی مالی متنوع شامل طلا و صندوق درآمد ثابت.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.85,
      leaves: [
        { slug: "gold", label: "دارای حساب طلا", confidence: "confirmed", confidenceScore: 95, summary: "موجودی فعال در حساب طلای دیجیتال.", evidence: ["اتصال کیف پول طلا"], lastUpdated: "۱ روز پیش", strength: 0.9, aiRecommendation: "پیشنهاد نمایش نمودار رشد طلا.", relatedNodeIds: ["u1-leaf-risk-moderate-risk", "u1-leaf-ahdaf-abroad-trip"] },
        { slug: "mortgage", label: "بدهی وام مسکن", confidence: "confirmed", confidenceScore: 85, summary: "اقساط ماهانه وام مسکن در حال پرداخت است.", evidence: ["گفتگوی محاسبه اقساط وام"], lastUpdated: "۱ هفته پیش", strength: 0.7 },
        { slug: "fixed-income", label: "سرمایه‌گذاری در صندوق درآمد ثابت", confidence: "inferred", confidenceScore: 60, summary: "الگوی رفتاری نشان‌دهنده تمایل به ریسک پایین است.", evidence: ["پرسش درباره صندوق‌های کم‌ریسک"], lastUpdated: "۳ هفته پیش", strength: 0.5 },
      ],
    },
    {
      category: "salamat",
      confidence: "inferred",
      confidenceScore: 55,
      summary: "نشانه‌هایی از افت کیفیت خواب مشاهده شده است.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "steps", label: "پیگیری منظم قدم‌شمار", confidence: "confirmed", confidenceScore: 80, summary: "ثبت روزانه تعداد قدم از طریق ساعت هوشمند.", evidence: ["همگام‌سازی داده ساعت هوشمند"], lastUpdated: "۱ روز پیش", strength: 0.7 },
        { slug: "sleep", label: "کاهش کیفیت خواب اخیر", confidence: "weak", confidenceScore: 35, summary: "افت میانگین ساعت خواب در دو هفته اخیر.", evidence: ["گزارش خواب ساعت هوشمند"], lastUpdated: "۴ روز پیش", strength: 0.4, aiRecommendation: "پیشنهاد یادآور خواب منظم." },
      ],
    },
    {
      category: "sabkeZendegi",
      confidence: "inferred",
      confidenceScore: 62,
      summary: "علاقه‌مند به سبک زندگی سالم و فعال.",
      lastUpdated: "۴ روز پیش",
      centerStrength: 0.6,
      leaves: [
        { slug: "morning-exercise", label: "علاقه به ورزش صبحگاهی", confidence: "confirmed", confidenceScore: 75, summary: "ثبت فعالیت ورزشی در بازه صبح.", evidence: ["داده فعالیت صبحگاهی"], lastUpdated: "۲ روز پیش", strength: 0.65 },
        { slug: "plant-diet", label: "رژیم غذایی گیاه‌محور", confidence: "weak", confidenceScore: 38, summary: "افزایش خرید محصولات گیاهی در ماه اخیر.", evidence: ["افزایش خرید سبزیجات"], lastUpdated: "۱۰ روز پیش", strength: 0.35 },
      ],
    },
    {
      category: "makanha",
      confidence: "confirmed",
      confidenceScore: 80,
      summary: "ساکن تهران با سفرهای مکرر به شمال کشور.",
      lastUpdated: "۲ روز پیش",
      centerStrength: 0.75,
      leaves: [
        { slug: "tehran-2", label: "سکونت در منطقه ۲ تهران", confidence: "confirmed", confidenceScore: 90, summary: "آدرس ثبت‌شده در منطقه ۲ تهران.", evidence: ["آدرس تحویل سفارش"], lastUpdated: "۱ ماه پیش", strength: 0.85 },
        { slug: "north-trip", label: "سفر مکرر به شمال", confidence: "inferred", confidenceScore: 65, summary: "رزرو اقامتگاه در شمال در سه ماه اخیر.", evidence: ["دو رزرو اقامتگاه در شمال"], lastUpdated: "۲ هفته پیش", strength: 0.55, relatedNodeIds: ["u1-leaf-ravabet-married"] },
        { slug: "cafe", label: "بازدید مکرر از کافه‌های محله", confidence: "weak", confidenceScore: 30, summary: "چک‌این مکرر در کافه‌های نزدیک محل سکونت.", evidence: ["سه چک‌این کافه در هفته"], lastUpdated: "۶ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "amoozesh",
      confidence: "inferred",
      confidenceScore: 58,
      summary: "در حال گسترش مهارت‌های زبانی و فنی.",
      lastUpdated: "۱ هفته پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "english", label: "ثبت‌نام دوره زبان انگلیسی", confidence: "confirmed", confidenceScore: 82, summary: "ثبت‌نام تایید شده در دوره آنلاین زبان.", evidence: ["رسید پرداخت دوره زبان"], lastUpdated: "۵ روز پیش", strength: 0.7 },
        { slug: "coding", label: "علاقه به یادگیری برنامه‌نویسی", confidence: "weak", confidenceScore: 32, summary: "جستجوی چندباره درباره دوره‌های برنامه‌نویسی.", evidence: ["جستجوی دوره پایتون"], lastUpdated: "۹ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "dastgahha",
      confidence: "confirmed",
      confidenceScore: 85,
      summary: "کاربر دستگاه‌های اپل با به‌روزرسانی منظم است.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.8,
      leaves: [
        { slug: "iphone", label: "استفاده از آیفون ۱۵", confidence: "confirmed", confidenceScore: 95, summary: "دستگاه اصلی ثبت‌شده در پروفایل، آیفون ۱۵.", evidence: ["اطلاعات دستگاه ورود"], lastUpdated: "۱ روز پیش", strength: 0.9 },
        { slug: "watch", label: "مالک ساعت هوشمند اپل", confidence: "confirmed", confidenceScore: 88, summary: "همگام‌سازی مداوم داده سلامت از ساعت هوشمند.", evidence: ["اتصال اپل هلث"], lastUpdated: "۳ روز پیش", strength: 0.75 },
      ],
    },
    {
      category: "appHayeMotasel",
      confidence: "confirmed",
      confidenceScore: 90,
      summary: "چند سرویس مالی و خدماتی به حساب متصل است.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.85,
      leaves: [
        { slug: "digikala", label: "اتصال به دیجی‌کالا", confidence: "confirmed", confidenceScore: 95, summary: "حساب دیجی‌کالا به‌طور کامل متصل و فعال است.", evidence: ["اتصال حساب دیجی‌کالا"], lastUpdated: "۱ روز پیش", strength: 0.9 },
        { slug: "snapp", label: "اتصال به اسنپ", confidence: "confirmed", confidenceScore: 85, summary: "استفاده منظم از سرویس اسنپ برای جابجایی.", evidence: ["ورود با اسنپ"], lastUpdated: "۴ روز پیش", strength: 0.7 },
        { slug: "exchange", label: "اتصال به صرافی رمزارز", confidence: "inferred", confidenceScore: 60, summary: "اتصال به یک کیف پول رمزارز خارجی شناسایی شد.", evidence: ["تراکنش ورودی از صرافی"], lastUpdated: "۲ هفته پیش", strength: 0.5 },
      ],
    },
    {
      category: "servisha",
      confidence: "confirmed",
      confidenceScore: 70,
      summary: "مشترک چند سرویس استریم است.",
      lastUpdated: "۵ روز پیش",
      centerStrength: 0.65,
      leaves: [
        { slug: "filimo", label: "اشتراک فیلیمو فعال", confidence: "confirmed", confidenceScore: 80, summary: "اشتراک ماهانه فیلیمو در حال تمدید خودکار.", evidence: ["رسید تمدید اشتراک"], lastUpdated: "۵ روز پیش", strength: 0.65 },
        { slug: "spotify", label: "اشتراک اسپاتیفای", confidence: "confirmed", confidenceScore: 75, summary: "پرداخت منظم اشتراک اسپاتیفای.", evidence: ["پرداخت ماهانه اسپاتیفای"], lastUpdated: "۱ هفته پیش", strength: 0.6 },
      ],
    },
    {
      category: "ravabet",
      confidence: "inferred",
      confidenceScore: 50,
      summary: "نشانه‌هایی از وضعیت خانوادگی در گفتگوها یافت شده.",
      lastUpdated: "۲ هفته پیش",
      centerStrength: 0.5,
      leaves: [
        { slug: "married", label: "متاهل", confidence: "inferred", confidenceScore: 60, summary: "اشاره به همسر در چند گفتگوی خرید.", evidence: ["اشاره به «همسرم» در گفتگو"], lastUpdated: "۲ هفته پیش", strength: 0.5 },
        { slug: "one-child", label: "دارای یک فرزند", confidence: "weak", confidenceScore: 35, summary: "خرید محصولات کودک در دو نوبت اخیر.", evidence: ["خرید پوشک و اسباب‌بازی"], lastUpdated: "۳ هفته پیش", strength: 0.35 },
      ],
    },
    {
      category: "goftogooha",
      confidence: "confirmed",
      confidenceScore: 78,
      summary: "گفتگوهای فعال حول محور سرمایه‌گذاری و مقایسه محصول.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.75,
      leaves: [
        { slug: "investment-q", label: "پرسش مکرر درباره سرمایه‌گذاری", confidence: "confirmed", confidenceScore: 80, summary: "بیش از ده پرسش درباره گزینه‌های سرمایه‌گذاری.", evidence: ["گفتگوهای سرمایه‌گذاری"], lastUpdated: "۱ روز پیش", strength: 0.75, relatedNodeIds: ["u1-leaf-mali-gold", "u1-leaf-risk-moderate-risk"] },
        { slug: "health-talk", label: "علاقه به گفتگو درباره سلامت", confidence: "weak", confidenceScore: 40, summary: "چند گفتگوی کوتاه درباره وضعیت خواب.", evidence: ["گفتگوی کوتاه سلامت"], lastUpdated: "۴ روز پیش", strength: 0.35 },
        { slug: "compare", label: "درخواست مکرر مقایسه محصول", confidence: "inferred", confidenceScore: 62, summary: "درخواست مقایسه قیمت در چند دسته کالا.", evidence: ["درخواست مقایسه گوشی"], lastUpdated: "۳ روز پیش", strength: 0.55 },
      ],
    },
    {
      category: "tarjihat",
      confidence: "confirmed",
      confidenceScore: 72,
      summary: "ترجیحات پرداخت و برند مشخصی دارد.",
      lastUpdated: "۶ روز پیش",
      centerStrength: 0.65,
      leaves: [
        { slug: "installment", label: "ترجیح پرداخت اقساطی", confidence: "confirmed", confidenceScore: 80, summary: "انتخاب مکرر گزینه پرداخت اقساطی در خرید.", evidence: ["انتخاب اقساط در سه خرید"], lastUpdated: "۶ روز پیش", strength: 0.7 },
        { slug: "iranian-brand", label: "ترجیح برند‌های ایرانی", confidence: "weak", confidenceScore: 38, summary: "خرید مکرر از برندهای داخلی در دسته پوشاک.", evidence: ["خرید از برند داخلی"], lastUpdated: "۱۲ روز پیش", strength: 0.35 },
      ],
    },
    {
      category: "risk",
      confidence: "inferred",
      confidenceScore: 55,
      summary: "سطح ریسک‌پذیری متوسط با یک سابقه تاخیر جزئی.",
      lastUpdated: "۱ هفته پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "moderate-risk", label: "ریسک‌پذیری متوسط در سرمایه‌گذاری", confidence: "inferred", confidenceScore: 60, summary: "انتخاب گزینه‌های سرمایه‌گذاری با ریسک متوسط.", evidence: ["انتخاب پرتفوی متعادل"], lastUpdated: "۱ هفته پیش", strength: 0.55 },
        { slug: "late-payment", label: "سابقه تاخیر در پرداخت قسط", confidence: "weak", confidenceScore: 30, summary: "یک مورد تاخیر جزئی در پرداخت قسط وام مسکن.", evidence: ["یادآور تاخیر پرداخت"], lastUpdated: "۱ ماه پیش", strength: 0.3 },
      ],
    },
    {
      category: "ahdaf",
      confidence: "inferred",
      confidenceScore: 58,
      summary: "اهداف مالی و سفر در افق کوتاه‌مدت.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "new-house", label: "هدف خرید خانه جدید", confidence: "inferred", confidenceScore: 65, summary: "جستجوی مکرر آگهی مسکن در منطقه جدید.", evidence: ["جستجوی خانه در دو منطقه"], lastUpdated: "۳ روز پیش", strength: 0.6, aiRecommendation: "پیشنهاد نمایش راهنمای وام مسکن." },
        { slug: "abroad-trip", label: "هدف پس‌انداز برای سفر خارجی", confidence: "weak", confidenceScore: 35, summary: "پرس‌وجو درباره نرخ ارز و بلیط خارجی.", evidence: ["پرسش نرخ ارز"], lastUpdated: "۹ روز پیش", strength: 0.3 },
      ],
    },
  ],
  [
    { id: "u1-insight-1", text: "کاربر احتمالاً ظرف ۳ ماه آینده قصد جابجایی منزل دارد." },
    { id: "u1-insight-2", text: "علاقه به طلا ۴۲٪ در یک ماه اخیر افزایش یافته است.", trendDelta: "+۴۲٪" },
    { id: "u1-insight-3", text: "گفتگوهای مرتبط با سلامت به‌طور محسوسی کاهش یافته است.", trendDelta: "-۲۸٪" },
  ]
);

const u2: UserProfile = buildUser(
  "u2",
  "رضا کریمی",
  false,
  "۱ گفتگوی فعال",
  [
    {
      category: "kharid",
      confidence: "confirmed",
      confidenceScore: 75,
      summary: "خریدهای عمدتاً مرتبط با لوازم ورزشی.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.7,
      leaves: [
        { slug: "sportswear", label: "خرید مکرر پوشاک ورزشی", confidence: "confirmed", confidenceScore: 78, summary: "سه خرید پوشاک ورزشی در ماه اخیر.", evidence: ["سه سفارش پوشاک ورزشی"], lastUpdated: "۳ روز پیش", strength: 0.7 },
        { slug: "supplements", label: "علاقه به مکمل‌های ورزشی", confidence: "weak", confidenceScore: 35, summary: "بازدید از صفحات مکمل بدون خرید.", evidence: ["مشاهده صفحه مکمل"], lastUpdated: "۱ هفته پیش", strength: 0.3 },
      ],
    },
    {
      category: "mali",
      confidence: "inferred",
      confidenceScore: 50,
      summary: "وضعیت مالی محافظه‌کارانه با تمرکز بر پس‌انداز.",
      lastUpdated: "۵ روز پیش",
      centerStrength: 0.5,
      leaves: [
        { slug: "savings", label: "تمایل به پس‌انداز بلندمدت", confidence: "inferred", confidenceScore: 58, summary: "انتقال منظم بخشی از درآمد به حساب پس‌انداز.", evidence: ["تراکنش پس‌انداز ماهانه"], lastUpdated: "۵ روز پیش", strength: 0.5 },
        { slug: "no-debt", label: "بدون بدهی فعال", confidence: "confirmed", confidenceScore: 70, summary: "هیچ وام یا قسط فعالی در پروفایل ثبت نشده.", evidence: ["عدم وجود قسط فعال"], lastUpdated: "۲ هفته پیش", strength: 0.6 },
      ],
    },
    {
      category: "salamat",
      confidence: "confirmed",
      confidenceScore: 82,
      summary: "کاربر با فعالیت ورزشی منظم و پایدار.",
      lastUpdated: "۱ روز پیش",
      centerStrength: 0.8,
      leaves: [
        { slug: "gym", label: "حضور منظم در باشگاه", confidence: "confirmed", confidenceScore: 85, summary: "چک‌این منظم باشگاه سه بار در هفته.", evidence: ["چک‌این باشگاه"], lastUpdated: "۱ روز پیش", strength: 0.8 },
        { slug: "good-sleep", label: "کیفیت خواب پایدار", confidence: "confirmed", confidenceScore: 75, summary: "میانگین خواب باثبات در ماه اخیر.", evidence: ["گزارش خواب پایدار"], lastUpdated: "۴ روز پیش", strength: 0.65 },
      ],
    },
    {
      category: "dastgahha",
      confidence: "confirmed",
      confidenceScore: 70,
      summary: "استفاده از دستگاه‌های اندروید.",
      lastUpdated: "۲ روز پیش",
      centerStrength: 0.65,
      leaves: [
        { slug: "android", label: "استفاده از گوشی اندروید", confidence: "confirmed", confidenceScore: 80, summary: "دستگاه ثبت‌شده اندروید با به‌روزرسانی منظم.", evidence: ["اطلاعات دستگاه ورود"], lastUpdated: "۲ روز پیش", strength: 0.7 },
        { slug: "smartband", label: "مالک مچ‌بند هوشمند", confidence: "inferred", confidenceScore: 55, summary: "همگام‌سازی داده گام از مچ‌بند هوشمند.", evidence: ["داده مچ‌بند هوشمند"], lastUpdated: "۱ هفته پیش", strength: 0.5 },
      ],
    },
    {
      category: "appHayeMotasel",
      confidence: "confirmed",
      confidenceScore: 68,
      summary: "اتصال به سرویس‌های محدود اما فعال.",
      lastUpdated: "۴ روز پیش",
      centerStrength: 0.6,
      leaves: [
        { slug: "digikala2", label: "اتصال به دیجی‌کالا", confidence: "confirmed", confidenceScore: 75, summary: "حساب دیجی‌کالا فعال با خریدهای منظم.", evidence: ["اتصال حساب دیجی‌کالا"], lastUpdated: "۴ روز پیش", strength: 0.65 },
        { slug: "tapsi", label: "اتصال به تپسی", confidence: "inferred", confidenceScore: 50, summary: "استفاده گاه‌به‌گاه از سرویس تپسی.", evidence: ["دو سفر ثبت‌شده تپسی"], lastUpdated: "۲ هفته پیش", strength: 0.4 },
      ],
    },
    {
      category: "goftogooha",
      confidence: "inferred",
      confidenceScore: 55,
      summary: "گفتگوهای پراکنده درباره ورزش و تجهیزات.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.5,
      leaves: [
        { slug: "gear-q", label: "پرسش درباره تجهیزات ورزشی", confidence: "inferred", confidenceScore: 58, summary: "چند پرسش درباره کفش دویدن.", evidence: ["گفتگوی کفش دویدن"], lastUpdated: "۳ روز پیش", strength: 0.5 },
        { slug: "diet-q", label: "پرسش درباره برنامه غذایی", confidence: "weak", confidenceScore: 32, summary: "یک گفتگوی کوتاه درباره رژیم پروتئین.", evidence: ["گفتگوی رژیم پروتئین"], lastUpdated: "۱۰ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "risk",
      confidence: "inferred",
      confidenceScore: 45,
      summary: "ریسک‌پذیری پایین در تصمیمات مالی.",
      lastUpdated: "۱ هفته پیش",
      centerStrength: 0.45,
      leaves: [
        { slug: "low-risk", label: "ترجیح گزینه‌های کم‌ریسک", confidence: "inferred", confidenceScore: 55, summary: "عدم تمایل به سرمایه‌گذاری در دارایی‌های پرنوسان.", evidence: ["رد پیشنهاد رمزارز"], lastUpdated: "۱ هفته پیش", strength: 0.45 },
        { slug: "on-time", label: "سابقه پرداخت به‌موقع", confidence: "confirmed", confidenceScore: 80, summary: "بدون سابقه تاخیر در پرداخت‌ها.", evidence: ["گزارش پرداخت به‌موقع"], lastUpdated: "۳ هفته پیش", strength: 0.65 },
      ],
    },
    {
      category: "ahdaf",
      confidence: "weak",
      confidenceScore: 40,
      summary: "هدف مشخصی هنوز به‌طور واضح شناسایی نشده.",
      lastUpdated: "۲ هفته پیش",
      centerStrength: 0.4,
      leaves: [
        { slug: "marathon", label: "هدف شرکت در مسابقه دو", confidence: "weak", confidenceScore: 42, summary: "جستجوی اطلاعات مسابقات دو در شهر.", evidence: ["جستجوی مسابقه دو"], lastUpdated: "۲ هفته پیش", strength: 0.4 },
        { slug: "fitness-goal", label: "هدف بهبود آمادگی جسمانی", confidence: "inferred", confidenceScore: 55, summary: "افزایش تدریجی شدت تمرینات ثبت‌شده.", evidence: ["افزایش شدت تمرین"], lastUpdated: "۱۰ روز پیش", strength: 0.5 },
      ],
    },
  ],
  [
    { id: "u2-insight-1", text: "الگوی ورزشی کاربر در یک ماه اخیر باثبات بوده است." },
    { id: "u2-insight-2", text: "بازدید از محصولات مکمل ورزشی افزایش یافته است.", trendDelta: "+۱۸٪" },
  ]
);

const u3: UserProfile = buildUser(
  "u3",
  "نیلوفر حسینی",
  false,
  "بدون گفتگوی فعال",
  [
    {
      category: "kharid",
      confidence: "inferred",
      confidenceScore: 52,
      summary: "خریدهای پراکنده در دسته زیبایی و مد.",
      lastUpdated: "۴ روز پیش",
      centerStrength: 0.5,
      leaves: [
        { slug: "beauty", label: "خرید مکرر محصولات زیبایی", confidence: "inferred", confidenceScore: 60, summary: "دو خرید محصولات آرایشی در ماه اخیر.", evidence: ["دو سفارش لوازم آرایشی"], lastUpdated: "۴ روز پیش", strength: 0.5 },
        { slug: "fashion", label: "علاقه به مد فصلی", confidence: "weak", confidenceScore: 34, summary: "بازدید از کالکشن فصلی پوشاک.", evidence: ["مشاهده کالکشن جدید"], lastUpdated: "۹ روز پیش", strength: 0.3 },
      ],
    },
    {
      category: "sabkeZendegi",
      confidence: "confirmed",
      confidenceScore: 70,
      summary: "سبک زندگی متمرکز بر هنر و خلاقیت.",
      lastUpdated: "۲ روز پیش",
      centerStrength: 0.65,
      leaves: [
        { slug: "art", label: "علاقه به کلاس‌های هنری", confidence: "confirmed", confidenceScore: 78, summary: "ثبت‌نام در کلاس نقاشی آنلاین.", evidence: ["رسید ثبت‌نام کلاس نقاشی"], lastUpdated: "۲ روز پیش", strength: 0.7 },
        { slug: "reading", label: "علاقه به مطالعه رمان", confidence: "inferred", confidenceScore: 55, summary: "خرید چند جلد رمان در سه ماه اخیر.", evidence: ["خرید کتاب رمان"], lastUpdated: "۲ هفته پیش", strength: 0.5 },
      ],
    },
    {
      category: "makanha",
      confidence: "inferred",
      confidenceScore: 58,
      summary: "ساکن شیراز با سفرهای کوتاه داخلی.",
      lastUpdated: "۵ روز پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "shiraz", label: "سکونت در شیراز", confidence: "confirmed", confidenceScore: 85, summary: "آدرس ثبت‌شده در شیراز.", evidence: ["آدرس تحویل سفارش"], lastUpdated: "۱ ماه پیش", strength: 0.75 },
        { slug: "isfahan-trip", label: "سفر کوتاه به اصفهان", confidence: "weak", confidenceScore: 35, summary: "یک رزرو اقامتگاه در اصفهان.", evidence: ["رزرو اقامتگاه اصفهان"], lastUpdated: "۳ هفته پیش", strength: 0.3 },
      ],
    },
    {
      category: "amoozesh",
      confidence: "confirmed",
      confidenceScore: 75,
      summary: "در حال گذراندن دوره‌های خلاقانه.",
      lastUpdated: "۳ روز پیش",
      centerStrength: 0.7,
      leaves: [
        { slug: "painting-course", label: "ثبت‌نام دوره نقاشی پیشرفته", confidence: "confirmed", confidenceScore: 80, summary: "پرداخت شهریه دوره نقاشی پیشرفته.", evidence: ["رسید پرداخت دوره"], lastUpdated: "۳ روز پیش", strength: 0.7 },
        { slug: "design-interest", label: "علاقه به یادگیری طراحی گرافیک", confidence: "weak", confidenceScore: 36, summary: "جستجوی چندباره درباره دوره طراحی.", evidence: ["جستجوی دوره گرافیک"], lastUpdated: "۱ هفته پیش", strength: 0.35 },
      ],
    },
    {
      category: "ravabet",
      confidence: "weak",
      confidenceScore: 38,
      summary: "اطلاعات محدود درباره روابط خانوادگی.",
      lastUpdated: "۳ هفته پیش",
      centerStrength: 0.4,
      leaves: [
        { slug: "single", label: "مجرد", confidence: "weak", confidenceScore: 40, summary: "عدم اشاره به همسر یا فرزند در گفتگوها.", evidence: ["فقدان اشاره به خانواده"], lastUpdated: "۳ هفته پیش", strength: 0.4 },
        { slug: "roommate", label: "زندگی مشترک با هم‌خانه", confidence: "weak", confidenceScore: 32, summary: "اشاره به «هم‌خانه‌ام» در یک گفتگو.", evidence: ["اشاره به هم‌خانه"], lastUpdated: "۱ ماه پیش", strength: 0.3 },
      ],
    },
    {
      category: "tarjihat",
      confidence: "inferred",
      confidenceScore: 60,
      summary: "ترجیح محصولات دست‌ساز و هنری.",
      lastUpdated: "۶ روز پیش",
      centerStrength: 0.55,
      leaves: [
        { slug: "handmade", label: "ترجیح محصولات دست‌ساز", confidence: "inferred", confidenceScore: 62, summary: "خرید مکرر از فروشندگان صنایع‌دستی.", evidence: ["دو خرید صنایع‌دستی"], lastUpdated: "۶ روز پیش", strength: 0.55 },
        { slug: "eco", label: "ترجیح بسته‌بندی سازگار با محیط‌زیست", confidence: "weak", confidenceScore: 34, summary: "انتخاب گزینه بسته‌بندی سبز در سفارش.", evidence: ["انتخاب بسته‌بندی سبز"], lastUpdated: "۲ هفته پیش", strength: 0.3 },
      ],
    },
  ],
  [
    { id: "u3-insight-1", text: "کاربر به دنبال دوره‌های آموزشی خلاقانه جدید است." },
    { id: "u3-insight-2", text: "علاقه به محصولات صنایع‌دستی رو به افزایش است.", trendDelta: "+۲۲٪" },
  ]
);

export const intelligenceUsers: UserProfile[] = [u1, u2, u3];
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. This is the step that will surface any typo in the hand-written data (e.g. mismatched `ConfidenceLevel` string) — fix any reported line before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/lib/mocks/userIntelligence.ts
git commit -m "Add mock user intelligence graph data for 3 users"
```

---

### Task 5: Graph layout math

**Files:**
- Create: `src/lib/intelligenceLayout.ts`

- [ ] **Step 1: Write the file**

```ts
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Smoke-test the pure function manually**

Run:
```bash
npx tsx -e "
import { computeGraph } from './src/lib/intelligenceLayout';
import { intelligenceUsers } from './src/lib/mocks/userIntelligence';
const u1 = intelligenceUsers[0];
const { nodes, edges } = computeGraph(u1, new Set(), 'all');
console.log('nodes:', nodes.length, 'edges:', edges.length);
const expanded = computeGraph(u1, new Set([u1.nodes.find(n => n.kind === 'category')!.id]), 'all');
console.log('after expanding first category, nodes:', expanded.nodes.length);
"
```
Expected: first line prints `nodes: 15 edges: 14` (1 center + 14 categories, 14 center→category edges); second line prints a higher node count (15 + however many leaves the first category has). If `npx tsx` isn't available, run `npm install -D tsx` first (dev-only, one-off verification tool — do not add it to the app's runtime dependency list beyond this check).

- [ ] **Step 4: Commit**

```bash
git add src/lib/intelligenceLayout.ts
git commit -m "Add pure graph layout function for the intelligence canvas"
```

---

### Task 6: Custom React Flow node components

**Files:**
- Create: `src/components/admin/nodes/CenterNode.tsx`
- Create: `src/components/admin/nodes/CenterNode.module.css`
- Create: `src/components/admin/nodes/CategoryNode.tsx`
- Create: `src/components/admin/nodes/CategoryNode.module.css`
- Create: `src/components/admin/nodes/LeafNode.tsx`
- Create: `src/components/admin/nodes/LeafNode.module.css`
- Create: `src/components/admin/nodes/nodeTypes.ts`

- [ ] **Step 1: Write `CenterNode.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `CenterNode.module.css`**

```css
.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 160px;
  padding: 20px 16px;
  border-radius: var(--radius-widget);
  background: var(--color-white);
  box-shadow: var(--shadow-card-soft);
  text-align: center;
}

.handle {
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: none;
  border: none;
  border-radius: 0;
  pointer-events: none;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-selected);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-ravi);
  font-weight: 600;
  font-size: 22px;
}

.name {
  font-family: var(--font-ravi);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-ink);
}

.status {
  font-family: var(--font-ravi);
  font-weight: 400;
  font-size: 12px;
  color: var(--color-neutral-500);
}
```

- [ ] **Step 3: Write `CategoryNode.tsx`**

```tsx
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
```

- [ ] **Step 4: Write `CategoryNode.module.css`**

```css
.node {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 64px;
  padding: 8px 14px;
  border-radius: var(--radius-tile);
  background: rgba(var(--node-accent), 0.12);
  border: 2px solid rgb(var(--node-accent));
  box-shadow: var(--shadow-card);
  text-align: center;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.node:hover {
  transform: scale(1.04);
}

.node.expanded {
  box-shadow: var(--shadow-floating);
}

.node.inferred {
  border-style: dashed;
}

.node.weak {
  border-style: dotted;
  background: rgba(var(--node-accent), 0.06);
}

.handle {
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: none;
  border: none;
  border-radius: 0;
  pointer-events: none;
}

.label {
  font-family: var(--font-ravi);
  font-weight: 600;
  font-size: 13px;
  color: var(--color-ink);
}
```

- [ ] **Step 5: Write `LeafNode.tsx`**

```tsx
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
```

- [ ] **Step 6: Write `LeafNode.module.css`**

```css
.node {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 152px;
  padding: 8px 12px;
  border-radius: var(--radius-pill);
  background: var(--color-white);
  border: 1.5px solid rgb(var(--node-accent));
  box-shadow: var(--shadow-card);
  text-align: center;
  cursor: pointer;
  transition: transform 120ms ease;
}

.node:hover {
  transform: scale(1.05);
}

.node.inferred {
  border-style: dashed;
}

.node.weak {
  border-style: dotted;
  opacity: 0.85;
}

.handle {
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: none;
  border: none;
  border-radius: 0;
  pointer-events: none;
}

.label {
  font-family: var(--font-ravi);
  font-weight: 500;
  font-size: 12px;
  color: var(--color-ink);
}
```

- [ ] **Step 7: Write `nodeTypes.ts`**

```ts
import type { NodeTypes } from "@xyflow/react";
import { CenterNode } from "./CenterNode";
import { CategoryNode } from "./CategoryNode";
import { LeafNode } from "./LeafNode";

export const nodeTypes: NodeTypes = {
  center: CenterNode,
  category: CategoryNode,
  leaf: LeafNode,
};
```

- [ ] **Step 8: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/admin/nodes
git commit -m "Add custom React Flow node components for center/category/leaf"
```

---

### Task 7: Graph canvas component

**Files:**
- Create: `src/components/admin/IntelligenceGraph.tsx`
- Create: `src/components/admin/IntelligenceGraph.module.css`

- [ ] **Step 1: Write `IntelligenceGraph.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `IntelligenceGraph.module.css`**

```css
.canvas {
  position: relative;
  flex: 1;
  height: 100%;
  background: var(--color-bg-gradient-bottom);
  border-radius: var(--radius-sheet);
  overflow: hidden;
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/IntelligenceGraph.tsx src/components/admin/IntelligenceGraph.module.css
git commit -m "Add IntelligenceGraph React Flow canvas component"
```

---

### Task 8: Sidebar

**Files:**
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/AdminSidebar.module.css`

- [ ] **Step 1: Write `AdminSidebar.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import type { UserProfile } from "@/types/intelligence";
import styles from "./AdminSidebar.module.css";

type AdminSidebarProps = {
  users: UserProfile[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
};

export function AdminSidebar({ users, selectedUserId, onSelectUser }: AdminSidebarProps) {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return users;
    return users.filter((u) => u.name.includes(trimmed));
  }, [users, query]);

  const vipUsers = filteredUsers.filter((u) => u.isVip);
  const recentUsers = filteredUsers.slice(0, 2);

  return (
    <aside className={styles.sidebar}>
      <input
        className={styles.search}
        type="text"
        placeholder="جستجوی کاربر..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {vipUsers.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>کاربران ویژه</h3>
          <UserList users={vipUsers} selectedUserId={selectedUserId} onSelectUser={onSelectUser} />
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>کاربران اخیر</h3>
        <UserList users={recentUsers} selectedUserId={selectedUserId} onSelectUser={onSelectUser} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>همه کاربران</h3>
        <UserList users={filteredUsers} selectedUserId={selectedUserId} onSelectUser={onSelectUser} />
      </section>

      <section className={styles.stubSection}>
        <h3 className={styles.sectionTitle}>گفتگوهای فعال</h3>
        <p className={styles.stubText}>به‌زودی</p>
      </section>

      <section className={styles.stubSection}>
        <h3 className={styles.sectionTitle}>بررسی‌های ذخیره‌شده</h3>
        <p className={styles.stubText}>به‌زودی</p>
      </section>
    </aside>
  );
}

function UserList({
  users,
  selectedUserId,
  onSelectUser,
}: {
  users: UserProfile[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
}) {
  return (
    <ul className={styles.userList}>
      {users.map((user) => (
        <li key={user.id}>
          <button
            type="button"
            className={`${styles.userRow} ${user.id === selectedUserId ? styles.selected : ""}`}
            onClick={() => onSelectUser(user.id)}
          >
            <span className={styles.avatar}>{user.name.charAt(0)}</span>
            <span className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userStatus}>{user.statusLine}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Write `AdminSidebar.module.css`**

```css
.sidebar {
  direction: rtl;
  width: 280px;
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
  padding: 20px 16px;
  background: var(--color-white);
  border-radius: var(--radius-sheet);
  box-shadow: var(--shadow-card-soft);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search {
  direction: rtl;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface-subtle);
  font-family: var(--font-ravi);
  font-size: 13px;
  color: var(--color-ink);
}

.search::placeholder {
  color: var(--color-neutral-500);
}

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stubSection {
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0.5;
}

.sectionTitle {
  font-family: var(--font-ravi);
  font-weight: 600;
  font-size: 12px;
  color: var(--color-neutral-500);
  margin: 0;
}

.stubText {
  font-family: var(--font-ravi);
  font-size: 12px;
  color: var(--color-neutral-400);
  margin: 0;
}

.userList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.userRow {
  width: 100%;
  display: flex;
  align-items: center;
  direction: rtl;
  gap: 12px;
  height: 52px;
  padding: 0 8px;
  border-radius: 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: right;
  transition: background 120ms ease;
}

.userRow:hover {
  background: var(--color-surface-subtle);
}

.userRow.selected {
  background: var(--color-surface-subtle);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-selected);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-ravi);
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.userInfo {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.userName {
  font-family: var(--font-ravi);
  font-weight: 600;
  font-size: 13px;
  color: var(--color-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.userStatus {
  font-family: var(--font-ravi);
  font-weight: 400;
  font-size: 11px;
  color: var(--color-neutral-500);
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/AdminSidebar.tsx src/components/admin/AdminSidebar.module.css
git commit -m "Add admin sidebar with user search and lists"
```

---

### Task 9: Filter chips

**Files:**
- Create: `src/components/admin/FilterChips.tsx`
- Create: `src/components/admin/FilterChips.module.css`

- [ ] **Step 1: Write `FilterChips.tsx`**

```tsx
"use client";

import type { IntelligenceCategory } from "@/types/intelligence";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/config/intelligenceColors";
import styles from "./FilterChips.module.css";

type FilterChipsProps = {
  activeCategories: "all" | ReadonlySet<IntelligenceCategory>;
  onToggleCategory: (category: IntelligenceCategory) => void;
  onSelectAll: () => void;
  showInsights: boolean;
  onToggleInsights: () => void;
};

export function FilterChips({
  activeCategories,
  onToggleCategory,
  onSelectAll,
  showInsights,
  onToggleInsights,
}: FilterChipsProps) {
  const allSelected = activeCategories === "all";

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={`${styles.chip} ${allSelected ? styles.active : ""}`}
        onClick={onSelectAll}
      >
        همه
      </button>
      {CATEGORY_ORDER.map((category) => {
        const active = allSelected || activeCategories.has(category);
        return (
          <button
            key={category}
            type="button"
            className={`${styles.chip} ${active ? styles.active : ""}`}
            onClick={() => onToggleCategory(category)}
          >
            {CATEGORY_LABELS[category]}
          </button>
        );
      })}
      <button
        type="button"
        className={`${styles.chip} ${showInsights ? styles.active : ""}`}
        onClick={onToggleInsights}
      >
        AI Insights
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Write `FilterChips.module.css`**

```css
.row {
  direction: rtl;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 2px;
  scrollbar-width: none;
}

.row::-webkit-scrollbar {
  display: none;
}

.chip {
  flex-shrink: 0;
  height: 36px;
  padding: 0 16px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-soft);
  background: var(--color-white);
  font-family: var(--font-ravi);
  font-weight: 500;
  font-size: 13px;
  color: var(--color-ink);
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}

.chip.active {
  background: var(--color-selected);
  color: var(--color-white);
  border-color: var(--color-selected);
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/FilterChips.tsx src/components/admin/FilterChips.module.css
git commit -m "Add filter chip row for graph categories and AI insights"
```

---

### Task 10: AI insight card strip

**Files:**
- Create: `src/components/admin/InsightCardStrip.tsx`
- Create: `src/components/admin/InsightCardStrip.module.css`

- [ ] **Step 1: Write `InsightCardStrip.tsx`**

```tsx
import type { AIInsight } from "@/types/intelligence";
import styles from "./InsightCardStrip.module.css";

type InsightCardStripProps = {
  insights: AIInsight[];
};

export function InsightCardStrip({ insights }: InsightCardStripProps) {
  if (insights.length === 0) return null;

  return (
    <div className={styles.strip}>
      {insights.map((insight) => (
        <div key={insight.id} className={styles.card}>
          <p className={styles.text}>{insight.text}</p>
          {insight.trendDelta && (
            <span
              className={`${styles.delta} ${insight.trendDelta.startsWith("-") ? styles.negative : styles.positive}`}
            >
              {insight.trendDelta}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write `InsightCardStrip.module.css`**

```css
.strip {
  direction: rtl;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 2px;
  scrollbar-width: none;
}

.strip::-webkit-scrollbar {
  display: none;
}

.card {
  flex-shrink: 0;
  min-width: 220px;
  max-width: 280px;
  padding: 14px 16px;
  border-radius: var(--radius-widget);
  background: var(--color-white);
  box-shadow: var(--shadow-card-soft);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text {
  margin: 0;
  font-family: var(--font-ravi);
  font-weight: 500;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-ink);
}

.delta {
  align-self: flex-start;
  font-family: var(--font-ravi);
  font-weight: 600;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}

.delta.positive {
  color: var(--color-success);
  background: var(--color-success-bg);
}

.delta.negative {
  color: var(--color-danger);
  background: var(--color-danger-bg);
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/InsightCardStrip.tsx src/components/admin/InsightCardStrip.module.css
git commit -m "Add AI insight card strip component"
```

---

### Task 11: Inspector panel

**Files:**
- Create: `src/components/admin/InspectorPanel.tsx`
- Create: `src/components/admin/InspectorPanel.module.css`

- [ ] **Step 1: Write `InspectorPanel.tsx`**

```tsx
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
            ×
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
```

- [ ] **Step 2: Write `InspectorPanel.module.css`**

```css
.panelCollapsed {
  width: 0;
  flex-shrink: 0;
}

.panel {
  direction: rtl;
  width: 360px;
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
  padding: 20px 18px;
  background: var(--color-white);
  border-radius: var(--radius-sheet);
  box-shadow: var(--shadow-card-soft);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.headerTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.categoryChip {
  font-family: var(--font-ravi);
  font-weight: 600;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: rgba(var(--node-accent), 0.12);
  color: rgb(var(--node-accent));
}

.closeButton {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--color-surface-subtle);
  color: var(--color-neutral-500);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.title {
  margin: 0;
  font-family: var(--font-ravi);
  font-weight: 700;
  font-size: 18px;
  color: var(--color-ink);
}

.confidenceBadge {
  align-self: flex-start;
  font-family: var(--font-ravi);
  font-weight: 500;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-soft);
  color: var(--color-neutral-500);
}

.confidenceBadge.confirmed {
  border-style: solid;
}

.confidenceBadge.inferred {
  border-style: dashed;
}

.confidenceBadge.weak {
  border-style: dotted;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sectionTitle {
  margin: 0;
  font-family: var(--font-ravi);
  font-weight: 600;
  font-size: 12px;
  color: var(--color-neutral-500);
}

.body {
  margin: 0;
  font-family: var(--font-ravi);
  font-weight: 400;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-ink);
}

.list {
  margin: 0;
  padding: 0 18px 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.listItem {
  font-family: var(--font-ravi);
  font-size: 12px;
  color: var(--color-neutral-500);
}

.relatedChips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.relatedChip {
  font-family: var(--font-ravi);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface-subtle);
  color: var(--color-ink);
  cursor: pointer;
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/InspectorPanel.tsx src/components/admin/InspectorPanel.module.css
git commit -m "Add right inspector panel for selected graph node"
```

---

### Task 12: Admin page — wire everything together

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/page.module.css`

- [ ] **Step 1: Write `page.module.css`**

```css
.page {
  direction: rtl;
  display: flex;
  gap: 16px;
  height: 100vh;
  padding: 16px;
  background: linear-gradient(to bottom, var(--color-bg-gradient-top), var(--color-bg-gradient-bottom));
  box-sizing: border-box;
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```

- [ ] **Step 2: Write `page.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import type { IntelligenceCategory } from "@/types/intelligence";
import { intelligenceUsers } from "@/lib/mocks/userIntelligence";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { FilterChips } from "@/components/admin/FilterChips";
import { InsightCardStrip } from "@/components/admin/InsightCardStrip";
import { IntelligenceGraph } from "@/components/admin/IntelligenceGraph";
import { InspectorPanel } from "@/components/admin/InspectorPanel";
import styles from "./page.module.css";

export default function AdminIntelligencePage() {
  const [selectedUserId, setSelectedUserId] = useState(intelligenceUsers[0].id);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(new Set());
  const [activeCategories, setActiveCategories] = useState<"all" | Set<IntelligenceCategory>>("all");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(true);

  const profile = useMemo(
    () => intelligenceUsers.find((u) => u.id === selectedUserId) ?? intelligenceUsers[0],
    [selectedUserId]
  );

  function handleSelectUser(userId: string) {
    setSelectedUserId(userId);
    setExpandedCategoryIds(new Set());
    setActiveCategories("all");
    setSelectedNodeId(null);
  }

  function handleToggleCategoryNode(categoryNodeId: string) {
    setExpandedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryNodeId)) {
        next.delete(categoryNodeId);
      } else {
        next.add(categoryNodeId);
      }
      return next;
    });
  }

  function handleToggleCategoryFilter(category: IntelligenceCategory) {
    setActiveCategories((prev) => {
      const base = prev === "all" ? new Set<IntelligenceCategory>() : new Set(prev);
      if (base.has(category)) {
        base.delete(category);
      } else {
        base.add(category);
      }
      return base.size === 0 ? "all" : base;
    });
  }

  return (
    <div className={styles.page}>
      <AdminSidebar users={intelligenceUsers} selectedUserId={selectedUserId} onSelectUser={handleSelectUser} />

      <div className={styles.main}>
        <FilterChips
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategoryFilter}
          onSelectAll={() => setActiveCategories("all")}
          showInsights={showInsights}
          onToggleInsights={() => setShowInsights((v) => !v)}
        />

        {showInsights && <InsightCardStrip insights={profile.insights} />}

        <IntelligenceGraph
          profile={profile}
          expandedCategoryIds={expandedCategoryIds}
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategoryNode}
          onSelectLeaf={setSelectedNodeId}
        />
      </div>

      <InspectorPanel
        profile={profile}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  );
}
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both pass with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/page.tsx src/app/admin/page.module.css
git commit -m "Wire up /admin intelligence console page"
```

---

### Task 13: Manual verification pass

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server and load the route**

Start the dev server, navigate to `http://localhost:3000/admin`.
Expected: page loads with no console errors, RTL layout (sidebar on the right visually? — confirm sidebar renders on the visual right/leading edge per `dir="rtl"` flow, center graph in the middle, inspector collapsed on the visual left since no node is selected), no composer/bottom-dock chrome from the consumer app is present.

- [ ] **Step 2: Verify user switching**

Click each of the 3 users in the sidebar (سارا احمدی, رضا کریمی, نیلوفر حسینی).
Expected: center node label/avatar-initial updates, graph re-fits to the new user's categories, insight cards update, any open inspector closes, filter chips reset to "همه".

- [ ] **Step 3: Verify category expand/collapse**

Click a category node (e.g. مالی for سارا احمدی).
Expected: 3 leaf nodes fan out from that category with visible edges. Click it again: leaves disappear.

- [ ] **Step 4: Verify filter chips**

Click a single category chip (e.g. سلامت).
Expected: graph shows only the center node + سلامت cluster. Click همه.
Expected: all 14 categories return. Toggle the "AI Insights" chip.
Expected: insight card strip hides/shows without affecting the graph.

- [ ] **Step 5: Verify inspector panel across confidence levels**

For سارا احمدی, expand مالی and click "دارای حساب طلا" (confirmed, solid border).
Expected: inspector opens on the right with summary, confidence badge "تایید شده · ۹۵٪", evidence list, last-updated text, related-node chips (ریسک‌پذیری متوسط..., هدف پس‌انداز...), and an AI recommendation line. Click one of the related-node chips.
Expected: inspector updates to show that node's detail (its category may not be expanded in the graph — that's fine, the inspector still resolves it by id).

Click "علاقه به محصولات دیجیتال" (inferred, dashed border) and "تخفیف‌های فصلی" (weak, dotted border) in خرید.
Expected: each shows its correct dashed/dotted node border in the graph and correct confidence badge/label in the inspector.

- [ ] **Step 6: Verify pan/zoom/drag**

Scroll to zoom, drag the canvas background to pan, drag a leaf node to reposition it.
Expected: all three work smoothly via React Flow's built-in behavior; dragging a node does not crash or duplicate edges.

- [ ] **Step 7: Fix any issues found, then final check**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean. If any step above surfaced a bug, fix the relevant component file and re-run steps 1-6 for the affected area before proceeding.

- [ ] **Step 8: Final commit (only if fixes were made in Step 7)**

```bash
git add -A
git commit -m "Fix issues found during admin console manual verification"
```
