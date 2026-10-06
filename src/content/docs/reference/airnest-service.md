---
title: Airnest service
description: The injectable API for triggering and inspecting runs.
---

## trigger(dagId, options?)

Creates a manual run and returns its id.

| Option | Default | |
| --- | --- | --- |
| `params` | `{}` | Stored on the run, read with `@Params()`. |
| `triggeredBy` | none | Who asked for it. |
| `logicalDate` | now | The run's logical date. Its data interval starts and ends there. |

Throws `RunAlreadyExistsError` when the DAG already has a run for that logical date, and an error when the DAG was
never registered.

Throws `InvalidParamsError` when params break the DAG's schema.

## clear(runId, options?)

Puts tasks of a run back to `pending` and returns the ids that were cleared. Options: `taskIds`, `downstream` (default
`true`), `onlyFailed`, `clearedBy`. See [Rerunning and backfilling](../../guides/operating-runs/).

## backfill(dagId, { from, to }, options?)

Creates one `backfill` run per scheduled interval in the range and returns `{ created, skipped }`. Options: `params`,
`triggeredBy`.

## runs(dagId, limit = 25)

Latest runs first.

```ts
type RunSummary = {
  runId: string;
  dagId: string;
  runType: 'scheduled' | 'manual' | 'backfill';
  state: 'queued' | 'running' | 'success' | 'failed';
  logicalDate: Date;
  failureReason: string | null;
  triggeredBy: string | null;
  tasks: {
    taskId: string;
    state: TaskState;
    tryNumber: number;
    reason: string | null;
    lastError: string | null;
  }[];
};
```

`reason` explains why a task was skipped or marked `upstream_failed`; `lastError` is the message of its latest failed
attempt.
