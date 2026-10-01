import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import * as yaml from 'js-yaml'

export async function readSpecification(source, filename) {
  const content = filename
    ? await readFile(filename)
    : await downloadPublicFile(source, source.path)
  const sha256 = createHash('sha256').update(content).digest('hex')
  if (source.sha256)
    assert.equal(
      sha256,
      source.sha256,
      'The public specification changed. Run pnpm sync:openapi and review the regenerated SDK.',
    )
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
  return {
    sha256,
    spec: JSON.parse(
      JSON.stringify(spec, function (key, value) {
        if (value && typeof value === 'object' && dictionaryKeys.has(key))
          dictionaries.add(value)
        return presentation.has(key) && !dictionaries.has(this)
          ? undefined
          : value
      }),
    ),
  }
}

export async function downloadPublicFile(source, path) {
  const response = await fetch(
    `https://raw.githubusercontent.com/${source.repository}/${source.ref || 'main'}/${path}`,
    { signal: AbortSignal.timeout(30_000) },
  )
  assert(response.ok, `Could not read ${path}: HTTP ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}
