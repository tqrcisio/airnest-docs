---
title: Trigger rules
description: When a task starts, given what happened upstream.
---

By default a task starts when every task in its `after` list succeeded. `triggerRule` changes that.

```ts
@Task({ after: ['load'], triggerRule: 'one_failed' })
notifyFailure() {}
```

| Rule | Starts when | Is skipped when | Becomes upstream_failed when |
| --- | --- | --- | --- |
| `all_success` (default) | all upstream succeeded | any upstream was skipped | any upstream failed |
| `all_failed` | all upstream failed | any upstream succeeded or was skipped | never |
| `all_done` | all upstream finished, in any state | never | never |
| `one_success` | at least one upstream succeeded | all upstream were skipped | all finished, none succeeded, not all skipped |
| `one_failed` | at least one upstream failed | all finished and none failed | never |
| `none_failed` | all finished and none failed | never | any upstream failed |
| `none_failed_min_one_success` | all finished, none failed, at least one succeeded | all were skipped | any upstream failed |
| `always` | immediately | never | never |

"Failed" includes `upstream_failed`, so a failure travels down the graph. The scheduler propagates `skipped` and
`upstream_failed` in a single pass, and stores the reason ("1 upstream tasks failed") next to the task.

Tasks without upstream start immediately whatever the rule.
