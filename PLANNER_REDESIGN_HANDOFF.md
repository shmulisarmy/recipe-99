# Captain Cook Planner ground-up rebuild handoff

Status: **active and incomplete — the user explicitly rejected the current UI and the prior finish claim.**

Date: 2026-08-23

Branch: `redesign`

Current HEAD: `f819773` (`fix: finish planner reference redesign`)

## User directive that controls the next context

The user rejected the current result twice:

> you are not done!!!!

Then clarified the required approach:

> maybe you should start off, remove all relevent display code and start all the from the beggining to reimplement the design, you are not done untill the ui looks like the images, and i mean everything!!!!, inclduing the logo and all!!!!!!

Treat the four PNGs in [`design/planner/`](design/planner/) as approved comps, not loose inspiration. Delete and rebuild the relevant Planner and modal presentation. Preserve domain truth, routes, Convex APIs, mutations, error recovery, focus behavior, and direct-manipulation behavior underneath the new markup.

The user also explicitly authorized the existing temporary no-sign-in mode so real Convex data can be used during design verification. Do not spend this rebuild restoring authentication; the user will handle authentication afterward.

## Correction to the previous handoff

The prior context prematurely called the redesign finished after a narrow calendar-row correction and a reviewer verdict. That conclusion is invalid because the user rejected the rendered result. Commit `f819773` is a checkpoint, not an accepted finish. Its saved screenshots remain useful only as evidence of what must be replaced.

No code changes were made after the user's ground-up rebuild directive. At handoff, the worktree contains only the unrelated user-owned untracked directory:

```text
?? solid-table/
```

Do not add, move, delete, format, or commit `solid-table/`.

## Required skills and workflow

- Use the repo-local Impeccable skill. It was loaded in the interrupted context along with `reference/new-work.md`, `reference/visualize.md`, and the frontend-design skill.
- The supplied reference images are already the approved visual direction, so do not generate alternative concepts or ask the user to choose another direction.
- Use semantic code navigation before replacing component markup. A TypeScript Language Service behavior trace has already been completed and is summarized below.
- Read `reference/craft-floor.md` immediately before the first UI edit.
- The original handoff requires multiple agents. Read-only behavior, brand, and pixel-inventory agents completed successfully; an `impeccable_asset_producer` spawn was interrupted and must be rerun before shipping assets.
- Use the T3 collaborative preview first for browser work. The dev app was reachable at port 3000 in tab `tab_6` during the prior context, but recheck preview status rather than assuming that tab or server survived compaction.

## Approved reference files

| State | File | Raster dimensions |
| --- | --- | --- |
| Closed Planner | `design/planner/no-models-open.png` | 530×1134 |
| Day sheet | `design/planner/day model open.png` | 356×730 |
| Recipe sheet | `design/planner/recipe-model-open.png` | 356×746 |
| Cart sheet | `design/planner/cart-model-open.png` | 350×746 |

Open all four at original resolution before editing and compare subsequent captures at the reference app width, not only at 390px.

## Fixed visual direction

### Palette

Use the sampled reference colors rather than the current brighter approximation:

- page: `#f1f6fa`
- work surface: `#ffffff`
- ink: `#141e14`
- action teal: `#498ba3`
- selected/active green: `#4d7b4c`
- muted green-gray: `#5f6b5f`
- borders/rules: `#e4ebe5` and `#eaf0eb`
- ready soft fill: `#ecf3ee`
- pale cyan panels: `#e7f0f6` and `#f1f6fa`

The references read as one neutral rounded/system-sans hierarchy. The current conspicuous Chivo/Atkinson/IBM Plex mix is not visually faithful on this surface. Rebuild the Planner type hierarchy from the reference silhouette while keeping fonts obtainable and legible.

### Captain Cook branding

The newest instruction resolves the prior brand ambiguity: use the Captain Cook logo and visible product name. Apply the visible rename across the shell, sign-in, document titles, not-found state, PWA manifest, accessible navigation label, and current product/design contracts.

Source asset [`logo.png`](logo.png):

- 1024×559 RGBA, but fully opaque;
- pale-blue landscape background;
- circular captain/chef wheel emblem with baked-in `CAPTAIN COOK` lettering;
- SHA-256 at handoff: `a041415498528f0e5e01747654973e78b509ed082cd5eecf1652d9b3033f1208`.

Preserve `logo.png` unchanged. Create safe derived runtime assets:

- a centered 559×559 crop beginning around x=232 for the square mark;
- `public/brand/captain-cook-logo.png` for the shell/auth;
- padded mask-safe `public/icons/icon-512.png`, then a derived 192×192 icon;
- optionally a downscaled full lockup under `public/brand/` if the auth composition needs it.

Do not stretch the landscape source into a square. Do not chroma-key the blue background; related blues inside the illustration would be damaged. Rerun the Impeccable asset producer and record pre-existing origin/provenance before shipping these raster derivatives.

The reference profile portrait has no corresponding real asset or identity field. Do not fabricate a person. Use the real account image only if a real source becomes available; otherwise use a quiet `CC`/identity fallback while matching the reference avatar geometry.

## Pixel inventory: what to rebuild

### Shared mobile shell

- Remove the boxed `99`/`Recipe 99` presentation.
- Brand row at normalized app width: circular Captain Cook badge about 38–40px, bold `Captain Cook`, small uppercase `RECIPE APP`, and a roughly 38px circular account control at right.
- Use about 20px mobile gutters.
- Close controls are pale circular buttons with a centered `×` and a full 40–44px hit target.
- Planner reference navigation is exactly three equal items: Pantry, Plan, Groceries, with canister/calendar/cart outline icons and a fixed white bar.
- Preserve real routes. A safe reconciliation is to make this three-item navigation Planner-specific: Pantry links to Pantry, Plan links to Planner, and Groceries opens the selected day's real cart. Do not globally relabel Intake as Groceries or silently delete Recipes.
- Do not draw fake iOS status bars or home indicators in the web app; those are device chrome in the references.

### Closed Planner

Current failure: the six-week calendar consumes the viewport and pushes shopping below the fold. The reference first viewport shows brand, title/CTA, a compact two-week calendar composition, the full shopping preview, and bottom navigation together.

- `Meal Schedule` and the teal `+ Plan Meal` pill share one row.
- White calendar card with roughly 15px normalized radius and thin green-gray border.
- Month heading is bold with an adjacent down chevron.
- Each visible date cell contains uppercase weekday, bold date, and real recipe thumbnails.
- Selected cell has a 2px green outline, pale green fill, and green weekday.
- Reference composition is a 14-day/two-row window. Preserve the complete month in data/DOM and keyboard movement, but make the mobile visual viewport show the relevant two weeks so the first viewport matches the comp. Do not retain the current six visible 71px rows merely because they are already implemented.
- Meal-heavy cells may grow vertically like the reference; the prior fixed-row `f819773` correction is not authoritative after the user's rejection.
- Shopping card is a large pale-blue panel with cyan outline, up to four real lines, a real `+ n more` count, and two white pills at its bottom.
- `Plan Meal` and `Auto Shop` remain visible and inert because no domain behavior exists.

### Day sheet

- White bottom sheet begins around mid-screen over the dimmed compact Planner, with a centered pale handle.
- Header: formatted day, planned-recipe count, circular close control.
- First viewport is the meal list: image-led flat rows with thin border, title, truthful readiness/ingredient summary, and compact READY/MISSING treatment.
- The current `Day settings`, People row, global Meals/missing heading, exposed drag/menu chrome, readiness disclosure, and shopping summary do not belong in the reference first viewport.
- Preserve those behaviors through progressive disclosure or below-fold secondary content rather than deleting them. The three-dot per-meal menu may own details/amount/move; people/readiness/cart controls can live below the comp-matching meal region.
- Touch, pointer, and keyboard movement must remain reachable and use the same generated mutations.

### Recipe sheet

- Sheet geometry is already the closest current state, but rebuild to the reference proportions: handle, header/subtitle, close circle, 2:1 hero crop, title/status, three equal pale-blue stat tiles, availability panel, compact ingredient rows, fixed teal `Start Cooking` above the Planner nav.
- Use real recipe imagery and projection data. The reference prep/cook times do not exist in the domain; do not fabricate them. Keep truthful day amount, ingredient readiness, and amount-to-make values in the same tile geometry.
- Keep loading/error/refetch, nested amount control, missing-ingredient aggregation, add-to-cart states, substitutions, and unavailable-route recovery.
- `Start Cooking` remains visible and inert.

### Cart sheet

- Replace the current large single progress/editor card with a dense checklist of real cart rows matching the reference rhythm.
- Each at-rest row: compact checkbox, ingredient name, truthful secondary line if one exists, amount at right. Completed rows use cyan check and strike-through.
- Do not invent `Used in …` provenance because the current cart data does not reliably provide it.
- Editing remains a secondary state reached from the row; preserve drafts, custom units, bulk save, validation focus, pending/error/success, modal widening where needed, and unsaved-close confirmation.
- The default footer should use reference-style action pills rather than a large standalone Close bar, while a safe close action remains available through the header.
- Long carts scroll beneath fixed header/footer and clear the Planner navigation.

## Presentation code expected to be deleted/replaced

Primary implementation surface:

- `src/features/planner/components/planner.tsx`
- `src/features/planner/components/day_cell.tsx`
- `src/features/planner/components/day_detail.tsx`
- `src/features/planner/components/recipe_pill.tsx`
- `src/features/planner/components/planner_modals.tsx`
- the complete Planner-specific block in `src/index.css`, including its current mobile overrides
- relevant shell/wordmark rules in `src/index.css`
- `src/components/app_shell.tsx`

Do not delete behavior merely because its current markup is being replaced. Remove the stale `TOUR 1` comment in `planner.tsx` during the rebuild.

## Behavior graph that must survive

The completed TypeScript Language Service trace established these boundaries:

### Routes and ownership

- One `Planner` component serves `/planner`, `/planner/day/:date`, `/planner/day/:date/recipe/:plannedRecipeId`, and `/planner/day/:date/cart`.
- Day click opens the date route; day close returns to `/planner`.
- Recipe/cart routes replace rather than stack over the day sheet; their close returns to the owning day route.
- Local Amount and Move surfaces remain overlays over the day; Recipe details can own a nested Amount surface.
- Route dates are `YYYY-MM-DD`; persistence/projection keys remain `Date.prototype.toDateString()`.

### Generated Convex calls

- Planner query: `api.planner_exports.usersPlanner`.
- Move beginning: `InsertRecipeAtBeginningOfDate { recipeId, toDate }`.
- Move end: `InsertRecipeAtEndOfDate { recipeId, toDate }`.
- Move before: `MoveRecipeOnTopOfOtherRecipe { recipeId, otherRecipeId }`.
- People: `updateDayMultiplier { date, multiplier }`, non-negative integer.
- Recipe amount: `updateRecipeOverrideMultiplier { recipeId, multiplier: number | null }`, positive or null.
- Recipe details: `recipe_exports.getRecipeByTitle { recipeTitle, version }`.
- Add projected deficits: `BulkUpdateCartToGet { date, ingredients }`.
- Save cart drafts: `BulkSetCartToGet { date, ingredients }`.
- Custom units: `customUnit_exports.getCustomUnits { associatedIngredient }`.

All movement uses the planned occurrence's stable `id`, never title/version.

### Interaction contract

- Calendar has one focusable date target per cell; Left/Right ±1, Up/Down ±7, Home/End row bounds.
- Keyboard meal move: Space lifts; arrows change day/position; Space/Enter drops; Escape cancels and restores focus; announce every transition.
- Pointer drag supports calendar/ticket beginning, row-before, and end-of-day targets; failures expose retry/dismiss without corrupting confirmed order.
- Touch movement starts only from the meal grip, hit-tests the same target surfaces, uses the same three mutations, and always cleans listeners/body classes.
- Shared Overlay must retain portal dialog semantics, body scroll lock, background inertness, topmost Escape, focus trap, opener restoration, and safe backdrop dismissal.
- Cart drafts remain local until one bulk save; unsaved Escape/navigation must offer Keep editing/Discard.
- People saves on blur/Enter with validation and server-value restoration on failure.
- Amount, recipe query, add-missing, Planner query, and move flows retain localized loading/error/success/retry states.

Known existing hazard to fix instead of preserving: the cart span inside a day button is nested clickable content and can bubble into day selection. The rebuilt calendar cell should keep one date target; cart opening belongs to the day/cart surfaces.

## Captain Cook runtime/documentation inventory

Runtime locations:

- `src/components/app_shell.tsx`: fallback route label/title, avatar fallback, wordmark, navigation accessible label.
- `src/auth/google.tsx`: sign-in title, wordmark, support copy. Keep the internal `recipe-99.google-id-token` storage key for session continuity.
- `src/App.tsx`: not-found title and copy.
- `src/features/planner/components/day_detail.tsx`: branded readiness explanation.
- `index.html`: default title and icon metadata.
- `vite.config.ts`: PWA name/short name/icons.
- `public/icons/icon-192.png` and `icon-512.png`: currently obsolete green assets.

Durable current-state contracts that require a DOX/documentation rename include root, `src`, `docs`, `convex`, and `learnings` AGENTS where they describe the current product, plus `PRODUCT.md`, `DESIGN.md`, `FUNCTIONAL_INVARIANTS.md`, `STYLE_GUIDE.md`, `docs/product/`, `docs/design/`, and `.ralph/redesign-prompt.md`.

Preserve historical rollout notes and old findings as history. Static `docs/design-examples/` should be synchronized if they remain current examples.

## Temporary authentication bypass

Commit `27dad03` is intentionally active. It allows the app to mount without Google and lets unauthenticated Query/Mutation/Action contexts resolve the first stored Planner or Pantry owner through `authenticatedUserId`.

This is broad: anonymous clients can read and mutate that stored owner's data. It was synced only to personal development deployment:

```text
dev:doting-sandpiper-434
https://doting-sandpiper-434.convex.cloud
```

No production deployment was targeted. Do not deploy any Convex change without reading the Convex deployment guard and announcing the target. Do not restore auth during this visual rebuild unless the user changes scope.

The existing sign-in Playwright tests fail by design while the bypass is active because `/sign-in` redirects to Planner. Add bypass-compatible Planner shell coverage instead of treating that failure as a visual regression.

## Current commits

```text
f819773 fix: finish planner reference redesign        # rejected by user; not final
27dad03 chore: enable temporary redesign auth bypass  # keep during visual rebuild
2bdcce2 docs: hand off unfinished planner redesign
136c4e6 docs: record planner modal design system
5fe2443 redesign: align planner recipe and cart modals
9d0855b redesign: replace planner day ticket with modal
68898ea redesign: rebuild planner calendar surface
a98d7c5 redesign: clear planner presentation for rebuild
4624349 did some clean up
```

## Required next sequence

1. Read root and nearest AGENTS files plus this handoff, PRODUCT, FUNCTIONAL_INVARIANTS, DESIGN, REDESIGN_PROGRESS, and recent history.
2. Open all four approved reference PNGs at original resolution.
3. Recheck dirty worktree and preserve `solid-table/`.
4. Rerun the interrupted `impeccable_asset_producer`; derive and inspect Captain Cook runtime/PWA assets without changing `logo.png`.
5. Read `reference/craft-floor.md` immediately before editing.
6. Delete/rewrite the Planner-specific presentation and shell branding in one coherent build, preserving the behavior graph above.
7. Build once, then render the real-data closed/day/recipe/cart states at the reference app width, 390×844, 320px, desktop, and 200% zoom. Compare side-by-side with the approved comps.
8. Exercise the interaction matrix: close/backdrop/Escape/focus restoration; People; amount override/default; cart edit/save/discard/custom units; recipe missing/add states where real data permits; pointer, keyboard, touch, and explicit movement; empty/unavailable/long states.
9. Apply one complete evidence-driven correction batch, recapture, and run the detector once on changed targets.
10. Spawn a fresh no-history `impeccable_finish_reviewer`. The prior `ship` verdict is invalidated by the user's rejection.
11. Act on its exact disposition, then run the Impeccable documenter, update DOX/PRODUCT/DESIGN/REDESIGN_PROGRESS, and commit coherent checkpoints.

## Verification gates

At minimum:

```sh
npx tsc --noEmit
npx tsc -p convex/tsconfig.json --noEmit
npm run build
git diff --check
```

Also inspect `dist/manifest.webmanifest` for Captain Cook name/short name/icon paths, verify emitted icon sizes and mask-safe crop, verify route titles and navigation accessible name, and confirm `logo.png` still has the SHA-256 recorded above.

Report browser evidence accurately: T3/Playwright with the local bypass is real-data local-bypass evidence, not authenticated Firefox/Chrome evidence.
