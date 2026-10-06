---
title: Architecture
description: The pieces and how they talk to each other.
---

```
 @Dag providers ──► DagExplorer ──► DagRegistry ──► registerDag (version by hash)
                                                     │
 Scheduler loop (every scheduler.pollMs)             ▼
   createDueRuns ──────────────────────────► airnest.dag_run
   reapExpiredLeases                          airnest.task_instance
   advanceRuns ──► planRun (trigger rules) ─► queued tasks
                                                     │
 Worker loop (every worker.pollMs)                   ▼
   claimTasks (SKIP LOCKED) ─► run the method ─► succeed / fail
   heartbeat every leaseMs / 3                 airnest.xcom, airnest.task_attempt
```

| Package | Role |
| --- | --- |
| `@airnest/core` | Graph validation, trigger rules, run planning, retry delays and the cron timetable. No framework and no I/O. |
| `@airnest/postgres` | Schema, migrations, run creation, the task queue, leases, outputs and run history. Works with `pg` or PGlite. |
| `@airnest/nestjs` | Decorators, discovery, the scheduler and worker loops, and the `Airnest` service. |

## Coordination

PostgreSQL is the only coordination point. Every scheduler replica runs the same loop and locks the rows it works on
with `FOR UPDATE SKIP LOCKED`, so there is no leader election and no extra infrastructure. Task state changes are
compare-and-set: an update only applies if the task is still in the expected state and, for workers, still owned by the
same attempt.

## What the scheduler does on each tick

1. Creates runs that are due, respecting `catchup` and `maxActiveRuns`.
2. Fails attempts whose lease expired.
3. For each active run, re-queues retries whose delay is over, evaluates trigger rules, queues the tasks that are ready,
   marks skipped and upstream-failed tasks with their reason, and closes the run when everything is done.
