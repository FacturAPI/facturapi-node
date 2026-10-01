import assert from 'node:assert/strict'
import * as yaml from 'js-yaml'

export async function resolveRevision(repository, ref = 'main') {
  if (/^[a-f0-9]{40}$/.test(ref)) return ref
  const response = await fetch(
    `https://api.github.com/repos/${repository}/commits/${encodeURIComponent(ref)}`,
    {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(30_000),
    },
  )
  assert(
    response.ok,
    `Could not resolve the public documentation ref: HTTP ${response.status}`,
  )
  const { sha } = await response.json()
  assert.match(
    sha,
    /^[a-f0-9]{40}$/,
    'Expected a complete documentation commit SHA.',
  )
  return sha
}

export async function readSpecification(source) {
  assert.match(
    source.revision,
    /^[a-f0-9]{40}$/,
    'Pin a complete documentation commit SHA with pnpm sync:openapi.',
  )
  const response = await fetch(
    `https://raw.githubusercontent.com/${source.repository}/${source.revision}/${source.path}`,
    { signal: AbortSignal.timeout(30_000) },
  )
  assert(
    response.ok,
    `Could not read the public specification: HTTP ${response.status}`,
  )
  const content = Buffer.from(await response.arrayBuffer())
  const spec = yaml.load(content.toString('utf8'), {
    schema: yaml.JSON_SCHEMA,
  })
  assert(spec.openapi === '3.1.0', 'Expected the public OpenAPI 3.1 contract.')
  const presentation = new Set([
    'x-codeSamples',
    'x-logo',
    'example',
    'examples',
    'externalDocs',
  ])
  // Annotation names can also be real property/parameter/schema names.
  const dictionaries = new WeakSet()
  const dictionaryKeys = new Set([
    'properties',
    'patternProperties',
    '$defs',
    'schemas',
    'parameters',
    'headers',
    'paths',
    'webhooks',
    'responses',
    'content',
    'securitySchemes',
    'requestBodies',
    'callbacks',
    'links',
  ])
  return JSON.parse(
    JSON.stringify(spec, function (key, value) {
      if (value && typeof value === 'object' && dictionaryKeys.has(key))
        dictionaries.add(value)
      return presentation.has(key) && !dictionaries.has(this)
        ? undefined
        : value
    }),
  )
}
