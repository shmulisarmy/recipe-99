# Purpose

Own the SolidJS browser application and the frontend side of the Convex boundary.

# Ownership

- `index.tsx`, `App.tsx`, and `convex_client.ts` compose providers, authentication, queries, and top-level screens.
- `auth/` owns the Google authentication gate.
- `components/` owns app-wide inventory and menu UI that is not feature-private.
- `data.ts`, `logic.ts`, `math.ts`, and `utils/` own shared client data helpers and calculations.
- `features/` owns self-contained product workflows; `primitives/` owns cross-cutting domain values.

# Local Contracts

- Use SolidJS signals, stores, and control-flow components for reactive state; do not introduce a second UI state system.
- Call Convex through `convex-solidjs` and `convex/_generated/api`; do not create handwritten function-reference shims.
- Keep `App.tsx` as the composition root. Feature-specific behavior belongs in its feature, not in the app shell.
- Preserve the provider order in `index.tsx`: Convex availability must wrap the authenticated application.
- Shared code may depend on a feature only through that feature's documented integration surface.

# Work Guidance

- Put reusable domain operations in `primitives/` or an existing shared module only when more than one feature genuinely owns the use case.
- Keep feature-local UI, projections, and interaction state inside the owning feature.

# Verification

- Run `npm run build` after frontend changes.
- Exercise the affected authenticated flow in the browser when interaction state, focus, drag-and-drop, or modal dismissal changes.

# Child DOX Index

- `features/AGENTS.md` — feature ownership and integration surfaces.
- `primitives/AGENTS.md` — measurement values, units, conversion, and arithmetic.
