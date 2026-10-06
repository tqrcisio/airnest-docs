---
title: Admin
description: The web UI for DAGs, runs, attempts and manual triggers.
---

`apps/admin` in the repository is a React application that talks to the [control plane](../control-plane/). It has no
knowledge of airnest's tables: every list, detail, badge and action comes from the manifest, and only the run grid and
the graph are written for orchestration.

![A run of the invoices DAG: the graph with each task's state, the task list with attempts and the reason a task was skipped](/airnest-docs/admin-run.png)

## What it shows

- **DAGs**: schedule, pause state, last run and next run, with trigger, pause and resume.
- **A DAG**: the grid of recent runs by task, the graph, and the latest runs. Each cell of the grid opens that run with
  the task selected.
- **A run**: the graph colored by task state, every task with its attempt number and the reason it was skipped or
  marked upstream failed, and the attempts of the selected task with worker, duration and error.
- **Trigger**: a form generated from the DAG's `params` description. Strings, numbers, booleans, enums and lists of
  strings or numbers get their own fields; anything else falls back to a JSON editor.

![The sales_daily DAG: grid of runs by task, graph and recent runs](/airnest-docs/admin-dag.png)

Views refresh every few seconds, so a run in progress updates on its own.

## Running it

The admin expects the control plane under `/airnest` on the same origin. In development, Vite proxies that path to
`AIRNEST_API_TARGET` (default `http://localhost:3100`):

```bash
pnpm --filter @airnest/demo dev
pnpm --filter @airnest/admin dev
```

`apps/demo` is a Nest application with three sample DAGs, PGlite and the control plane, so the admin has history to show
from the first minute.

To serve the admin from your own application, build it with `AIRNEST_ADMIN_BASE` set to the path it will live under and
`VITE_AIRNEST_API` pointing at the control plane, then serve `apps/admin/dist` as static files.

:::caution
The admin is not published as a package yet. Shipping it inside `@airnest/control-plane`, served from the same module,
is on the roadmap.
:::
