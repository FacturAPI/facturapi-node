import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import ts from 'typescript'

copyFileSync('dist/index.d.mts', 'dist/index.d.ts')

const source = ts.createSourceFile(
  'index.d.ts',
  readFileSync('dist/index.d.ts', 'utf8'),
  ts.ScriptTarget.Latest,
  true,
)
const declarations = new Map(
  source.statements
    .filter((statement) => statement.name)
    .map((statement) => [statement.name.text, statement]),
)
const aliases = []
for (const statement of source.statements) {
  if (
    statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    ) &&
    !statement.modifiers.some(
      (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
    )
  ) {
    if (
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement)
    ) {
      const parameters = statement.typeParameters
      aliases.push(
        `export type ${statement.name.text}${parameters?.length ? `<${parameters.map((parameter) => parameter.getText(source)).join(', ')}>` : ''} = API.${statement.name.text}${parameters?.length ? `<${parameters.map((parameter) => parameter.name.text).join(', ')}>` : ''};`,
      )
    } else if (statement.name) {
      aliases.push(
        `export import ${statement.name.text} = API.${statement.name.text};`,
      )
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        aliases.push(
          `export import ${declaration.name.getText(source)} = API.${declaration.name.getText(source)};`,
        )
      }
    }
  }
  if (
    !ts.isExportDeclaration(statement) ||
    !statement.exportClause ||
    !ts.isNamedExports(statement.exportClause)
  )
    continue
  for (const element of statement.exportClause.elements) {
    if (element.name.text === 'default') continue
    if (!statement.isTypeOnly && !element.isTypeOnly) {
      aliases.push(
        `export import ${element.name.text} = API.${element.name.text};`,
      )
      continue
    }
    const parameters = declarations.get(
      (element.propertyName || element.name).text,
    )?.typeParameters
    aliases.push(
      `export type ${element.name.text}${parameters?.length ? `<${parameters.map((parameter) => parameter.getText(source)).join(', ')}>` : ''} = API.${element.name.text}${parameters?.length ? `<${parameters.map((parameter) => parameter.name.text).join(', ')}>` : ''};`,
    )
  }
}
writeFileSync(
  'dist/index.d.cts',
  `import * as API from './index.js';
declare class Facturapi extends API.default {
  static readonly default: typeof Facturapi;
}
declare namespace Facturapi {
${aliases.join('\n')}
}
export = Facturapi;
`,
)
