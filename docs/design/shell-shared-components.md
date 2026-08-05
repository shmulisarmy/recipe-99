# Shell and shared components

## Authenticated shell

- `AppShell`: responsive shell, route outlet, and safe-area padding.
- `PrimaryNav`: Planner, Recipes, Pantry, Intake; active route uses enamel text, a left marker on desktop, and `aria-current="page"`.
- `TopBar`: compact route context and account control; no duplicate page title.
- `IdentityMenu`: avatar or initials, visible identity on wide screens, and `Sign out`.
- `PageHeader`: one route heading, one supporting sentence when it adds information, and at most one primary action.

Avoid repeated eyebrow, breadcrumb, title, and support labels that say the same thing. A page should usually need only its title and one concise sentence.

## Sign-in

Above 900px, use two columns: the product thesis and a quiet sign-in panel. Below it, use one column.

- heading: `Plan meals from what’s already in your kitchen.`
- support: `Recipe 99 connects your pantry, recipes, calendar, and shopping needs.`
- preserve Google's rendered `Sign in with Google` control.
- loading: reserve the button area and show `Loading Google sign-in…`.
- missing configuration: `Google sign-in is not configured for this app.`
- load failure: `Google sign-in could not load. Check your connection and try again.` plus `Try again`.
- authentication pending: `Signing in…` adjacent to the control.
- authentication failure: keep sign-in available and focus the error notice.
- sign-out returns to `/sign-in` and removes authenticated content immediately.

## Shared primitives

- `Button`: primary, secondary, quiet, and destructive; stable width while pending.
- `IconButton`: local SVG, accessible name, and at least 44px touch target.
- `StatusText`: check/warning icon plus Ready, Missing, Checking, Saved, or Error. It is not a decorative pill.
- `Amount`: tabular amount and unit with stable alignment.
- `MeasurementEditor`: visible Amount and Unit labels with the four supported units.
- `InlineFieldError`: adjacent and programmatically associated.
- `InlineNotice`: local success, error, or neutral message.
- `ToastRegion`: non-critical confirmations only; initiating controls still own pending and failure states.
- `Skeleton`: matches rows or calendar areas without shimmer under reduced motion.
- `EmptyState`: heading, one explanatory sentence, and at most one relevant action.
- `ConfirmDialog`: alert-dialog semantics for destructive or unsaved-draft decisions.

## Data and mutation states

Every query-backed destination shows:

1. **Loading:** geometry-matched skeleton and plain label such as `Checking your pantry…`.
2. **Loaded:** actual data, including legitimate empty data.
3. **Error:** a local message naming what failed plus `Try again`.
4. **Refreshing:** keep usable content visible and add a quiet updating indicator.

Each mutation is scoped to the initiating row, button, or overlay. Disable duplicate submission while pending, retain drafts after failure, and keep unrelated controls available.

## Copy conventions

Use active, consistent verbs: `Save changes`, `Move meal`, `Add to pantry`, `Finish reconciliation`, and `Add missing ingredients to cart`. Failure copy says what did not happen and how to recover. Empty copy directs the next relevant action.
