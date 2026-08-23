# Routes and responsive layout

## Solid Router map

| Route | Destination and presentation |
| --- | --- |
| `/` | Redirect authenticated users to `/planner` and unauthenticated users to `/sign-in`. |
| `/sign-in` | Google sign-in. Successful authentication enters the planner. |
| `/planner` | Current-month calendar and today's compact shopping preview. |
| `/planner/day/:date` | Selected-day modal over the Planner base surface. `:date` is local-calendar `YYYY-MM-DD`. |
| `/planner/day/:date/recipe/:plannedRecipeId` | Planned-recipe drawer over the Planner base surface; it replaces rather than stacks over the day modal. |
| `/planner/day/:date/cart` | Shopping-cart modal over the Planner base surface; it replaces rather than stacks over the day modal. |
| `/recipes` | Recipe library. Search and ready-only state use `?q=...&ready=1`. |
| `/recipes/:recipeKey` | Recipe-library right drawer; `:recipeKey` is encoded `title@version`. |
| `/pantry` | Pantry ledger and inline amount editing. |
| `/intake` | Batch review workspace. |
| `/intake/reconcile` | Separate second-step reconciliation workspace. Direct entry without a live handoff returns to `/intake` with guidance. |
| `*` | `That page is not in Recipe 99` and `Go to planner`. |

Opening and closing a route-owned overlay updates browser history. Back closes the overlay before leaving its owning destination.

## Primary navigation

Use this fixed order and exact labels:

1. Planner
2. Recipes
3. Pantry
4. Intake

Shopping is reached through a planner day because each cart belongs to a date.

## Shell modes

| Viewport | Shell | Content |
| --- | --- | --- |
| `>= 1100px` | 208px left navigation and 64px identity bar | Maximum 1440px content width with 24px gutters; Planner may expand to 1600px on wide desktop screens. |
| `768-1099px` | 64px top identity bar and horizontal route navigation | 20px gutters; single main column. |
| `< 768px` | 56px top bar and fixed 64px bottom navigation | 16px gutters plus safe-area and bottom-navigation padding. |

The planner's calendar and shopping-list preview sit side by side at 1200px and wider. Below that threshold, the preview follows the full-width calendar. At 200% zoom, allow the layout to enter a smaller mode rather than forcing horizontal page scrolling.

## Wide planner

On desktop viewports around 1600px and wider, Planner uses the available shell width up to 1600px instead of the ordinary 1440px route cap. The calendar receives the larger share of the two-column base layout while the shopping preview remains compact.

```text
┌──────────────┬───────────────────────────────────────────────────────┐
│ Recipe 99    │ Meal Schedule                           Account      │
│ Planner      ├────────────────────────────────────────────────────────┤
│ Recipes      │ ┌──────────────────────────┐ ┌─────────────────────┐ │
│ Pantry       │ │ current-month calendar   │ │ Shopping List       │ │
│ Intake       │ │ up to 3 thumbnails      │ │ first 4 items       │ │
│              │ │ then +n                  │ │ then +n            │ │
│              │ │                          │ │ Start Shopping      │ │
│              │ └──────────────────────────┘ └─────────────────────┘ │
└──────────────┴─────────────────────────────────────────────────────────┘
```

## Mobile planner

```text
┌───────────────────────────┐
│ Recipe 99         Account │
├───────────────────────────┤
│ Meal Schedule  Plan Meal │
│ ┌───────────────────────┐ │
│ │ August 2026           │ │
│ │ S  M  T  W  T  F  S   │ │
│ │    [recipe thumbnails]│ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ Shopping List         │ │
│ │ first 4 items + more  │ │
│ │ Start Shopping        │ │
│ └───────────────────────┘ │
├───────────────────────────┤
│ Planner Recipes Pantry +  │
└───────────────────────────┘
```

Mobile calendar cells are about 71px high and use the same thumbnail language as desktop. At 385px and below, the calendar card owns an internal horizontal scroll area with a 344px calendar minimum; the page itself does not scroll horizontally. The shopping preview follows the calendar. Selecting a date opens a bottom sheet up to 72dvh that clears the fixed navigation; meal names, readiness, touch handles, and all actions live in its internally scrolling body.

Recipes are three columns only when content width supports them, two at intermediate widths, and one on mobile. Pantry remains a ledger that reflows into labeled rows. Intake and reconciliation are separate full-page, single-column workspaces on mobile.
