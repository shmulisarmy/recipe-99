# Accessibility and motion

Target WCAG 2.2 AA.

## Structure and navigation

- Include `Skip to main content`.
- Use header, navigation, main, and dialog landmarks.
- Use one `h1` per route and do not skip heading levels.
- Mark the active route with `aria-current="page"`.
- Give each calendar day one focusable date control; keep cell summaries non-interactive.
- Preserve table header/row associations when pantry and intake tables visually reflow on mobile.
- Give every icon-only control an accessible name and, when needed, visible tooltip.

## Focus and targets

- Use a visible 2px enamel focus ring with 2px page/surface offset.
- Focus remains visible above sticky headers and footers.
- Touch targets are at least 44x44px. Desktop controls are at least 32x32px with a 24x24px minimum hit area.
- Hover never reveals the only path to an action; touch/keyboard overflow menus expose the same controls.
- Overlay focus, dismissal, and restoration follow [the surface matrix](overlays-surface-matrix.md).

## Forms and feedback

- Every input has a persistent visible label; placeholders are examples only.
- Use numeric input mode where helpful but validate partial and non-numeric values.
- Associate field errors through `aria-describedby`.
- For multi-row submits, focus the first invalid field and show a summary only when several rows fail.
- Use one polite live region for mutation success and drag-position updates. Reserve assertive announcements for blocking errors.
- Pending controls keep their dimensions and expose `aria-busy="true"`.
- Progress bars expose min, max, current value, and ingredient-specific label.

## Color, type, and responsive access

- Body text meets 4.5:1 contrast; large text and component boundaries meet 3:1.
- Ready/Missing, selected/today, and progress use text or shape in addition to color.
- Nothing essential renders below 11px; mobile status summaries render at 10-11px only because the adjacent accessible date label contains the full summary.
- Support 320 CSS pixels without page-level horizontal scrolling.
- Support 200% zoom and user text enlargement without hiding actions or clipping fields.
- Production self-hosts fonts; fallbacks preserve legibility if font loading fails.

## Motion

Motion is concentrated on selected-day context and overlay entry:

- Day Ticket content change: 140ms opacity transition; the shell remains fixed.
- Drawer/modal: 160ms opacity plus at most 6px translation; exit 120ms.
- Drag lift: 100ms elevation change with no scale required.
- Success check: one 120ms opacity transition.
- No ambient motion, staggered cards, parallax, confetti, bounce, or skeleton shimmer.

Under `prefers-reduced-motion: reduce`, remove translation, smooth scrolling, and pulsing; change selected day and overlay state immediately while preserving focus, pending, target, and success cues.
