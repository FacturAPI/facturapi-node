# Contributor instructions

## Consumer documentation

- Write `CHANGELOG.md` for developers who consume the SDK. Document observable behavior, public API and type changes, compatibility requirements, fixes, and any action required to upgrade.
- Keep build tools, bundlers, test runners, lint/format configuration, CI setup, and development-only dependency updates out of the changelog. Explain those in pull request descriptions instead.
- Summarize type changes by consumer capability or correction, not by individual fields or implementation steps. Put detailed upgrade cases in the README migration guide.
- Keep changelog entries factual and concise. Use a friendly, task-oriented tone in the README; occasional emojis belong there, not in new changelog entries.
- Preserve published changelog entries as written. Apply editorial changes only to new entries; correct historical entries only when a concrete factual error has been verified.
- Keep migration guidance in the README. State which integrations need no code changes as explicitly as those that do. Verify historical behavior against released source before documenting a migration; do not infer a breaking change from a version number alone.

## OpenAPI generation

- Generate resource methods, request/response types, model aliases, and response date plans with `pnpm generate:sdk`. Do not edit files carrying a generation banner.
- `openapi/source.json` pins a complete public FacturAPI/facturapi-docs commit SHA. `pnpm sync:openapi` resolves docs `main` to its current commit, downloads the spec from that exact commit, and records it only after parsing succeeds. An explicit public branch, tag or full SHA is supported for coordinated PRs. Run `pnpm generate:sdk` after syncing.
- Generation always downloads the YAML from the recorded commit into memory; it never follows a moving branch or writes a spec snapshot. Builds and runtime tests use tracked generated files and need no spec download. Commit public documentation changes and sync their public ref before generating; do not record local filesystem paths or pin unpublished local changes.
- Generate method summaries, argument descriptions and return documentation from OpenAPI. Keep SDK-specific binary upload/download and local webhook verification guidance in the generator; attach documentation to every public overload and use absolute documentation links.
- `openapi-typescript` resolves the OpenAPI contract; the TypeScript compiler resolves the resulting types for date plans. Do not add a second JSON Schema interpreter or a handwritten date-path inventory.
- `scripts/sdk/resources.json` maps public resource/method names to operation IDs. Use a string operation ID for normal endpoints; HTTP bindings and signatures are derived from the spec. Add overrides only for established argument names, optionality/nullability, fixed download formats, multipart/local-signature behavior, or response overloads. Do not repeat inferred path/body/query bindings. Every public HTTP operation must have a binding; adding an operation intentionally fails generation until its public method is chosen.
- Use `bodySchema` for an explicit SDK convenience method that selects a specific input variant from the public spec while preserving the original HTTP operation. Keep `create()` available for dynamic or incomplete customer inputs; do not add runtime validation or rewrite the supplied body.
- Use `querySchema` to bind a grouped query contract from the public spec when separate OpenAPI query parameters cannot express dependencies between them. Keep conditional values and required fields in that schema rather than repeating them in generator code. TypeScript cannot express arbitrary string exclusions (`not`); do not invent a narrower country catalog to work around that limitation.
- Use `bodyByQueryFlag` only for a verified relationship between a query flag and an input schema that OpenAPI cannot express across parameters and request bodies. Keep both input schemas in the public spec; require a literal `true` to select the incomplete body and preserve the normal input for dynamic booleans.
- Preserve the SDK convention that a declared request body is a required method argument unless the operation explicitly marks it optional (`required: false`) or a compatibility override says otherwise. Optional query objects accept null by default; explicit overrides preserve existing exceptions.
- `scripts/sdk/models.json` preserves public model names. `scripts/sdk/enums.json` binds existing runtime enums to their semantic schema locations; never bind enums merely because their numeric/string values happen to match. Named enum drift must be corrected explicitly.
- Preserve the real HTTP transport, binary behavior, and local cryptography. Test external HTTP boundaries with fixtures; do not replace these implementations with mocks.
- Run `pnpm generate:sdk:check`, `pnpm test`, `pnpm lint`, and browser tests for generation changes. Cover input strings/Date values, nullable dates, complement discriminants, opaque metadata/XML, and additions to the contract.
- This repository is public. Never copy private implementation sources, paths, identifiers, diagnostics, or planning context into generated files, tests, commits, PR descriptions, or review replies.
- Keep the source commit metadata and generated sources tracked; do not commit a downloaded spec. Mark generated artifacts with `linguist-generated` in `.gitattributes` so reviews focus on the generator, bindings, runtime, and tests; keep handwritten configuration visible. Update the attributes when adding generated output files.

- Describe current SDK capabilities in the README without release announcements ; version references are appropriate when they explain verified compatibility or when a capability became available. Put release improvements in the changelog. The SDK supports Node.js and browsers; keep titles and summaries accurate for both.
