# Agent findings

Working notes for redesign agents: implementation constraints, tooling truths, and queued findings awaiting verified implementation. Move durable conclusions into PRODUCT.md / DESIGN.md / FUNCTIONAL_INVARIANTS.md / REDESIGN_PROGRESS.md.

## Verification access (2026-08-16, Claude Code session)

- The user's signed-in Chrome can be driven via AppleScript for navigation, tab title/URL reads, and window resize — but NOT JavaScript execution ("Allow JavaScript from Apple Events" is off; Chrome ignores synthetic menu clicks to enable it, a real user gesture is required).
- `screencapture` returns only the wallpaper: the terminal lacks macOS Screen Recording permission. No authenticated screenshots until granted.
- The Codex chrome bridge (`browser-client.mjs`) refuses outside the Codex CLI ("requires privileged node_repl capabilities"). Chrome CDP ports are closed; Chrome 136+ blocks CDP on the default profile.
- Claude Code's own Chrome extension is installed (`~/.claude/chrome/chrome-native-host`), but tools require launching `claude --chrome` or the user running `/chrome`.
- The user's Chrome runs with `WebContentsForceDark` — the root cause of dark-looking captures. Never judge palette through that browser.
- Auth is a Google ID token in `sessionStorage` (`recipe-99.google-id-token`) validated by Convex server-side; there is no legitimate headless way to mint one. Do not add dev auth bypasses.
- Local verification scripts live untracked in `.impeccable/`: `solid-warning-check.mjs`, `title-check.mjs`, `signin-states.mjs` (renders the GSI-failure state by blocking `accounts.google.com`), `zoom-check.mjs`.

## Unblock options for authenticated visual verification (any one suffices)

1. User runs `/chrome` in Claude Code (or relaunches with `claude --chrome`).
2. User enables Chrome menu View → Developer → Allow JavaScript from Apple Events.
3. User grants the terminal Screen Recording permission (System Settings → Privacy & Security).

## Authenticated keyboard/AX verification harness (2026-08-16)

System Events accessibility reads against the signed-in Chrome DO work and constitute real rendered verification for structure and keyboard behavior:

- Set `AXEnhancedUserInterface` to true on the Chrome process once, then recursively search the front window for `AXWebArea`; web content (roles, names, labels) is fully exposed.
- `perform action "AXPress"` presses real buttons; `keystroke tab` / `key code 53` (Escape) drive keyboard interaction; `AXFocusedUIElement` reports the focused element's role and accessible name.
- This verified the Pantry conversion popover contract end-to-end (focus-in on open, tab-out light dismiss, Escape + focus restoration) without screenshots or JS.
- Caveats: traversal is slow (bound depth, scope to the web area), the AX tree showed each ledger button twice (DOM renders once — treat as traversal/Chrome artifact, but worth a real screen-reader spot check someday), and there is no color/pixel evidence — this complements, not replaces, visual verification.
- Only press buttons whose action is non-destructive; never AXPress mutation-committing controls during verification.

## Queued accessibility findings (code-level audit, 2026-08-16 — verify rendered before fixing)

Fixed and keyboard-verified 2026-08-16: conversion popover focus-in (Select ref was never attached), popover light dismiss on focus-out, ConfirmDialog focus restoration (code-symmetric with Overlay; not yet rendered — reaching it requires editing a cart draft).

Still queued, in priority order:

1. **Reconcile add-ingredient panel** (`src/features/available_ingredients_bulk_add_form/index.tsx` ~353-444): `role="dialog"` with no focus trap, no `aria-modal`, no focus restoration, no inert management, not Portal-wrapped. High. Unreachable without a real receipt handoff — verify by walking the intake flow when visual access returns.
2. **Select label associations**: `Select.tsx` now forwards a ref but still has no `id`/`aria-describedby` path for field errors (medium; the AX check showed the label nesting DOES expose "Target unit" as the select's name, so severity is lower than the audit guessed).
3. **Cart-row edit announcements** (`planner_modals.tsx` ~721-807): no polite live region for obtained/needed changes during cart editing. Medium.
4. **`aria-current="date"` on today's calendar cell** (planner day cells). Low, cheap.
5. **Drag state announcements for pointer drag** (`recipe_pill.tsx`): keyboard moves announce, pointer drags don't. Low.

Verified-fine by audit: StatusText non-color cues, recipe image alt handling, planner keyboard-move announcements, intake row error focus handling, Overlay primitive (trap/restore/inert/aria-modal all present and now keyboard-verified live).
