# GitHub Copilot Instructions

## Project Overview

<!-- Replace this section with your project's specific information -->

This is a template repository for GitHub projects. Customize this file to describe:
- Your project's architecture and design patterns
- Key folders and their purposes
- Technology stack and frameworks used
- Important conventions and coding standards

### Project Structure

```
project-root/
├── src/          # Source code
├── tests/        # Test files
├── docs/         # Documentation
├── scripts/      # Build and utility scripts
├── .github/      # GitHub configuration and workflows
└── README.md     # Project overview
```

<!-- Update the structure above to match your actual project layout -->

## Finding Related Code

When working on this project:

1. **Semantic search first**: Use file search to find concepts and features
2. **Grep for exact strings**: Use grep for error messages or specific function names
3. **Follow imports**: Check what files import the module you're working on
4. **Check test files**: Often reveal usage patterns and expected behavior

## Development Workflow

<!-- Customize these sections based on your project's needs -->

### Building the Project

```bash
# Add your build commands here
npm install
npm run build
```

### Running Tests

```bash
# Add your test commands here
npm test
```

### Linting and Formatting

```bash
# Add your linting commands here
npm run lint
npm run format
```

## Coding Guidelines

### General Principles

- Write clean, maintainable code
- Follow established patterns in the codebase
- Write tests for new features and bug fixes
- Document complex logic and public APIs
- Keep functions small and focused on a single responsibility

### Code Style

<!-- Customize these style guidelines for your language/framework -->

#### Naming Conventions

- Use descriptive names for variables, functions, and classes
- Follow language-specific naming conventions (camelCase, PascalCase, snake_case, etc.)
- Use meaningful prefixes for private/internal members if applicable

#### Comments and Documentation

- Write comments for complex algorithms or business logic
- Use JSDoc/equivalent for public APIs
- Keep comments up-to-date with code changes
- Explain "why" not "what" in comments

### Language-Specific Guidelines

<!-- Add language-specific guidelines here -->

#### TypeScript/JavaScript

- Use `const` by default, `let` when reassignment is needed
- Prefer arrow functions for callbacks
- Use async/await over raw Promises
- Add type annotations for function parameters and return values

#### Python

- Follow PEP 8 style guide
- Use type hints for function signatures
- Write docstrings for modules, classes, and functions
- Use f-strings for string formatting

<!-- Add more languages as needed -->

## Common Patterns

### Error Handling

- Always handle errors gracefully
- Provide meaningful error messages
- Log errors with appropriate context
- Don't swallow exceptions silently

### Testing

- Write unit tests for individual functions and methods
- Write integration tests for workflows and features
- Aim for good test coverage on critical paths
- Use descriptive test names that explain what is being tested

### Performance

- Profile before optimizing
- Use appropriate data structures for the task
- Cache expensive computations when appropriate
- Be mindful of memory usage and cleanup

## Dependencies

<!-- Document important dependencies and why they're used -->

- List key dependencies and their purposes
- Note any version constraints or compatibility requirements
- Document alternatives that were considered

## Troubleshooting

<!-- Add common issues and their solutions -->

### Common Issues

**Issue**: Build fails with [error message]
**Solution**: [Explanation of how to fix]

**Issue**: Tests fail intermittently
**Solution**: [Debugging steps]

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed contribution guidelines.

## Additional Resources

- [Project Documentation](../docs/)
- [API Reference](../docs/api/)
- [Architecture Guide](../docs/architecture.md)
- [Style Guide](../docs/style-guide.md)

<!-- Add links to relevant documentation, wikis, or external resources -->
