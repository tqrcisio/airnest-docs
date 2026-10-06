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
- A control plane: HTTP API for DAGs, runs and attempts, pause and trigger, and a manifest for admin UIs.
- An admin UI built on that manifest: DAG list, run grid, graph, attempts and a trigger form generated from params.
- Rerunning failed tasks, a task with its downstream or a whole run, and backfills over a range.
- Params validated against a JSON Schema, with defaults, on every kind of run.
- Pools that cap concurrent tasks on an external resource.
- Task logs, stored per attempt and followed live in the admin.
- Retention of run history.
- Opt-in guards, interceptors and filters around tasks.

## Next

1. Publish the packages to npm.
2. Stream logs and run updates over SSE instead of polling.
3. Assets: schedule a DAG when another one updates the data it reads.
4. Deferrable tasks that free their slot while waiting on something external.
5. Deadlines with callbacks.
