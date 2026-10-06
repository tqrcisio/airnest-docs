---
title: Testing DAGs
description: Unit-test tasks and run whole DAGs against an in-memory PostgreSQL.
---

## Tasks are methods

The fastest test needs no orchestration at all: instantiate the DAG class, or get it from a testing module, and call the
method.

```ts
const dag = new SalesDailyDag(fakeGateway, fakeWarehouse);
expect(await dag.load([{ branch: 1, total: 10 }])).toEqual({ upserted: 1 });
```

## Whole runs with PGlite

[PGlite](https://pglite.dev) is PostgreSQL compiled to WebAssembly. `@airnest/postgres` accepts it directly, so a test
can boot the real module without a database server.

```ts
import { PGlite } from '@electric-sql/pglite';

const moduleRef = await Test.createTestingModule({
  imports: [
    AirnestModule.forRoot({ db: new PGlite(), scheduler: { pollMs: 10 }, worker: { pollMs: 10 } }),
    SalesModule,
  ],
}).compile();
const app = await moduleRef.init();

await app.get(Airnest).trigger('sales_daily', { params: { branches: [1] } });
```

Then poll `app.get(Airnest).runs('sales_daily')` until the run reaches `success` or `failed`, and close the module in
`afterEach`.

## Checking a DAG's shape

`DagRegistry` exposes the compiled definition. With both loops disabled, a test can assert dependencies and options
without running anything:

```ts
AirnestModule.forRoot({ db: new PGlite(), scheduler: { enabled: false }, worker: { enabled: false } });

const { definition } = app.get(DagRegistry).get('sales_daily');
expect(definition.tasks.map((task) => [task.id, task.upstream])).toEqual([
  ['extract', []],
  ['load', ['extract']],
]);
```
