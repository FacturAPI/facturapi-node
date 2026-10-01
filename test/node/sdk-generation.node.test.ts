import { resolve } from 'node:path'
import { expect, it, vi } from 'vitest'
import { methodDocumentation } from '../../scripts/sdk/documentation.mjs'
import {
  readSpecification,
  resolveRevision,
} from '../../scripts/sdk/openapi-source.mjs'
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

it('documents SDK arguments, binary returns and absolute links from the public spec', () => {
  const operation = {
    operationId: 'previewFuture',
    path: '/future/{future_id}',
    summary: 'Vista previa',
    description:
      'Consulta la [guía](/docs/guides/invoices) y la [referencia](#tag/invoice).',
    parameters: [
      {
        in: 'path',
        name: 'future_id',
        description: 'ID del recurso.',
        schema: { type: 'string' },
      },
      {
        in: 'query',
        name: 'amount',
        required: true,
        description: 'Monto en la moneda del documento.',
      },
      {
        in: 'query',
        name: 'mode',
        required: false,
        description: 'Modo de la solicitud.',
      },
    ],
    responses: {
      200: {
        description: 'PDF',
        content: {
          'application/pdf': { schema: { type: 'string', format: 'binary' } },
        },
      },
    },
  }
  const spec = { paths: { [operation.path]: {} } }
  const documentation = methodDocumentation(
    spec,
    operation,
    resolveOperationBinding(spec, operation),
  )
  expect(documentation).toContain('@param id - ID del recurso.')
  expect(documentation).toContain(
    '@param params.amount - Monto en la moneda del documento.',
  )
  expect(documentation).toContain(
    '@returns Archivo como stream en Node.js o Blob en el navegador.',
  )
  expect(documentation).toContain(
    'https://docs.facturapi.io/docs/guides/invoices',
  )
  expect(documentation).toContain('https://docs.facturapi.io/api/#tag/invoice')
  expect(
    methodDocumentation(
      spec,
      operation,
      resolveOperationBinding(spec, operation, {
        querySchema: 'ConditionalInput',
      }),
    ),
  ).toContain('@param params.mode - Modo de la solicitud.')
  expect(
    methodDocumentation(
      spec,
      {
        ...operation,
        responses: {
          200: {
            description: 'Objeto con un enlace temporal y metadatos.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SignedDownloadUrl' },
              },
            },
          },
        },
      },
      resolveOperationBinding(spec, operation),
    ),
  ).toContain(
    '@returns Objeto SignedDownloadUrl con url, expires_at, content_type y filename.',
  )
})

it('resolves moving refs once and reads the pinned commit while preserving schema property names', async () => {
  const content = Buffer.from(
    JSON.stringify({
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {},
      components: {
        schemas: {
          Future: {
            type: 'object',
            properties: {
              example: { type: 'string', description: 'A real field.' },
            },
          },
        },
      },
    }),
  )
  const revision = 'a'.repeat(40)
  const fetch = vi.fn(async (url: string) => {
    if (url.startsWith('https://api.github.com/')) {
      expect(url).toBe(
        'https://api.github.com/repos/FacturAPI/facturapi-docs/commits/docs%2Ffuture-contract',
      )
      return Response.json({ sha: revision })
    }
    expect(url).toBe(
      `https://raw.githubusercontent.com/FacturAPI/facturapi-docs/${revision}/website/openapi_v2.yaml`,
    )
    return new Response(content)
  })
  vi.stubGlobal('fetch', fetch)
  try {
    const source = {
      repository: 'FacturAPI/facturapi-docs',
      revision: await resolveRevision(
        'FacturAPI/facturapi-docs',
        'docs/future-contract',
      ),
      path: 'website/openapi_v2.yaml',
    }
    expect(source.revision).toBe(revision)
    const spec = await readSpecification(source)
    expect(spec.components.schemas.Future.properties.example).toBeDefined()
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(await resolveRevision(source.repository, revision)).toBe(revision)
    expect(fetch).toHaveBeenCalledTimes(2)
    await expect(
      readSpecification({ ...source, revision: 'main' }),
    ).rejects.toThrow('complete documentation commit SHA')
    expect(fetch).toHaveBeenCalledTimes(2)
  } finally {
    vi.unstubAllGlobals()
  }
})
