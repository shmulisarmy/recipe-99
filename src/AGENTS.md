# Purpose

Own the SolidJS browser application and the frontend side of the Convex boundary.

# Ownership

- `index.tsx`, `App.tsx`, and `convex_client.ts` compose providers, authentication, planner projection, Solid Router destinations, and top-level screens.
- `auth/` owns the Google authentication gate under its local contract.
- `components/` owns the responsive application shell and shared route-level UI under its local contract.
- `data.ts`, `logic.ts`, and `utils/` own shared client data helpers and calculations.
- `features/` owns self-contained product workflows; `primitives/` owns cross-cutting domain values.

# Local Contracts

- Use SolidJS signals, stores, and control-flow components for reactive state; do not introduce a second UI state system.
- Call Convex through `convex-solidjs` and `convex/_generated/api`; do not create handwritten function-reference shims.
- Use `api.customUnit_exports.*` for custom-unit reads and creation, `api.pantry_exports.*` for pantry reads and writes, `api.planner_exports.*` for planner reads and writes, and `api.recipe_exports.*` for recipe reads and creation; do not couple frontend code to nested Convex table modules.
- Intake may use the generated `api.agents.*` surface for Agent orchestration and image-upload functions owned by `convex/agents/`.
- Keep `App.tsx` as the composition root. Feature-specific behavior belongs in its feature, not in the app shell.
- `features/intakeRoute.tsx` uploads captured intake images to Convex storage, starts multimodal ingredient-draft generation with the returned storage ID, and subscribes to the draft ID so scheduled Agent tool writes reach the intake form reactively.
- Preserve the provider order in `index.tsx`: Convex availability must wrap the authenticated application.
- Shared code may depend on a feature only through that feature's documented integration surface.
- `recipeMakingProjection` reports unfulfilled required and substitute measurements already scaled by the requested recipe multiplier.
- Navigation-owned state belongs in Solid Router paths and search parameters; recipe and cart overlays must preserve their owning route in browser history.
- Shared overlays make the application behind them inert, trap focus while open, close on Escape when safe, and restore focus to the invoking control.
- The recipe library keeps recipe imagery prominent, combines search and readiness filters in the URL, uses a responsive image-led stream with a route-owned detail drawer, and lets either a result or its drawer add that recipe to a chosen planner day.

# Work Guidance

- Put reusable domain operations in `primitives/` or an existing shared module only when more than one feature genuinely owns the use case.
- Keep feature-local UI, projections, and interaction state inside the owning feature.
- Keep the six-color enamel presentation, local SVG icons, visible focus treatment, and responsive shell aligned with `docs/design/`.

# Verification

- Run `npm run build` after frontend changes.
- Exercise the affected authenticated flow in the browser when interaction state, focus, pointer/touch drag-and-drop, or modal dismissal changes.

# Child DOX Index

- `auth/AGENTS.md` — Google Identity Services, Convex token delivery, and authenticated UI gating.
- `components/AGENTS.md` — application shell, shared UI primitives, pantry editor, and recipe library.
- `features/AGENTS.md` — feature ownership and integration surfaces.
- `primitives/AGENTS.md` — measurement values, units, conversion, and arithmetic.
