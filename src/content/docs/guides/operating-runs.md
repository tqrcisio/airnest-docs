---
title: Rerunning and backfilling
description: Clear tasks to run them again, and create runs for a past range.
---

## Rerunning tasks of a run

Clearing a task puts it back to `pending` so the scheduler runs it again. By default everything downstream of it is
cleared too, because its results depended on the old output.

```ts
await airnest.clear(runId, { onlyFailed: true, clearedBy: user.email });
await airnest.clear(runId, { taskIds: ['transform'] });
await airnest.clear(runId, { taskIds: ['transform'], downstream: false });
await airnest.clear(runId);
```

| Option | Default | |
| --- | --- | --- |
| `taskIds` | every task | Where to start. |
| `downstream` | `true` | Also clear every task that depends on them. |
| `onlyFailed` | `false` | Keep only `failed` and `upstream_failed` tasks of the selection. |
| `clearedBy` | none | Stored on the run with the time it happened. |

- Tasks that are queued or running cannot be cleared; wait for them, or the call fails with `TaskStillActiveError`.
- Upstream tasks that are not cleared keep their outputs, so a rerun of `load` reads what `transform` produced before.
- A cleared task gets its full retry budget again. Attempt numbers keep growing, so history stays intact.
- A finished run goes back to `queued` and follows `maxActiveRuns` like any other.

In the admin, a run page offers **Rerun failed tasks** and **Rerun everything**, and each task row a button that reruns
it with its downstream.

## Backfills

A backfill creates one run for every interval of the schedule whose fire falls in a range, exactly as the scheduler
would have, with `runType: 'backfill'`.

```ts
await airnest.backfill('sales_daily', { from: new Date('2026-01-01'), to: new Date('2026-03-31') }, { triggeredBy: user.email });
```

- Logical dates that already have a run are skipped and counted in `skipped`.
- Runs start a few at a time: `maxActiveRuns` limits how many of a DAG run at once, whatever created them.
- One backfill creates at most 1000 runs. Split longer ranges.
- DAGs without a schedule cannot be backfilled; trigger them with an explicit `logicalDate` instead.
