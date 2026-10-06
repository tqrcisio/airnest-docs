---
title: Roadmap
description: What exists, and what comes next.
---

airnest is young. The packages are at `0.0.1` and the API may still change.

## Available

- `@Dag` and `@Task` with compile-time checked dependencies and typed outputs.
- Cron schedules with timezones, logical dates and data intervals, catchup and `maxActiveRuns`.
- The eight Airflow trigger rules, propagated in one pass.
- Retries with fixed or exponential backoff, per-attempt timeouts, leases and a reaper.
- Versioned definitions, manual triggers with params, run history.
- Scheduler and worker in the same process or split, with graceful shutdown.

## Next

1. A control plane: HTTP API for DAGs, runs and tasks, plus a manifest that describes them.
2. An admin UI generated from that manifest: run grid, graph, live logs, trigger form.
3. Pools to cap concurrent access to an external resource.
4. Clearing a run or a task to execute it again, and backfills over a date range.
5. Params with a schema, validated on trigger and rendered as a form.
6. Guards and interceptors around tasks.
7. Retention of run history.
