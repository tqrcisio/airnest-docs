---
title: Getting started
description: Install airnest, declare a DAG and watch it run.
---

## Install

```bash
pnpm add @airnest/nestjs @airnest/postgres pg
```

`@airnest/nestjs` needs `@nestjs/common` and `@nestjs/core` 11 or 12, `reflect-metadata` and `rxjs`, which a Nest app
already has.

:::caution
The packages are not on npm yet. Until the first release, install them from the
[repository](https://github.com/tqrcisio/airnest).
:::

## Register the module

```ts
import { Module } from '@nestjs/common';
import { AirnestModule } from '@airnest/nestjs';
import { fromPgPool } from '@airnest/postgres';
import pg from 'pg';

@Module({
  imports: [
    AirnestModule.forRoot({
      db: fromPgPool(new pg.Pool({ connectionString: process.env.DATABASE_URL })),
    }),
    SalesModule,
  ],
})
export class AppModule {}
```

On boot the module creates the `airnest` schema if needed, registers every DAG it finds and starts a scheduler and a
worker in the same process.

## Declare a DAG

```ts
import { Dag, DataInterval, Output, Task } from '@airnest/nestjs';

@Dag({ id: 'sales_daily', schedule: '0 3 * * *', timezone: 'America/Sao_Paulo', catchup: true })
export class SalesDailyDag {
  constructor(
    private readonly gateway: SalesGateway,
    private readonly warehouse: Warehouse,
  ) {}

  @Task({ retries: 3, retryBackoff: 'exponential' })
  extract(@DataInterval() interval: DataInterval) {
    return this.gateway.fetch(interval);
  }

  @Task({ after: ['extract'] })
  load(@Output('extract') sales: Sale[]) {
    return this.warehouse.upsert(sales);
  }
}
```

Add it to the `providers` of any module, next to the services it injects:

```ts
@Module({ providers: [SalesGateway, Warehouse, SalesDailyDag] })
export class SalesModule {}
```

There is no `forFeature`: every provider decorated with `@Dag` is discovered at startup.

## Run it

With `startDate` unset, the first scheduled run happens at the next fire of the cron. To run it now:

```ts
import { Airnest } from '@airnest/nestjs';

@Injectable()
export class SalesController {
  constructor(private readonly airnest: Airnest) {}

  rerun(userEmail: string) {
    return this.airnest.trigger('sales_daily', { triggeredBy: userEmail });
  }
}
```

`airnest.runs('sales_daily')` returns the latest runs with the state, attempt and last error of every task.

## What fails at boot

The application refuses to start, with the reason, when a DAG:

- has a cycle or depends on a task that does not exist;
- reads the output of a task that is not in its `after` list;
- shares its id with another DAG;
- depends on a request-scoped provider.
