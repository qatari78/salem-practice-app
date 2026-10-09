# Fable segment (final reviewer) — 2026-10-09, started 17:58 UTC

Continuing from Astra's handoff ("Next actions" item 5 below) and the Lead's `review/DISPOSITION.md`. The previous segment stopped at commit `37994e7` after an allowance pause; that commit only added the box's pause marker `SALEM-PAUSE-TEST.txt`, left untouched. Astra's record below is kept unchanged; Fable's state is in this section.

## Reviewed version (Fable)

Pilot plan v2 (9 Oct 2026) as transcribed in `review/INPUT.md`; application at staging tip `f96a8a2241fb0b8eabae2b0d4feaeba2c6799f1b` (byte-identical on this branch: `git diff --stat f96a8a2 HEAD -- . ':!review'` lists only the pause marker). Switch commit `4825cc2`, baseline `187b890`. No plan v3 text exists.

## Evidence accessed (Fable)

All review files and retained logs under `review/`; `AGENTS.md`; `server.js`; `public/index.html`; `package.json`; `test/flag.test.js`; `test/version.test.js`; all `e2e/*.spec.js`; `.github/workflows/checks.yml` and `checks/*`; git refs and history; diffs `187b890..4825cc2` (server.js, public/index.html); `187b890:server.js` and `:public/index.html`; history search for marker or rollback commits (none found). One web search on Railway docs (Variables Reference; Deployment Actions): provided variables are available during the build; rollback restores the image and custom variables without rebuilding. Nothing outside the repository read; no hosting, GitHub or staging access.

## Checks run (Fable)

None re-run. Astra's six checks at the same application commit are retained in `review/logs/` (all `EXIT_CODE=0`; unit 50/50; browser 10/10 on phone and desktop). No Fable finding depends on a different check result; the new findings come from code reading (server.js:52 literal-line coupling; /version key set fixed by test/version.test.js:19; rule 4 scope) and from the plan text (production inventory not checked).

## Unresolved questions (Fable)

Astra's ER1–ER8 stand as the Lead answered them: ER1 and ER2 originals do not exist (ids not recorded; bodies not kept); ER3, ER5, ER6 originals not supplied; ER7 and ER8 routed to Salem. None can be settled from this repository; none needs to be, because plan v3 and one recorded drill produce fresh evidence. Open owner decisions: R3, R7, R8, R9 (see `SIGNOFF.md` "For Salem").

## Next actions (Fable)

1. Lead: write plan v3 with the MUST set in `SIGNOFF.md` (explicit on/off and apply operation; whole-drill freeze, window, recovery target, fail-stop; ledger and outside observations; boundary sentence).
2. Lead: card for the build-time release manifest (R2) within AGENTS.md rule 4 (F-new-4); optional `/release` route (F-new-3); Railway build command change is the Lead's.
3. Lead: run the drill once under v3 with the ledger and the Playwright run against the staging URL on both profiles (R5), production inventory before and after (F-new-2).
4. Salem, through the Lead: decide R3, R7, R8, R9.
5. Next reviewer: review plan v3 and the manifest card at their exact commits against the acceptance tests in `SIGNOFF.md`.

## Verdict so far (Fable)

**CHANGES REQUIRED.** MUST findings R1, R2, R4, R5, R6 stand with known, Lead-accepted remedies; R3, R7, R8, R9 are FOR SALEM; F-new-1 to F-new-4 are non-blocking SHOULD items. The code is sound for its purpose; the plan and its evidence are not yet sufficient to call the two levers proven. Full reasoning and the acceptance tests are in `review/SIGNOFF.md`; final dispositions in `review/FINDINGS.md`.

Fable progress:
- [x] Read `CHECKPOINT.md`; identified continuation point.
- [x] Read `FINDINGS.md`, `DISPOSITION.md`, `IMPROVEMENTS.md`, `EVIDENCE.md`, `INPUT.md`.
- [x] Read the originals: `server.js`, `public/index.html`, tests, `checks.yml`, `checks/*`, git log.
- [x] Own judgment on each of Astra's findings and on the Lead's answers; new findings F-new-1..4.
- [x] Wrote `FINDINGS.md` dispositions, `SIGNOFF.md`, this checkpoint. Final answer to follow; if the box stops before it, these three files are the complete record.

---

# Astra segment (first reviewer) — kept unchanged below

# Reviewed version

Pilot plan v2, 9 Oct 2026, as supplied in the review request (sections A–D). Sections A–C are preserved in `review/INPUT.md`; no later plan revision was reviewed.

Repository commit: `f96a8a2241fb0b8eabae2b0d4feaeba2c6799f1b`.
Review card: `review-demo-s7` (inferred from the assigned branch); branch: `card/review-demo-s7`.
Initial working tree: clean. Scope: read-only application review; new records only under `review/`. No commits, pushes, deployment actions, or GitHub API calls authorized or performed.

# Evidence accessed

- `AGENTS.md` — repository rules.
- Repository file inventory, `git status --short --branch`, and `git rev-parse HEAD`.
- The supplied plan, owner objective, Lead report, and originals index. Claims in the report are not independent proof of execution.
- `server.js`, `public/index.html`, `package.json`, `README.md`, `.gitignore`.
- `.github/workflows/checks.yml` and all four files in `.github/workflows/checks/`.
- `test/flag.test.js`, `test/version.test.js`, `e2e/flag.spec.js`.
- `git log --all --decorate --date=iso-strict --format=fuller --stat -25` and `git show-ref --heads`. Local `staging`, `origin/staging`, and the review branch name the same commit; no rebase is needed against the supplied staging ref.
- All other test sources: `test/server.test.js`, `test/notfound.test.js`, `test/robots.test.js`, `test/method.test.js`, `test/head.test.js`, `test/connect.test.js`, `test/connect-abuse.test.js`, `e2e/counter.spec.js`, `e2e/reset.spec.js`, `e2e/total.spec.js`, `e2e/page.spec.js`.
- `package-lock.json` version/resolution entries and installed Playwright output configuration code in `node_modules/playwright/lib/cli/testActions.js`, `lib/common/index.js`, and `lib/runner/index.js`. An initial lookup of older Playwright source paths found no files; the subsequent search located the installed implementation.
- Full reachable git log and switch patch, retained in `review/logs/history.log` and `review/logs/flag-commit.log`; historical `187b890be6e95d4570596b3463c12ae129f02547:server.js` and `:public/index.html`; targeted diff of `4825cc2` against HEAD; non-shallow status; search for rollback/marker history.
- Public primary sources listed with specific technical uncertainties and links in `review/EVIDENCE.md:31`: Railway variables, API variable operations, Git metadata, deployment actions/reference, recovery, retention and pricing. Documentation describes platform behavior; it is not evidence of this account's past operations.
- All review records and full retained check output. No filesystem files outside this repository were read, and no external skill files were opened under that boundary.

# Checks run

Local runtime: Node `v24.21.0`, npm `11.19.0` (workflow selects Node 24).

| Command | Result | Retained output |
| --- | --- | --- |
| `npm ci` | Exit 0; 86 packages installed; npm reports 0 vulnerabilities (not a security audit conclusion) | `review/logs/npm-ci.log` |
| `npx eslint --config .github/workflows/checks/eslint.config.js .` | Exit 0 | `review/logs/lint.log` |
| `npx tsc --project .github/workflows/checks/tsconfig.json` | Exit 0 | `review/logs/types.log` |
| `node --test 'test/**/*.test.js'` | Exit 0; 50 passed, 0 failed | `review/logs/unit.log` |
| `node .github/workflows/checks/build-check.mjs` | Exit 0; app started and `/health` answered | `review/logs/build.log` |
| `npx playwright test --config .github/workflows/checks/playwright.config.js --output=review/.scratch/test-results` | Exit 0; 10 passed, including off-mode clicks on phone and desktop | `review/logs/browser.log` |

All test output was visible through `tee`; the originating command's exit status is retained. Cache and report paths are confined to `review/`; the explicitly authorized `npm ci` also created ignored dependencies in `node_modules/`. All planned checks completed. No browser or extra package installation performed.

Browser execution uses the checked-in tests, projects, retry setting, and timeouts. The only browser invocation changes were output destinations: `--output` for test artifacts, `PLAYWRIGHT_HTML_OUTPUT_DIR` for HTML, and a temporary directory under `review/.scratch/`. npm cache/log paths were also routed there. Installed Playwright source was inspected to confirm output overrides; check definitions were not edited. The workflow's browser installation step was omitted as instructed. These are local pre-checks, not historical GitHub check results or staging observations.

Output disclosure: build/browser logs include permitted app startup port/environment messages and warnings that color-control variables are set; no secret value or environment dump appears in the retained logs.

Final integrity checks: `git diff --check`, `git diff --exit-code` and `git diff --cached --exit-code` returned 0. `git rev-parse HEAD staging origin/staging` returned the reviewed SHA for all three. `git status --short --untracked-files=all` lists only new deliverables under `review/`. Record validation confirmed the single findings table has nine rows with valid ranks/owners and OPEN dispositions, all required checkpoint sections exist, and all six retained check logs end in `EXIT_CODE=0`. No application checks were rerun after the documentation-only work.

# Unresolved questions and evidence requests

Requests are addressed to the Lead for the shared record; no reply is awaited in this job. Provide only permitted non-secret fields, never tokens or complete environment/variable dumps.

1. **ER1 — EVIDENCE REQUEST: historical deployment ledger and operations.** Supply staging project/environment/service identification and deployment IDs with full source SHAs, timestamps/timezones, status, operation type, target/result relationship and retained-image identity for baseline, switch off, switch on, rollback B, forward F and final state. Include the single `FEATURE_TOTAL_TAPS` setting versus observed running state, sanitized SET/DELETE/apply requests and results, queued-deployment events, healthcheck setting, staging-branch before/after SHAs, and production's unchanged deployment inventory. Supply the claimed page-marker source, full commit SHA and precise B/F mapping. The supplied non-shallow history does not identify that marker; this is missing evidence, not proof it never existed.
2. **ER2 — EVIDENCE REQUEST: external proof.** Supply original timestamped HTTP status/headers/bodies for `/health`, `/version` and the page at baseline/off/on/B/F/final, and interaction traces or equivalent assertion records tied to the deployment IDs. Show actual Add/Reset behavior and uncaught errors on staging. Supply the start/end observations supporting each claimed ten-second interval and any measured downtime. If only HTML was observed, mark that limitation and run the missing interactions as new evidence.
3. **ER3 — EVIDENCE REQUEST: prior reviews.** Supply original inputs and complete outputs for `83538e`, `ef0eec`, and `5f5e82`, exact plan/source versions, job settings establishing the claimed model/effort, packet sizes and counting method/cap, and dispositions of every recommendation. These establish what was reviewed and approved, including the attributed Fable comment.
4. **ER4 — EVIDENCE REQUEST: phone acceptance.** Supply the original dated owner message, timezone and surrounding context identifying device, staging URL, intended flow and release. The short reported word alone does not establish off-mode interaction or which artifact was viewed.
5. **ER5 — EVIDENCE REQUEST: checks, merge and checklist.** Supply official job/check records and complete relevant output tied to `4825cc22b1b7e1ccad0dc68be74b6d70633a455c` and the other release SHAs claimed as tested, the original s7-flag card and exact-head review/merge record (including the merge tool revision), and the versioned 13-item checklist linking every PASS to its original evidence. This reviewer cannot retrieve GitHub records through prohibited APIs.
6. **ER6 — EVIDENCE REQUEST: worker-log retention.** Supply the specific worker/logging configuration or source responsible for the alleged final-2,000-character retention, plus a corresponding original full/truncated example and any separately retained command/exit-code artifacts. Neither the alleged truncation nor historical check execution is established by today's repository.
7. **ER7 — EVIDENCE REQUEST: cost.** Supply a sanitized current billing-period summary showing the existing subscription, total shared consumption, remaining included allowance, projected pilot consumption and Salem's approved budget. This is needed to settle the incremental $0 claim, not to change a plan or buy anything.
8. **ER8 — EVIDENCE REQUEST: owner requirements.** Through the Lead, record Salem's choices for existing-session behavior, activation delay/outage, invalid/missing flag defaults, required recovery horizon, and the future gate for schema/data compatibility. The existing dummy switch remains unchanged; the review does not make these choices for him.

# Next actions

1. Reviewer handoff ready: code/history inspection, local checks, claim assessment, findings, replacement plan and final integrity checks are complete. No further authorized application work remains in this review.
2. Lead: attach the requested originals, correct unsupported PASS labels, and reconcile the claim table in `EVIDENCE.md`. Preserve distinctions between historical proof and any new run.
3. Lead: take Salem-owned decisions R3/R7/R8/R9 through the normal owner channel. Do not interpret proposed text as approval to change his items.
4. Lead/builder: turn accepted identity/runbook changes into scoped cards with new test files; keep frozen tests/checks intact. Prepare two compatible releases and execute the revised staging drill after preflight.
5. Next reviewer: review the changed plan and exact releases against the new evidence, then update dispositions. All nine findings remain OPEN until their remedies or required evidence are assessed.

# Verdict so far

**INSUFFICIENT EVIDENCE.** The simple switch design is supported locally, and all local checks passed. Material historical claims lack originals, so the reported all-PASS closure is not accepted. Seven MUST findings also identify evidence/process/design corrections; one SHOULD finding and one QUESTION delimit production reuse. The nine deduplicated findings are in `FINDINGS.md`; pasteable proposed plan text is in `IMPROVEMENTS.md`.

## Handoff note

Environment output in retained files: permitted app port/environment startup messages and color-variable SET warnings; no secret values or environment dump observed.

Card: `review-demo-s7` (branch-derived; no separate card file supplied). Branch: `card/review-demo-s7`. Final reviewed commit: `f96a8a2241fb0b8eabae2b0d4feaeba2c6799f1b`; no review commit created, as the box is responsible for committing/pushing these files. Supplied staging refs already match; no rebase is needed against them.

Files: new review findings, checkpoint, improvements, supplied-input transcription, evidence/claim matrix, `.gitignore` for scratch output, and full check/history logs under `review/`. Existing application, tests, workflow and dependency manifests were not edited. The permitted `npm ci` populated ignored dependencies; scratch outputs are ignored under `review/.scratch/`.

Verification: lint/types/build exit 0, unit 50/50, browser 10/10 across phone and desktop. Full command records above. Historical CI/staging observations and private records remain unverified. No hosted action, push, commit, or owner-item change was performed. No external skill files were read because the job restricts filesystem access to this repository.

Not done: implementation of the proposed improvements, deployment rerun, retrieval of missing private originals, and owner decisions. Those are separate follow-up work; the review itself records every material finding found in the accessible evidence.

Lesson: prove release identity, effective configuration and browser behavior together; a passing local suite cannot establish historical deployment recovery.
