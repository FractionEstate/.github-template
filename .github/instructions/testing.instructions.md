---
description: Guidelines for writing tests
---

# Testing Guidelines

## Test Structure

Tests should follow the Arrange-Act-Assert (AAA) pattern:

```typescript
test('should do something', () => {
  // Arrange - Set up test data and conditions
  const input = createTestInput();
  
  // Act - Execute the code being tested
  const result = functionUnderTest(input);
  
  // Assert - Verify the results
  expect(result).toBe(expectedOutput);
});
```

## Test Organization

- Group related tests using `describe` blocks
- Use clear, descriptive test names that explain what is being tested
- Keep tests focused on a single behavior or scenario
- Place test files next to the code they test (e.g., `myModule.ts` and `myModule.test.ts`)

## Best Practices

### Test Independence

- Each test should be independent and not rely on other tests
- Use `beforeEach` and `afterEach` hooks to set up and tear down test state
- Avoid shared mutable state between tests

### Test Coverage

- Aim for high coverage on critical business logic
- Test edge cases and error conditions
- Don't just test the happy path

### Mocking and Stubbing

- Mock external dependencies to isolate the code being tested
- Use dependency injection to make code more testable
- Keep mocks simple and focused

### Async Testing

- Use async/await for testing asynchronous code
- Set appropriate timeouts for long-running operations
- Clean up async operations in afterEach hooks

## Testing Patterns

### Unit Tests

Test individual functions or methods in isolation:

```typescript
describe('Calculator', () => {
  test('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  
  test('throws on invalid input', () => {
    expect(() => add('2', 3)).toThrow();
  });
});
```

### Integration Tests

Test how components work together:

```typescript
describe('User API', () => {
  test('creates and retrieves a user', async () => {
    const user = await createUser({ name: 'Test' });
    const retrieved = await getUser(user.id);
    expect(retrieved.name).toBe('Test');
  });
});
```

### Snapshot Tests

Use for UI components or complex data structures:

```typescript
test('renders correctly', () => {
  const component = render(<MyComponent />);
  expect(component).toMatchSnapshot();
});
```

## Common Pitfalls to Avoid

- ❌ Testing implementation details instead of behavior
- ❌ Over-mocking leading to tests that don't reflect real usage
- ❌ Flaky tests that pass/fail inconsistently
- ❌ Tests that are too slow or take too long to run
- ❌ Unclear test names that don't explain what's being tested
- ❌ Tests that are tightly coupled to specific implementation

## Resources

- Project testing framework documentation
- [Testing Best Practices](https://martinfowler.com/testing/)
- Team testing guidelines and conventions
