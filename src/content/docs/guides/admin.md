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

The admin ships inside `@airnest/control-plane` and is served by the same module, under `<path>/ui`:

```ts
AirnestControlPlaneModule.forRoot({ db, authorize, path: 'airnest' });
// admin at /airnest/ui, API at /airnest
```

The page itself is public and holds no data: every call it makes goes through the API, which `authorize` protects. That
is deliberate, because a browser navigating to the page cannot attach a bearer token. When your authorization relies on
one, put the admin behind the same session or proxy that issues it. Pass `ui: false` to serve only the API.

The module tells the page where the API lives, so changing `path` needs no rebuild.

To work on the admin itself, run the demo backend and the Vite dev server, which proxies `/airnest` to
`AIRNEST_API_TARGET` (default `http://localhost:3100`):

```bash
pnpm build
pnpm --filter @airnest/demo dev
pnpm --filter @airnest/admin dev
```

`apps/demo` is a Nest application with three sample DAGs, PGlite and the control plane, so the admin has history to show
from the first minute.
