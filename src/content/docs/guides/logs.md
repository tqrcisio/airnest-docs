---
title: Task logs
description: Write logs from a task and read them live in the admin.
---

Every attempt has its own log. Ask for the logger with `@TaskLog()` or use `ctx.logger`:

```ts
@Task()
async extract(@DataInterval() interval: DataInterval, @TaskLog() log: TaskLogger) {
  log.log(`reading ${interval.start.toISOString()} to ${interval.end.toISOString()}`);
  const rows = await this.source.fetch(interval);
  if (rows.length === 0) log.warn('no rows in this interval');
  return rows.length;
}
```

- Lines go to the database in batches every second and when the attempt ends, and to the Nest logger with the context
  `<dag>.<task>`.
- When an attempt fails, its error message is appended as an `error` line, so the log tells the whole story.
- `GET /runs/:runId/tasks/:taskId/logs?after=<seq>` returns lines after a sequence number. The admin polls it every two
  seconds while the task runs.
- Logs are deleted with their run, so [retention](../../reference/module-options/) applies to them too.
