# Purpose

Own educational artifacts derived from Recipe 99 work without making them part of the runtime application contract.

# Ownership

- `convex/` owns the Convex migration course, source list, learning records, lessons, reference pages, and shared lesson assets.
- `oauth/` owns the Google OAuth course, notes, source list, lessons, and shared lesson assets.

# Local Contracts

- Treat each topic's `MISSION.md` as its learning objective and `RESOURCES.md` as its source register.
- Keep lessons and reference pages self-contained static HTML that use only assets within their topic directory.
- Do not infer current application behavior from a historical lesson; the active contracts live in the root, `src/`, `convex/`, and `docs/` DOX hierarchy.

# Work Guidance

- Update a topic's source register and learning records when adding claims or durable lessons.

# Verification

- Check local links and asset references in changed Markdown and HTML files.

# Child DOX Index
