---
title: Introduction
description: What airnest is, what it borrows from Airflow and when it is the right tool.
---

airnest runs directed acyclic graphs of tasks on a schedule, inside a NestJS application, with PostgreSQL as the only
moving part. It takes the execution model of Apache Airflow (logical dates, data intervals, catchup, trigger rules,
retries) and expresses it the way Nest code is written: a DAG is a provider, a task is a method, and everything the task
needs arrives through dependency injection.

## When it fits

- Scheduled, incremental work where each run is about a slice of time: nightly extracts, hourly syncs, end-of-month
  closings, reports that must be rebuilt for a past day.
- Teams that already run NestJS and PostgreSQL and do not want to operate a separate orchestrator for it.
- Pipelines with fan-out and fan-in, where "run C after A and B, but notify if either failed" matters.

## When it does not

- Long business processes that wait days for human input or external signals. Durable execution engines model that
  better; NestJS ships one in [`@nestjs/workflows`](https://github.com/nestjs/workflows).
- Very high throughput (thousands of tasks per second). The queue lives in PostgreSQL, which is plenty for scheduled
  pipelines and not designed for that.
- Polyglot workers. Tasks are TypeScript methods.

## What it takes from Airflow

| Airflow | airnest |
| --- | --- |
| DAG file with operators | Class with `@Dag`, methods with `@Task` |
| `>>` dependencies | `@Task({ after: ['extract'] })`, checked at compile time |
| `logical_date`, `data_interval_start/end` | `@LogicalDate()`, `@DataInterval()` |
| `catchup`, `max_active_runs` | same names, same behavior |
| Trigger rules | the eight rules, same semantics |
| XCom | the task's return value, read with `@Output()` |
| Scheduler + executor + workers | one Nest module; split roles across processes with a flag |
| Metadata database | a `airnest` schema in your PostgreSQL |

What it leaves out on purpose: the DAG processor that parses files, Jinja templates, pluggable executors and the provider
ecosystem. Those exist because Airflow runs arbitrary Python from a folder; here the DAG is code compiled with your app.
