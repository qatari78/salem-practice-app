# Replacement plan text

The Lead can paste the following as a revised pilot plan. It proposes work; this review has not changed the application, its checks, hosting, or owner decisions. R3, R7, R8 and R9 remain Salem-owned. Existing historical claims retain their own evidence requirements even if a new drill succeeds.

## Goal and boundaries

Prove, on the practice app's staging service, a restart-based presentation switch and an application release rollback/return procedure. Keep the existing Node/Railway setup and dependencies. Do not add a flag service, database, or user-visible marker for this drill.

The dummy switch retains its current contract: only exact `FEATURE_TOTAL_TAPS=off` removes Total taps from newly served HTML; Add and Reset keep working. A settings change takes effect only after an observed deployment and a new page load. An already-open tab retains its DOM and code. This is not a promise of immediate revocation in existing sessions.

This drill proves application code/configuration recovery for a stateless counter. It does not prove reversal of customer writes, migrations, payments, external effects, or data restoration. Before a real project depends on those properties, Salem approves the intended behavior and the practice app rehearses the relevant failure/recovery path using synthetic data.

## 1. Preserve existing code evidence and establish durable identity

Keep the current switch implementation and its tests. Its nine startup-value cases and off-mode browser flow are useful regression coverage. Add any new tests in new files; never rewrite the frozen tests or change check definitions to accommodate a result.

Add a release manifest inside each built application artifact. Generate it once from the verified source SHA during the release build, using the existing allowed Git metadata or the checked-out commit as appropriate to that build. The release build must fail if it cannot establish the source identity. Never generate or replace the identity at server startup or during rollback.

Have `/version` use that manifest's source identity on built deployments. Preserve its existing JSON keys; source-only local runs keep their documented local fallback. Retain the full SHA in the release evidence. Do not manually assign runtime Git metadata to make a rollback appear correct. Build-generated files must not contaminate the source-only test workspace.

New tests should run the packaged app from an isolated fixture/artifact and show that its identity remains correct when runtime Git metadata is absent or conflicting. Also check that two distinct release artifacts identify their respective sources. Existing local tests must remain unchanged and pass. The Lead owns any hosting build-command change; builders must not edit `.github/workflows/`. No additional dependency is required.

Use two reviewed releases, B and F, that both contain the manifest and compatible switch behavior. Their source identities must differ. The pre-switch release `187b890…` can serve as a historical code-rollback example, but cannot establish that off survives rollback. Do not silently relabel historical deployments as the new B/F.

## 2. Prepare the drill and recovery targets

Assign a new run ID. Record the exact staging project, environment, service, URL, branch SHA, and UTC start time. Verify that the chosen control-plane operation targets that environment/service; production receives no operation. Retain a sanitized before/after deployment inventory for both environments to support this boundary without exposing credentials or other variables.

Obtain exact-commit green check records and review dispositions for the releases used. Prepare B's snapshots and deploy F through the normal release process before starting the measurement window. Once the initial targets below are qualified and F_on is current, freeze merges and deployment/configuration changes for the whole measurement window, including the switch exercise; check for queued deployments before starting. If an unexpected deployment appears, invalidate that measurement and stop the proof.

Create a ledger of target deployment IDs, result deployment IDs, full source SHAs, artifact/image identities where available, observed `FEATURE_TOTAL_TAPS` state, and times. Several deployments can share one commit while having different variables; commit alone is not a target identifier. Capture both on and off snapshots for B while preparing B, then prepare F through the normal reviewed release process. Verify each saved snapshot when created. Use the table below as the required set of targets, not as evidence they already exist.

| Target | Source | Effective switch | Purpose |
| --- | --- | --- | --- |
| B_on | B | on | Ordinary rollback target |
| B_off | B | off | Rollback target that can keep the feature disabled |
| F_on | F | on | Initial healthy state and final recovery target |
| F_off | F | off | Forward target for the combined exercise |

Before the switch exercise, B_on, B_off and F_on must be qualified and available for restoration. Step 4 produces and qualifies F_off. Before the rollback exercise, verify all four recorded targets are still eligible and that a forward recovery target is available. Retention is finite; record the deadline from the current plan/account. If a rebuild is necessary, label and time it separately, then qualify the resulting artifact before using it as a rollback target. Do not describe a source rebuild as restoration of the same image. See [Railway's recovery guide](https://docs.railway.com/guides/roll-back-bad-deploy).

Record whether Railway gates traffic on `/health`. The endpoint existing in code does not establish the hosted healthcheck setting. Use the existing healthcheck setting where configured and verify external health and behavior regardless of platform status.

For this practice drill, propose a five-minute observation window for each deployment action, chosen before execution; expiration is a failed observation, not grounds to extend tests or blindly repeat mutations. Record actual time-to-effect and HTTP failures. The Lead records the safe recovery action and handles failures; Salem separately decides acceptable activation time/outage for real customers. Neither ten-second anecdotes nor a one-minute estimate is an operating guarantee.

## 3. Use one external observation procedure

For every required state, record UTC times, the staging URL, target/result IDs, expected source and flag, `/health` status/body, `/version` status/body, and browser evidence. Use exact `/health` and `/version` paths with cache-revalidation request headers; the current app does not support adding query strings to those endpoints.

Use fresh browser contexts on both configured phone/desktop profiles. Start collecting uncaught page errors before navigation. On staging, actually perform Add → Add → Reset → Add and assert count values 0 → 2 → 0 → 1. With off, assert the Total taps element is absent throughout. With on, assert totals start at 0, reach 2 after two adds, remain 2 through Reset, then reach 3. Require no uncaught errors.

Retain a trace or equivalent timestamped interaction/assertion record, with deployment identity captured around the observation. A button in raw HTML is not interaction evidence. Local CI proves the code under test; it cannot substitute for this staging observation. An emulated phone profile also cannot substitute for Salem's separately recorded actual-phone click-through.

## 4. Prove switch off and on on one release

Starting from qualified F_on, explicitly set the single allowed feature value to `off`. Use the documented apply/deploy operation for the selected interface. Record the returned deployment and wait for the external observation to establish F identity, absent feature, and working counter.

Set the value explicitly to `on`, apply/deploy, and require the corresponding F identity and browser assertions. Never assume deletion, saving a setting, or a same-value write has restarted the process. If no suitable deployment is produced, stop this item and record why. Both observations must reference the same source F, with their distinct deployment IDs. Retain the qualified F_off and latest F_on IDs for recovery tests.

## 5. Prove rollback and forward, including the combined state

First restore the recorded B_on target, observe B and on externally, then restore the recorded F_on target and observe F and on. Record the original target and newly resulting deployment for each action. Keep the Git staging branch unchanged.

Then restore the qualified F_off state and verify off. Restore B_off and require B with off from its first successful external observation; return to F_off and require F with off. This establishes that a disabled feature can remain disabled through code recovery. Do not first restore an on snapshot and call a later switch reset proof that off was preserved.

Keep external page/identity probes running at a recorded cadence through these transitions. Responses may initially come from the outgoing off deployment; every successful page sample must omit Total taps, and the expected target identity must appear before the observation deadline. Retain all samples and report the cadence so the evidence does not imply finer coverage than was measured. Browser interaction assertions still run once each target is active.

The selected snapshots must already contain the intended switch state because rollback can restore historical custom variables. A generic instruction to reset the switch afterward leaves a potential interval with the wrong behavior. This combined drill uses only the practice feature and the existing platform. [Railway's deployment actions](https://docs.railway.com/deployments/deployment-actions) describe the snapshot behavior.

Keep desired service settings and the observed running state as separate ledger fields. If they disagree, use a verified apply/deploy path for the exact intended source and configuration, then repeat the external assertions. Do not infer the running state from the settings screen.

## 6. Restore, handle failure, and close with evidence

Always finish by restoring the qualified F_on target and reconciling the service's single feature setting to on through an observed deployment if needed. Require healthy responses, F identity, Total taps present and updating, successful counter interactions, no uncaught errors, no pending/queued changes, and the unchanged staging branch. Record production's unchanged deployment inventory. Only then release the deployment freeze.

If any identity, state, interaction, or timing check fails, stop the proof and keep its result open. Attempt the prequalified safe recovery action. If recovery fails, record the last verified state, failed action, and next recovery owner; do not claim the app was restored or the item passed. Do not proceed with an unrelated card while the environment's state is unresolved.

Acceptance is conjunctive:

```text
PASS for this run requires
  reviewed releases with exact-commit green checks
  AND observed F_on -> F_off -> F_on without source change
  AND observed F_on -> B_on -> F_on
  AND observed F_off -> B_off -> F_off with feature absent
  AND required external identity and browser assertions at each state
  AND final verified F_on, aligned settings, unchanged staging branch
  AND production untouched
  AND a durable evidence link for each assertion
```

Retain complete check stdout/stderr, exit codes, commit/plan identity, start/end times, reviewer input/output packets and dispositions. Keep only allowlisted app-setting values in shared records; never include an environment dump, credentials, or other secret values. If the worker stream is truncated, preserve full permitted check output separately before summarizing it. Missing historical records remain marked unverified; a rerun gets a new date and cannot prove the earlier run.

## Cost and owner decisions

Expected additional cash is conditional on verified remaining included capacity in the already-paid subscriptions. Record the billing period, current shared consumption, projected pilot consumption, remaining headroom, and Salem's approved budget. Report existing recurring subscriptions separately. Railway Pro is currently $20/month including $20 of resource consumption, with excess billed; do not call the platform free. [Railway pricing](https://docs.railway.com/pricing/plans).

Before production reuse, Salem decides the required effect on existing sessions, activation delay/outage, invalid or missing flag defaults, recovery horizon, and customer-data compatibility requirements. Preserve the current dummy-feature semantics while those choices remain open; do not introduce a new paid service or storage system on assumption.
