---
title: Runs and logical dates
description: Logical dates, data intervals, catchup and maxActiveRuns.
---

A run is one execution of a DAG. Every run has a **logical date** and a **data interval**, and those, not the wall
clock, are what a task should use to decide which data it processes.

## Scheduled runs

For a DAG with `schedule: '0 3 * * *'` and `timezone: 'America/Sao_Paulo'`, the run that fires at 03:00 on October 6
has:

- logical date: 2026-10-06 03:00 (São Paulo);
- data interval: from the previous fire, 2026-10-05 03:00, to 2026-10-06 03:00.

This is Airflow 3's model: the logical date is the moment the run was due. A task that reads
`@DataInterval()` processes exactly one day, and running it again for the same interval gives the same result, which
is what makes reruns and backfills safe.

The cron is evaluated in the DAG's timezone, so `0 3 * * *` stays at 03:00 local time across daylight saving changes.
Without `timezone`, it is UTC.

## Catchup

`startDate` sets the first interval. When the scheduler finds fires that were missed (the app was down, or `startDate`
is in the past):

- with `catchup: true`, it creates one run for every missed interval, oldest first;
- with `catchup: false` (the default), it creates only the latest one and moves on.

## maxActiveRuns

At most `maxActiveRuns` runs of a DAG run at the same time (default 16), whether the scheduler, a manual trigger or a
backfill created them; the others wait in `queued`. While the limit is reached the scheduler creates nothing new, so a
long catchup proceeds a few runs at a time. With `maxActiveRuns: 1`, runs are strictly sequential.

## One run per logical date

`(dag, logical date)` is unique. Scheduling the same interval twice, from two scheduler replicas or after a restart, is
a no-op, and triggering a manual run for a logical date that already has one throws `RunAlreadyExistsError`.

## Manual runs

`airnest.trigger(dagId)` creates a run whose logical date is now and whose data interval is empty (start equals end).
Pass `logicalDate` to rerun a specific moment and `params` to change what the tasks do. See
[Triggering runs](../../guides/triggering-runs/).

## Run states

| State | Meaning |
| --- | --- |
| `queued` | created, no task has been planned yet |
| `running` | at least one task was planned |
| `success` | every task finished and no final task failed |
| `failed` | a final task failed, or no remaining task can ever start |

A final task is one that no other task waits for. A failure handled by a cleanup task (for example with `one_failed`)
does not fail the run if the cleanup succeeds.
