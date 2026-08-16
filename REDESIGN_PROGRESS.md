# Redesign progress

## Process state

- Branch: `auto-redesign`.
- Impeccable 4.1.1 is installed project-locally under `.agents/skills/impeccable/` with the Codex hook manifest in `.codex/hooks.json`.
- Browser verification works through the connected in-app browser and an authenticated Chrome session.
- Playwright and Chromium are installed for standalone fresh-context checks.
- SantanderAI Ralph is installed as `ralph-loop.sh`; repository-specific configuration and prompt live under `.ralph/`.
- Persistent context files: `PRODUCT.md`, `FUNCTIONAL_INVARIANTS.md`, `DESIGN.md`, and this file.

## Baseline evidence

Authenticated baseline screenshots are local, intentionally untracked artifacts:

- `.impeccable/baseline/desktop-planner.png`
- `.impeccable/baseline/desktop-recipes.png`
- `.impeccable/baseline/desktop-pantry.png`
- `.impeccable/baseline/desktop-intake.png`
- `.impeccable/baseline/mobile-planner.png`
- `.impeccable/baseline/mobile-recipes.png`
- `.impeccable/baseline/mobile-pantry.png`
- `.impeccable/baseline/mobile-intake.png`

The authenticated Chrome profile applies a dark rendering treatment even though computed application tokens remain the documented light enamel palette. Treat those captures as layout and hierarchy evidence; verify source colors and a clean Playwright browser before changing palette tokens.

## Current strengths

- The routed shell already establishes Planner, Recipes, Pantry, and Intake as distinct destinations.
- Recipes has effective imagery, search, readiness status, result counts, and desktop/mobile structural changes.
- Pantry uses a clear flat ledger and reflows into labeled mobile rows.
- Planner exposes a rich accessible date summary and a selected-day Day Ticket.
- The existing `docs/product/` and `docs/design/` contracts are unusually detailed and should remain the deeper source of truth.

## Current problems

### Highest priority

1. **Intake is not a coherent route.** The rendered page has no `main` landmark, `h1`, explanation, step framing, camera guidance, fallback, or visible status hierarchy. The desktop camera occupies a narrow unexplained strip; mobile is almost entirely an unlabeled camera surface.
2. **Mobile Planner loses the Day Ticket.** In the 390×844 baseline, the fixed Day Ticket and bottom navigation compete for the lower viewport; only the ticket's top edge/header is readily visible. This hides the authoritative selected-day actions.
3. **Intake leaks implementation state.** Current copy such as “the agent is still working on your ingredients” and raw action text does not use the product voice or explain what the user should do.

### Significant follow-ups

- Desktop Planner leaves a large unused region at wide viewports while the dense calendar and ticket remain visually small.
- Planner cell metadata is compact enough that icon meaning and counts require learning; selected-day context must carry more of the explanatory burden.
- Pantry mobile action rows split a strong outlined Edit action and a much quieter Convert action without a clear shared action rhythm.
- The app repeatedly logs Solid's “cleanups created outside a `createRoot` or `render` will never be run” warning during route changes. Treat this as a functional-quality issue to diagnose separately from visual styling.
- Intake currently requests its upload URL during render and starts from camera capture only; preserve semantics while making camera state, permission failure, processing, review, and reconciliation understandable.
- Impeccable's baseline detector reports four warnings in `src/index.css`: two side-accent borders (`.inline-notice` and `.cart-match`) and two width transitions (`.progress > span` and the widened cart modal). Evaluate them in context rather than mechanically changing all four.

## Decisions already made

- This is an incremental redesign of an existing routed system, not a new visual identity.
- `docs/design/` remains the detailed presentation contract. Root `DESIGN.md` is the autonomous loop's concise entry point.
- The visual world remains the light six-color enamel system. Do not infer a dark-theme redesign from the authenticated Chrome profile's rendering treatment.
- The Day Ticket remains the signature surface and authoritative selected-day control center.
- Intake is the first redesign target because it is structurally incomplete and accessibility-poor, not because it needs decorative polish.
- No backend, domain, measurement, persistence, or API changes are authorized for visual convenience.

## Mistakes and approaches not to repeat

- Do not begin an iteration by changing global CSS without opening the affected route first.
- Do not treat a successful build or DOM snapshot as visual verification.
- Do not use unauthenticated Playwright screenshots as proof of authenticated workflows.
- Do not “solve” awkward product state by hiding a feature or replacing real data with mocks.
- Do not spend early iterations on shadows, radii, or palette tweaks while Intake and mobile Planner remain structurally weak.
- Do not trust a screenshot's dark/light appearance without checking computed tokens when browser extensions may alter rendering.

## Next highest-value opportunities

1. Reframe `/intake` as an accessible capture → processing → review workflow while preserving the current camera, OCR, upload, Agent, and reconciliation semantics.
2. Fix mobile Planner so the Day Ticket and bottom navigation never overlap and the ticket exposes useful selected-day content in the first viewport.
3. Improve wide Planner composition so calendar and Day Ticket use available space without reducing scanability.
4. Audit Pantry mobile action hierarchy and conversion presentation.
5. Run an accessibility and interaction audit across overlays, focus restoration, and route-change warnings.

## Iteration log

### Infrastructure and baseline — 2026-08-16

- Inspected repository, routes, current design contracts, Convex boundary, and authenticated application state.
- Installed Impeccable, Playwright Chromium, and one maintained Codex-compatible Ralph loop.
- Captured desktop and mobile baselines for all four primary destinations.
- Recorded product truth, functional invariants, design direction, and prioritized redesign opportunities.
- Verified the new Playwright desktop/mobile sign-in smoke checks (`2 passed`) and a production build.
- No product functionality or application presentation changed in this baseline iteration.
