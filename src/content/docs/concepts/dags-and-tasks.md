---
title: DAGs and tasks
description: How a class becomes a graph.
---

A DAG is a Nest provider decorated with `@Dag`. Each method decorated with `@Task` is a task whose id is the method
name. Methods without `@Task` are ordinary helpers.

```ts
@Dag({ id: 'invoices', defaults: { retries: 2 } })
export class InvoicesDag {
  constructor(private readonly billing: BillingService) {}

  @Task()
  extract(@Params('customers') customers: string[]) {
    return this.billing.openInvoices(customers);
  }

  @Task({ after: ['extract'] })
  charge(@Output('extract') invoices: Invoice[]) {
    return this.billing.charge(invoices);
  }

  @Task({ after: ['charge'], triggerRule: 'one_failed' })
  alert(@Ctx() ctx: DagContext<InvoicesDag>) {
    return this.billing.alert(ctx.runId);
  }
}
```

## Dependencies

`after` lists the tasks that must finish before this one starts. The names are checked by the compiler: the decorator
only accepts names of methods that exist on the class, so `after: ['extrac']` is a type error.

A DAG may fan out (several tasks after the same one) and fan in (one task after several). Cycles are rejected at boot.

## Passing data between tasks

A task's return value is stored as its output and handed to the tasks after it. There are two ways to read it:

- `@Output('extract') invoices: Invoice[]` injects it as a parameter. The type is whatever you declare.
- `@Ctx() ctx: DagContext<InvoicesDag>` gives `ctx.output('extract')`, typed as the awaited return type of `extract`.

Reading the output of a task that is not in `after` fails at boot, because nothing guarantees it has run.

Outputs are stored as JSON. Keep them small (ids, counts, file keys) and put large data in your own storage. Values
that JSON cannot represent change on the way: a `Date` arrives as a string.

## Parameters a task can ask for

| Decorator | Value |
| --- | --- |
| `@Ctx()` | the whole task context |
| `@LogicalDate()` | the run's logical date |
| `@DataInterval()` | `{ start, end }` of the run |
| `@Params()` / `@Params('name')` | the run's params, or one of them |
| `@Output('task')` | the output of an upstream task |

The context also carries `dagId`, `runId`, `taskId`, `tryNumber` and an `AbortSignal` that fires on timeout or when
the worker loses its lease.

## Defaults

`defaults` on `@Dag` applies to every task; options on `@Task` override it.

```ts
@Dag({ id: 'exports', defaults: { retries: 3, retryBackoff: 'exponential', timeoutMs: 600_000 } })
```
