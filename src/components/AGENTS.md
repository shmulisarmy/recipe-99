# Purpose

Own shared route-level UI and reusable presentation that is not private to one feature.

# Ownership

- `app_shell.tsx` owns responsive navigation, page framing, and the signed-in user menu.
- `ui.tsx` owns shared icons, amount/status presentation, overlays, and confirmation dialogs.
- `inventory_editor.tsx` owns pantry listing, inline measurement editing, custom-unit selection, and pantry mutations.
- `menu.tsx` owns the searchable recipe library, readiness presentation, recipe detail route, and add-to-planner flow.
- `loading_animation.tsx` owns the shared loading indicator used by Intake.

# Local Contracts

- Keep shared overlays accessible: make background content inert, trap focus, close on Escape when safe, and restore focus to the invoking control.
- Keep recipe search and readiness filters in the URL and preserve route ownership for recipe details.
- Use generated top-level Convex aliases for pantry, recipe, planner, and custom-unit operations.
- Shared controls may import a feature-private component only when it is intentionally reusable across those owners; preserve the selected component's value semantics.

# Work Guidance

- Keep feature-specific interaction state in its feature; move UI here only when it is genuinely shared or owns a top-level route.
- Keep visual behavior aligned with `docs/design/` and reusable styles in `src/index.css`.

# Verification

- Run `npm run build`.
- Exercise the affected authenticated route in the browser when navigation, focus, overlays, filtering, or mutation feedback changes.

# Child DOX Index
