---
description: Help fix a bug in the codebase
---

# Fix Bug

You are helping to fix a bug in the codebase.

## Instructions

1. **Understand the bug**:
   - Read the bug report carefully
   - Identify the expected vs. actual behavior
   - Review any error messages or stack traces

2. **Locate the problem**:
   - Search for relevant code using semantic search
   - Check recent changes that might have introduced the bug
   - Look for similar issues that were fixed before

3. **Reproduce the issue**:
   - Set up the necessary conditions to reproduce
   - Write a test that fails due to the bug
   - Verify the bug exists in the current codebase

4. **Fix the bug**:
   - Make minimal changes to fix the issue
   - Ensure the fix doesn't break existing functionality
   - Update or add tests to prevent regression

5. **Verify the fix**:
   - Run all relevant tests
   - Verify the original bug is fixed
   - Check for any side effects
   - Test edge cases

6. **Document the fix**:
   - Update comments if the fix changes behavior
   - Add comments explaining non-obvious fixes
   - Update documentation if needed

## Example Workflow

```typescript
// 1. Write a failing test
test('should handle null input gracefully', () => {
  expect(() => processData(null)).not.toThrow();
});

// 2. Fix the bug
function processData(data: Data | null): Result {
  if (!data) {
    return { success: false, error: 'No data provided' };
  }
  // ... rest of the function
}

// 3. Verify the test passes
// 4. Check related tests still pass
```

## Things to Avoid

- Making changes unrelated to the bug fix
- Fixing multiple bugs in one change
- Breaking existing functionality
- Over-engineering the solution
- Skipping tests

## Output

Provide:
- A clear explanation of what caused the bug
- The minimal code changes to fix it
- Tests that verify the fix
- Any documentation updates needed
