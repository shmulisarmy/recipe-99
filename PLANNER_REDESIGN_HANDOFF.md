# Planner redesign lead handoff

Status: **incomplete — source implementation exists, but final authenticated visual verification and correction have not happened.**

Date: 2026-08-23

Branch: `redesign`

Checkpoint before this handoff: `136c4e6`

## Mission

Take over the Planner redesign and lead it to a visually verified finish against the four committed references in [`design/planner/`](design/planner/). Preserve all existing product behavior, state, queries, mutations, routes, drag/touch/keyboard interactions, validation, error recovery, and Convex API boundaries.

The user's confirmed requirements are:

- Replace the persistent selected-day ticket with a route-owned day modal: centered modal/drawer treatment on desktop and bottom sheet on mobile.
- Match the supplied mobile references closely and adapt the same composition sensibly to desktop.
- Keep reference-only controls with no existing behavior visible but inert. This currently applies to `Plan Meal`, `Auto Shop`, and `Start Cooking`.
- Do not invent implementation logic or factual data to satisfy the mockups.
- Verify meaningful stages in a real browser, preferably mobile, update DOX, and commit coherent checkpoints.
- Use multiple agents for implementation and independent verification.

## Read first

1. [`AGENTS.md`](AGENTS.md), then every nearer `AGENTS.md` for files you touch.
2. [`PRODUCT.md`](PRODUCT.md)
3. [`FUNCTIONAL_INVARIANTS.md`](FUNCTIONAL_INVARIANTS.md)
4. [`DESIGN.md`](DESIGN.md)
5. [`REDESIGN_PROGRESS.md`](REDESIGN_PROGRESS.md)
6. [`src/features/planner/components/AGENTS.md`](src/features/planner/components/AGENTS.md)
7. The four reference images in [`design/planner/`](design/planner/).
8. Recent history beginning at `a98d7c5`.

Use the repo-local Impeccable workflow for the remaining visual work. Treat the functional invariants as a hard gate.

## Current implementation checkpoint

These commits were made in order:

| Commit | Scope |
| --- | --- |
| `a98d7c5` | Committed the four reference PNGs and replaced the old Planner return markup with a temporary shell. |
| `68898ea` | Rebuilt the base Planner with scoped theme variables, calendar thumbnails, and selected-day shopping preview. |
| `9d0855b` | Replaced the persistent day ticket with a route-owned day modal/bottom sheet. |
| `5fe2443` | Reworked the planned-recipe and cart overlays toward the supplied references. |
| `136c4e6` | Reconciled PRODUCT, DESIGN, functional invariants, detailed design docs, and REDESIGN_PROGRESS with the new modal architecture. |

Implementation files currently in scope:

- [`src/features/planner/components/planner.tsx`](src/features/planner/components/planner.tsx)
- [`src/features/planner/components/day_cell.tsx`](src/features/planner/components/day_cell.tsx)
- [`src/features/planner/components/day_detail.tsx`](src/features/planner/components/day_detail.tsx)
- [`src/features/planner/components/recipe_pill.tsx`](src/features/planner/components/recipe_pill.tsx)
- [`src/features/planner/components/planner_modals.tsx`](src/features/planner/components/planner_modals.tsx)
- [`src/index.css`](src/index.css)
- Shared recipe imagery in [`src/components/menu.tsx`](src/components/menu.tsx)

Independent logic review passed over `4624349..5fe2443`: no Convex/backend/generated changes, mutation references and argument shapes stayed identical, and planner keyboard, pointer, touch, focus, retry, amount, cart-draft, save, and discard behavior remained wired. Do not infer visual correctness from that source-level pass.

## New logo asset and unresolved brand decision

The user added [`logo.png`](logo.png) as the app logo. It is a 1024×559 RGBA PNG showing a circular captain/chef emblem and the words **Captain Cook**.

The live app, PRODUCT contract, document titles, authentication screen, accessible labels, and shell currently say **Recipe 99**. The mobile references also show Captain Cook branding. This is a product-level naming conflict, not merely an image swap.

Before renaming visible or accessible product copy, confirm whether the user wants:

1. a full product rename to Captain Cook, or
2. the Captain Cook illustration used as the visual mark while the product remains Recipe 99.

Preserve `logo.png` as the untouched source asset. Derive runtime-sized/cropped assets under `public/` only after that decision; do not destructively overwrite the source. If it becomes a PWA icon, update the manifest and verify every emitted icon path.

## What is still unfinished

### 1. Authenticated rendered baseline and five-state capture

The collaborative preview was available at `http://127.0.0.1:3000/planner` but remained signed out. The fresh Impeccable finish reviewer returned `disposition: recapture` because none of the final authenticated states had valid screenshots.

Required captures after authentication:

- closed Planner at desktop, from the document top;
- closed Planner at 390×844 mobile, plus a 320px overflow/target check;
- `/planner/day/:date` with a populated day modal;
- `/planner/day/:date/recipe/:plannedRecipeId` with the recipe modal;
- `/planner/day/:date/cart` with the cart modal.

Save final evidence under `.impeccable/review/` as `desktop.png`, `mobile.png`, plus clearly named day/recipe/cart captures. Validate that each image shows the intended route, loaded real data, correct viewport, no clipping, and no blank region before review.

### 2. Logo and shell fidelity

- The shell and sign-in page still render the CSS `99` mark, not `logo.png`.
- The references show a Captain Cook logo and different brand copy.
- The existing shell has four required destinations—Planner, Recipes, Pantry, Intake—while the references show three. Preserve the product's four-destination contract unless the user explicitly changes it.
- Decide whether the logo belongs in the desktop sidebar, mobile top bar, authentication screen, PWA assets, or all four after resolving the name conflict.

### 3. Base Planner fidelity

Source inspection indicates likely material differences that must be judged in the authenticated render:

- The implementation renders the full current-month grid; the mobile reference shows a compact two-week calendar composition.
- At 385px and below the implementation uses contained horizontal calendar scrolling to preserve 44px targets. The reference appears to fit all seven days without scrolling. Resolve this through rendered comparison without weakening touch targets or causing page-level overflow.
- Calendar thumbnails rely on the curated title-to-Unsplash mapping in `RecipeImage`; recipes outside that map show an icon fallback. Check actual planner data rather than assuming image coverage.
- The shopping preview and desktop two-column adaptation have not been visually compared with the references.
- `Plan Meal` and `Auto Shop` are intentionally inert per user instruction.

### 4. Day modal fidelity and interaction

- The modal preserves People, readiness explanation, shopping progress, and every movement surface. It is therefore denser than the reference's meal-focused sheet.
- Use hierarchy or progressive disclosure to approach the reference without deleting or disconnecting those controls.
- Test backdrop, Escape, focus trap/restoration, body scroll lock, nested amount/move overlays, pointer drag, touch drag, keyboard lift/drop/cancel, cross-day targets, failure retry, and empty-day state using real authenticated data.
- Some newly styled planner metadata remains at 10px in `src/index.css`; reconcile it with the documented 11px essential-text floor.

### 5. Recipe modal fidelity and truthfulness

- The hero uses the shared `RecipeImage` map and needs real-data coverage verification.
- The reference's prep/cook times do not exist in the domain model. A prior attempt to hard-code `15 min` and `25 min` was rejected and removed. Do not reintroduce fabricated timing.
- The three current stat tiles use truthful projection values: day amount, ingredients ready, and amount to make. Assess their visual composition against the reference.
- Verify query loading/refetch, amount override/default, missing-ingredient calculations, add-to-cart pending/success/error, nested focus behavior, and unavailable recipe route.
- `Start Cooking` is intentionally inert.

### 6. Cart modal fidelity and behavior

- Checklist marks are computed from existing obtained percentage and are intentionally non-interactive; no toggle mutation exists.
- The reference is visually simpler than the preserved cart editor. Check real at-rest rows, touch-visible edit affordance, active drafts, custom units, bulk save, validation focus, success/error, wide desktop draft state, Escape/backdrop with drafts, and Keep editing/Discard behavior.
- Verify the sheet clears the fixed mobile navigation and that long carts scroll without moving the header/footer.

### 7. Known cleanup and finish gates

- Remove the stale `TOUR 1` teaching comment in `planner.tsx` during the next legitimate touch of that block.
- Re-run the Impeccable detector only as directed by its workflow; previous runs reported four pre-existing warnings in unrelated/shared CSS rules.
- After the first authenticated comparison, make one batched correction pass, recapture all affected states, and send the complete evidence to a fresh `impeccable_finish_reviewer`.
- If fixes change the built visual system, rerun the documentation pass so DESIGN and detailed docs describe the final render rather than this interim checkpoint.

## Verified commands at handoff

The following passed after `5fe2443` and before this documentation/handoff-only work:

```sh
npm run build
npx tsc --noEmit
npx tsc -p convex/tsconfig.json --noEmit
npm run test:ui
git diff --check
```

`npm run test:ui` currently covers the public sign-in screen in desktop Chromium and mobile Chromium; it does not verify authenticated Planner behavior.

## Git and workspace safety

- `redesign` contains the five planner checkpoints above and is ahead of `origin/redesign`.
- `master` and `origin/master` were at `4624349` when the redesign began.
- `solid-table/` is unrelated user-owned untracked work. Do not add, move, delete, format, or commit it.
- Keep the logo source and this handoff committed together so a fresh agent can recover the same context from history.

## Recommended first takeover sequence

1. Read the contracts and recent commits listed above.
2. Ask the one brand question about Captain Cook versus Recipe 99 before changing product copy.
3. Start the local app and obtain an authenticated browser session.
4. Capture all five current states before editing; compare each side-by-side with its matching PNG.
5. Rank material mismatches, then implement one coherent correction batch with a separate agent reviewing behavior preservation.
6. Run build, frontend and Convex TypeScript, public Playwright, diff checks, and the authenticated interaction matrix.
7. Recapture, run the fresh finish reviewer, resolve its disposition, update DOX/design docs, and commit the final checkpoint.

Do not declare this redesign finished until the authenticated captures exist and the finish reviewer returns a valid post-capture disposition.
