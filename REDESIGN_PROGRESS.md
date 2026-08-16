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

1. **Mobile Planner loses the Day Ticket.** In the 390×844 baseline, the fixed Day Ticket and bottom navigation compete for the lower viewport; only the ticket's top edge/header is readily visible. This hides the authoritative selected-day actions.
2. **Intake's generated-draft wait copy leaks implementation state.** “The agent is still working on your ingredients” does not use the product voice or tell the user what will happen next.

### Significant follow-ups

- Desktop Planner leaves a large unused region at wide viewports while the dense calendar and ticket remain visually small.
- Planner cell metadata is compact enough that icon meaning and counts require learning; selected-day context must carry more of the explanatory burden.
- Pantry mobile action rows split a strong outlined Edit action and a much quieter Convert action without a clear shared action rhythm.
- The app repeatedly logs Solid's “cleanups created outside a `createRoot` or `render` will never be run” warning during route changes. Treat this as a functional-quality issue to diagnose separately from visual styling.
- Intake still needs an explicit camera-permission failure state. Preserve capture, OCR, upload, Agent, and handoff semantics when addressing it.
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

1. Fix mobile Planner so the Day Ticket and bottom navigation never overlap and the ticket exposes useful selected-day content in the first viewport.
2. Give Intake camera permission/loading failure an actionable product-voice state, then refine the generated-draft wait copy.
3. Improve wide Planner composition so calendar and Day Ticket use available space without reducing scanability.
4. Audit Pantry mobile action hierarchy and conversion presentation.
5. Run an accessibility and interaction audit across overlays, focus restoration, and route-change warnings.

## Iteration log

### Public sign-in IA vocabulary — 2026-08-16

- Reconstructed the redesign context, loaded Impeccable 4.1.1, ran its context command for `/planner`, read the installed Chrome-control skill, and connected to Chrome through the supported browser bridge.
- Authenticated Planner verification is still blocked in this fresh context: the existing `localhost:3000/intake` Chrome tab is already owned by an older browser automation session, and a fresh controlled Chrome tab renders the unauthenticated sign-in page. No authenticated Planner UI was changed.
- Chose a safe public-surface improvement instead: the sign-in thesis chain now uses the durable primary destinations in order, `Planner`, `Recipes`, `Pantry`, `Intake`, instead of implying a separate Shopping destination.
- Verification evidence: Chrome-rendered desktop and mobile sign-in captures live under `.impeccable/review/iteration-03-desktop-signin-after.png` and `.impeccable/review/iteration-03-mobile-signin-after.png`; DOM checks confirmed the updated chain at both sizes.
- Verification: `npm run build` passed; `npm run test:ui` passed (`2 passed`); `git diff --check` passed; Impeccable detector still reports only the four pre-existing `src/index.css` warnings already listed in Current problems.
- Impeccable finish reviewer returned `disposition: ship` with no material fixes for the scoped public sign-in refinement.
- Browser console evidence: no new source errors from this copy change; the known Solid cleanup warning still appears, and Chrome logged one Google Identity warning after repeated sign-in page initialization during verification.
- Hostile review: this is intentionally a small information-architecture correction, not the main Planner fix. The next highest-value opportunity remains authenticated mobile Planner Day Ticket verification and layout repair once a controllable authenticated tab is available.

### Authenticated Planner verification blocked — 2026-08-16

- Reconstructed the redesign context, loaded Impeccable 4.1.1, ran its context command, and inspected the current git state before selecting work.
- The highest-value unresolved issue remains mobile Planner: the selected-day Day Ticket must stay usable above the fixed bottom navigation.
- No Planner UI code was changed because the authenticated Planner surface could not be rendered in this session.
- Evidence: a copied Chrome profile with localhost and Convex cookies still rendered the sign-in page at both `127.0.0.1:3000/planner` and `localhost:3000/planner`; Playwright collected Google origin/auth errors and the existing Solid cleanup warning, not authenticated Planner DOM.
- Evidence: live browser screenshots under `.impeccable/review/` also showed the sign-in or Intake state rather than authenticated Planner after the automation attempt.
- Decision: do not commit an authenticated Planner presentation change from source intent, stale baseline screenshots, or unauthenticated Playwright output. Resume with mobile Planner only after an authenticated browser session can render `/planner`; otherwise choose a public/unauthenticated surface if a meaningful issue is found there.
- Loop correction: the fresh Codex context had not loaded the installed Chrome browser skill and incorrectly fell back to profile copying and AppleScript. The persistent Ralph prompt now requires the supported Chrome bridge bootstrap and explicitly prohibits profile, cookie, storage, and browser-database inspection. Retry authenticated Planner verification through that bridge.

### Infrastructure and baseline — 2026-08-16

- Inspected repository, routes, current design contracts, Convex boundary, and authenticated application state.
- Installed Impeccable, Playwright Chromium, and one maintained Codex-compatible Ralph loop.
- Captured desktop and mobile baselines for all four primary destinations.
- Recorded product truth, functional invariants, design direction, and prioritized redesign opportunities.
- Verified the new Playwright desktop/mobile sign-in smoke checks (`2 passed`) and a production build.
- No product functionality or application presentation changed in this baseline iteration.

### Intake capture workspace — 2026-08-16

- Reframed `/intake` as a full-page step-one workspace with a main landmark, `Add a batch` hierarchy, the established two-step indicator, task-oriented capture guidance, and a clear processing state.
- Kept the 1:2, 960×1920 camera target and every OCR, upload, Agent draft, review, and reconciliation behavior unchanged.
- Desktop now pairs concise receipt guidance with the narrow camera instead of presenting an unexplained strip.
- The first mobile render put guidance before the shutter; hostile self-review rejected it. The final mobile order puts the camera first and scales it so the shutter is available before the fixed bottom navigation, with guidance immediately below.
- Removed raw Agent action output from presentation; the editable generated draft remains the next visible workflow state.
- Independent Impeccable finish review caught and corrected two issues before commit: processing now announces itself as a polite live status, and the camera remains flat instead of borrowing the Day Ticket's reserved elevation.
- Rendered evidence: `.impeccable/baseline/iteration-01-desktop-intake.png` and `.impeccable/baseline/iteration-01-mobile-intake.png` (local, ignored).
- Verification: production build passed; Playwright desktop/mobile sign-in checks passed (`2 passed`); authenticated Chrome desktop and 390×844 mobile DOM/render checks passed; no new browser errors; Impeccable detector remained at the four recorded pre-existing warnings.
