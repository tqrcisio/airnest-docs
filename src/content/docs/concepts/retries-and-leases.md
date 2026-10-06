---
title: Retries, timeouts and leases
description: What happens when a task fails, hangs or its worker disappears.
---

## Retries

```ts
@Task({ retries: 3, retryDelayMs: 30_000, retryBackoff: 'exponential', maxRetryDelayMs: 600_000 })
```

- `retries` is how many times a failed attempt is retried (default 0).
- `retryDelayMs` is the wait before a retry (default 5 minutes).
- With `retryBackoff: 'exponential'`, the delay doubles on each attempt, up to `maxRetryDelayMs` (default 1 day), with
  jitter between half and all of it. The jitter is derived from the run, task and attempt, so every scheduler replica
  computes the same delay.

A retried task waits in `up_for_retry` and goes back to the queue when the delay is over. Every attempt is recorded in
`airnest.task_attempt` with its worker and error.

## Timeouts

`timeoutMs` bounds one attempt. When it expires, the task's `AbortSignal` fires and the attempt fails with
`timed out after <n>ms`, which counts as a failure for retries.

The worker stops waiting immediately, but JavaScript cannot kill a running function. Pass `ctx.signal` to `fetch`,
database drivers and loops so the work actually stops.

## Leases

A worker that claims a task holds a lease on it (30 seconds by default) and renews it every third of that time. If the
lease expires, because the process crashed or the event loop was blocked, the scheduler treats the attempt as failed
with `worker stopped renewing its lease` and the retry policy decides what follows.

Each attempt has its own id, and every write a worker makes is conditioned on that id and on the task still running.
A worker that comes back after losing its lease cannot report success or failure anymore: its writes are ignored and it
aborts the task. This is what makes it safe to kill pods in the middle of a run.

CPU-heavy tasks that block the event loop for longer than the lease will be reaped. Move that work to a worker thread
or raise `worker.leaseMs`.
