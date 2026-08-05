# Recipe 99 Product Functionality

## Product purpose

Recipe 99 is a personal meal-planning workspace that connects four everyday questions:

1. What food do I have?
2. What can I make with it?
3. What am I planning to eat on each day?
4. What still needs to be bought?

The application keeps each signed-in person's pantry, recipes, meal plan, serving amounts, and day-specific shopping needs separate. It continuously projects pantry availability forward through the plan, so a recipe's status reflects what earlier planned meals and shopping carts will have consumed or supplied.

## People and primary use case

The primary user is a person planning meals for themselves, a household, or guests. They need to move quickly between inventory, recipe choice, calendar planning, and shopping without manually recalculating quantities.

The core loop is:

1. Record or correct pantry quantities.
2. Find recipes that can be made now, or see exactly what is missing.
3. Arrange recipes on calendar days and set how many people each meal should serve.
4. Add shortfalls to the appropriate day's shopping cart.
5. Record what was acquired and decide what to do with any remaining shopping need.

## Authentication and personal data

- A user signs in with Google before entering the application.
- Pantry, planner, and recipe data are loaded for the authenticated user.
- The signed-in identity is visible, and the user can sign out.
- Authentication failures are surfaced on the sign-in screen.

## Pantry

### View and correct inventory

- The pantry lists each ingredient with its stored amount and unit.
- A user can replace an ingredient's amount.
- A user can convert a stored quantity between grams, kilograms, ounces, and pounds while preserving the represented quantity.
- Invalid negative quantities are rejected.

### Batch pantry intake

- A user can review a batch of ingredients before adding them to the pantry.
- Each row's name, amount, and unit can be edited.
- Rows can be removed, and new ingredients can be added.
- Names are normalized and must be unique within the batch.
- When an incoming ingredient also appears on today's shopping list, the user can choose how much of the acquired amount should count as already obtained.
- Pantry submission and shopping-list reconciliation are two separate confirmation steps.
- After the pantry is updated, the user can decide, per still-needed ingredient, whether to keep the remainder on today's cart, move it to tomorrow's cart, or remove it from today's cart.

## Recipe menu

- The menu lists all recipes.
- Recipes can be searched by recipe title or ingredient name.
- The menu can be filtered to recipes that are currently ready to make.
- Each recipe is classified from the current pantry as ready, missing ingredients, or temporarily unavailable for analysis while pantry data is loading.
- A recipe shows its description, required ingredients already present, missing ingredients and quantities, and available substitutes.
- Result counts and a useful no-results state help the user understand a search or filter.

## Meal planner

### Calendar overview

- The planner presents the current month as a calendar, including the leading and trailing days needed to complete its weeks.
- The current day and selected day are identifiable.
- Each day shows its planned recipes, shopping-cart item count, and number of people eating when that day exists in the plan.
- Recipe status is visible at a glance: the user can distinguish meals that can be made from meals that are missing ingredients.
- On small screens, selecting a date opens a focused day summary beneath the calendar.

### Arrange meals with drag and drop

- A planned recipe can be dragged onto another calendar day, moving it to the beginning of that day.
- A planned recipe can be dragged onto another recipe to place it directly before that recipe.
- Drop targets expose a visible active state.
- Every move preserves the planned recipe's stable identity and persists immediately.

### Serving amounts

- A user can set the number of people eating on a day using a non-negative whole number.
- Every recipe on the day inherits that day amount by default.
- A specific recipe can override the day's amount with its own positive multiplier.
- The recipe can be returned to the day default.
- The active multiplier is visible on a planned recipe when it differs from one.

### Forward-looking availability

- Recipe availability is simulated chronologically across the meal plan.
- Each day's not-yet-obtained shopping items are treated as becoming available before that day's recipes.
- Recipes consume projected pantry quantities in their planned order.
- Required quantities are scaled by the day or recipe-specific multiplier.
- Substitutes are considered when the primary ingredient is insufficient.
- A recipe detail view explains what will be used, what is covered, and what is missing.
- When a recipe cannot be made, the user can add its missing quantities to that planner day's shopping cart.

## Shopping carts

- Each planner day has its own shopping cart.
- The calendar shows how many ingredients are in a day's cart.
- The cart lists the target amount for each ingredient, any amount already obtained, and percentage progress.
- A user can edit one or more target amounts and units as local drafts, then save all edits together.
- Invalid negative or non-numeric amounts are rejected.
- Unsaved cart edits are protected when the user presses Escape; the app asks before discarding them.
- Empty carts clearly state that there is nothing to buy for that day.

## General current interface outline

The current application has a Google sign-in gate followed by a slim identity header. After sign-in, the product workflows are rendered as one long vertical page in this order:

1. Batch pantry intake
2. Monthly planner
3. Pantry quantity editor
4. Recipe menu

The planner is a desktop month grid with a selected-day detail panel on mobile. Recipe details and shopping carts open in modal dialogs. Most editing happens inline or inside those dialogs. There is currently no primary navigation or route structure separating the four workflows.

## Redesign behavior contract

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

## Product opportunities for the redesign

These are information-architecture opportunities, not new backend features:

- Give Planner, Recipes, Pantry, and Intake distinct destinations with a persistent way to move between them.
- Make the planner the natural home base while keeping shopping and pantry status close at hand.
- Treat the daily meal plan as the bridge between recipe decisions and shopping work.
- Use consistent ingredient, amount, status, and serving vocabulary across every destination.
- Keep dense planning actions compact, but let complex edits open into focused panels or dialogs.
- Make drag-and-drop discoverable without making it the only way to understand the planned order.
