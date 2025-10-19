---
description: Help write comprehensive tests for code
---

# Write Tests

You are helping to write tests for the codebase.

## Instructions

1. **Understand the code**:
   - Read the code thoroughly
   - Identify the public API
   - Understand the expected behavior
   - Note dependencies and side effects

2. **Plan test coverage**:
   - Identify main use cases
   - List edge cases
   - Consider error conditions
   - Think about boundary values
   - Consider different input types

3. **Write test cases**:
   - Start with the happy path
   - Add tests for edge cases
   - Test error handling
   - Test boundary conditions
   - Test with invalid input

4. **Structure tests well**:
   - Use descriptive test names
   - Follow Arrange-Act-Assert pattern
   - Keep tests independent
   - One assertion per test (when practical)
   - Use setup/teardown appropriately

5. **Verify tests**:
   - Tests pass with correct code
   - Tests fail when they should
   - Tests are not flaky
   - Tests run quickly
   - Tests are maintainable

## Test Categories

### Unit Tests

Test individual functions/methods in isolation:

```typescript
describe('formatCurrency', () => {
  test('formats positive numbers with two decimal places', () => {
    expect(formatCurrency(42.5)).toBe('$42.50');
  });
  
  test('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
  
  test('handles negative numbers', () => {
    expect(formatCurrency(-10.5)).toBe('-$10.50');
  });
  
  test('throws on invalid input', () => {
    expect(() => formatCurrency(NaN)).toThrow('Invalid amount');
  });
});
```

### Integration Tests

Test how components work together:

```typescript
describe('User Registration Flow', () => {
  test('successfully registers a new user', async () => {
    const userData = { name: 'Test', email: 'test@example.com' };
    const user = await registerUser(userData);
    
    expect(user.id).toBeDefined();
    expect(user.name).toBe(userData.name);
    
    // Verify user can log in
    const loginResult = await login(userData.email, 'password');
    expect(loginResult.success).toBe(true);
  });
});
```

### Edge Cases to Consider

- Null/undefined values
- Empty collections
- Boundary values (0, -1, max values)
- Very large inputs
- Special characters in strings
- Concurrent operations
- Network failures
- Timeout scenarios

## Test Writing Patterns

### Setup and Teardown

```typescript
describe('Database operations', () => {
  let db: Database;
  
  beforeEach(async () => {
    db = await createTestDatabase();
  });
  
  afterEach(async () => {
    await db.close();
  });
  
  test('inserts record', async () => {
    const record = await db.insert({ name: 'Test' });
    expect(record.id).toBeDefined();
  });
});
```

### Mocking Dependencies

```typescript
describe('UserService', () => {
  test('fetches user from API', async () => {
    const mockApi = {
      getUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test' })
    };
    
    const service = new UserService(mockApi);
    const user = await service.getUser(1);
    
    expect(user.name).toBe('Test');
    expect(mockApi.getUser).toHaveBeenCalledWith(1);
  });
});
```

### Parametrized Tests

```typescript
describe.each([
  { input: 'hello', expected: 'HELLO' },
  { input: 'world', expected: 'WORLD' },
  { input: '', expected: '' },
  { input: 'MiXeD', expected: 'MIXED' }
])('toUpperCase', ({ input, expected }) => {
  test(`converts "${input}" to "${expected}"`, () => {
    expect(toUpperCase(input)).toBe(expected);
  });
});
```

### Async Tests

```typescript
describe('async operations', () => {
  test('resolves with data', async () => {
    const data = await fetchData();
    expect(data).toBeDefined();
  });
  
  test('rejects on error', async () => {
    await expect(fetchInvalidData()).rejects.toThrow('Not found');
  });
  
  test('calls callback after delay', (done) => {
    setTimeout(() => {
      expect(true).toBe(true);
      done();
    }, 100);
  });
});
```

## Test Quality Checklist

- [ ] Test names clearly describe what is being tested
- [ ] Tests are independent and can run in any order
- [ ] Tests use appropriate assertions
- [ ] Edge cases are covered
- [ ] Error cases are tested
- [ ] Tests are not flaky
- [ ] Tests run quickly
- [ ] Mocks are used appropriately
- [ ] Setup/teardown is proper
- [ ] Tests follow project conventions

## Common Testing Mistakes

- ❌ Testing implementation details
- ❌ Tests that depend on other tests
- ❌ Over-mocking leading to meaningless tests
- ❌ Vague or unclear test names
- ❌ Tests that are slow or flaky
- ❌ Missing error case tests
- ❌ Not cleaning up after tests
- ❌ Tests that test the mock instead of the code

## Output

Provide:
- Comprehensive test suite
- Clear, descriptive test names
- Coverage of happy path, edge cases, and errors
- Well-structured, maintainable tests
- Documentation of any test setup needed
