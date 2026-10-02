import assert from 'node:assert/strict'

// The spec owns HTTP bindings. Overrides only preserve SDK naming and signatures.
export function resolveOperationBinding(spec, operation, overrides = {}) {
  const parameters = [
    ...(spec.paths[operation.path].parameters || []),
    ...(operation.parameters || []),
  ].map((parameter) =>
    parameter.$ref
      ? spec.components.parameters[parameter.$ref.split('/').at(-1)]
      : parameter,
  )
  const pathParameters = [...operation.path.matchAll(/\{([^}]+)\}/g)]
    .map(([, name]) => name)
    .filter((name) => !(name in (overrides.path || {})))
  for (const name of Object.keys(overrides.path || {})) {
    assert(
      operation.path.includes(`{${name}}`),
      `Unknown path override for ${operation.operationId}: ${name}`,
    )
  }
  const path = Object.fromEntries(
    [...operation.path.matchAll(/\{([^}]+)\}/g)].map(([, name]) => [
      name,
      name in (overrides.path || {})
        ? { value: overrides.path[name] }
        : {
            argument:
              overrides.argumentNames?.[name] ||
              (pathParameters.length === 1
                ? 'id'
                : name.replace(/_([a-z])/g, (_, letter) =>
                    letter.toUpperCase(),
                  )),
          },
    ]),
  )
  const query = parameters.filter((parameter) => parameter.in === 'query')
  const body =
    overrides.body ||
    (operation.requestBody && !overrides.extension
      ? { argument: overrides.argumentNames?.body || 'data' }
      : undefined)
  const params =
    overrides.params ||
    (query.length
      ? { argument: overrides.argumentNames?.query || 'params' }
      : undefined)
  const args = overrides.arguments || [
    ...pathParameters.map((name) => {
      assert(
        parameters.some(
          (parameter) =>
            parameter.in === 'path' &&
            parameter.name === name &&
            parameter.schema?.type === 'string',
        ),
        `A non-string path parameter needs an explicit SDK argument: ${name}`,
      )
      return { name: path[name].argument, optional: false, type: 'string' }
    }),
    ...(body
      ? [
          {
            name: body.argument,
            optional: operation.requestBody.required === false,
          },
        ]
      : []),
    ...(params
      ? [
          {
            name: params.argument,
            optional: !query.some((parameter) => parameter.required),
            nullable: !query.some((parameter) => parameter.required),
          },
        ]
      : []),
  ]
  return {
    ...overrides,
    hasQuery: query.length > 0,
    path,
    arguments: args.map((argument) => ({
      ...argument,
      ...(argument.name in (overrides.optional || {})
        ? { optional: overrides.optional[argument.name] }
        : {}),
      ...(argument.name in (overrides.nullable || {})
        ? { nullable: overrides.nullable[argument.name] }
        : {}),
    })),
    ...(body ? { body } : {}),
    ...(params ? { params } : {}),
    ...(overrides.extension && overrides.extension !== 'validateSignature'
      ? { formData: true }
      : {}),
  }
}
