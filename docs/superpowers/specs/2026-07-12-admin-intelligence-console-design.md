# Admin User Intelligence Console — Phase 1 design

Status: approved (Phase 1 scope only). Phase 2 (timeline / heatmap / table modes, right-click
quick actions, mode switcher) is deferred to its own future spec.

## Goal

Build an internal "AI User Intelligence Console" at a new `/admin` route: a graph-first view of
what Hooshang has learned about a given user, replacing the traditional CRM-table idea with an
interactive node graph as the primary interface. Left sidebar to pick a user, center canvas shows
the user as a hub node surrounded by 14 knowledge-domain clusters, right panel inspects whatever
node is selected. This is a standalone internal surface — not linked from, or navigable to, the
consumer Hooshang app.

## Why this shape

- The user's reference implementation (Graphify, github.com/elbruno/graphify-dotnet) is a .NET/C#
  library and cannot run in this Next.js/React/TypeScript codebase. **React Flow** is the
  substitute: it gives custom node/edge components, built-in pan/zoom/drag, and enough layout
  control to hand-place category nodes radially — without pulling in a full physics engine
  (react-force-graph) that would be harder to theme precisely to the existing design system.
- Everything is mock data, matching how the rest of the repo works (`src/lib/mocks/*.ts`,
  `src/types/*.ts`) — no backend, no auth, no real user data.
- Reuses existing design tokens (`--radius-pill`, `--radius-widget`, `--shadow-card-soft`,
  `--color-selected`, Ravi font) rather than inventing a new visual language, per the project's
  existing token file (`src/styles/tokens.css`).

## Route & shell

- New route: `src/app/admin/page.tsx`, own layout (`src/app/admin/layout.tsx` if needed for
  isolation from the consumer app's root layout chrome — composer, bottom dock, etc. must not
  appear here). No nav entry point from the consumer app.
- Three-column shell: fixed left sidebar (~280px) · flexible center canvas · collapsible right
  inspector (~360px, slides in from the visual right edge and collapses to 0 width when no node
  is selected).
- Filter-chip row sits above the canvas, horizontally scrollable, `--radius-pill` chips using
  `--color-selected` (black bg / white text) for active state — same visual language as existing
  selected-pill usage elsewhere in the app.
- White surfaces throughout, `--shadow-card-soft` for panels, `--radius-widget`/`--radius-sheet`
  for containers. RTL Persian UI (`dir="rtl"`), Ravi font stack.

## Left sidebar

- Search input at top (RTL, `--radius-pill`), filters the mock user list by name/phone as you type.
- Sections, top to bottom: "کاربران ویژه" (VIP, from `isVip: true` in mock data), "کاربران اخیر"
  (recent — static ordering in mock data, not derived from real recency), full user list.
- "گفتگوهای فعال" (active conversations) and "بررسی‌های ذخیره‌شده" (saved investigations) render
  as static, non-interactive stub sections (label + empty state) — there is no data model for
  these yet in Phase 1. They exist for layout completeness only; clicking them does nothing.
- Each user row: avatar, name, one-line status string from mock data (e.g. "۳ گفتگوی فعال").
  Selecting a row sets the active user, resets any node selection (closes inspector), and resets
  active filter chips to "همه".

## Center graph canvas (React Flow)

- Center node: the selected user (avatar + name), larger than other nodes, fixed position,
  non-draggable, always visible regardless of filters.
- 14 category nodes arranged in a fixed radial ring around the center, one per domain: خرید,
  مالی, سلامت, سبک زندگی, مکان‌ها, آموزش, دستگاه‌ها, اپ‌های متصل, سرویس‌ها, روابط, گفتگوها,
  ترجیحات, ریسک, اهداف. Each has a distinct accent color (defined in the mock data, not hardcoded
  per-component).
- Clicking a category node expands its leaf nodes (2-4 per category) radially outward from that
  category's position; clicking again collapses them back. Only one category's leaves are shown
  expanded at a time is NOT enforced — multiple categories can be expanded simultaneously.
- Edges: stroke width mapped from a `strength: number` (0-1) field on the edge, quantized to a
  1-4px range.
- Node and edge styling by `confidence: "confirmed" | "inferred" | "weak"`:
  - confirmed → solid fill, solid border
  - inferred → solid fill, dashed border
  - weak → lighter fill, dotted border
  - Three new CSS custom properties for this (e.g. `--confidence-confirmed`,
    `--confidence-inferred`, `--confidence-weak`) — the existing `--color-info/warning/success`
    tokens are semantic-status colors (up/down/borderline) and should not be reused for a
    different meaning (confidence).
- Standard React Flow controls: zoom in/out/fit-view buttons, bottom-left corner. Pan via
  drag-on-background, zoom via scroll/pinch, node drag re-positions (position not persisted).

## AI Insight cards

- A horizontal strip of cards above the canvas (below the filter chips), one per entry in the
  selected user's `insights: AIInsight[]` mock array. Each card: short generated-sounding
  sentence (e.g. "کاربر احتمالاً ظرف ۳ ماه آینده قصد جابجایی دارد."), optional trend delta.
- Not a graph node/category — purely a card strip, per the approved design (AI Insights was in
  the original filter-chip list but is treated as a display concern, not a 15th graph cluster).
- The "AI Insights" filter chip toggles visibility of this card strip (on by default), it does not
  filter graph nodes.

## Right inspector panel

- Opens when any non-center node is selected; closes on explicit close button or when the user
  selection changes.
- Header: node label, category color chip, confidence badge (icon matching solid/dashed/dotted
  node style).
- Body: Summary text, confidence score (0-100 with a small bar), Evidence (list of source
  conversation snippets referencing mock conversation IDs — plain text list, not deep-linked to a
  real conversation view), Last updated (relative Persian date string), Related nodes (chips;
  clicking one re-selects that node and re-focuses/pans the canvas to it), AI recommendation
  (short mock string).

## Filter chips

- Row: همه + 14 category chips + AI Insights chip (16 total). Multi-select toggle behavior, not
  radio.
- Category chips: selecting one or more filters the graph to show only the center node + selected
  categories' clusters (expanded state per category persists independently). Deselecting all
  chips, or clicking همه, resets to showing all categories.
- AI Insights chip: toggles the insight card strip only (see above), independent of graph
  filtering.

## Data model

New file `src/types/intelligence.ts`:

```
type ConfidenceLevel = "confirmed" | "inferred" | "weak";
type IntelligenceCategory = "kharid" | "mali" | "salamat" | "sabkeZendegi" | "makanha" |
  "amoozesh" | "dastgahha" | "appHayeMotasel" | "servisha" | "ravabet" | "goftogooha" |
  "tarjihat" | "risk" | "ahdaf";

type IntelligenceNode = {
  id: string;
  kind: "category" | "leaf";
  category: IntelligenceCategory;
  label: string;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0-100, inspector detail
  summary: string;
  evidence: string[]; // mock conversation snippet strings
  lastUpdated: string; // relative Persian string, pre-formatted in mock data
  aiRecommendation?: string;
};

type IntelligenceEdge = {
  id: string;
  source: string; // node id
  target: string; // node id
  strength: number; // 0-1, drives stroke width
};

type AIInsight = {
  id: string;
  text: string;
  trendDelta?: string; // e.g. "+۴۲٪"
};

type UserProfile = {
  id: string;
  name: string;
  avatarSrc: string;
  isVip: boolean;
  statusLine: string; // e.g. "۳ گفتگوی فعال"
  nodes: IntelligenceNode[];
  edges: IntelligenceEdge[];
  insights: AIInsight[];
};
```

New file `src/lib/mocks/userIntelligence.ts`: exports `intelligenceUsers: UserProfile[]` — 3-4
users, ~40-50 nodes each (2-4 leaf nodes per category × 14 categories + center), category color
map, and a handful of insights per user. Category accent colors defined once in this file, not
duplicated per-component.

## Out of scope (Phase 1)

Timeline mode, heatmap mode, table mode, mode-switcher UI, right-click quick actions
(Explain/Expand neighbors/Show conversations/Show source/Compare/Hide/Pin), saved-investigations
and active-conversations real data/interactivity, node position persistence, real backend/auth.

## Testing

Manual verification only (no test infra in this repo currently): load `/admin`, confirm RTL
layout, select multiple users and confirm graph/insights/sidebar update, expand/collapse category
nodes, toggle filter chips (single, multiple, all-off, "همه"), select nodes of each confidence
level and confirm inspector renders correct styling, confirm zoom/pan/drag work, confirm no
consumer-app chrome (composer, bottom dock) leaks into the admin layout.
