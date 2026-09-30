# Contributor instructions

## Consumer documentation

- Write `CHANGELOG.md` for developers who consume the SDK. Document observable behavior, public API and type changes, compatibility requirements, fixes, and any action required to upgrade.
- Keep build tools, bundlers, test runners, lint/format configuration, CI setup, and development-only dependency updates out of the changelog. Explain those in pull request descriptions instead.
- Keep changelog entries factual and concise. Use a friendly, task-oriented tone in the README; occasional emojis belong there, not in new changelog entries.
- Preserve published changelog entries as written. Apply editorial changes only to new entries; correct historical entries only when a concrete factual error has been verified.
- Keep migration guidance in the README. State which integrations need no code changes as explicitly as those that do. Verify historical behavior against released source before documenting a migration; do not infer a breaking change from a version number alone.
