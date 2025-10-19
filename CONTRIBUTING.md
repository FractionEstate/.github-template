# Contributing Guide

Thank you for your interest in contributing! This guide will help you get started.

## How to Contribute

### Reporting Issues

1. **Search existing issues** to avoid duplicates
2. **Use issue templates** for bug reports and feature requests
3. **Provide details**:
   - Clear description of the issue/request
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Environment details
   - Screenshots if applicable

### Submitting Pull Requests

1. **Fork the repository** and create a new branch
2. **Follow coding standards** outlined in `.github/copilot-instructions.md`
3. **Write tests** for your changes
4. **Update documentation** if needed
5. **Use the PR template** and fill it out completely
6. **Link related issues** in the PR description
7. **Ensure CI passes** before requesting review

### Pull Request Process

1. **Create your branch**:
   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/my-bugfix
   ```

2. **Make your changes**:
   - Keep changes focused and atomic
   - Follow existing code style
   - Add/update tests
   - Update documentation

3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug in component"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/my-feature
   ```

5. **Open a Pull Request**:
   - Fill out the PR template
   - Link related issues
   - Request reviews from appropriate team members

6. **Respond to feedback**:
   - Address review comments
   - Push additional commits as needed
   - Request re-review when ready

7. **Merge**:
   - Once approved, a maintainer will merge your PR
   - Your branch will be deleted automatically

## Coding Standards

### Code Style

Follow the project's coding standards documented in `.github/copilot-instructions.md`:
- Use consistent formatting
- Follow naming conventions
- Write clear, self-documenting code
- Add comments for complex logic

### Testing

- Write unit tests for new functionality
- Ensure all tests pass before submitting
- Maintain or improve code coverage
- Test edge cases and error conditions

### Documentation

- Update README if adding features
- Add inline comments for complex code
- Update API documentation
- Include usage examples

### Commit Messages

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add OAuth2 authentication
fix(api): handle null response from endpoint
docs(readme): update installation instructions
test(utils): add tests for string helpers
```

## Development Setup

<!-- Customize based on your project -->

### Prerequisites

- [List required tools and versions]
- [e.g., Node.js 18+, Python 3.9+, etc.]

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_ORG/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
npm install
# or: pip install -r requirements.txt
# or: go mod download

# Run tests to verify setup
npm test
```

### Building

```bash
# Build the project
npm run build
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.js

# Run with coverage
npm run test:coverage
```

### Linting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## Code Review Guidelines

### For Contributors

- Be open to feedback
- Respond to comments promptly
- Ask questions if something is unclear
- Be willing to iterate on your changes

### For Reviewers

- Be constructive and respectful
- Explain the reasoning behind suggestions
- Acknowledge good work
- Focus on the code, not the person
- Approve when ready, don't be overly critical

## Getting Help

- Check the [documentation](./docs/)
- Search [existing issues](../../issues)
- Ask in [discussions](../../discussions)
- Contact maintainers (see CODEOWNERS)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive collaboration
- Follow the [Code of Conduct](https://opensource.microsoft.com/codeofconduct/)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes (for significant contributions)
- [CONTRIBUTORS.md](./CONTRIBUTORS.md) (if applicable)

## Questions?

If you have questions about contributing, please:
1. Check this guide
2. Search existing issues
3. Open a new issue with the "question" label
4. Reach out to maintainers

Thank you for contributing! 🎉
