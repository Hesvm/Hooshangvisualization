# Finance / Investment flow — design

Status: approved. Implementing in one combined pass (no phase checkpoints).

## Goal

Turn the existing, currently-disabled `مدیریت مالی` space tile into a working Finance/Investment
space: a homepage (spending widget + discovery section), a scripted crypto-portfolio-analysis
conversation (exchange connect → analysis → insights), and a scripted cross-market allocation
flow (risk questions → editable sliders → presets → save). Everything is native to the existing
design system — no new visual language, no new state library, no new chart/icon dependency.

## Why this shape

The repo already has one working analog for a multi-stage scripted conversation:
`LaptopShoppingFlow.tsx` (a `FlowState` object + `patch()`/`schedule()` helpers driving staged
reveals, mounted as a single `ConversationBlock` case). This design reuses that architecture
exactly instead of inventing a new one, and reuses every existing UI primitive (`BottomSheet`,
`ThinkingBeat`, `ChipRow`, `QuestionCard`, `RangeSlider`, `ComponentHeader`, `Composer`,
`SpaceHeader`, `faNum`/`formatToman`) rather than rebuilding them.

## Space & routing

- Reuse the existing `modiriat-mali` space id (`src/config/spaces.ts`) — no new space entry.
- Add `spacePages["modiriat-mali"]` (currently missing, which is why the tile renders `disabled`
  in `src/app/page.tsx`'s `SpaceTile`): `title: "سرمایه‌گذاری"`, existing `finance.png` icon, new
  green `accentRgb`.
- `src/app/spaces/[spaceId]/page.tsx`: for `modiriat-mali` only, render `FinanceStartSection`
  instead of `HistoryList` in the `history` slot (explicit conditional, not a new generic slot
  system — this is the only space that needs it).

## New conversation block kind

`ConversationBlock` gains one variant: `{ id: string; kind: "financeCryptoAnalysis" }` (payload-free,
like `monthlyGroceryShopping` — all content comes from mocks/lib). `renderBlock` gets one new case
returning `<CryptoPortfolioFlow key={block.id} />`. Register conversation
`crypto-portfolio-analysis` (`spaceId: "modiriat-mali"`) in `lib/mocks/conversations.ts` with an
initial `userText` block (`CRYPTO_USER_MESSAGE`) followed by the flow block.

## Data model (`src/types/finance.ts`)

- `ExchangeDef = { id, name, initial, color, logoSrc?, status: "not_connected" | "connected" }`
- `Holding = { id, symbol, name, quantity, currentValue, averageBuyPrice, currentPrice, profitLoss, profitLossPercentage, allocationPercentage, liquidityLevel: "high"|"medium"|"low", riskLevel: "low"|"medium"|"high" }`
- `DistributionSlice = { category: "bitcoin"|"ethereum"|"stablecoin"|"altcoins"; percentage: number; color: string; label: string }`
- `PortfolioInsight = { id, severity: "high"|"medium"|"low", title, body, actionChipId? }`
- `PortfolioData = { totalValue, totalProfitLoss, profitLossPercentage, change30d, connectedExchangeCount, holdingsCount, holdings: Holding[], distribution: DistributionSlice[], liquidityScore, concentrationScore, riskScore, insights: PortfolioInsight[] }`
- `MarketId = "fixedIncome" | "gold" | "stocks" | "crypto"`
- `AllocationItem = { id: MarketId, label, percentage, amount, color, min, max }`
- `AllocationPresetId = "conservative" | "balanced" | "aggressive"`
- `AllocationState = { totalInvestableAmount, horizon, riskTolerance, selectedPreset, allocations: AllocationItem[], riskLevel, liquidityLevel, expectedVolatilityRange, recommendedMinimumHorizon }`

Distribution omits `نقد`/cash — the mock data doesn't model a cash position, and the spec says
only to include it if backed by data.

## Mock/copy modules

- `lib/mocks/financeCopy.ts` — all Persian strings, `TIMING` constants, `THINKING_TEXT` cycles for
  the two thinking beats, chip label sets, message builders (mirrors `shoppingScript.ts`).
- `lib/mocks/exchanges.ts` — the six exchanges + "چند صرافی دارم" / "کیف پول شخصی" rows. Bitpin
  uses the real provided logo (`public/images/exchanges/bitpin.webp`); the rest use colored
  initial-letter monograms (same convention as `LOAN_PROVIDERS.providerInitial`).
- `lib/mocks/portfolio.ts` — `MOCK_PORTFOLIO: PortfolioData`, holdings summing to totalValue
  ≈ ۱.۲۸ میلیارد تومان, distribution ۴۲/۲۷/۸/۲۳ (BTC/ETH/stable/alt), 3 structured insights.
- `lib/mocks/spending.ts` — `MOCK_SPENDING`: total, prior-month delta %, 5 categories with
  amounts/colors, one insight string, month label.
- `lib/allocation.ts` — pure functions: `PRESETS` (conservative/balanced/aggressive percentage
  maps per spec §23), `redistribute(allocations, changedId, newPercentage)` (proportional
  redistribution among the other three, integer percentages summing to exactly 100, no negative
  values), `deriveRiskSummary(allocations)` → `{ riskLevel, liquidityLevel, expectedVolatilityRange, recommendedMinimumHorizon }`
  weighted off the stocks+crypto share.

`TOTAL_INVESTABLE_AMOUNT` for the allocation flow is a separate round demo figure
(۱,۰۰۰,۰۰۰,۰۰۰ تومان), distinct from the crypto portfolio's ۱.۲۸ میلیارد — the spec explicitly
keeps "current crypto analysis" and "hypothetical cross-market allocation" separate.

## Components

**Homepage**
- `components/widgets/finance/SpendingWidget.tsx` (+css) — full-span, light-card family (like
  `ShoppingListWidget`, not the dark health tiles): title, `formatToman` total, delta pill (green/
  red), native segmented bar (div widths from category %, controlled palette), ranked top
  categories, one insight line, ghost "تحلیل کامل خرج‌ها" button (inert in this pass — no deeper
  spending-analysis flow is specified).
- `components/finance/FinanceStartSection.tsx` (+css) — heading «شروع کار با هوشنگ مالی», one
  dominant crypto-analysis card (elevated card family like `FinalRecommendationCard`: title,
  supporting copy, 3 trust points with `TickCircle`, primary CTA navigating to
  `/spaces/modiriat-mali/conversations/crypto-portfolio-analysis`), plus two smaller
  composer-fill suggestion chips below it (kept visually secondary).

**Conversation flow** (`components/conversation/finance/`)
- `CryptoPortfolioFlow.tsx` (+css) — orchestrator. Stages: entry `ThinkingBeat` (700–1100ms) →
  assistant asks which exchange → `ExchangeSelectionList` → pick → `BottomSheet` with
  `ExchangeConnectionSheet` → confirm → close sheet, assistant ack line → one `ThinkingBeat`
  (~3.2s, cycling the 5 provided messages, covering both "connecting" and "analyzing" as one
  beat) → result reveal (assistant line + `PortfolioSummaryCard` + `PortfolioDonutChart` +
  `PortfolioInsights` + `ChipRow`) → allocation-entry chip tapped → its own user bubble (internal
  state, not `ConversationView`'s `sent` list — same technique `LaptopShoppingFlow` uses for
  chip-triggered follow-ups) → assistant line → two `QuestionCard` steps (1/2, 2/2) → one
  consolidated user bubble built dynamically from both answers → `ThinkingBeat` (1.5–2.5s,
  cycling 4 messages) → assistant recommendation line → `AllocationEditor`.
- `ExchangeSelectionList.tsx` — header + supporting copy + exchange rows (logo/monogram, name,
  status pill, chevron) + the two special rows, each calling `onSelect(id)`.
- `ExchangeConnectionSheet.tsx` — rendered inside the shared `BottomSheet` (same mount pattern as
  `DeepDiveSheet`): header (logo/monogram + dynamic name), explanation, "access granted" section
  (4 `TickCircle` rows), "access not granted" section (3 muted/blocked rows), trust line, primary
  "اتصال امن به {name}" + secondary "فعلاً نه".
- `PortfolioSummaryCard.tsx` (+css) — outer shell like `FinalRecommendationCard` (radius 24,
  `--shadow-card-soft`): total value (new `formatTomanCompact` helper in `faNum.ts` picks
  میلیون/میلیارد automatically — no hardcoded unit strings), 30-day performance line (green/red
  from sign), eye/eye-slash mask toggle, 4 secondary stat tiles.
- `PortfolioDonutChart.tsx` (+css) under `components/charts/DonutChart.tsx` (+css) — the
  reusable ring-chart primitive, generalized (not finance-specific), used by the finance-specific
  wrapper that supplies portfolio segments + legend. Technique adapted from the snippet you
  provided (stroke-dasharray/dashoffset ring segments, per-segment animate-in) but rewritten for
  this repo: CSS Modules instead of Tailwind/`cn()`, the installed `motion` package (`motion/react`)
  instead of `framer-motion`, project color tokens instead of `hsl(var(--border))`. Segment colors
  stay in the green/teal/blue family (no rainbow). Legend is always visible below the ring
  (hover-only doesn't work on touch), each row has a color dot + label + Persian percentage.
- `PortfolioInsights.tsx` (+css) — renders `PortfolioData.insights` (top 3), each a card with a
  severity tag, title, body, optional action chip — generated from structured data, not
  hardcoded per-card JSX.
- `AllocationEditor.tsx` (+css) — title, 4 market rows (label, live `NumericText` percentage,
  live `formatToman` amount, `RangeSlider` colored per market via CSS var), preset row (`ChipRow`
  with `activeId=selectedPreset`), live summary block (risk/liquidity/volatility/horizon from
  `deriveRiskSummary`), disclosure line, primary "ذخیره این سناریو" + secondary `ChipRow` (3
  actions — see behavior below).

## Allocation slider behavior

Dragging one `RangeSlider` calls `redistribute()`: the changed market takes the dragged value,
the other three are scaled proportionally off their previous relative weights to absorb the
remainder, rounded to integers, with any rounding remainder assigned to the largest of the other
three so the total is always exactly 100. Amounts are always derived
(`Math.round(totalInvestableAmount * percentage / 100)`), never stored independently of
percentage. Presets overwrite all four percentages at once (and are what set the default —
`selectedPreset: "balanced"` for this scripted path, per spec §23's explicit override even though
§23 also mentions deriving it from the questionnaire).

Secondary allocation actions (no deeper spec given, so scoped minimally):
- "ریسکش رو کمتر کن" → switches preset to `conservative`.
- "سناریوی دیگه بساز" → resets preset to `balanced`.
- "با ترکیب فعلی مقایسه کن" → reveals one short canned note inline (no real "current portfolio"
  vs. "new allocation" comparison data is modeled — out of scope for this pass).

"ذخیره این سناریو" sets local component state only (`savedAllocationScenario`) and shows an
inline acknowledgement — no persistence claim, since no memory/profile system exists yet to
attach it to.

## Tokens

`src/styles/tokens.css` gains `--color-success` / `--color-success-bg`, following the exact
existing `--color-danger`/`--color-warning`/`--color-info` pattern. Used for positive deltas,
connected states, and the space's header glow (`accentRgb`) — never as a page-wide recolor.

## Icons

No new icon library. A few additional `iconsax-react` entries added to the existing
`QuestionOptionIcon` map for the risk-questionnaire options (reusing icons already imported
elsewhere in the app where sensible: `Clock`/`TimerStart`/`ShieldTick`/`Flash`-family). Exchange
branding per the "Exchange logos" note above.

## Explicit assumptions (flagged for review after implementation)

1. Homepage secondary prompts are inert composer-fill suggestions, not full flows.
2. Allocation's three secondary actions are lightly functional (2 real, 1 canned note), not
   fully specified flows.
3. `SpendingWidget`'s "تحلیل کامل خرج‌ها" button has no destination in this pass.
4. No disconnect/settings UI for the connected exchange — no profile/settings center exists yet
   to host it.
5. `TOTAL_INVESTABLE_AMOUNT` is a fixed demo constant, not derived from the crypto portfolio.

## Files

**New**: `src/types/finance.ts`; `src/lib/mocks/{exchanges,portfolio,spending,financeCopy}.ts`;
`src/lib/allocation.ts`; `src/components/charts/DonutChart.tsx(.module.css)`;
`src/components/widgets/finance/SpendingWidget.tsx(.module.css)`;
`src/components/finance/FinanceStartSection.tsx(.module.css)`;
`src/components/conversation/finance/{CryptoPortfolioFlow,ExchangeSelectionList,ExchangeConnectionSheet,PortfolioSummaryCard,PortfolioDonutChart,PortfolioInsights,AllocationEditor}.tsx`
(+ `.module.css` per component); `public/images/exchanges/bitpin.webp`.

**Modified**: `src/config/spaces.ts` (composer suggestion), `src/config/spacePages.tsx` (new
entry), `src/app/spaces/[spaceId]/page.tsx` (conditional history slot), `src/types/conversation.ts`
(+block kind), `src/components/conversation/blocks.tsx` (+case), `src/lib/mocks/conversations.ts`
(+conversation), `src/lib/faNum.ts` (+`formatTomanCompact`), `src/components/conversation/QuestionOptionIcon.tsx`
(+icon keys), `src/styles/tokens.css` (+success tokens).
