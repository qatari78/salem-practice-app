# Sign-off — Pilot plan v2, feature switch and staging rollback (setup step 7, checklist item 5)

VERDICT: CHANGES REQUIRED

Final reviewer: Fable (claude-fable-5-1), 9 Oct 2026, trial of the expanded review mandate (Lead proposes, Astra reviews, Lead answers, Fable signs off). Judgment formed from the originals read in this repository and the record on the review branch; nothing outside the repository was read. This verdict replaces the earlier Fable approval of the plan text (job 5f5e82, reported in review/INPUT.md:45): that approval preceded execution, and execution showed that steps 3 and 4 could not be run as written (deleting the variable did not redeploy; /version showed `local` on rollback deployments). Those are new facts, so the verdict changes.

## Version signed

- Plan: Pilot plan v2, 9 Oct 2026, written by the Lead, as transcribed in `review/INPUT.md` section A. No v3 text exists yet; the Lead's dispositions (`review/DISPOSITION.md`) say so.
- Application: tip of `staging`, commit `f96a8a2241fb0b8eabae2b0d4feaeba2c6799f1b`. The review branch adds only files under `review/` and the box's pause marker; application, tests and checks are byte-identical to that commit (`git diff --stat f96a8a2 HEAD -- . ':!review'` lists only `SALEM-PAUSE-TEST.txt`).
- Switch commit: `4825cc22b1b7e1ccad0dc68be74b6d70633a455c` (card s7-flag); its parent `187b890be6e95d4570596b3463c12ae129f02547` is the pre-switch baseline B named in the plan.

## Why CHANGES REQUIRED and not APPROVE or INSUFFICIENT EVIDENCE

Five MUST findings stand with known, Lead-accepted remedies (R1, R2, R4, R5, R6). The plan as written cannot be executed to its own acceptance: step 4's identity check needs a source identity that survives rollback and the code has none (R2); step 3's restore step uses deletion, which the Lead's own run showed does not redeploy (R4); step 3's "counter works" was never observed on staging (R5); the drill has no whole-drill freeze, deadline or recovery target (R6); and the ids the plan itself required in step 4 were not recorded and cannot be recovered (R1). The historical "13 PASS" closure is therefore not accepted as proof that the two levers work. The question is not unsettleable: a plan v3 containing the remedies below, run once with records, settles it. That is a known remedy, so the verdict is CHANGES REQUIRED. A new run cannot prove the 9 Oct run; it does not need to, because the objective is the levers, not the date.

The code itself is sound for its purpose. The switch is read once at start-up, only the exact value `off` disables the line, the page script tolerates the missing element, and the unit and browser tests prove it on both configured screens (Astra's run at this commit: unit 50/50, browser 10/10, lint, types and build exit 0; `review/logs/`). No security issue was found in the change.

## Every finding: final disposition

| id | importance | owner | Astra round 1 | Lead round 2 | Fable final | one-line reason |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | MUST | Lead | OPEN | accepted in part; ids unrecoverable | OPEN | Plan step 4 required recording deployment ids; they were not recorded. Remedy: run again under v3 with a ledger. |
| R2 | MUST | builder | OPEN | accepted; card to follow | OPEN | server.js:10 falls back to `local`; step 4's identity check is unsatisfiable on rollback deployments. Remedy: build-time release manifest. |
| R3 | MUST | Salem | OPEN | accepted as design improvement; for Salem | FOR SALEM | 187b890 cannot honour `off`; levers proven separately. Advice: run the combined drill before the first real project. |
| R4 | MUST | Lead | OPEN | accepted, wording modified | OPEN | v2 text says "delete the variable"; the run showed deletion does not redeploy. Remedy: explicit on/off, wait for the deployment, verify. |
| R5 | MUST | Lead | OPEN | accepted | OPEN | Off-mode counter on staging checked by raw HTML only. Remedy: Playwright against the staging URL, both profiles. |
| R6 | MUST | Lead | OPEN | accepted in part | OPEN | No whole-drill freeze, window, recovery target or fail-stop rule in v2. Remedy: add them to v3. |
| R7 | MUST (Fable rates SHOULD) | Salem | OPEN | rejected as MUST for the pilot | FOR SALEM | One-off drill on an already-paid plan; no purchase path. Advice: accept "/bin/bash cash" as "no new purchase"; record the month's Railway usage once. |
| R8 | SHOULD | Salem | OPEN | for Salem; boundary sentence accepted | FOR SALEM | Stateless rollback proves nothing about data. Boundary sentence into v3; synthetic-data rehearsal is Salem's call. |
| R9 | QUESTION | Salem | OPEN | for Salem | FOR SALEM | Restart-based, open tabs unchanged, any value but `off` means on. Keep for the dummy; decide per real feature. |
| F-new-1 | SHOULD | builder | — | — | OPEN (non-blocking) | server.js:52 removes one exact literal line; a reformat of index.html defeats the switch (CI would catch it). |
| F-new-2 | SHOULD | Lead | — | — | OPEN (non-blocking) | "Production is not touched" is asserted, not checked; record production's deployment inventory before and after. |
| F-new-3 | SHOULD | builder | — | — | OPEN (non-blocking) | /version cannot show that a restart happened; expose start time and manifest SHA on a new route, not by changing /version's frozen key set. |
| F-new-4 | SHOULD | Lead | — | — | OPEN (non-blocking) | The R2 card must read only `RAILWAY_GIT_COMMIT_SHA` by name at build time (AGENTS.md rule 4), or the Lead amends rule 4 first. |

## Required changes (the MUST set) before a sign-off can be APPROVE

1. **Plan v3 text** (Lead): step 3 sets `FEATURE_TOTAL_TAPS` explicitly to `off` and then `on`, names the interface (dashboard or API) and the apply/deploy operation, waits for the resulting deployment id, and never deletes (R4). The freeze on other cards and deployment changes covers steps 3 and 4, with a check for queued deployments before starting, a 5-minute window per action, the F_on deployment id as the safe recovery target, and a fail-stop rule: on any failed check, stop the proof and restore F_on (R6). Acceptance requires the ledger and the outside observations below (R1, R5). Add the boundary sentence: this pilot proves the two levers separately on a stateless page (R3, R8; text only).
2. **Code, one card** (builder, Lead writes the card): a release manifest written during the Railway build from `RAILWAY_GIT_COMMIT_SHA` read by name (build fails if empty), read by /version on built deployments, `local` fallback unchanged when the manifest is absent, manifest never present in the source tree or the test workspace, /version's key set unchanged (R2, F-new-4). Railway documents that its provided variables are available during the build and that rollback restores the image without rebuilding ([Variables Reference](https://docs.railway.com/variables/reference), [Deployment Actions](https://docs.railway.com/deployments/deployment-actions)), so a build-time stamp survives rollback; the Lead's observation that the runtime variable is absent on rollback deployments is the reason the stamp must be baked in at build time. The Railway build command change is the Lead's (hosting setting).
3. **One drill under v3, recorded** (Lead): a ledger with, for each action, UTC time, deployment id before and after, full source SHA, the single feature setting as set and as observed, /health and /version status and body, and the browser record; production's deployment inventory before and after (F-new-2). Staging interactions observed by Playwright against the staging URL on both device profiles (R5).

## Remaining non-blocking items

- F-new-1: make the off-mode removal format-independent in a later card.
- F-new-3: expose process start time and manifest SHA on a new route (for example `/release`); keep /version as the frozen test fixes it.
- R6 (part): measure customer-visible availability separately from deployment time; MUST for real projects, SHOULD here.
- R7 advice: record the month's Railway usage figure once in the close-out.
- Astra's evidence requests ER3 (prior review packets), ER5 (check records for the release SHAs) and ER6 (worker-log retention) remain unanswered with originals; they do not block v3 because v3 produces its own records. ER6's remedy (keep the whole worker stream) is the box change the Lead proposed.

## Acceptance tests implementation must carry

Unit (new files under `test/`, existing tests untouched):
- /version returns `commit` equal to the first 7 characters of the manifest SHA when a manifest fixture is present, and `local` when it is absent and `RAILWAY_GIT_COMMIT_SHA` is unset; the response keys stay exactly `version`, `commit`, `env`.
- The manifest writer exits non-zero and writes nothing when `RAILWAY_GIT_COMMIT_SHA` is empty or not a 40-character hex SHA; it writes the full SHA when set (set the variable in the test, never read any other).
- Two fixtures with different manifest SHAs produce different /version answers from the same source tree.
- If `/release` is adopted: it answers JSON with the full SHA and an ISO start time, and `HEAD` and `405` behaviour match the existing routes (test/head.test.js and test/method.test.js patterns, in new files).

Browser (existing `e2e/flag.spec.js` unchanged; staging run uses a separate config outside `.github/workflows/`, `baseURL` set to the staging URL, no `webServer`, both device profiles, retries 0):
- Off state: `total` element count 0 throughout; Add → Add → Reset → Add gives 0 → 2 → 0 → 1; no uncaught page errors (listener registered before navigation).
- On state: `Total taps: 0`, then 2 after two Adds, still 2 after Reset, 3 after the next Add; count 1; no uncaught errors.
- Identity around each browser run: /version body recorded immediately before and after, both equal to the expected release.

Drill acceptance (conjunctive, from `review/IMPROVEMENTS.md` section 6, kept as the required set): reviewed releases with exact-commit green checks AND observed F_on → F_off → F_on without source change AND observed F_on → B_on → F_on AND the identity and browser assertions at each state AND final verified F_on with the service setting `on` and the staging branch unchanged AND production inventory unchanged AND a durable evidence link for each assertion. The combined F_off → B_off → F_off leg is added only if Salem requires it for this pilot (R3).

## For Salem (decisions, not applied by this review)

1. R3: require the combined drill (feature stays off through rollback and return) before the first real project. Advice: yes, /bin/bash, next practice pilot.
2. R7: accept "/bin/bash cash" as "no new purchase" for this pilot; the Lead records the month's Railway usage once. Advice: accept.
3. R8: require a synthetic-data recovery rehearsal in the practice environment before the first project with customer data. Advice: yes.
4. R9: keep the dummy switch semantics (restart-based, open tabs unchanged, only exact `off`) for this pilot; decide per real feature at its first gate. Advice: keep for now.

## What this reviewer checked

Read in full: `review/CHECKPOINT.md`, `FINDINGS.md`, `DISPOSITION.md`, `IMPROVEMENTS.md`, `EVIDENCE.md`, `INPUT.md`, the six retained check logs, `AGENTS.md`, `server.js`, `public/index.html`, `package.json`, `test/flag.test.js`, `test/version.test.js`, all five `e2e/*.spec.js`, `.github/workflows/checks.yml` and the four files under `checks/`. Git: full ref list, the switch commit's stat and the diffs `187b890..4825cc2` for `server.js` and `public/index.html`, `187b890:server.js` and `:public/index.html`, a search of all history for a marker or rollback commit (none), and the diff of application files between `f96a8a2` and the review branch head (none). Checks: not re-run; Astra ran all six at the same application commit and the logs end in exit 0; no finding of mine depends on a different result. Web: one search (Railway docs) to settle whether a build-time stamp is feasible; result above. Nothing on Railway, GitHub or staging was accessed; no hosting state was touched.
