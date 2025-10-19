---
description: Implement a solution following best practices
---

# Implement Solution

Implement a high-quality, general-purpose solution that solves the problem correctly for all valid inputs.

## Implementation Principles

### 1. Understand the Problem
- Read requirements carefully
- Don't just make tests pass - understand WHY tests exist
- Identify the actual problem being solved
- Consider all valid inputs, not just test cases

### 2. General Solution
- **DON'T** hard-code values for specific test inputs
- **DON'T** create shortcuts that only work for known cases
- **DO** implement the actual algorithm or logic
- **DO** handle all valid inputs correctly

### 3. Code Quality
- Follow project coding standards
- Write clean, readable code
- Use meaningful names
- Keep functions focused and concise
- Add comments for complex logic

### 4. Best Practices
- Follow SOLID principles
- Use appropriate data structures
- Handle errors gracefully
- Consider performance implications
- Make code maintainable and extendable

### 5. Validation
- Test with various inputs beyond test cases
- Verify edge cases are handled
- Check error conditions
- Ensure no regressions

## Bad Example (Hard-coded)

```typescript
// DON'T do this - only works for specific test inputs
function processData(input: number): number {
  if (input === 5) return 25;
  if (input === 10) return 100;
  return 0;
}
```

## Good Example (General Solution)

```typescript
// DO this - works for all valid inputs
function processData(input: number): number {
  if (input < 0) {
    throw new Error('Input must be non-negative');
  }
  return input * input;
}
```

## Implementation Checklist

- [ ] Understand the actual problem (not just the tests)
- [ ] Implement the correct algorithm/logic
- [ ] Handle all valid inputs properly
- [ ] Add appropriate error handling
- [ ] Follow project conventions
- [ ] Write clean, maintainable code
- [ ] Add necessary tests
- [ ] Verify with various inputs
- [ ] Document complex logic
- [ ] Review for potential issues

## When Tests Are Wrong

If you notice that:
- Tests have incorrect expectations
- Test cases don't match requirements
- Tests are testing implementation details
- The task itself is unreasonable or infeasible

**TELL THE USER** - explain the issue and suggest corrections.

## Robustness

Your solution should be:
- **Correct**: Solves the problem for all valid inputs
- **Robust**: Handles errors and edge cases
- **Maintainable**: Easy to understand and modify
- **Extendable**: Can be enhanced without major rewrites
- **Principled**: Follows established patterns and best practices

## Output

Provide a complete, well-tested implementation that:
1. Solves the problem generally (not just for test cases)
2. Follows best practices
3. Is maintainable and extendable
4. Handles edge cases and errors appropriately
5. Includes appropriate tests and documentation
