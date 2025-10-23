---
mode: agent
description: 'Eliminate type `any` and improve type safety'
tools: ['edit', 'search']
---
# No Any Types

Replace loose `any` types with precise alternatives:

1. Search for `any` usage in the specified scope.
2. Infer the actual shape of the data by examining usage sites.
3. Define explicit types or interfaces that capture the real structure.
4. Update function signatures and variable declarations to use the new types.
5. Run type checks and tests to confirm no regressions.

Prioritize commonly used functions and data structures for maximum impact.
