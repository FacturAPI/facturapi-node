import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { readSpecification, downloadPublicFile } from './sdk/openapi-source.mjs'

const root = new URL('../', import.meta.url)
const previous = JSON.parse(
  await readFile(new URL('openapi/source.json', root), 'utf8'),
)
const filename = process.argv[2] === '--file' ? process.argv[3] : undefined
assert(
  process.argv[2] !== '--file' || filename,
  'Provide a YAML file after --file.',
)
const source = {
  repository: previous.repository,
  ref: filename ? previous.ref || 'main' : process.argv[2] || 'main',
  path: previous.path,
}
const { sha256 } = await readSpecification(source, filename)
if (!filename) {
  const manifest = (await downloadPublicFile(source, 'website/openapi.sha256'))
    .toString('utf8')
    .trim()
    .split('\n')
  assert(
    manifest.includes(`${sha256}  ${source.path.split('/').at(-1)}`),
    'The documentation hash does not match the downloaded specification. Retry after updating the docs manifest.',
  )
}
await writeFile(
  new URL('openapi/source.json', root),
  JSON.stringify({ ...source, sha256 }, null, 2) + '\n',
)
console.log('Updated the public specification hash. Run pnpm generate:sdk.')
