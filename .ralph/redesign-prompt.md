# Recipe 99 autonomous redesign iteration

You are one fresh iteration in an incremental UI/UX redesign of an existing working SolidJS + Convex application.

## Reconstruct context first

From the repository root, read in this order:

1. `AGENTS.md` and every nearer `AGENTS.md` governing files you may touch.
2. `PRODUCT.md`.
3. `FUNCTIONAL_INVARIANTS.md`.
4. `DESIGN.md` and the relevant deeper documents under `docs/design/`.
5. `REDESIGN_PROGRESS.md`.
6. Recent `git log --oneline --decorate -20` and the current clean/dirty git state.

Load and follow the repo-local Impeccable skill for design work. Run its session context command once. Use its relevant critique, adapt, audit, layout, polish, or harden playbook when it fits the iteration. Do not replace the established visual world.

## Inspect the actual application

Run the app and inspect the rendered current state before choosing work. Prefer the connected authenticated Chrome session. Before any browser action, locate and read the complete installed Chrome skill at `/Users/shmuli/.codex/plugins/cache/openai-bundled/chrome/*/skills/control-chrome/SKILL.md`. Follow its Browser setup exactly: initialize its absolute `scripts/browser-client.mjs` through the Node REPL, select `agent.browsers.get("chrome")`, emit and read Chrome's complete documentation, then claim a current `localhost:3000` tab. This bridge—not a remote-debugging port—is how fresh Codex CLI contexts reach the authenticated browser.

Do not inspect or copy Chrome profiles, cookies, local storage, passwords, session files, or browser databases. Do not use AppleScript, screen-coordinate clicking, or standalone Playwright as a substitute for an available connected Chrome bridge. If Chrome setup fails, follow the skill's documented troubleshooting once before falling back. Use the clean in-app browser or installed Playwright setup for public/unauthenticated surfaces and mechanical checks. Test at desktop and mobile viewports, inspect console errors, and capture screenshots under `.impeccable/review/`.

Do not treat source inspection, a build, an unauthenticated sign-in screen, or a stale screenshot as proof of an authenticated feature's visual state. If authenticated browser access is unavailable, do not commit an authenticated UI change that you cannot render and inspect.

## Choose exactly one coherent iteration

Select the single highest-value unresolved UI/UX improvement in this order:

1. broken or confusing flows;
2. information architecture;
3. hierarchy;
4. major layout and responsive failures;
5. interaction clarity;
6. component consistency;
7. accessibility;
8. typography, spacing, and decorative polish.

Re-check the current app rather than trusting the previous ranking blindly. Do not invent product features. Do not hide or remove behavior because it is hard to present.

## Implement within the boundary

- Preserve every relevant item in `FUNCTIONAL_INVARIANTS.md`.
- Do not change backend behavior, domain logic, persistence, API contracts, data semantics, measurement arithmetic, or authentication unless strictly necessary to preserve behavior after a presentation refactor.
- Keep changes incremental and local to one coherent improvement.
- Preserve unrelated user work in a dirty tree.
- Use existing SolidJS state and generated Convex APIs.
- Perform the required DOX pass after meaningful changes.

## Verify and critique

After implementation:

1. Run applicable tests and `npm run build`.
2. Exercise the affected flow in the rendered application.
3. Check browser console errors.
4. Capture desktop and mobile screenshots.
5. Compare the result against `DESIGN.md` and the baseline/problem statement.
6. Run Impeccable's deterministic detector on changed UI targets.
7. Use the shipped fresh Impeccable finish reviewer when its playbook directs it.
8. Hostile-review the result: what is confusing, amateur, generic, overdesigned, underdesigned, slower than before, or worse at the core job?

If the result is worse or functionality regressed, fix or revert it before persisting the iteration. Never self-approve from code intent alone.

## Persist one successful checkpoint

For a successful iteration:

- Update `REDESIGN_PROGRESS.md` with the completed improvement, verification evidence, remaining problems, decisions, and the next highest-value opportunities.
- Update `DESIGN.md`, `FUNCTIONAL_INVARIANTS.md`, or the nearest `AGENTS.md` only when durable truth changed.
- Commit the iteration with a clear focused message. Do not include unrelated changes.
- Exit after the commit so the next iteration starts in a fresh context.

If no safe meaningful improvement can be completed and visually verified, document a new exact blocker in `REDESIGN_PROGRESS.md` and exit without pretending the iteration succeeded. Do not repeatedly append the same known blocker on consecutive iterations.

## Completion

Continue normal iterations while meaningful improvements remain. Only when all stopping criteria in the user's redesign brief are met and several consecutive fresh critiques find no worthwhile change, create `REDESIGN_COMPLETE.md`, update `REDESIGN_PROGRESS.md`, commit those files, then create an untracked root `stop.md` so Ralph exits before the next iteration.
