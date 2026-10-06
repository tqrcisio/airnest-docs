---
title: Control plane
description: Mount the HTTP API that lists DAGs, triggers and inspects runs.
---

`@airnest/control-plane` is a Nest module that exposes airnest over HTTP: DAGs, runs, task attempts, pause and trigger,
plus a manifest that describes all of it for a generic admin UI. It only reads and writes the `airnest` schema, so it
can live in the same application as the workers or in a separate one pointing at the same database.

```bash
pnpm add @airnest/control-plane
```

```ts
@Module({
  imports: [
    AirnestControlPlaneModule.forRoot({
      db: fromPgPool(pool),
      path: 'airnest',
      authorize: (request) => (request as AuthedRequest).user?.roles.includes('admin') ?? false,
      resolveUser: (request) => (request as AuthedRequest).user?.email,
    }),
  ],
})
export class AppModule {}
```

`authorize` is required on purpose: every route answers `403` unless it returns `true`. Run your authentication before
it (a global guard or middleware) so the request already carries the user. `resolveUser` fills `triggeredBy` on manual
runs and `pausedBy` on paused DAGs.

`path` is the prefix of every route (default `airnest`), and the [admin](../admin/) is served under `<path>/ui` unless
you pass `ui: false`. Use `forRootAsync` with `path` next to `useFactory` to read the
options from configuration.

## Routes

| Method | Path | |
| --- | --- | --- |
| `GET` | `/manifest` | Entities, fields, actions and every registered DAG with its graph. |
| `GET` | `/dags` | Registered DAGs with schedule, pause state, next run and last run state. |
| `GET` | `/dags/:dagId` | One DAG, including its full definition. |
| `GET` | `/dags/:dagId/runs?limit=25` | Latest runs with the state of every task (limit up to 200). |
| `POST` | `/dags/:dagId/runs` | Trigger a manual run. Body: `{ params?, logicalDate? }`. |
| `POST` | `/dags/:dagId/backfills` | Create runs for a range. Body: `{ from, to, params? }`. |
| `POST` | `/dags/:dagId/pause` | Stop creating scheduled runs. Manual triggers still work. |
| `POST` | `/dags/:dagId/unpause` | Resume the schedule. |
| `GET` | `/runs/:runId` | One run with its tasks, reasons and last errors. |
| `GET` | `/runs/:runId/tasks/:taskId/attempts` | Every attempt of a task: worker, outcome, error, start and end. |
| `GET` | `/runs/:runId/tasks/:taskId/logs?after=0` | Log lines of a task after a sequence number. |
| `POST` | `/runs/:runId/clear` | Rerun tasks. Body: `{ taskIds?, downstream?, onlyFailed? }`. |
| `GET` | `/pools` | Pools with slots, running and queued tasks. |

Errors follow Nest's HTTP exceptions: `404` for an unknown DAG, run or task, `409` when a manual run already exists for
that logical date or a task to clear is still running, `400` for a malformed body, invalid params (one message per
problem) or a backfill range that is reversed or too long.

## The manifest

The manifest is what lets an admin UI render lists, details and actions without knowing airnest's tables. Each entity
declares its fields with a `kind` (`code`, `datetime`, `state`, `enum`, `relation`...), whether they show in lists, how
they filter and sort, and, for states, a tone (`success`, `danger`, `warning`, `info`, `neutral`). Each DAG comes with
its tasks and dependencies, ready to draw the graph, and its `params` description, ready to build the trigger form.

```json
{
  "version": 1,
  "entities": [{ "slug": "runs", "fields": [{ "name": "state", "kind": "state", "options": [...] }], "actions": [] }],
  "dags": [{ "id": "sales_daily", "tasks": [{ "id": "load", "upstream": ["extract"] }], "params": {...} }]
}
```
