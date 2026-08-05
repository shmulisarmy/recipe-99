# Routes and responsive layout

## Solid Router map

| Route | Destination and presentation |
| --- | --- |
| `/` | Redirect authenticated users to `/planner` and unauthenticated users to `/sign-in`. |
| `/sign-in` | Google sign-in. Successful authentication enters the planner. |
| `/planner` | Current-month planner with today selected in the UI. |
| `/planner/day/:date` | Planner with the selected date reflected in the Day Ticket. `:date` is local-calendar `YYYY-MM-DD`. |
| `/planner/day/:date/recipe/:plannedRecipeId` | Planned-recipe right drawer over the selected planner day. |
| `/planner/day/:date/cart` | Centered shopping-cart modal over the selected planner day. |
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
| `>= 1100px` | 208px left navigation and 64px identity bar | Maximum 1440px content width with 24px gutters. |
| `768-1099px` | 64px top identity bar and horizontal route navigation | 20px gutters; single main column. |
| `< 768px` | 56px top bar and fixed 64px bottom navigation | 16px gutters plus safe-area and bottom-navigation padding. |

The planner's calendar and 320px Day Ticket sit side by side only when the viewport is approximately 1280px or wider. Between 768px and that threshold, the Day Ticket follows the full-width calendar. At 200% zoom, allow the layout to enter a smaller mode rather than forcing horizontal page scrolling.

## Wide planner

```text
┌──────────────┬──────────────────────────────────────────────────────┐
│ Recipe 99    │ August 2026                            Account      │
│ Planner      ├──────────────────────────────────────────────────────┤
│ Recipes      │ ┌──────────────────────────┐ ┌─────────────────────┐ │
│ Pantry       │ │ current-month calendar   │ │ Wed, Aug 5         │ │
│ Intake       │ │ max 2 meals per day      │ │ People 3           │ │
│              │ │ then +n                  │ │ all 5 meals        │ │
│              │ │                          │ │ readiness + cart   │ │
│              │ └──────────────────────────┘ └─────────────────────┘ │
└──────────────┴──────────────────────────────────────────────────────┘
```

## Mobile planner

```text
┌───────────────────────────┐
│ Recipe 99         Account │
├───────────────────────────┤
│ August 2026               │
│ S  M  T  W  T  F  S       │
│       3  4 [5] 6  7       │
│       check 2 warn 1 +2   │
│                           │
│ ┌───────────────────────┐ │
│ │ Wed, Aug 5  People 3  │ │
│ │ all meals + actions   │ │
│ │ shopping progress     │ │
│ └───────────────────────┘ │
├───────────────────────────┤
│ Planner Recipes Pantry +  │
└───────────────────────────┘
```

Mobile calendar cells are at least 52px high and remain within seven equal columns. They show a day number plus compact shape-and-count summaries such as check `2`, warning `1`, and `+2`; color is supplementary. Meal names and all actions live in the Day Ticket.

Recipes are three columns only when content width supports them, two at intermediate widths, and one on mobile. Pantry remains a ledger that reflows into labeled rows. Intake and reconciliation are separate full-page, single-column workspaces on mobile.
