# Purpose

Keep application features isolated behind explicit public APIs.

# Ownership

Each direct child directory is a self-contained feature that owns its internal logic and components.

# Local Contracts

- Every feature must contain an `outside_feature_exports.ts` file.
- Code outside a feature must import from that file instead of importing the feature's internal files directly.
- Export only the functionality that the feature intentionally exposes to the rest of the application.

# Work Guidance

- Add public exports to `outside_feature_exports.ts` as the feature's external API evolves.

# Verification

- Run `npm run build` after changing feature exports or their consumers.

# Child DOX Index

- `available_ingredients_bulk_add_form/AGENTS.md` — bulk pantry intake and shopping-cart draft handoff.
