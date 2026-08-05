# Design tokens

## Palette

Use these six named colors. Rules, hover fills, disabled colors, and status tints are alpha mixes rather than additional palette entries.

| Token | Hex | Use |
| --- | --- | --- |
| `--color-chalk` | `#F3F6F2` | Page background and quiet grouped regions. |
| `--color-porcelain` | `#FFFFFF` | Primary work surfaces and overlays. |
| `--color-ink` | `#182421` | Text and icons. |
| `--color-enamel` | `#1F5B62` | Primary actions, active navigation, selection, and focus. |
| `--color-parsley` | `#347249` | Ready and success. |
| `--color-paprika` | `#B84632` | Missing, invalid, and error. |

Standard rule is ink at 18%; muted text is ink at 68%; hover fill is enamel at 7%; ready and missing fills are used only for local notices, never whole cards.

Color never carries status alone. Ready uses a local check SVG and text; Missing uses a warning SVG and text; errors include explicit copy.

## Typography

Production self-hosts WOFF2 files. Offline examples use deliberate system fallbacks and require no downloads.

| Role | Family | Weight | Use |
| --- | --- | --- | --- |
| Primary | `Atkinson Hyperlegible Next`, fallback `Avenir Next, Segoe UI, Arial, sans-serif` | 400, 600 | All body copy, labels, controls, rows, and small headings. |
| Major | `Chivo`, fallback `Avenir Next, Segoe UI, Arial, sans-serif` | 600-650 | Wordmark, route title, month heading, sign-in thesis only. No condensed fallback. |
| Aligned values | `IBM Plex Mono`, fallback `SFMono-Regular, Consolas, monospace` | 500, 600 | Dates, order, quantities, units, and compact counts only. |

Use `font-variant-numeric: tabular-nums` for all numeric controls and progress values, whether or not they use mono.

| Token | Size / line height | Use |
| --- | --- | --- |
| `--text-xs` | 11 / 16px | Secondary values and dense calendar summaries. Nothing essential is smaller. |
| `--text-sm` | 13 / 19px | Compact rows, statuses, and helper text. |
| `--text-md` | 16 / 24px | Default copy and controls. |
| `--text-lg` | 20 / 27px | Panel and drawer headings. |
| `--text-xl` | 30 / 36px | Route headings. |
| `--text-hero` | 40 / 46px desktop; 32 / 38px mobile | Sign-in thesis only. |

Mobile status summaries are 10-11px. Avoid pervasive uppercase and letter spacing. Use sentence case. Dates may use short title case such as `Wed, Aug 5`; do not style essential labels as tiny uppercase eyebrows.

## Space and controls

- Spacing scale: `4, 8, 12, 16, 24, 32, 48px`.
- Standard control height: 40px desktop, 44px touch.
- Icon controls: 36px desktop, 44px touch.
- Ordinary radius: 8px.
- Dialog radius: 12px desktop; full-height mobile overlays have no radius.
- Statuses are inline icon-and-text labels, not pills.

## Surfaces and elevation

- Ordinary sections are flat and separated by spacing, a 1px rule, or a quiet background shift.
- Recipe cards and pantry rows do not float.
- Do not use blur or translucent glass.
- Inspection drawers use `0 12px 36px rgb(24 36 33 / 0.14)`.
- Transaction modals use `0 18px 52px rgb(24 36 33 / 0.20)`.
- The inline Day Ticket may use `0 4px 18px rgb(24 36 33 / 0.10)` as the one persistent lifted surface.

## Icons

Use local 20px SVG icons with 1.75px stroke, round joins, and `currentColor` in production. Standalone examples reference local SVG files. Do not use Unicode characters as interface icons.

Required icons include calendar, recipes, pantry, intake/add, cart, people, search, check, warning, more, edit, close, and drag/move. Every icon-only button has a visible focus state, accessible name, and tooltip where the meaning is not universal.
