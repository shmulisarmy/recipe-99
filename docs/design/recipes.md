# Recipes

## Page

- title: `Recipes`;
- support: `See what your pantry can make right now.`;
- search label: `Search recipes or ingredients`;
- ready-only toggle: `Ready to make`;
- count: `{visible} of {total} recipes`.

Search matches recipe title or required ingredient name case-insensitively. Query and toggle state update the URL after 250ms without adding history for every keystroke. Empty parameters are removed.

## Library rows and cards

Use a flat responsive list/grid, not elevated dashboard cards. Each recipe is separated by a light rule or quiet grouped background and contains:

1. title;
2. inline Ready, Missing, or Checking status;
3. description clamped to three lines only in the library;
4. compact ingredient summary;
5. `View recipe`.

Each recipe begins with a consistently cropped image in a fixed aspect ratio. Resolve images from the curated title map; recipes without a title match and failed images use a stable chalk-and-enamel recipe placeholder rather than repeating one generic food photograph. Keep readiness beside the title instead of over the crop. Lazy-loaded images reserve their final geometry and never expose broken media.

Ready does not fill the whole item green. Missing lists at most two missing ingredient names and then `+n more`. While pantry data loads, show `Checking pantry…` without implying failure.

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
