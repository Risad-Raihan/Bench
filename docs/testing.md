# Testing

```bash
npm test
```

That runs Vitest once and exits. For watch mode: `npx vitest`.

Tests live next to the module they cover, named `*.test.ts`. They exercise
external behaviour through the module's public interface — given inputs,
assert the returned value or the database rows written — never internal
call sequences or private helpers.

The test database strategy (dedicated `TEST_DATABASE_URL`, truncate + seed
per test, no transaction rollback) is documented in `src/test/setup.ts`.
Pure helpers do not need a database.
