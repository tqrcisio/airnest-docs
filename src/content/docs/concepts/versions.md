---
title: Versions
description: How deploys interact with DAG definitions.
---

On boot, each DAG's definition (tasks, dependencies, schedule, options) is serialized and hashed. A new hash becomes a
new version in `airnest.dag_version`, and the DAG starts pointing at it. Deploying the same code twice changes nothing.

- A run keeps the version it was created with. The scheduler plans its remaining tasks with that graph, so adding or
  removing tasks does not reshape runs already in flight.
- When a new version changes the schedule, the next fire is recomputed from the last run's logical date.
- The task code a worker executes is the code it loaded. Runs from an older version still run the current methods.

:::caution
Renaming or removing a task while runs of the previous version are pending makes those tasks fail with
`worker ... does not load <dag>.<task>`. Let in-flight runs finish before deploying a breaking change to a DAG.
:::
