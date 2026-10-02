import ts from 'typescript'

// Inspect the types produced by openapi-typescript instead of implementing
// JSON Schema reference, intersection, and union resolution a second time.
export function compileDatePlans(filename, content) {
  const options = {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    skipLibCheck: true,
  }
  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (path, languageVersion, ...rest) =>
    path === filename
      ? ts.createSourceFile(path, content, languageVersion, true)
      : getSourceFile(path, languageVersion, ...rest)
  const program = ts.createProgram([filename], options, host)
  const checker = program.getTypeChecker()
  const source = program.getSourceFile(filename)
  const nodes = [{ kind: 'none' }, { kind: 'date' }]
  const visited = new Map()
  const literals = (type) =>
    type.isUnion()
      ? type.types.flatMap(literals)
      : type.isStringLiteral() || type.isNumberLiteral()
        ? [type.value]
        : []
  function compile(type) {
    if (type.symbol?.name === 'Date') return 1
    if (visited.has(type)) return visited.get(type)
    if (type.isUnion()) {
      const variants = type.types.filter(
        (variant) =>
          !(variant.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)),
      )
      if (variants.length === 1) return compile(variants[0])
      if (
        variants.some((variant) => variant.symbol?.name === 'Date') &&
        variants.every(
          (variant) =>
            variant.symbol?.name === 'Date' ||
            variant.flags & ts.TypeFlags.StringLike,
        )
      ) {
        const id = nodes.length
        visited.set(type, id)
        nodes.push({ kind: 'date-time' })
        return id
      }
    }
    if (
      type.flags &
      (ts.TypeFlags.Any |
        ts.TypeFlags.Unknown |
        ts.TypeFlags.StringLike |
        ts.TypeFlags.NumberLike |
        ts.TypeFlags.BooleanLike |
        ts.TypeFlags.Null |
        ts.TypeFlags.Undefined |
        ts.TypeFlags.Never)
    )
      return 0
    const id = nodes.length
    visited.set(type, id)
    nodes.push({ kind: 'none' })
    if (type.isUnion()) {
      nodes[id] = {
        kind: 'union',
        variants: type.types.map((variant) => ({
          plan: compile(variant),
          match: Object.fromEntries(
            checker.getPropertiesOfType(variant).flatMap((property) => {
              const values = literals(
                checker.getTypeOfSymbolAtLocation(property, source),
              )
              return values.length === 1 ? [[property.name, values]] : []
            }),
          ),
        })),
      }
    } else if (checker.isArrayType(type) || checker.isTupleType(type)) {
      nodes[id] = {
        kind: 'array',
        items: compile(checker.getIndexTypeOfType(type, ts.IndexKind.Number)),
      }
    } else {
      nodes[id] = {
        kind: 'object',
        properties: Object.fromEntries(
          checker
            .getPropertiesOfType(type)
            .map((property) => [
              property.name,
              compile(checker.getTypeOfSymbolAtLocation(property, source)),
            ]),
        ),
        additional: checker.getIndexTypeOfType(type, ts.IndexKind.String)
          ? compile(checker.getIndexTypeOfType(type, ts.IndexKind.String))
          : 0,
      }
    }
    return id
  }
  const components = checker.getTypeAtLocation(
    source.statements.find(
      (node) =>
        ts.isInterfaceDeclaration(node) && node.name.text === 'components',
    ),
  )
  const schemas = checker.getTypeOfSymbolAtLocation(
    checker.getPropertyOfType(components, 'schemas'),
    source,
  )
  const componentPlans = Object.fromEntries(
    checker
      .getPropertiesOfType(schemas)
      .map((property) => [
        property.name,
        compile(checker.getTypeOfSymbolAtLocation(property, source)),
      ]),
  )
  const operations = checker.getTypeAtLocation(
    source.statements.find(
      (node) =>
        ts.isInterfaceDeclaration(node) && node.name.text === 'operations',
    ),
  )
  const operationPlans = Object.fromEntries(
    checker.getPropertiesOfType(operations).map((property) => {
      const operation = checker.getTypeOfSymbolAtLocation(property, source)
      const responses = checker.getTypeOfSymbolAtLocation(
        checker.getPropertyOfType(operation, 'responses'),
        source,
      )
      const plans = checker
        .getPropertiesOfType(responses)
        .filter((response) => /^2\d\d$/.test(response.name))
        .flatMap((response) => {
          const content = checker.getPropertyOfType(
            checker.getTypeOfSymbolAtLocation(response, source),
            'content',
          )
          if (!content) return []
          const json = checker.getPropertyOfType(
            checker.getNonNullableType(
              checker.getTypeOfSymbolAtLocation(content, source),
            ),
            'application/json',
          )
          return json
            ? [compile(checker.getTypeOfSymbolAtLocation(json, source))]
            : []
        })
      const id =
        plans.length === 1
          ? plans[0]
          : nodes.push({
              kind: 'union',
              variants: plans.map((plan) => ({ plan, match: {} })),
            }) - 1
      return [property.name, id]
    }),
  )
  // Retain only branches that can reach a Date, including recursive types.
  const active = new Set(
    nodes.flatMap((node, id) =>
      node.kind === 'date' || node.kind === 'date-time' ? [id] : [],
    ),
  )
  for (let changed = true; changed;) {
    changed = false
    nodes.forEach((node, id) => {
      const children =
        node.kind === 'object'
          ? [...Object.values(node.properties), node.additional]
          : node.kind === 'array'
            ? [node.items]
            : node.kind === 'union'
              ? node.variants.map((variant) => variant.plan)
              : []
      if (!active.has(id) && children.some((child) => active.has(child))) {
        active.add(id)
        changed = true
      }
    })
  }
  const ids = new Map(
    [...active].sort((a, b) => a - b).map((id, index) => [id, index + 1]),
  )
  return {
    nodes: [
      { kind: 'none' },
      ...[...ids.keys()].map((id) => {
        const node = nodes[id]
        if (node.kind === 'object')
          return {
            kind: 'object',
            properties: Object.fromEntries(
              Object.entries(node.properties)
                .filter(([, plan]) => active.has(plan))
                .map(([name, plan]) => [name, ids.get(plan)]),
            ),
            ...(active.has(node.additional)
              ? { additional: ids.get(node.additional) }
              : {}),
          }
        if (node.kind === 'array')
          return { ...node, items: ids.get(node.items) }
        if (node.kind === 'union')
          return {
            ...node,
            variants: node.variants.map((variant) => ({
              ...variant,
              plan: ids.get(variant.plan) || 0,
            })),
          }
        return node
      }),
    ],
    components: Object.fromEntries(
      Object.entries(componentPlans).map(([name, id]) => [
        name,
        ids.get(id) || 0,
      ]),
    ),
    operations: Object.fromEntries(
      Object.entries(operationPlans).map(([name, id]) => [
        name,
        ids.get(id) || 0,
      ]),
    ),
  }
}
