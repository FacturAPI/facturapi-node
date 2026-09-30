# Contributor instructions

## Consumer documentation

- Write `CHANGELOG.md` for developers who consume the SDK. Document observable behavior, public API and type changes, compatibility requirements, fixes, and any action required to upgrade.
- Keep build tools, bundlers, test runners, lint/format configuration, CI setup, and development-only dependency updates out of the changelog. Explain those in pull request descriptions instead.
- Keep changelog entries factual and concise. Use a friendly, task-oriented tone in the README; occasional emojis belong there, not in new changelog entries.
- Preserve published changelog entries as written. Apply editorial changes only to new entries; correct historical entries only when a concrete factual error has been verified.
- Keep migration guidance in the README. State which integrations need no code changes as explicitly as those that do. Verify historical behavior against released source before documenting a migration; do not infer a breaking change from a version number alone.

## OpenAPI generation

- Generate resource methods, request/response types, model aliases, and response date plans with `pnpm generate:sdk`. Do not edit files carrying a generation banner.
- `openapi/source.json` pins a public FacturAPI/facturapi-docs commit. Update it with `pnpm sync:openapi <public-docs-commit-sha>`, then regenerate. The checked-in snapshot keeps builds and CI independent of network access and sibling checkouts.
- `openapi-typescript` resolves the OpenAPI contract; the TypeScript compiler resolves the resulting types for date plans. Do not add a second JSON Schema interpreter or a handwritten date-path inventory.
- `scripts/sdk/resources.json` owns existing resource/method names, argument bindings, binary uploads, signature validation, and response overloads. Every public HTTP operation must have a binding; adding an operation intentionally fails generation until its public method is chosen.
- `scripts/sdk/models.json` preserves public model names. `scripts/sdk/enums.json` binds existing runtime enums to their semantic schema locations; never bind enums merely because their numeric/string values happen to match. Named enum drift must be corrected explicitly.
- Preserve the real HTTP transport, binary behavior, and local cryptography. Test external HTTP boundaries with fixtures; do not replace these implementations with mocks.
- Run `pnpm generate:sdk:check`, `pnpm test`, `pnpm lint`, and browser tests for generation changes. Cover input strings/Date values, nullable dates, complement discriminants, opaque metadata/XML, and additions to the contract.
- This repository is public. Never copy private implementation sources, paths, identifiers, diagnostics, or planning context into snapshots, generated files, tests, commits, PR descriptions, or review replies.
