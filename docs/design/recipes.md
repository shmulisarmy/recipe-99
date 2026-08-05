# Recipes

## Page

- title: `Recipes`;
- support: `See what your pantry can make right now.`;
- search label: `Search recipes or ingredients`;
- ready-only toggle: `Ready to make`;
- count: `{visible} of {total} recipes`.

Search matches recipe title or required ingredient name case-insensitively. Query and toggle state update the URL after 250ms without adding history for every keystroke. Empty parameters are removed.

## Library stream

Use an image-led editorial stream, not elevated dashboard cards. On wide screens, use two columns of flat horizontal bands; each band allocates approximately 42–45% of its width to imagery and the remainder to content. Separate bands with whitespace and a light rule: do not add a card border, card background, or shadow. Below tablet width, use one stacked stream with the image first.

Each recipe contains:

1. a consistently cropped `3:2` image;
2. title with adjacent Ready, Missing, or Checking status;
3. description clamped to three lines on wide screens and two lines on mobile;
4. three compact ingredient rows on wide screens and two on mobile;
5. a quiet `View recipe` link with an action arrow.

Resolve images from the curated title map; recipes without a title match and failed images use a stable chalk-and-enamel recipe placeholder rather than repeating one generic food photograph. Keep readiness beside the title instead of over the crop. Lazy-loaded images reserve their final geometry and never expose broken media. Use Chivo for recipe names at approximately 24–26px, Atkinson for descriptions and controls, and IBM Plex Mono only for quantities and the result count.

Ready does not fill the whole item green. Do not repeat ingredient-level `ready` labels when the whole recipe is Ready. Missing lists at most two missing ingredient names and then `+n more`. While pantry data loads, show `Checking pantry…` without implying failure.

Keep search full width. Place the Ready toggle, result count, updating state when present, and Clear action on one restrained metadata row without an enclosing workbench panel. On 320–430px screens, keep the row compact enough that the first recipe image arrives quickly; permit the count to truncate before wrapping the controls.

Do not animate the result grid, zoom images, or shimmer loading media. Permit only a 140–180ms image fade-in and a 3px arrow translation on the explicit `View recipe` action. Under reduced motion, both changes are immediate.

## Recipe-library detail

Use a right drawer on desktop and full-height mobile drawer. Show full description and groups:

- `You have`, with required and available amounts;
- `Still needed`, with required, available, and missing amounts;
- `Substitutes`, with substitute requirement and availability.

This context has no planner-day actions such as serving override or add-to-cart.

## States

- no recipes: `No recipes are available yet.`;
- no search match: `No recipes match “{query}”.` and `Clear search`;
- ready-only empty: `Nothing is ready with your current pantry.` and `Show all recipes`;
- pantry error: keep recipes visible, show `Couldn’t check pantry`, and offer `Try again`;
- recipe error: `Recipes couldn’t load.` and `Try again`.
