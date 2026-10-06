---
title: Guards and interceptors
description: Apply Nest enhancers around tasks.
---

With `enhancers: true`, guards, interceptors and exception filters declared on a DAG class or on a task method run
around every attempt, the same way they run around a controller.

```ts
AirnestModule.forRoot({ db, enhancers: true });

@Dag({ id: 'payouts' })
@UseGuards(OnlyWhenPayoutsEnabled)
export class PayoutsDag {
  @Task()
  @UseInterceptors(MeasureDuration)
  send() {}
}
```

The execution context has type `'airnest'`, and its single argument is the task context:

```ts
@Injectable()
export class OnlyWhenPayoutsEnabled implements CanActivate {
  constructor(private readonly flags: FeatureFlags) {}

  canActivate(context: ExecutionContext) {
    const [task] = context.getArgs<[DagContext]>();
    return this.flags.isOn('payouts', task.logicalDate);
  }
}
```

- A guard that returns `false` fails the attempt with `Forbidden resource`, and the retry policy applies.
- An interceptor can change the return value before it is stored as the task's output.

:::caution
Enhancers are off by default because global ones (`APP_GUARD`, `useGlobalInterceptors`) run too. A global
authentication guard that reads `switchToHttp().getRequest()` breaks tasks. Before turning this on, make global
enhancers return early when `context.getType() === 'airnest'`.
:::
