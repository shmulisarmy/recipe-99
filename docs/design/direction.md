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

## Signature element: selected-day Day Ticket

The one signature element is the selected-day **Day Ticket**. The name describes its role, not a restaurant metaphor: it is the household's compact daily plan.

It combines:

- selected date;
- number of people;
- the complete ordered meal list;
- each meal's readiness and serving override;
- shopping count and progress;
- the full set of day actions.

The surface has softly clipped 8px top corners, one quiet divider below its date, and the design system's only persistent lift shadow. Remove faux perforation, ticket numbering, and other decorative metaphor.

Placement is inline with the calendar only when the current shell leaves enough content width, approximately a 1280px viewport in the current 208px-navigation shell. Below that it follows the calendar. On mobile it appears immediately below the compact month grid.

## Uniqueness check

The direction avoids warm editorial recipe-journal styling, dark neon dashboards, newspaper layouts, and generic KPI cards. Its specificity comes from the real relationship between day order, kitchen quantities, and shopping progress. The Day Ticket is the single expressive shape; every other surface stays restrained.
