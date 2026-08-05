# Redesign contract

## General current interface outline

The current application has a Google sign-in gate followed by a slim identity header. After sign-in, the product workflows are rendered as one long vertical page in this order:

1. Batch pantry intake
2. Monthly planner
3. Pantry quantity editor
4. Recipe menu

The planner is a desktop month grid with a selected-day detail panel on mobile. Recipe details and shopping carts open in modal dialogs. Most editing happens inline or inside those dialogs. There is currently no primary navigation or route structure separating the four workflows.

## Required behavior

The redesign may replace every visual component, layout, style, label hierarchy, and navigation pattern, but it must keep the following capabilities reachable and understandable:

- Google sign-in, identity feedback, failure messaging, and sign-out.
- Pantry quantity editing and unit conversion.
- Batch pantry intake, add/remove row controls, today's-cart allocation, and the second-step remainder decisions.
- Recipe and ingredient search, ready-only filtering, readiness explanations, substitutes, and empty states.
- Calendar and focused-day planning views.
- Recipe-to-day and recipe-to-recipe drag and drop, including clear drop feedback.
- Day serving counts, per-recipe overrides, and restoring the day default.
- Recipe availability, consumption, substitution, and missing-quantity explanations.
- Adding missing recipe ingredients to a day's shopping cart.
- Day cart progress, bulk draft editing, validation, saving, and unsaved-change protection.
- Pending, success, error, disabled, loading, and empty states at the control or workflow where they matter.
- Pointer, keyboard, mobile, reduced-motion, and visible-focus usability.

## Information-architecture opportunities

These are information-architecture opportunities, not new product features:

- Give Planner, Recipes, Pantry, and Intake distinct destinations with a persistent way to move between them.
- Make the planner the natural home base while keeping shopping and pantry status close at hand.
- Treat the daily meal plan as the bridge between recipe decisions and shopping work.
- Use consistent ingredient, amount, status, and serving vocabulary across every destination.
- Keep dense planning actions compact, but let complex edits open into focused panels or dialogs.
- Make drag-and-drop discoverable without making it the only way to understand the planned order.
