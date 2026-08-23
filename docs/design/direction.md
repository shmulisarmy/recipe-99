# Direction

## Concrete subject

Recipe 99 is a working household-kitchen planner for a person arranging meals for themselves, a household, or guests. It is not a recipe magazine, restaurant system, grocery storefront, or general productivity dashboard.

The authenticated application's single job is:

> Turn the food already in the kitchen into a credible day-by-day meal plan and an exact shopping remainder.

The design makes this chain visible:

`pantry on hand -> recipe readiness -> planned order -> day shopping need`

## Experience principles

1. **The day is the bridge.** A selected day connects meals, servings, projected readiness, and shopping.
2. **Quantities are first-class.** Amounts and units align consistently and remain easy to compare.
3. **Readiness is explained.** Ready and Missing always lead to the calculation behind the result.
4. **Dense, not cramped.** Calendar summaries stay compact; full detail appears in the authoritative selected-day surface or a focused overlay.
5. **Direct manipulation has an equal alternative.** Pointer dragging, keyboard movement, and touch movement produce the same outcome.
6. **Household language wins.** Copy uses plain verbs and familiar kitchen terms.

## Visual character

The palette takes its cues from cool enamel cookware and clean household prep surfaces. The experience is calm, sturdy, and practical rather than industrial. Ordinary surfaces are flat, pale, and separated by spacing or light rules. There is no grid-paper background, glass blur, pervasive elevation, decorative gradient, or dashboard-card collage. Curated food photography is limited to the recipe library and recipe-library drawer, where it helps recipes read as distinct choices instead of acting as page decoration.

Typography supplies most of the personality. Atkinson Hyperlegible Next carries the interface. Chivo appears only in the wordmark and major headings. IBM Plex Mono appears only where alignment materially helps dates, order, quantities, and counts.

## Planner signature: calendar into day modal

The Planner's signature is the transition from a scannable current-month calendar into a focused selected-day modal. The closed route keeps the calendar authoritative and pairs it with a compact shopping-list preview for the selected date; choosing a date opens the complete daily plan without replacing or shrinking the calendar beneath it.

The selected-day modal combines:

- selected date;
- number of people;
- the complete ordered meal list;
- each meal's readiness and serving override;
- shopping count and progress;
- the full set of day actions.

Its meal rows use real recipe imagery, rounded bordered containers, and compact readiness labels. On desktop the day is a centered compact dialog; on mobile it becomes a bottom sheet that stops above primary navigation. Recipe and cart routes replace the day modal instead of stacking another surface over it.

The Planner alone may use its reference-derived cool-blue page, cyan action, rounded calendar card, image thumbnails, and pale shopping panel as a route-scoped expression. These tokens do not replace the global enamel palette on Recipes, Pantry, Intake, or the shell.

## Uniqueness check

The direction avoids warm editorial recipe-journal styling, dark neon dashboards, newspaper layouts, and generic KPI cards. Its specificity comes from the real relationship between day order, kitchen quantities, and shopping progress. Planner expression is concentrated in its calendar, shopping preview, and coordinated modal family; unrelated routes stay restrained.
