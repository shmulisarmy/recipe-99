# Purpose

Own the durable product and presentation contracts for Recipe 99, plus static checkpoints used to evaluate the redesign before implementation.

# Ownership

- `product/` defines what the application does and the fixed behavior the redesign must preserve.
- `design/` defines visual direction, navigation presentation, responsive layouts, component states, overlay choices, accessibility, motion, and acceptance criteria.
- `design-examples/` owns disposable standalone HTML/CSS examples and local icons that demonstrate the design without application code or persistence.

# Local Contracts

- Treat `product/README.md` and `design/README.md` as indexes; keep detailed contracts in their focused child documents.
- Keep product behavior separate from presentation decisions. A design revision must not silently add or remove functionality.
- Keep design examples offline-safe, free of application data access, and synchronized with the design specification.
- Split growing documents and styles by durable concern instead of rebuilding a monolith.

# Work Guidance

- Update the relevant index when adding, removing, or renaming a product, design, or example file.
- Remove superseded style guides rather than leaving conflicting visual contracts in place.

# Verification

- Check local Markdown, HTML, CSS, image, and stylesheet references after documentation changes.
- Check standalone HTML structure and CSS syntax after changing design examples.

# Child DOX Index
