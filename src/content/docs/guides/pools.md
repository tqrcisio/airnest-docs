---
title: Pools
description: Cap how many tasks use an external resource at once.
---

A pool is a named number of slots. Tasks that declare it never run more than that many at the same time, across every
worker and every DAG. Use it to protect what cannot take more load: a source database, a rate-limited API, a warehouse
that locks on writes.

```ts
AirnestModule.forRoot({
  db,
  pools: { warehouse: { slots: 2, description: 'Warehouse writes' }, erp: 4 },
});

@Task({ after: ['transform'], pool: 'warehouse' })
load() {}
```

`defaults: { pool: 'erp' }` on `@Dag` puts every task of the DAG in the pool.

- Pools are declared in the module options and stored in the database on boot. The application refuses to start if a
  task names a pool that does not exist.
- Slot allocation is serialized in PostgreSQL, so the cap holds with any number of workers. Tasks without a pool are
  claimed in parallel as before.
- `GET /pools` on the control plane, and the **Pools** page of the admin, show slots, running and queued tasks.
