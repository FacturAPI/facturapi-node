// API prose comes from the spec; these notes describe SDK argument/return shapes.
export function methodDocumentation(spec, operation, entry) {
  const dereference = (value) =>
    value?.$ref
      ? value.$ref
          .slice(2)
          .split('/')
          .reduce(
            (target, part) =>
              target?.[part.replaceAll('~1', '/').replaceAll('~0', '~')],
            spec,
          )
      : value
  const parameters = [
    ...(spec.paths[operation.path].parameters || []),
    ...(operation.parameters || []),
  ].map(dereference)
  const body = dereference(operation.requestBody)
  const bodySchema = dereference(Object.values(body?.content || {})[0]?.schema)
  const prose = [operation.summary, operation.description]
    .filter(Boolean)
    .map((text) => text.trim())
  const lines = []
  for (const argument of entry.arguments) {
    const path = Object.entries(entry.path).find(
      ([, binding]) => binding.argument === argument.name,
    )
    const field = Object.entries(entry.params || {}).find(
      ([, binding]) => binding?.argument === argument.name,
    )
    const parameter = parameters.find(
      (parameter) =>
        (path && parameter.in === 'path' && parameter.name === path[0]) ||
        (field && parameter.in === 'query' && parameter.name === field[0]),
    )
    const uploadField = {
      file: 'file',
      cerFile: 'cer',
      keyFile: 'key',
      password: 'password',
    }[argument.name]
    const description =
      parameter?.description ||
      (entry.body?.argument === argument.name
        ? body?.description || 'Datos de la solicitud.'
        : entry.params?.argument === argument.name
          ? 'Parámetros de consulta.'
          : dereference(bodySchema?.properties?.[uploadField])?.description ||
            argument.name)
    lines.push(`@param ${argument.name} - ${description}`)
    if (entry.params?.argument === argument.name)
      for (const parameter of parameters.filter(
        (parameter) =>
          parameter.in === 'query' &&
          parameter.required &&
          parameter.description,
      ))
        lines.push(
          `@param ${argument.name}.${parameter.name} - ${parameter.description}`,
        )
    if (
      ['file', 'cerFile', 'keyFile'].includes(argument.name) &&
      entry.extension
    )
      lines.push(
        `Acepta Blob, File, ArrayBuffer, Uint8Array o un stream de Node.js.`,
      )
  }
  const responses = Object.entries(operation.responses || {})
    .filter(([status]) => /^2\d\d$/.test(status))
    .map(([status, response]) => ({ status, ...dereference(response) }))
  const binary = responses.some((response) =>
    Object.values(response.content || {}).some(
      (content) => dereference(content.schema)?.format === 'binary',
    ),
  )
  const signedDownload = responses.some((response) =>
    Object.values(response.content || {}).some(
      (content) =>
        content.schema?.$ref === '#/components/schemas/SignedDownloadUrl',
    ),
  )
  lines.push(
    `@returns ${
      binary
        ? 'Archivo como stream en Node.js o Blob en el navegador.'
        : signedDownload
          ? 'Objeto SignedDownloadUrl con url, expires_at, content_type y filename.'
          : responses
              .filter((response) => response.description)
              .map((response) =>
                responses.length > 1
                  ? `${response.status}: ${response.description}`
                  : response.description,
              )
              .join('\n')
    }`,
  )
  return (
    '/**\n' +
    [...prose, lines.join('\n')]
      .join('\n\n')
      .replace(
        /\]\((\/[^)]*|#[^)]*)\)/g,
        (_, link) =>
          `](${link.startsWith('#') ? 'https://docs.facturapi.io/api/' : 'https://docs.facturapi.io'}${link})`,
      )
      .replaceAll('*/', '* /')
      .split('\n')
      .map((line) => ` * ${line}`)
      .join('\n') +
    '\n */\n'
  )
}
