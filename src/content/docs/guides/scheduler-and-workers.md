---
title: Scheduler and workers
description: Running everything in one process, or splitting roles.
---

By default every instance of the application runs both a scheduler loop and a worker loop. That is the right setup for
most deployments: add replicas and both roles scale together, coordinated through PostgreSQL.

## Splitting roles

To keep task execution away from the processes that serve HTTP, turn off the worker in the API and run a separate
process that only executes tasks:

```ts
// api
AirnestModule.forRoot({ db, worker: { enabled: false } });

// worker entrypoint
AirnestModule.forRoot({ db, scheduler: { enabled: false }, worker: { concurrency: 8 } });
```

A worker process is a Nest application context, without HTTP:

```ts
const app = await NestFactory.createApplicationContext(WorkerModule);
app.enableShutdownHooks();
```

The worker must import the modules that declare the DAGs it executes. A worker that claims a task of a DAG it does not
load fails the attempt with an explicit error.

## Sizing

- `worker.concurrency` (default 4) is how many tasks one process runs at once.
- `worker.pollMs` (default 500) and `scheduler.pollMs` (default 1000) bound how long a ready task waits before starting.
- `worker.leaseMs` (default 30 s) must be longer than the longest event-loop stall of your tasks.

## Shutdown

Call `app.enableShutdownHooks()` so SIGTERM closes the application. On close, the loops stop taking work and the
worker waits for running tasks up to `shutdownTimeoutMs` (default 30 s). Tasks still running after that are abandoned:
their lease expires and another replica's scheduler fails the attempt so the retry policy can pick it up.

Set your orchestrator's grace period (Kubernetes `terminationGracePeriodSeconds`, Docker `stop_grace_period`) above
`shutdownTimeoutMs`.
