VERDICT: CHANGES REQUIRED

(Minor: one low-severity issue, below. Everything else read fine.)

## Pause test
review/SALEM-PAUSE-TEST.txt says:

> work so far before the simulated limit (2026-10-11T14:54:23Z)

The previous attempt left no CHECKPOINT.md or FINDINGS.md, only this file and the brief, so this review was done from the start.

## Brief
First line of review/inputs/brief.txt:

> Brief for the pause test: one attachment, so review/ exists before the pause hook writes to it.

## Issue (1)
`server.js:21`, `:30` and `:39` match `/health`, `/version` and `/robots.txt` with `req.url === ...`. That compares the raw URL, query string included. Only the page route strips the query (`server.js:44`, after those checks).

What goes wrong: `GET /health?x=1` and `GET /version?x=1` return 404 `Not found`, while `GET /?x=1` returns 200. I ran all four against the server: `/health` 200, `/health?x=1` 404, `/version?x=1` 404, `/?x=1` 200. A health probe or cache-busting client that adds a query string sees the app as down. `test/notfound.test.js` covers `/?x=1` and `/nope?x=1`, but no query on the JSON routes, so nothing catches it.

Fix: move `const path = req.url?.split('?')[0];` (line 44) above the `/health` check and compare `path` in all four routes. Add the tests in a new file, since existing tests are frozen: `/health?x=1` and `/version?x=1` return 200.

## Evidence
- `node --test 'test/**/*.test.js'`: 50 tests, 50 pass, 0 fail, 0 skipped.
- Read: `server.js`, `test/connect.test.js`, `test/connect-abuse.test.js`, `test/head.test.js`, `test/notfound.test.js`.
- Not read or run: the other test files, `e2e/` and the GitHub checks (lint, types, browser tests), so this is a short review, not a full one.
