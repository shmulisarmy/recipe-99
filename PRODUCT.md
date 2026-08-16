# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recipe 99 is for a person planning meals for themselves, a household, or guests. They use it while moving between pantry inventory, recipe choice, a dated meal plan, and shopping. Their job is to make a credible plan without manually recalculating ingredient quantities after every change.

## Product Purpose

Recipe 99 connects four everyday questions:

1. What food is already in the kitchen?
2. What recipes can be made from it?
3. What will be eaten on each day, and for how many people?
4. What still needs to be bought for that day?

Success means the user can keep inventory accurate, choose feasible recipes, arrange meals in date and meal order, and maintain day-specific shopping needs with quantities that stay consistent across the system.

## Positioning

Recipe 99 is not a recipe magazine or a generic calendar. Its distinctive mechanism is a chronological pantry projection: each day's outstanding shopping is added before that day's meals, planned recipes then consume projected inventory in order, and readiness reflects the resulting future state rather than only today's pantry snapshot.

## Operating Context

The core loop is:

1. Capture or correct pantry quantities.
2. Find recipes that are ready, or inspect exactly what is missing.
3. Add recipes to dated plans and set day or meal-specific serving amounts.
4. Arrange meal order when sequence changes ingredient availability.
5. Add missing quantities to the appropriate day's shopping cart.
6. Record acquired ingredients and reconcile any remaining shopping need.

The product is a responsive authenticated web application used on desktop and mobile. Receipt intake is camera-first and may continue with browser OCR and AI-assisted draft generation before the user reviews the resulting ingredients.

## Capabilities and Constraints

- Google authentication gates all personal pantry, recipe, planner, and shopping data.
- Planner, Recipes, Pantry, and Intake are distinct routes in a shared responsive shell.
- Measurements use a serializable amount-and-unit value. Built-in mass units and ingredient-associated custom units must retain their current conversion semantics.
- Planner readiness is chronological, multiplier-aware, substitution-aware, and order-dependent.
- Each shopping cart belongs to one planner date.
- Intake updates the pantry first and reconciles today's shopping remainder as a separate second step.
- SolidJS signals and stores own browser state; Convex owns persistence and authenticated server behavior.
- Frontend code calls generated Convex API references. The redesign must not introduce parallel API or domain models.
- Existing product behavior is governed in detail by `FUNCTIONAL_INVARIANTS.md` and `docs/product/`.

## Brand Commitments

- Product name: Recipe 99.
- Voice: plain, specific household language; active verbs; no marketing hype.
- Existing wordmark: the `99` mark paired with “Recipe 99.”
- Product vocabulary: Pantry, Recipes, Planner, Intake, Day Ticket, Ready, Missing, Amount to make, and shopping cart.

## Evidence on Hand

- Real authenticated pantry, recipe, planner, and shopping data is available through the connected development deployment.
- Curated recipe imagery and local SVG interface icons exist in the application.
- Durable product and design contracts live under `docs/product/` and `docs/design/`.
- Baseline screenshots from the authenticated application live locally under `.impeccable/baseline/`.
- There are no verified testimonials, customer claims, pricing claims, usage metrics, or public launch claims. Future design work must not fabricate them.

## Product Principles

1. The selected day connects meals, servings, readiness, and shopping.
2. Quantities and units are product truth, not decorative metadata.
3. Readiness must be explainable from pantry, shopping, date, order, and amount.
4. Direct manipulation always has an understandable precise alternative.
5. User edits remain reversible until they are deliberately persisted.

## Accessibility & Inclusion

The target is WCAG 2.2 AA. The application must remain usable at 320 CSS pixels, at 200% zoom, with keyboard-only navigation, visible focus, reduced motion, non-color status cues, named controls, and touch targets appropriate to mobile use.
