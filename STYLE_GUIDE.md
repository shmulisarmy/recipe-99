# Recipe-99 — Design Style Guide

*A style guide written **for this app specifically**, not a generic design system. Every rule below exists to answer the two questions this app is really about:*

> **"Can I cook this right now?"** and, if not, **"What exactly is stopping me?"**

Grounded in standard UI/UX + frontend practice (hierarchy, contrast, status semantics, progressive disclosure), then opinionated toward *this* domain: a pantry-vs-recipe availability checker.

---

## 0. The North Star

This is not a recipe *reader*. It's a **readiness scanner**. The user arrives holding a fixed pantry and scans a menu to find what they can make *tonight*. So the design's #1 job is **at-a-glance triage**: the eye should sort recipes into "yes / no" before reading a single word.

Everything else — typography, imagery, description — is secondary to that verdict.

**Design consequence:** status is the loudest thing on every card. Not the title. The *status*.

---

## 1. Color — semantic first, decorative second

The palette is a **traffic system**, not a mood board. Color carries *meaning* here, so we spend our brightest, highest-contrast colors on status and keep everything else warm and quiet so status can shout.

| Role | Token | Tailwind | Why (UX rationale) |
|------|-------|----------|--------------------|
| Canvas | `--bg` | `bg-stone-50` | Warm off-white reads "kitchen," not "spreadsheet." Low glare for long scanning. |
| Surface / card | `--surface` | `bg-white` | Cards float above canvas → each recipe is a discrete decision unit. |
| Ink | `--text` | `text-stone-800` | Softer than pure black; less fatigue over a long list. |
| Muted | `--muted` | `text-stone-500` | Descriptions, units, secondary metadata. Recedes so status wins. |
| **Ready** | `--ok` | `emerald-*` (`bg-emerald-50` / `text-emerald-700` / `ring-emerald-500`) | Green = go. Reserved **only** for "you can make this." Never decorative. |
| **Blocked** | `--warn` | `amber-*` (`bg-amber-50` / `text-amber-700`) | Amber, not red. You're not *broken* — you're one grocery run away. Amber = "almost." |
| Missing chip | `--missing` | `rose-*` (`bg-rose-50` / `text-rose-700`) | The specific missing ingredient is the sharpest note — it's the actionable atom. |
| Have chip | `--have` | `emerald-50 / emerald-700` | Owned ingredients confirmed in calm green. |
| Brand accent | `--accent` | `text-stone-900` / subtle | The app is the stage, not the star. Minimal branding. |

**Opinion:** never render a recipe in neutral-only. A card with no color state is a bug — the user learns nothing. Every card is either green-blessed or amber-flagged.

**Contrast rule:** all status text/badges must clear WCAG AA (4.5:1). The `-700` text on `-50` background pairs above are chosen to pass.

---

## 2. Typography — a strict 3-level hierarchy

Long lists punish typographic noise. Three levels, no more.

| Level | Use | Style |
|-------|-----|-------|
| **Title** | Recipe name | `text-xl font-semibold tracking-tight text-stone-800` |
| **Body** | Description | `text-sm text-stone-500 leading-relaxed` |
| **Label** | Badges, chips, units, counts | `text-xs font-medium uppercase tracking-wide` |

- System font stack (default Tailwind sans) — fast, familiar, no web-font flash on a utility app.
- **Numbers matter here** (amounts, units). Keep them in the label tier, muted, never competing with the title. The user reads *"can I?"* first, *"how much?"* only after committing.

**UX note:** uppercase tracked labels on badges read as "system status," which is exactly the register we want for the verdict — authoritative, scannable, not chatty.

---

## 3. Layout & rhythm

- **Card grid.** Responsive: 1 col mobile → 2 → 3 (`grid gap-5 sm:grid-cols-2 lg:grid-cols-3`). Cards, not rows, because each recipe is a self-contained yes/no decision.
- **8px spacing base.** Stick to Tailwind's 2/3/4/5/6 scale. Consistent rhythm = calmer scan.
- **Generous card padding** (`p-5`) — breathing room signals "considered," and a recipe you might cook deserves to feel appetizing, not cramped.
- **Max content width** `max-w-6xl mx-auto` with page padding `px-4 py-8` — never let the grid sprawl edge-to-edge on desktop.
- **Card anatomy (top → bottom):**
  1. **Status badge** (top-right or full-width strip) — the verdict, first.
  2. **Title.**
  3. **Description** (muted, 1–2 lines).
  4. **Ingredient chips** — have (green) + missing (rose), missing sorted first.
  5. If blocked: a quiet substitute hint where one exists.

**Opinion:** the status badge comes *visually before or above* the title in the reading path even though the title is bigger. Big ≠ first. Color and position put the verdict first; size makes the title the anchor once the eye lands.

---

## 4. Status treatment — the heart of the app

Two states, unmistakably different **without relying on color alone** (accessibility + glanceability):

**READY**
- Card: subtle emerald ring (`ring-1 ring-emerald-200`) + faint tint or clean white.
- Badge: `✓ Ready to make` — emerald, filled.
- Chips: all ingredients green "have."

**MISSING**
- Card: neutral/amber-tinged, softer, slightly de-emphasized (it's not tonight's dinner).
- Badge: `Missing 2` — amber, with a **count** (the count is the single most useful number in the app: it's the size of your grocery gap).
- Chips: missing ingredients in rose, listed first, with the required amount; owned ones in calm green after.
- Substitute hint: if a `substitute` exists, show `try {substitute}` — this is *progressive disclosure of a path forward*, not clutter.

**Why the count matters (UX):** "Missing 2" vs "Missing 5" instantly ranks near-misses above lost causes. The user's next action ("what's a small shop away?") is answered before they read the ingredient list. Surface the count in the badge.

**Redundant encoding:** icon (✓ / •) + color + text label. Never color-only — colorblind users and glare must still parse the verdict.

---

## 5. Search — a first-class control, not an afterthought

The menu will grow; search is how the user regains control. Treat it as a fixed, obvious tool.

- **Placement:** top of page, full-width, above the grid. It's the first thing after the title.
- **Style:** large hit target (`h-12`), rounded (`rounded-xl`), soft border (`ring-1 ring-stone-200`), leading search icon, clear placeholder: `Search recipes or ingredients…`.
- **Behavior (opinionated):**
  - **Instant / live filter** as you type (no submit button) — a small menu means results should feel immediate.
  - **Search matches BOTH recipe titles AND ingredient names.** This is the killer feature for *this* app: "I have eggs going bad" → type `egg` → see every recipe using eggs. Ingredient-search turns the pantry-checker into a "what can I do with X" tool.
  - Case-insensitive, trimmed, substring match.
  - Optional but recommended: a "Ready only" toggle/filter chip so the user can collapse the menu to just tonight's options.
- **Empty state:** when a search returns nothing, show a friendly, centered message (`No recipes match "{query}"`) — never a blank void. Empty states are where users feel lost; catch them.
- **Result count:** small muted line `Showing 3 of 12` reassures the filter is working and quantifies scope.

**UX note:** live search + dual field (title *and* ingredient) is what makes this feel like a kitchen assistant instead of a static list. It respects that the user's mental model is *ingredients-first*, not *recipe-first*.

---

## 6. Motion & feedback (restraint)

- Hover on cards: `transition` + a gentle `hover:shadow-md` / slight lift. Confirms interactivity without bounce.
- Filtering: let it be instant; no spinners (data is local). Avoid animated reflows that make the eye chase moving cards.
- Focus states: visible `focus-visible:ring-2` on the search input and any toggle — keyboard users must never lose their place.

**Opinion:** this is a decision tool. Motion should *confirm*, never *entertain*. Every animation must earn its place by making a state change legible.

---

## 7. Accessibility baseline (non-negotiable)

- Never encode status by color alone (see §4 — icon + text always).
- AA contrast on all text.
- Search input has an associated label (visually hidden is fine).
- Semantic structure: page `<h1>`, cards as list items, status as readable text (a screen reader should hear "Chocolate cake, missing 2 ingredients: flour, sugar").
- Keyboard: input focusable, toggles operable, focus rings visible.

---

## 8. Implementation notes (SolidJS + Tailwind v4)

- **JSX attribute is `class`**, not `className` (Solid).
- Tailwind v4, zero-config (`@import 'tailwindcss'` already in `index.css`). Use utility classes directly.
- **Reactivity:** use `createSignal` for the search query (and any "ready only" toggle); derive the filtered list with `createMemo`. Render the grid with `<For>`.
- **`multiplier` is always `1`.** Pass the literal `1` to `recipeMakingProjection`. Do not add a multiplier control to the UI.
- **Data wiring:** availability needs the user's pantry. Export `AvailableIngredients` from `data.ts` and pass it as the `ingredients` arg. A recipe is **READY** when `recipeMakingProjection(recipe, AvailableIngredients, 1).unfulfilledIngredients.length === 0`; otherwise **MISSING**, and that array *is* the "why."
- Guard the `false` return of the projection defensively (treat as blocked/unknown), so a recipe with an undefined substitute path never crashes the card.

---

### The one-sentence summary
**Warm, quiet kitchen canvas; loud, honest status; ingredient-aware instant search — so the user always knows what they can cook and precisely why they can't.**
