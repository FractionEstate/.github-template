---
description: Help document code and APIs
---

# Document Code

You are helping to write documentation for code.

## Instructions

1. **Understand the code**:
   - Read the code thoroughly
   - Understand its purpose and usage
   - Identify the public API surface
   - Note any complex or non-obvious behavior

2. **Identify documentation needs**:
   - Public APIs need detailed documentation
   - Complex algorithms need explanation
   - Configuration options need description
   - Usage examples are helpful

3. **Write clear documentation**:
   - Start with a brief overview
   - Explain what, why, and how
   - Include parameters and return values
   - Document exceptions and errors
   - Provide usage examples

4. **Use appropriate formats**:
   - JSDoc/TSDoc for TypeScript/JavaScript
   - Docstrings for Python
   - JavaDoc for Java
   - XML comments for C#
   - GoDoc for Go

5. **Maintain documentation**:
   - Keep docs in sync with code
   - Update when behavior changes
   - Remove outdated information
   - Add missing documentation

## Documentation Types

### Function/Method Documentation

```typescript
/**
 * Calculates the total price including tax and discount.
 * 
 * This function applies the discount first, then calculates tax on the
 * discounted amount. The discount is applied as a percentage.
 * 
 * @param basePrice - The original price before any adjustments
 * @param taxRate - Tax rate as a decimal (e.g., 0.1 for 10%)
 * @param discountPercent - Discount percentage (0-100)
 * @returns The final price after discount and tax
 * @throws {RangeError} If discount is not between 0 and 100
 * @throws {RangeError} If tax rate is negative
 * 
 * @example
 * ```typescript
 * // Calculate price with 20% discount and 10% tax
 * const finalPrice = calculateTotalPrice(100, 0.1, 20);
 * // Returns: 88 (100 - 20% = 80, 80 + 10% = 88)
 * ```
 * 
 * @example
 * ```typescript
 * // Calculate price with no discount
 * const finalPrice = calculateTotalPrice(100, 0.1, 0);
 * // Returns: 110
 * ```
 */
function calculateTotalPrice(
  basePrice: number,
  taxRate: number,
  discountPercent: number
): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new RangeError('Discount must be between 0 and 100');
  }
  if (taxRate < 0) {
    throw new RangeError('Tax rate cannot be negative');
  }
  
  const discountedPrice = basePrice * (1 - discountPercent / 100);
  return discountedPrice * (1 + taxRate);
}
```

### Class Documentation

```typescript
/**
 * Manages user sessions and authentication state.
 * 
 * The SessionManager handles user login, logout, and session validation.
 * Sessions expire after a configurable timeout period. The manager
 * automatically refreshes sessions that are about to expire.
 * 
 * @example
 * ```typescript
 * const sessionManager = new SessionManager({
 *   timeout: 3600000, // 1 hour
 *   autoRefresh: true
 * });
 * 
 * // Create a session
 * const session = await sessionManager.login(credentials);
 * 
 * // Validate session
 * const isValid = await sessionManager.validate(session.id);
 * 
 * // Logout
 * await sessionManager.logout(session.id);
 * ```
 */
class SessionManager {
  /**
   * Creates a new SessionManager instance.
   * 
   * @param options - Configuration options
   * @param options.timeout - Session timeout in milliseconds (default: 1 hour)
   * @param options.autoRefresh - Whether to auto-refresh expiring sessions (default: false)
   */
  constructor(options: SessionOptions) {
    // Implementation
  }
  
  /**
   * Authenticates a user and creates a new session.
   * 
   * @param credentials - User credentials
   * @returns Promise resolving to the created session
   * @throws {AuthenticationError} If credentials are invalid
   */
  async login(credentials: Credentials): Promise<Session> {
    // Implementation
  }
}
```

### Interface/Type Documentation

```typescript
/**
 * Configuration options for the API client.
 */
interface ApiClientConfig {
  /**
   * The base URL for all API requests.
   * Should not include a trailing slash.
   * 
   * @example 'https://api.example.com'
   */
  baseUrl: string;
  
  /**
   * API key for authentication.
   * Obtained from the developer portal.
   */
  apiKey: string;
  
  /**
   * Request timeout in milliseconds.
   * @default 30000
   */
  timeout?: number;
  
  /**
   * Number of retry attempts for failed requests.
   * @default 3
   */
  retries?: number;
}
```

### Module/File Documentation

```typescript
/**
 * @module auth
 * 
 * Authentication and authorization utilities.
 * 
 * This module provides functions for user authentication, token management,
 * and permission checking. It integrates with OAuth2 and supports both
 * session-based and token-based authentication.
 * 
 * @example
 * ```typescript
 * import { authenticate, validateToken } from './auth';
 * 
 * // Authenticate user
 * const token = await authenticate(username, password);
 * 
 * // Validate token
 * const isValid = await validateToken(token);
 * ```
 */
```

## Documentation Best Practices

### Be Clear and Concise
- Use simple language
- Avoid jargon when possible
- Be specific and accurate
- Focus on what matters to users

### Provide Examples
- Include realistic examples
- Show common use cases
- Demonstrate error handling
- Show different scenarios

### Document Behavior
- Explain what the code does
- Describe any side effects
- Note any assumptions
- Document edge cases

### Keep It Updated
- Update docs when code changes
- Remove outdated information
- Add missing documentation
- Review docs regularly

## Common Documentation Sections

### README Files
- Project overview
- Installation instructions
- Quick start guide
- Usage examples
- Configuration options
- Contributing guidelines
- License information

### API Documentation
- Endpoints and methods
- Request/response formats
- Authentication requirements
- Error codes and handling
- Rate limiting
- Examples

### Architecture Documentation
- System overview
- Component diagram
- Data flow
- Design decisions
- Technology choices

## Documentation Checklist

- [ ] Public APIs are documented
- [ ] Parameters are described
- [ ] Return values are documented
- [ ] Exceptions are documented
- [ ] Examples are provided
- [ ] Complex logic is explained
- [ ] Edge cases are mentioned
- [ ] Documentation is clear and accurate
- [ ] Documentation follows project style
- [ ] No outdated information

## Output

Provide:
- Clear, comprehensive documentation
- Accurate descriptions of behavior
- Helpful examples
- Proper formatting
- No outdated information
