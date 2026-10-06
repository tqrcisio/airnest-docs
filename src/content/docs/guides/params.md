---
title: Params
description: Describe what a run accepts, with defaults and validation.
---

`params` on `@Dag` is a JSON Schema. Every run, scheduled, manual or backfill, is validated against it, and defaults
are filled in before the run is stored, so tasks always see a complete object.

```ts
@Dag({
  id: 'invoices',
  params: {
    type: 'object',
    properties: {
      customers: { type: 'array', items: { type: 'string' }, default: ['acme'] },
      dryRun: { type: 'boolean', default: false },
      region: { type: 'string', enum: ['north', 'south'], default: 'north' },
    },
    additionalProperties: false,
  },
})
```

With Zod, convert the schema once: `params: z.toJSONSchema(InvoiceParams)`.

- A manual trigger with invalid params fails with `InvalidParamsError`, and the control plane answers `400` with one
  message per problem (`customers must be array`).
- A schedule whose defaults do not satisfy the schema (a required param without default) stops, and the scheduler logs
  it, instead of creating runs that would fail.
- The admin builds the trigger form from the same schema: strings, numbers, booleans, enums and lists get their own
  fields, anything else a JSON editor.
