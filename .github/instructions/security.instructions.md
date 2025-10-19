---
description: Security best practices and guidelines
---

# Security Guidelines

## General Security Principles

- **Defense in Depth**: Implement multiple layers of security
- **Least Privilege**: Grant minimum necessary permissions
- **Fail Securely**: Ensure failures don't expose sensitive data
- **Keep It Simple**: Complex security is often insecure
- **Never Trust User Input**: Validate and sanitize all input

## Input Validation

### Validate All Input

Always validate input from users, APIs, and external systems:

```typescript
function processUserInput(input: string): string {
  // Validate input
  if (!input || input.length > MAX_LENGTH) {
    throw new ValidationError('Invalid input');
  }
  
  // Sanitize input
  const sanitized = sanitizeInput(input);
  
  return sanitized;
}
```

### Sanitization

- Remove or escape potentially dangerous characters
- Use established libraries for sanitization
- Be aware of different contexts (HTML, SQL, JavaScript, etc.)

## Authentication and Authorization

### Authentication

- Use secure authentication mechanisms (OAuth2, JWT, etc.)
- Never store passwords in plain text
- Use strong password hashing (bcrypt, Argon2)
- Implement rate limiting on authentication endpoints
- Use multi-factor authentication when possible

```typescript
// Good - using a secure hashing library
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

### Authorization

- Check permissions before allowing access to resources
- Implement role-based or attribute-based access control
- Don't rely on client-side authorization checks

```typescript
function canAccessResource(user: User, resource: Resource): boolean {
  if (!user.isAuthenticated) {
    return false;
  }
  
  if (resource.isPublic) {
    return true;
  }
  
  return user.hasPermission(`read:${resource.type}`) || 
         resource.ownerId === user.id;
}
```

## Data Protection

### Sensitive Data

- Never log sensitive data (passwords, tokens, PII)
- Encrypt sensitive data at rest and in transit
- Use environment variables for secrets, not hardcoded values
- Implement proper key management

```typescript
// Bad - exposing sensitive data
console.log('User login:', { username, password });

// Good - omitting sensitive data
console.log('User login:', { username });
```

### Secrets Management

- Use secret management services (e.g., AWS Secrets Manager, Azure Key Vault)
- Never commit secrets to version control
- Rotate secrets regularly
- Use different secrets for different environments

```typescript
// Good - using environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable is not set');
}
```

## SQL Injection Prevention

Always use parameterized queries:

```typescript
// Bad - vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// Good - using parameterized query
const query = 'SELECT * FROM users WHERE email = ?';
const results = await db.query(query, [email]);
```

## Cross-Site Scripting (XSS) Prevention

- Escape output when rendering user content
- Use Content Security Policy (CSP) headers
- Sanitize HTML input
- Use frameworks that auto-escape by default

```typescript
// Good - escaping HTML
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

## Cross-Site Request Forgery (CSRF) Prevention

- Use CSRF tokens for state-changing operations
- Check Origin and Referer headers
- Use SameSite cookie attribute
- Implement proper CORS policies

## API Security

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

### HTTPS Only

- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use HSTS headers

### Input Size Limits

- Limit request body size
- Limit file upload sizes
- Prevent resource exhaustion

## Dependency Security

- Regularly update dependencies
- Use tools like npm audit, Snyk, or Dependabot
- Review security advisories for dependencies
- Pin dependency versions in production

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix
```

## Error Handling

- Don't expose stack traces to users
- Log errors securely with appropriate detail
- Use generic error messages for users
- Monitor and alert on security-related errors

```typescript
// Good - generic error message for user
try {
  await processPayment(paymentData);
} catch (error) {
  logger.error('Payment processing failed', { error, userId });
  throw new Error('Payment processing failed. Please try again.');
}
```

## Logging and Monitoring

- Log security events (authentication, authorization failures)
- Monitor for suspicious patterns
- Set up alerts for security incidents
- Ensure logs don't contain sensitive data
- Protect logs from unauthorized access

## Security Headers

Set appropriate security headers:

```typescript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## Code Review Security Checklist

When reviewing code, check for:

- [ ] Input validation on all user input
- [ ] Proper authentication and authorization checks
- [ ] No hardcoded secrets or credentials
- [ ] SQL queries use parameterization
- [ ] Output is properly escaped
- [ ] Error messages don't expose sensitive information
- [ ] Dependencies are up to date
- [ ] Security headers are set
- [ ] HTTPS is enforced
- [ ] Rate limiting is implemented

## Incident Response

- Have a security incident response plan
- Know who to contact for security issues
- Document and learn from security incidents
- Notify affected users when appropriate

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- Security team contact information
- Incident response procedures
