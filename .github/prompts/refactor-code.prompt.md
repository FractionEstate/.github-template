---
description: Help refactor code to improve quality
---

# Refactor Code

You are helping to refactor code to improve its quality, maintainability, or performance.

## Instructions

1. **Identify the problem**:
   - Understand why the code needs refactoring
   - Identify code smells or anti-patterns
   - Review performance bottlenecks if applicable
   - Consider technical debt impact

2. **Plan the refactoring**:
   - Define the desired end state
   - Break down into small, safe steps
   - Ensure tests exist before refactoring
   - Plan to keep functionality unchanged

3. **Ensure test coverage**:
   - Verify existing tests cover the code
   - Add missing tests before refactoring
   - Tests should pass before starting
   - Tests should pass after each step

4. **Refactor incrementally**:
   - Make one change at a time
   - Run tests after each change
   - Commit working code frequently
   - Keep the codebase in a deployable state

5. **Verify the refactoring**:
   - All tests still pass
   - Functionality is unchanged
   - Code is more maintainable
   - Performance is not degraded (or improved if that was the goal)

6. **Clean up**:
   - Remove dead code
   - Update comments and documentation
   - Ensure consistent style
   - Run linters and formatters

## Common Refactoring Patterns

### Extract Function

```typescript
// Before
function processOrder(order: Order) {
  // validate
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must have items');
  }
  if (!order.customer) {
    throw new Error('Order must have customer');
  }
  
  // process
  // ... lots of code
}

// After
function processOrder(order: Order) {
  validateOrder(order);
  // ... process order
}

function validateOrder(order: Order) {
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must have items');
  }
  if (!order.customer) {
    throw new Error('Order must have customer');
  }
}
```

### Replace Conditional with Polymorphism

```typescript
// Before
function getDiscount(customer: Customer): number {
  if (customer.type === 'premium') {
    return 0.2;
  } else if (customer.type === 'regular') {
    return 0.1;
  } else {
    return 0;
  }
}

// After
interface Customer {
  getDiscount(): number;
}

class PremiumCustomer implements Customer {
  getDiscount(): number {
    return 0.2;
  }
}

class RegularCustomer implements Customer {
  getDiscount(): number {
    return 0.1;
  }
}
```

### Introduce Parameter Object

```typescript
// Before
function createUser(name: string, email: string, age: number, city: string) {
  // ...
}

// After
interface UserData {
  name: string;
  email: string;
  age: number;
  city: string;
}

function createUser(userData: UserData) {
  // ...
}
```

## Refactoring Goals

Consider what you're optimizing for:

- **Readability**: Make code easier to understand
- **Maintainability**: Make code easier to modify
- **Performance**: Make code faster or more efficient
- **Testability**: Make code easier to test
- **Reusability**: Make code more modular and reusable
- **Simplicity**: Remove unnecessary complexity

## Things to Avoid

- Changing functionality while refactoring
- Making too many changes at once
- Refactoring without tests
- Over-engineering or adding unnecessary abstraction
- Skipping verification steps
- Breaking backwards compatibility unintentionally

## Refactoring Checklist

- [ ] Understand the reason for refactoring
- [ ] Existing tests provide good coverage
- [ ] All tests pass before starting
- [ ] Change is broken into small steps
- [ ] Tests pass after each step
- [ ] Functionality is preserved
- [ ] Code is more maintainable
- [ ] Documentation is updated
- [ ] No dead code remains
- [ ] Code style is consistent

## Output

Provide:
- Clear explanation of what was refactored and why
- Step-by-step changes with verification
- Confirmation that tests pass
- Any updated documentation
- Before/after comparison for clarity
