# AGENTS.md — rules for every agent working in this repository

This is Salem AI's practice app: one counter page, the permanent proving ground for the app-building setup (plan v1.2). No real users, no customer data, no money.

## Who you are here
- You work one card at a time, given to you by the Lead. The card file is your contract: do what it says, nothing more.
- You never talk to Salem, and you never change Salem's items (flows, screens, features, technology, monthly cost, customer data). If the card seems to need one, stop and write the question in your handoff note.

## Branches
- Work only on your card branch: `card/<card-id>`. Branch it from the current tip of `staging`.
- Never push to `staging` or `main`, never merge, never force-push or delete any branch other than your own card branch. Only the Lead merges.
- Before you hand over, bring your branch up to date with `staging` (rebase), so the Lead can move `staging` to your exact commit.

## The checks are the verdict
- Every push runs the checks on GitHub: lint, types, unit tests, build, browser tests on a phone and a desktop screen. Your own "tests pass" is only a pre-check.
- The checks live in `.github/workflows/` (including `checks/` for their configuration). Builder keys cannot change them. Do not try; do not work around them (no disabling rules inline, no skipped or `.only` tests, no lowered timeouts or retries).
- Add tests for what you build: unit tests in `test/`, browser tests in `e2e/`. Do not weaken or delete an existing test; if one is wrong, say so in the handoff note.

## Commands
- Install: `npm ci`
- Unit tests: `node --test 'test/**/*.test.js'`
- Run locally: `npm start` (port from `PORT`, default 3000; `/health` answers `{ ok: true }`)
- Lint, types, browser tests: see `.github/workflows/checks.yml` for the exact commands.

## Never
- Paid API keys or paid routes; secrets in code, logs or commits.
- New dependencies without the card saying so.
- Work outside this repository.

## Handoff note (end of every attempt)
Card id, branch and final commit, what changed (files), test results, anything not done, any question about Salem's items, and one lesson line.
