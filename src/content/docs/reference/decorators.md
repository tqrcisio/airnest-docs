---
title: Decorators
description: '@Dag, @Task and the task parameter decorators.'
---

## @Dag(options)

| Option | Type | Default | |
| --- | --- | --- | --- |
| `id` | `string` | required | Unique across the application. |
| `schedule` | `string \| null` | `null` | Cron expression. `null` means manual runs only. |
| `timezone` | `string` | `'UTC'` | IANA zone used to evaluate the cron. |
| `startDate` | `Date \| string` | none | First interval. Without it, the first run is the next fire after boot. |
| `catchup` | `boolean` | `false` | Create runs for every missed interval. |
| `maxActiveRuns` | `number` | `16` | Queued plus running runs allowed at once. |
| `tags` | `string[]` | `[]` | Free labels. |
| `params` | `object` | none | Description of the params the DAG accepts. |
| `defaults` | task options | none | Applied to every task, overridden per task. |

## @Task(options)

| Option | Type | Default | |
| --- | --- | --- | --- |
| `after` | method names | `[]` | Upstream tasks. Checked by the compiler. |
| `triggerRule` | see [Trigger rules](../../concepts/trigger-rules/) | `'all_success'` | |
| `retries` | `number` | `0` | Retries after a failed attempt. |
| `retryDelayMs` | `number` | `300000` | Delay before a retry. |
| `retryBackoff` | `'fixed' \| 'exponential'` | `'fixed'` | |
| `maxRetryDelayMs` | `number` | `86400000` | Cap for exponential backoff. |
| `timeoutMs` | `number` | none | Bound for one attempt. |
| `pool` | `string` | none | Reserved for pools, not enforced yet. |

The task id is the method name.

## Parameter decorators

| Decorator | Injects |
| --- | --- |
| `@Ctx()` | `TaskContext`; type it as `DagContext<YourDag>` for typed `output()` |
| `@LogicalDate()` | `Date` |
| `@DataInterval()` | `{ start: Date; end: Date }` |
| `@Params()` | the run's params object |
| `@Params('name')` | one param |
| `@Output('task')` | the return value of an upstream task |

## DagContext

```ts
type DagContext<TDag> = {
  dagId: string;
  runId: string;
  taskId: string;
  tryNumber: number;
  logicalDate: Date;
  dataInterval: { start: Date; end: Date };
  params: Record<string, unknown>;
  signal: AbortSignal;
  output<K extends TaskName<TDag>>(task: K): TaskOutput<TDag, K>;
};
```
