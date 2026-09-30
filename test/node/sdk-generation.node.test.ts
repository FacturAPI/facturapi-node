import { resolve } from 'node:path'
import { expect, it } from 'vitest'
import { compileDatePlans } from '../../scripts/sdk/date-plans.mjs'
import { resolveOperationBinding } from '../../scripts/sdk/operation-bindings.mjs'

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

it('derives bindings for new operations and preserves explicit SDK exceptions', () => {
  const operation = {
    operationId: 'createFutureResource',
    path: '/future/{resource_id}/{format}',
    requestBody: { required: true },
    parameters: [
      { $ref: '#/components/parameters/FutureCursor' },
      { in: 'path', name: 'format', schema: { type: 'string' } },
    ],
  }
  const spec = {
    paths: {
      [operation.path]: {
        parameters: [
          { in: 'path', name: 'resource_id', schema: { type: 'string' } },
        ],
      },
    },
    components: {
      parameters: {
        FutureCursor: { in: 'query', name: 'cursor', required: false },
      },
    },
  }
  const binding = resolveOperationBinding(spec, operation, {
    path: { format: 'pdf' },
    argumentNames: { body: 'options' },
  })
  expect(binding.path).toEqual({
    resource_id: { argument: 'id' },
    format: { value: 'pdf' },
  })
  expect(binding.body).toEqual({ argument: 'options' })
  expect(binding.params).toEqual({ argument: 'params' })
  expect(binding.arguments).toEqual([
    { name: 'id', optional: false, type: 'string' },
    { name: 'options', optional: false },
    { name: 'params', optional: true, nullable: true },
  ])
  spec.components.parameters.FutureCursor.required = true
  expect(resolveOperationBinding(spec, operation).arguments.at(-1)).toEqual({
    name: 'params',
    optional: false,
    nullable: false,
  })
  expect(() =>
    resolveOperationBinding(spec, operation, {
      path: { removed_parameter: 'pdf' },
    }),
  ).toThrow('Unknown path override')
})
