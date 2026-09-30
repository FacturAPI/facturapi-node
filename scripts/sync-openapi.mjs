import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import yaml from 'js-yaml'

const root = new URL('../', import.meta.url)
const source = JSON.parse(
  await readFile(new URL('openapi/source.json', root), 'utf8'),
)
const revision = process.argv[2] || source.revision
assert.match(
  revision,
  /^[a-f0-9]{40}$/,
  'Use a public documentation commit SHA.',
)
const response = await fetch(
  `https://raw.githubusercontent.com/${source.repository}/${revision}/${source.path}`,
)
assert(
  response.ok,
  `Could not read the public specification: HTTP ${response.status}`,
)
const spec = yaml.load(await response.text(), { schema: yaml.JSON_SCHEMA })
assert(spec.openapi === '3.1.0', 'Expected the public OpenAPI 3.1 contract.')
const presentation = new Set([
  'x-codeSamples',
  'x-logo',
  'example',
  'examples',
  'externalDocs',
])
await writeFile(
  new URL('openapi/facturapi.json', root),
  JSON.stringify(
    spec,
    (key, value) => (presentation.has(key) ? undefined : value),
    2,
  ) + '\n',
)
await writeFile(
  new URL('openapi/source.json', root),
  JSON.stringify({ ...source, revision }, null, 2) + '\n',
)
console.log(
  `Updated the public specification to ${revision}. Run pnpm generate:sdk.`,
)
