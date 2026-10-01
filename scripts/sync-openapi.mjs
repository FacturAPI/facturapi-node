import { readFile, writeFile } from 'node:fs/promises'
import { readSpecification, resolveRevision } from './sdk/openapi-source.mjs'

const root = new URL('../', import.meta.url)
const previous = JSON.parse(
  await readFile(new URL('openapi/source.json', root), 'utf8'),
)
const source = {
  repository: previous.repository,
  revision: await resolveRevision(
    previous.repository,
    process.argv[2] || 'main',
  ),
  path: previous.path,
}
// Resolve first, then read from that exact commit even if the branch moves.
await readSpecification(source)
await writeFile(
  new URL('openapi/source.json', root),
  JSON.stringify(source, null, 2) + '\n',
)
console.log(
  `Pinned the public specification to ${source.revision}. Run pnpm generate:sdk.`,
)
