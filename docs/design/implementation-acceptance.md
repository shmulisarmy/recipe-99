# Implementation and acceptance

## SolidJS boundaries

- Add Solid Router and use params/search params for navigation-owned state.
- Keep `App.tsx` as the composition root.
- Use Solid signals and stores for control state, local edits, drag state, and intake drafts; do not add another client state system.
- Reconnect the retained queries, mutations, validation, projection, and interaction handlers rather than recreating product logic in presentation components.
- Keep planner projection calculation independent from local component editing state.
- Preserve planned-recipe stable identities through every movement presentation.
- Respect existing feature integration surfaces and the nearest `AGENTS.md` before application implementation.

Suggested presentation ownership:

```text
app shell and routes
├── authentication and identity
├── shared controls, statuses, and feedback
├── recipes page and detail drawer
├── pantry page and conversion surface
├── intake review page
├── intake reconciliation page
└── planner
    ├── month calendar
    ├── selected-day shopping preview
    ├── selected-day modal
    ├── planned-recipe drawer
    ├── cart modal
    └── move and amount surfaces
```

## Acceptance checklist

- Google sign-in, identity feedback, errors, entry to the planner, and sign-out work.
- Planner, Recipes, Pantry, and Intake are distinct destinations in the responsive shell.
- Browser Back closes route-owned recipe/cart overlays first.
- Current month, leading/trailing dates, today, selection, up to three meal thumbnails, and `+n` remain visible at the appropriate breakpoint; accessible date summaries retain readiness, people, and shopping context.
- The calendar has one date-button focus model; the closed route owns the compact shopping preview and the selected-day modal owns all meal, people, readiness, cart-progress, and movement actions.
- On mobile, calendar thumbnails remain decorative while the accessible date summary covers the same meals and readiness state.
- At 320px, the calendar owns any necessary horizontal overflow inside its card rather than creating page-level scrolling; the selected-day bottom sheet remains above navigation.
- Day and recipe serving amounts validate, persist, show pending/failure, and support day-default restoration.
- Planner readiness explains chronology, consumption, substitutions, and missing quantities at the active amount.
- Missing recipe quantities can be added to the correct day cart with local feedback.
- Pointer dragging supports beginning-of-day, before-meal, and end-of-day placement with clear targets; calendar hover never resizes the grid.
- Touch dragging starts from the mobile selected-day modal and supports the same day and meal targets without exposing recipe names in calendar cells.
- Keyboard lift/drop and explicit Move meal surfaces can perform every pointer move.
- Failed moves restore confirmed order and expose retry.
- Recipe search, ingredient matching, ready-only filter, URL state, result counts, loading, and empty states work.
- Recipe imagery uses consistent responsive crops, a curated title map, a graceful fallback chain, and readable status placement without hiding text functionality.
- Recipe-library detail uses a right drawer on desktop and full-height mobile drawer. Planned-recipe detail uses a right drawer on desktop and a tall bottom sheet between the mobile top bar and navigation.
- Pantry amount replacement remains inline and distinct from quantity-preserving conversion.
- Pantry is flat; Intake and Reconciliation are separate full-page sequential workspaces.
- Batch intake supports edit, add, remove, normalization, duplicate validation, today's-cart allocation, pending/failure, and separate confirmation.
- Reconciliation supports Keep, Move, and Remove for every remaining item.
- Cart editing uses a centered 720-760px transaction modal on desktop and a bottom sheet up to 72dvh above mobile navigation.
- Cart progress is unit-aware; multiple target edits remain local until bulk save.
- Every dismissal path protects dirty cart drafts.
- Inspection and transaction scrims have distinct strengths and no blur.
- All essential copy is at least 11px, with mobile calendar status counts at 10-11px.
- Local SVG icons replace Unicode UI glyphs.
- All routes and overlays pass keyboard-only, visible-focus, screen-reader naming, 320px width, 200% zoom, and reduced-motion checks.
- Visual implementation uses the six-color enamel system and Atkinson-dominant type globally. Planner adds only its scoped cool-blue/cyan reference palette, rounded calendar and shopping cards, recipe thumbnails, and coordinated modal family.
