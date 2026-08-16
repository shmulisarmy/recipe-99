# Recipe 99 design direction

Recipe 99 is an Operate-mode household kitchen tool. The interface should disappear into planning while making one unusual relationship unmistakable: pantry on hand → recipe readiness → planned order → day shopping need.

Detailed route and component contracts live in `docs/design/`. This file is the durable top-level direction future redesign iterations must read first.

## Design philosophy

- Calm and sturdy, not precious or editorial.
- Dense where comparison matters, spacious where decisions need focus.
- Familiar controls with product-specific information architecture.
- Explain readiness instead of decorating it.
- Give every screen one clear task hierarchy; do not build a collage of equal cards.
- Preserve the real kitchen workflow. Do not invent features to produce a more dramatic interface.

The cultural home is household prep: enamel cookware, a clean counter, an annotated shopping list, and a dated meal plan. Avoid the predictable recipe-blog aesthetic, restaurant metaphors, generic dashboard KPI cards, dark-neon productivity styling, and warm cream/serif “AI lifestyle” presentation.

## Hierarchy and information architecture

The product has four primary destinations in fixed order: Planner, Recipes, Pantry, Intake. Shopping remains attached to a selected planner day because carts are date-owned.

Planner is the home base. Its hierarchy is month → calendar → selected-day Day Ticket → focused meal/cart surface. The Day Ticket is the product's signature component and the bridge between meals, servings, readiness, and shopping.

Recipes prioritizes search and readiness, then an image-led comparison stream. Pantry is a quantity ledger. Intake is a guided capture-and-review flow, not a bare camera or a generic form dashboard. Reconciliation is a separate second step.

## Visual world

Use a restrained light palette derived from cool enamel cookware and clean prep surfaces:

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Page | Chalk | `#F3F6F2` | App background and quiet grouped regions |
| Work surface | Porcelain | `#FFFFFF` | Primary surfaces and overlays |
| Content | Ink | `#182421` | Text, rules by alpha mix, icons |
| Action | Enamel | `#1F5B62` | Primary action, active navigation, focus, selection |
| Ready | Parsley | `#347249` | Ready and success, always with text or shape |
| Missing | Paprika | `#B84632` | Missing, invalid, destructive, always with explicit copy |

Ordinary sections are flat. Separate them with whitespace, rules, or a quiet surface shift. Reserve persistent lift for the Day Ticket; use stronger shadows only for drawers and transactional dialogs. No glass, decorative gradients, glowing borders, nested cards, or status-filled cards.

## Typography

- Atkinson Hyperlegible Next: body copy, labels, controls, rows, and supporting headings.
- Chivo: the wordmark and major route/month headings only.
- IBM Plex Mono: dates, order, measurements, units, and compact counts where alignment helps.
- Use fixed product-UI sizes rather than fluid display scaling. Essential text is at least 11px; body copy is 16/24px; route headings are approximately 30/36px.
- Use sentence case, plain verbs, and tabular numerals. Do not use decorative eyebrows or pervasive uppercase tracking.

## Spacing, density, and layout

Use a `4, 8, 12, 16, 24, 32, 48px` spacing rhythm. Default controls are 40px on desktop and 44px on touch. Ordinary radius is 8px; modal radius is 12px; mobile full-height overlays have no radius.

Desktop uses a 208px left navigation, a 64px identity bar, and content up to 1440px with 24px gutters. Tablet uses top identity plus horizontal primary navigation and a single content column. Mobile uses a 56px top bar, 16px content gutters, and a fixed 64px bottom navigation with safe-area spacing.

Responsive changes are structural. The planner calendar and 320px Day Ticket sit side by side only when space genuinely supports both. On mobile the calendar stays visible and the non-modal Day Ticket sits above—never under—the bottom navigation, with its own scrolling body.

## Component language

- Navigation: quiet by default, enamel for active state, icon plus text where space permits.
- Buttons: primary, secondary, quiet, and destructive share one shape and state vocabulary.
- Status: inline local SVG plus Ready, Missing, Checking, Saved, or Error text; never a decorative pill.
- Amounts: aligned, tabular, and adjacent to their units.
- Tables and ledgers: flat rows separated by rules; reflow into labeled mobile rows without losing header meaning.
- Recipe results: image-led horizontal bands on wide screens and a single stacked stream on mobile; imagery never hides status or actions.
- Overlays: right drawers for inspection, centered modal for cart transactions, compact modal/bottom sheet for movement and amount tasks.
- Empty and error states: name what happened and the next useful action.

## Interaction conventions

- The selected day owns all planner actions. Calendar summaries remain scannable and do not grow on hover.
- Direct manipulation is additive: drag-and-drop, keyboard movement, touch movement, and explicit Move meal all reach the same result.
- Pending and failure state stays at the initiating control or row; unrelated work remains available.
- Search and filters update the URL without creating history on every keystroke.
- Motion conveys state only: roughly 140–180ms for selection and overlay entry, shorter exits, no ambient animation or staggered page loads.
- Under reduced motion, translation and pulsing disappear while focus, pending, target, and success cues remain.

## Accessibility expectations

Target WCAG 2.2 AA. Provide one `h1` per route, semantic landmarks, `aria-current`, visible 2px focus rings, named icon controls, persistent labels, associated field errors, polite mutation announcements, non-color status cues, focus trapping/restoration for overlays, 320px support, and 200% zoom support.

## What should feel prominent

- The selected day and its complete ordered meal plan.
- Recipe readiness and the explanation behind it.
- Measurements, serving amounts, and shopping remainder.
- The next irreversible or persistence-bearing action in a focused flow.

## What should feel quiet

- Shell chrome, identity, helper text, and secondary navigation.
- Decorative food imagery outside the recipe library.
- Counts that support scanning but do not require action.
- Technical implementation details, Agent progress internals, and backend terminology.

## Patterns to remove or replace

- Bare route fragments without page hierarchy or guidance.
- Fixed surfaces that overlap navigation or hide authoritative content.
- Tiny icon-only metadata whose meaning depends on memorization.
- Duplicate labels that repeat route, page title, and section title without adding context.
- Placeholder or implementation copy exposed to users.
- Decorative card containers around every section.
