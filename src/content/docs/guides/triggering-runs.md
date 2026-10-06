---
title: Triggering runs
description: Manual runs, reruns of a past date and reading run history.
---

Inject the `Airnest` service anywhere in the application.

```ts
@Controller('dags')
export class DagsController {
  constructor(private readonly airnest: Airnest) {}

  @Post(':dagId/runs')
  trigger(@Param('dagId') dagId: string, @Body() body: { params?: Record<string, unknown> }, @Req() req: AuthedRequest) {
    return this.airnest.trigger(dagId, { params: body.params, triggeredBy: req.user.email });
  }

  @Get(':dagId/runs')
  runs(@Param('dagId') dagId: string) {
    return this.airnest.runs(dagId);
  }
}
```

## Parameters

`params` is stored with the run and read by tasks through `@Params()` or `ctx.params`. Scheduled runs get `{}`, so give
tasks a default for every param they read.

## Rerunning a date

Pass `logicalDate` to create a manual run for a specific moment:

```ts
await airnest.trigger('sales_daily', { logicalDate: new Date('2026-10-01T06:00:00Z') });
```

If that DAG already has a run for that logical date, `trigger` throws `RunAlreadyExistsError`. Clearing an existing run
to execute it again is on the [roadmap](../../roadmap/).

## Who triggered it

`triggeredBy` is free text stored on the run and returned by `runs()`. Use the user's email or id so the question "who
started this" always has an answer.
