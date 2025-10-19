---
description: Help review code changes
---

# Code Review

You are helping to review code changes.

## Instructions

1. **Understand the change**:
   - Read the PR description and related issues
   - Understand the purpose of the changes
   - Review the scope and impact
   - Check if requirements are met

2. **Review code quality**:
   - Check adherence to coding standards
   - Look for code smells and anti-patterns
   - Verify naming conventions
   - Check for proper error handling
   - Review documentation and comments

3. **Check functionality**:
   - Verify logic is correct
   - Check edge cases are handled
   - Look for potential bugs
   - Consider performance implications
   - Think about security concerns

4. **Review tests**:
   - Verify tests exist for changes
   - Check test coverage is adequate
   - Review test quality and clarity
   - Ensure tests actually test the code

5. **Consider maintainability**:
   - Is the code easy to understand?
   - Is it consistent with the codebase?
   - Will it be easy to modify later?
   - Is documentation sufficient?

6. **Provide constructive feedback**:
   - Be specific and actionable
   - Explain the reasoning
   - Offer suggestions
   - Acknowledge good work
   - Be respectful and collaborative

## Code Review Checklist

### Functionality
- [ ] Code implements the intended functionality
- [ ] Requirements are met
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs

### Code Quality
- [ ] Code is clean and readable
- [ ] Naming is clear and consistent
- [ ] Functions are focused and concise
- [ ] No code duplication
- [ ] Follows project conventions
- [ ] No code smells or anti-patterns

### Testing
- [ ] Tests exist for new/changed code
- [ ] Tests are comprehensive
- [ ] Tests are clear and maintainable
- [ ] All tests pass
- [ ] Edge cases are tested

### Security
- [ ] No security vulnerabilities
- [ ] Input is validated
- [ ] Sensitive data is protected
- [ ] Dependencies are safe
- [ ] Authentication/authorization is correct

### Performance
- [ ] No obvious performance issues
- [ ] Algorithms are efficient
- [ ] Resources are properly managed
- [ ] No memory leaks

### Documentation
- [ ] Code is self-documenting or well-commented
- [ ] API documentation is updated
- [ ] README is updated if needed
- [ ] Complex logic is explained

### Maintainability
- [ ] Code is modular and reusable
- [ ] Changes don't add unnecessary complexity
- [ ] Code is consistent with existing patterns
- [ ] Technical debt is not increased

## Review Comments Types

### Request Changes

For serious issues that must be fixed:

```
❌ This function doesn't validate input, which could lead to a security vulnerability.

Please add input validation:
\`\`\`typescript
if (!input || typeof input !== 'string') {
  throw new ValidationError('Invalid input');
}
\`\`\`
```

### Suggestions

For improvements that are nice to have:

```
💡 Consider extracting this complex logic into a separate function for better readability:

\`\`\`typescript
function calculateDiscount(order: Order): number {
  // calculation logic here
}
\`\`\`
```

### Questions

When something is unclear:

```
❓ What happens if the user is null here? Should we add a null check?
```

### Praise

Acknowledge good work:

```
✅ Nice use of the factory pattern here! This makes the code much more testable.
```

### Nitpicks

Minor style or formatting issues:

```
nit: This could be simplified to: `return items.length > 0`
```

## Things to Look For

### Common Issues
- Hardcoded values that should be configurable
- Missing error handling
- Race conditions in async code
- Memory leaks (unclosed resources)
- SQL injection vulnerabilities
- XSS vulnerabilities
- Missing input validation
- Inconsistent naming
- Dead code
- Over-engineered solutions

### Code Smells
- Long functions
- Large classes
- Duplicate code
- Too many parameters
- Deep nesting
- Complex conditionals
- Inappropriate coupling
- Feature envy

## Review Guidelines

### Be Constructive
- Focus on the code, not the person
- Explain why, not just what
- Offer solutions, not just criticism
- Be respectful and professional

### Be Thorough
- Review all changes carefully
- Don't rush through the review
- Test the changes if possible
- Consider the bigger picture

### Be Responsive
- Review in a timely manner
- Respond to questions and comments
- Be open to discussion
- Help resolve conflicts

## Output

Provide:
- Specific, actionable feedback
- Clear explanation of issues
- Suggestions for improvement
- Recognition of good work
- Overall assessment (approve, request changes, comment)
