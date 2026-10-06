---
title: Database schema
description: Tables in the airnest schema.
---

Everything lives in a PostgreSQL schema named `airnest`, created by the migrations. Your own tables are not touched.

| Table | Holds |
| --- | --- |
| `migration` | Applied migration versions. |
| `dag` | One row per DAG: current version, pause flag, last logical date and when the next run is due. |
| `dag_version` | Every definition ever registered, keyed by hash. |
| `dag_run` | Runs, unique per `(dag_id, logical_date)`, with type, state, params, failure reason and who triggered them. |
| `task_instance` | One row per task of each run: state, try number, current attempt id, lease, retry time, reason, last error. |
| `task_attempt` | One row per finished attempt: worker, outcome, error, start and end. |
| `xcom` | Task outputs as JSON, keyed by run, task and key. |

All tables carry `created_at`, and the mutable ones `updated_at`. Partial indexes keep the hot queries (queued tasks,
running leases, due retries, active runs) small regardless of history size.

Retention is not automatic yet. Deleting old rows from `dag_run` cascades to its task instances, attempts and outputs.
