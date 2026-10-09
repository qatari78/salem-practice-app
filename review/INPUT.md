# Supplied material

Sections A–C below are transcribed from the review request. This preserves the reviewed proposal and the Lead's assertions; it is not independent evidence that the reported operations occurred. The requested verdict concerns this plan and the evidence available at repository commit `f96a8a2241fb0b8eabae2b0d4feaeba2c6799f1b`.

## A. The proposal

# Pilot plan v2 — feature switch and staging rollback (setup step 7, checklist item 5)

v2 (9 Oct 2026): Astra review 20261009-83538e (CHANGES REQUIRED) — both must-fix and both should-fix taken.

Owner: the Lead. Practice app only (qatari78/salem-practice-app, Railway project salem-practice). No real users, no money, no customer data.

## Goal
Prove two safety levers before any real project:
1. A feature switch turns the dummy feature ("Total taps" line) off on staging without a code change, and back on.
2. Staging rolls back to the previous version and comes forward again.

## Steps
1. Card s7-flag (builder Sol, high; reviewer Sonnet, high): server.js reads `FEATURE_TOTAL_TAPS` at start-up (default on; only the exact value `off` turns it off). When off, the page is served without the "Total taps" line (the element is not in the HTML). public/index.html: the script must work when the line is absent (no error on Add or Reset; the counter still works). Tests: unit test for on and off (test/flag.test.js); a browser test e2e/flag.spec.js that starts its own server with FEATURE_TOTAL_TAPS=off on a free port and checks, on both configured screens: the line is absent, Add and Reset work, and the page raises no uncaught error. Existing browser tests unchanged (default on). Files: server.js, public/index.html, test/flag.test.js, e2e/flag.spec.js. [v2: Astra must-fix 1 and 2]
2. Merge as usual: checks green, review of the exact head, merge-card.cjs.
3. Switch proof: set `FEATURE_TOTAL_TAPS=off` on the Railway staging service (variable change → Railway redeploys the same commit). Check: /version shows the same commit; the page has no "Total taps" line; counter works. Set it back to `on` (delete the variable) and check the line is back.
4. Rollback proof: first record the deployment ids and their commits: B = the deployment before the s7-flag merge, F = the s7-flag deployment. Roll staging back to B; check /version shows B's commit. Then roll forward to F (by its recorded id); check /version shows F's commit AND the page again shows the "Total taps" line and the counter works. The staging branch on GitHub is not moved during the rollback. [v2: Astra should-fix 1 and 2]

## Acceptance
- Each check above observed from outside (HTTP on the staging URL), times recorded.
- Production is not touched (it has no domain and no deploys in this pilot).
- Nothing left switched off or rolled back at the end.

## Risks
- A push to staging during the rollback window redeploys the latest commit and ends the rollback early — no cards run during step 4.
- Railway variable changes redeploy the service; staging is briefly unavailable (~1 min).
- The switch is read at start-up only: flipping it needs a redeploy, not a live toggle. Accepted for the pilot.

## Cost
$0 cash (subscriptions; Railway usage within the Pro plan).

## B. The owner's objective (from the App-Building Plan v1.2)

The practice app is the permanent proving ground: every safety lever a real project will rely on is proven here first. Real projects will have paying customers, customer data and a monthly cost. Reviews must give Salem stronger designs, fewer avoidable mistakes, sound security and realistic operating costs. The two levers above will be relied on in production: "switch a feature off without a code change" and "roll back and come forward again".

## C. The Lead's report on the executed pilot (claims to verify; 9 Oct 2026)

- Item 3 "Staging deploys; Salem clicks through on phone": PASS — staging 4825cc2; Salem wrote "Clicked" at 1:37 PM.
- Item 10 "Astra reviews pilot plan at max, capped packet": PASS — Astra 83538e CHANGES REQUIRED (real bug) → plan v2 → recheck ef0eec APPROVE; packet 5.6k chars, cap 12k.
- Item 10b "Fable signs off the plan after Astra": PASS — Fable 5f5e82 max, packet 7.4k: APPROVE, 0 must-fix, 3 should-fix.
- Item 11 "Feature switch off; staging rolls back": PASS — off/on each a new deployment; rollback B in 10 s, forward F in 10 s (page marker).
- Finding 1: Railway variableDelete does not redeploy → to flip a switch, SET a value (on/off), never delete.
- Finding 2: Railway rollback restores the old deployment's variables → after a rollback the service settings and the running app can disagree; re-set the switch after any rollback.
- Finding 3: /version shows "local" on rollback deployments (Railway sets no RAILWAY_GIT_COMMIT_SHA there) → real apps need a build-time version stamp.
- Finding 4: review jobs' logs keep only the last 2,000 chars of the worker stream, so a reviewer's claim "I ran the checks" cannot be verified from the record.
- Finding 6: Fable's should-fix (c): "counter works" on staging with the switch off was checked only by the Add button being present in the raw HTML, never clicked; clicking in off mode was proven only by the CI browser test. The Lead's line "the counter still works" overstated it.
- Closed: "Step 7 CLOSED 9 Oct 2026, 1:37 PM: all 13 items PASS."
