# Load testing — K6

Load and performance test scripts written for [Grafana K6](https://k6.io/).

Complements the Playwright UI + API test suites by validating the system under load — *"does it survive 500 concurrent users?"* instead of *"does the button work?"*.

## Scripts

| File | Type | Profile | Goal |
|---|---|---|---|
| [smoke.js](smoke.js) | Smoke | 2 VUs, 30s | Sanity — system responds under minimal load |
| [load.js](load.js) | Load | 50 VUs, 5 min total | Typical production traffic, validate latency budget |
| [stress.js](stress.js) | Stress | 100 → 500 VUs, 8 min total | Find the breaking point |

## Running

Requires K6 installed:

```bash
brew install k6           # macOS
# or see https://k6.io/docs/get-started/installation/
```

Run any script:

```bash
k6 run k6/smoke.js
k6 run k6/load.js
k6 run k6/stress.js
```

Override the target with an environment variable:

```bash
BASE_URL=https://staging.example.com k6 run k6/smoke.js
```

## Reading the output

K6 prints a structured summary at the end:

```
✓ status is 200                                ← check pass rate
http_req_duration: avg=120ms  p(95)=380ms      ← latency percentiles
http_req_failed:   0.50%                       ← error rate
iterations:        1502 (50.07/s)
```

Exit code:
- `0` = all thresholds passed
- `99` = at least one threshold failed

This makes K6 directly integrable into CI — a failed threshold breaks the build like any other test.

## Design notes

- **Thresholds as contracts.** Every script declares pass/fail criteria up front (`http_req_failed`, `p(95)`, `checks`). Without thresholds, K6 just collects numbers — useful but not enforceable.
- **Sleep with jitter** in `load.js` mimics real user think-time, avoiding synthetic perfect-spacing of requests.
- **Read-heavy by design** — these scripts only hit GET endpoints. Mutation load tests against a shared demo would pollute data; for write-heavy scenarios in real projects I'd point them at a dedicated load environment.
