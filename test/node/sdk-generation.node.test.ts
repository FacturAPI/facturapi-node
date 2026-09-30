import { resolve } from 'node:path'
import { expect, it } from 'vitest'
import { compileDatePlans } from '../../scripts/sdk/date-plans.mjs'

it('discovers new date fields, dictionaries and recursive models without a date-path inventory', () => {
  const plans = compileDatePlans(
    resolve('src/generated/output.ts'),
    `
    export interface components {
      schemas: {
        FutureModel: {
          new_timestamp: Date | null;
          calendar: Record<string, Date>;
          children?: components['schemas']['FutureModel'][];
          metadata?: Record<string, unknown>;
        };
      };
    }
    export interface operations {
      getFutureModel: { responses: { 200: { content: {
        'application/json': components['schemas']['FutureModel'];
      } } } };
    }
  `,
  )
  const model = plans.nodes[plans.operations.getFutureModel]
  expect(plans.nodes[model.properties.new_timestamp]).toEqual({ kind: 'date' })
  expect(plans.nodes[model.properties.calendar]).toEqual({
    kind: 'object',
    properties: {},
    additional: 1,
  })
  expect(plans.nodes[model.properties.children]).toEqual({
    kind: 'array',
    items: plans.operations.getFutureModel,
  })
  expect(model.properties).not.toHaveProperty('metadata')
})
