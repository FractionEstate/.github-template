---
description: Help implement a new feature
---

# Add Feature

You are helping to implement a new feature in the codebase.

## Instructions

1. **Understand the requirements**:
   - Read the feature request thoroughly
   - Clarify any ambiguous requirements
   - Identify acceptance criteria
   - Consider edge cases and error scenarios

2. **Design the solution**:
   - Review existing similar features for consistency
   - Design APIs and data structures
   - Consider scalability and performance
   - Plan for testability
   - Identify files that need changes

3. **Break down the work**:
   - Divide the feature into small, incremental steps
   - Identify dependencies between steps
   - Plan to keep the codebase in a working state

4. **Implement the feature**:
   - Follow existing code patterns and conventions
   - Write clean, maintainable code
   - Add appropriate error handling
   - Document public APIs
   - Keep changes focused and minimal

5. **Test thoroughly**:
   - Write unit tests for new functionality
   - Add integration tests for workflows
   - Test edge cases and error conditions
   - Verify backwards compatibility
   - Test with realistic data

6. **Document the feature**:
   - Update API documentation
   - Add usage examples
   - Update user-facing documentation
   - Add inline comments for complex logic

## Implementation Checklist

- [ ] Requirements are clear and understood
- [ ] Design is reviewed and approved
- [ ] Implementation follows project conventions
- [ ] Unit tests are added and passing
- [ ] Integration tests are added and passing
- [ ] Edge cases are handled
- [ ] Error handling is implemented
- [ ] Code is documented
- [ ] User documentation is updated
- [ ] Performance is acceptable
- [ ] Security considerations are addressed
- [ ] Backwards compatibility is maintained

## Example Workflow

```typescript
// 1. Define the API
interface FeatureOptions {
  enabled: boolean;
  config?: FeatureConfig;
}

// 2. Implement core functionality
export function enableFeature(options: FeatureOptions): void {
  validateOptions(options);
  // Implementation
}

// 3. Add tests
describe('Feature', () => {
  test('enables feature with valid options', () => {
    expect(() => enableFeature({ enabled: true })).not.toThrow();
  });
  
  test('throws on invalid options', () => {
    expect(() => enableFeature({} as any)).toThrow();
  });
});

// 4. Document
/**
 * Enables the new feature with the specified options.
 * @param options - Configuration for the feature
 * @throws {ValidationError} If options are invalid
 */
```

## Things to Avoid

- Adding unnecessary complexity
- Breaking existing functionality
- Inconsistent patterns with rest of codebase
- Missing error handling
- Insufficient testing
- Poor performance without measurement
- Unclear or missing documentation

## Output

Provide:
- Clean, well-structured code
- Comprehensive tests
- Clear documentation
- Migration guide if needed
- Performance considerations if relevant
