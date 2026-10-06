---
title: Module options
description: Everything AirnestModule.forRoot accepts.
---

`AirnestModule.forRoot(options)` and `AirnestModule.forRootAsync({ useFactory, inject })` accept:

| Option | Default | |
| --- | --- | --- |
| `db` | required | A `SqlClient`: `fromPgPool(pool)` for `pg`, or a PGlite instance. |
| `migrate` | `true` | Apply pending migrations on boot. Safe with several replicas booting together. |
| `scheduler.enabled` | `true` | Run the scheduler loop in this process. |
| `scheduler.pollMs` | `1000` | Interval between scheduler ticks. |
| `worker.enabled` | `true` | Run the worker loop in this process. |
| `worker.id` | `hostname:pid` | Recorded on every attempt. |
| `worker.concurrency` | `4` | Tasks running at once in this process. |
| `worker.pollMs` | `500` | Interval between claims when the worker has free slots. |
| `worker.leaseMs` | `30000` | Lease on a claimed task, renewed every third of it. |
| `shutdownTimeoutMs` | `30000` | How long close waits for running tasks. |
| `clock` | `() => new Date()` | Time source, for tests. |

```ts
AirnestModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    db: fromPgPool(new pg.Pool({ connectionString: config.getOrThrow('DATABASE_URL') })),
    worker: { concurrency: config.get('AIRNEST_WORKER_CONCURRENCY', 4) },
  }),
});
```
