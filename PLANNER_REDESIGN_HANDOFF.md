# Planner redesign authentication-restoration handoff

Status: **Planner design complete; temporary authentication bypass remains intentionally active.**

Date: 2026-08-23

Branch: `redesign`

## Outcome

The Planner redesign is visually finished against the four committed references in [`design/planner/`](design/planner/). A fresh Impeccable finish reviewer returned `disposition: ship` with no material fixes after reviewing real persisted Convex data in all required states.

The user explicitly authorized a temporary no-sign-in mode so design work could continue despite the browser authentication problem. This handoff now exists to make that security tradeoff and its reversal path unmistakable.

## Final evidence

Saved under `.impeccable/review/`:

- `desktop.png` — closed Planner at 1440×900;
- `mobile.png` and `user-390.png` — closed Planner at 390×844;
- `user-320.png` — narrow calendar and target-size check at 320×700;
- `day.png` — populated route-owned day sheet;
- `recipe.png` — real-data recipe sheet;
- `cart.png` — real-data shopping-cart sheet.

The final correction keeps every desktop calendar week at 104px and every mobile week at 71px, including meal-heavy dates. At 320px the calendar scrolls inside its card while the page itself has no horizontal overflow. Essential Planner metadata is at least 11px.

The reference-only `Plan Meal`, `Auto Shop`, and `Start Cooking` controls remain visible and inert. Recipe statistics use persisted projection values rather than invented prep or cooking times. The four durable destinations—Planner, Recipes, Pantry, and Intake—remain intact.

## Temporary authentication bypass

The isolated bypass is commit `27dad03` (`chore: enable temporary redesign auth bypass`). It changes only:

- [`src/auth/google.tsx`](src/auth/google.tsx)
- [`src/auth/AGENTS.md`](src/auth/AGENTS.md)
- [`convex/auth.ts`](convex/auth.ts)
- [`convex/utils/auth.ts`](convex/utils/auth.ts)
- [`convex/AGENTS.md`](convex/AGENTS.md)

When no identity exists, the server resolves the first stored Planner or Pantry owner and uses that identity through `authenticatedUserId`. This applies to queries, mutations, and actions, so anonymous clients can read and mutate that stored owner's data while the bypass is deployed. It accepts no client-supplied owner ID, but it is still intentionally broad and must not ship to production.

The bypass was deployed only to the personal development deployment `dev:doting-sandpiper-434` (`https://doting-sandpiper-434.convex.cloud`). No production deployment was targeted. The deployment sync also removed the stale local-schema index `planFromDayPointer.by_userId` from that dev deployment.

## Restore authentication

1. Revert `27dad03`, or make the equivalent explicit cleanup: remove `REDESIGN_AUTH_BYPASS`, restore the Google gate, make `authenticatedUserId` throw without identity, remove `singleStoredUserId` and `resolveSingleUserIdForRedesign`, and remove both temporary DOX exceptions.
2. Announce and confirm the Convex target before syncing the restored functions. The current bypass target is the personal dev deployment named above; do not infer production authorization from this handoff.
3. Run `npx convex dev --once`, frontend and Convex TypeScript, `npm run build`, `npm run test:ui`, and `git diff --check`.
4. Verify fresh sign-in, session restoration, failed-token handling, sign-out, and authenticated Planner data in the connected browser.
5. Remove or archive this handoff after the authenticated finish review closes, as required by the root repository contract.

## Verification at design finish

Passed:

```sh
npx tsc --noEmit
npx tsc -p convex/tsconfig.json --noEmit
npm run build
git diff --check
```

`npm run test:ui` currently fails its two sign-in assertions by design: the bypass redirects `/sign-in` to `/planner`, so the expected public sign-in heading is absent. Restore authentication before treating that smoke suite as a release gate.

The single allowed Impeccable detector pass reported only four pre-existing shared-CSS warnings: side-tab borders at `src/index.css:99` and `src/index.css:240`, plus width transitions at `src/index.css:115` and `src/index.css:428`. No new Planner correction rule was flagged.

## Unrelated workspace state

`solid-table/` is unrelated user-owned untracked work. Do not add, move, delete, format, or commit it.

The Captain Cook logo and Recipe 99 naming conflict remains a separate product decision. The Planner finish did not change branding, shell copy, document titles, authentication copy, or PWA assets.
