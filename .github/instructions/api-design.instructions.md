---
description: Guidelines for designing APIs
---

# API Design Guidelines

## General Principles

- **Consistency**: Use consistent naming, patterns, and conventions throughout your API
- **Clarity**: Make the API intuitive and self-documenting
- **Simplicity**: Keep interfaces simple and focused
- **Stability**: Avoid breaking changes; use versioning when necessary
- **Documentation**: Document all public APIs thoroughly

## Naming Conventions

### Functions and Methods

- Use verbs for actions: `getUser()`, `createOrder()`, `deleteItem()`
- Use clear, descriptive names that explain what the function does
- Prefix boolean-returning functions with `is`, `has`, `can`, or `should`: `isValid()`, `hasPermission()`

### Parameters

- Use descriptive parameter names
- Group related parameters into objects for functions with many parameters
- Make parameters optional when sensible, with reasonable defaults

```typescript
// Good - grouped parameters
function createUser(options: {
  name: string;
  email: string;
  role?: string;
  active?: boolean;
}): User;

// Avoid - too many individual parameters
function createUser(
  name: string,
  email: string,
  role?: string,
  active?: boolean
): User;
```

## Function Design

### Single Responsibility

Each function should do one thing well:

```typescript
// Good - single responsibility
function validateEmail(email: string): boolean;
function sendEmail(to: string, subject: string, body: string): Promise<void>;

// Avoid - doing too much
function validateAndSendEmail(email: string, subject: string, body: string): Promise<boolean>;
```

### Return Values

- Be consistent with return types
- Use meaningful return values
- Consider returning objects for functions that need to return multiple values
- For async operations, return Promises

```typescript
// Good - returns a result object
async function processData(data: Input): Promise<{
  success: boolean;
  result?: Output;
  error?: Error;
}>;
```

### Error Handling

- Throw exceptions for exceptional conditions
- Use typed errors when possible
- Document what errors a function might throw
- Consider returning error objects for expected failures

```typescript
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateUser(user: User): void {
  if (!user.email) {
    throw new ValidationError('email', 'Email is required');
  }
}
```

## Type Design

### Interfaces and Types

- Use interfaces for object shapes that can be implemented
- Use type aliases for unions, intersections, and complex types
- Make types as specific as possible

```typescript
// Interface for implementation
interface Drawable {
  draw(): void;
}

// Type for complex type expressions
type Result<T> = { success: true; data: T } | { success: false; error: Error };
```

### Immutability

- Prefer immutable data structures
- Use `readonly` for properties that shouldn't change
- Return new objects instead of mutating parameters

```typescript
interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

function updateUser(user: User, changes: Partial<User>): User {
  return { ...user, ...changes };
}
```

## Async APIs

### Promises

- Return Promises for asynchronous operations
- Use async/await for better readability
- Handle errors appropriately
- Consider cancellation for long-running operations

```typescript
async function fetchUserData(userId: string): Promise<UserData> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}
```

## Backwards Compatibility

### Versioning

- Version your API when making breaking changes
- Support old versions for a reasonable deprecation period
- Communicate breaking changes clearly

### Deprecation

- Mark deprecated APIs with clear deprecation notices
- Provide migration paths to new APIs
- Set timelines for removal

```typescript
/**
 * @deprecated Use newFunction() instead. Will be removed in v3.0.0
 */
function oldFunction(): void {
  console.warn('oldFunction is deprecated, use newFunction instead');
  // ...
}
```

## Documentation

### Doc Comments

Use structured documentation comments:

```typescript
/**
 * Creates a new user in the system.
 * 
 * @param userData - The user information
 * @param userData.name - The user's full name
 * @param userData.email - The user's email address
 * @returns A promise that resolves to the created user with ID
 * @throws {ValidationError} If user data is invalid
 * @throws {DuplicateError} If user already exists
 * 
 * @example
 * ```typescript
 * const user = await createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 * ```
 */
async function createUser(userData: UserInput): Promise<User>;
```

## Testing APIs

- Write tests for all public APIs
- Test edge cases and error conditions
- Test backwards compatibility when versioning
- Include example usage in tests

## Resources

- [API Design Principles](https://principles.design/)
- Team API guidelines
- Language-specific API conventions
