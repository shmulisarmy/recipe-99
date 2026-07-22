# Purpose

Repository-wide development instructions for Recipe-99.

# Ownership

This file owns project-wide conventions. More specific subtree rules live in child `AGENTS.md` files.

# Local Contracts

- Follow the nearest child `AGENTS.md` without weakening this root contract.

# Work Guidance

# Verification

- Run `npm run build` after application code changes.

# Child DOX Index
- a feature (a folder withing `src/features`) should not import from another feature unless it is part of that features 'public API' (which means that the functionality is exported from that features 'outside_feature_exports.ts' file).