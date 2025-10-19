# GitHub Template for Great Developer Experience

A comprehensive GitHub repository template inspired by [microsoft/vscode](https://github.com/microsoft/vscode), designed to provide an excellent developer experience for any new project using GitHub Copilot and modern development practices.

## Features

This template includes:

- 🤖 **GitHub Copilot Instructions** - Project-specific guidelines and architecture documentation
- 📝 **Issue Templates** - Structured templates for bug reports and feature requests
- 🔄 **Pull Request Template** - Standardized PR descriptions with checklists
- 👥 **CODEOWNERS** - Automated code review assignments
- 🔒 **Dependabot Configuration** - Automated dependency updates
- 📚 **Coding Instructions** - Domain-specific guidelines for common patterns
- 💡 **Copilot Prompts** - Reusable prompts for common development tasks
- 🚀 **CI/CD Workflows** - Example GitHub Actions workflows

## Quick Start

### Using This Template

1. **Use as a template**:
   ```bash
   # On GitHub, click "Use this template" button
   # Or clone and copy .github directory to your project
   ```

2. **Customize for your project**:
   - Update `.github/copilot-instructions.md` with your project's architecture
   - Modify issue templates in `.github/ISSUE_TEMPLATE/`
   - Update CODEOWNERS with your team's structure
   - Customize workflows in `.github/workflows/`
   - Add project-specific instructions and prompts

3. **Configure repository settings**:
   - Enable GitHub Copilot for your repository
   - Enable issue templates in repository settings
   - Configure branch protection rules
   - Set up required reviewers using CODEOWNERS

## Directory Structure

```
.github/
├── copilot-instructions.md       # Main Copilot guidance for the project
├── pull_request_template.md      # Template for all pull requests
├── CODEOWNERS                     # Code ownership and review assignments
├── dependabot.yml                 # Dependency update configuration
├── ISSUE_TEMPLATE/
│   ├── bug_report.md             # Bug report template
│   ├── feature_request.md        # Feature request template
│   └── config.yml                # Issue template configuration
├── instructions/
│   ├── testing.instructions.md   # Testing guidelines
│   ├── api-design.instructions.md # API design patterns
│   └── security.instructions.md  # Security best practices
├── prompts/
│   ├── fix-bug.prompt.md         # Prompt for fixing bugs
│   ├── add-feature.prompt.md     # Prompt for adding features
│   ├── refactor-code.prompt.md   # Prompt for refactoring
│   ├── write-tests.prompt.md     # Prompt for writing tests
│   └── review-code.prompt.md     # Prompt for code reviews
└── workflows/
    └── ci.yml                     # Example CI/CD workflow
```

## Components Overview

### 🤖 Copilot Instructions

The `copilot-instructions.md` file provides GitHub Copilot with context about your project:
- Project architecture and structure
- Coding conventions and standards
- Development workflows
- Common patterns and practices

**Customize this file** to include your project's specific information.

### 📝 Issue Templates

Structured templates help contributors provide the right information:
- **Bug Report**: Systematic bug reporting with reproduction steps
- **Feature Request**: Structured feature proposals with use cases
- **Config**: Links to documentation and discussion forums

### 🔄 Pull Request Template

The PR template ensures consistent pull requests with:
- Clear description of changes
- Type of change categorization
- Testing checklist
- Link to related issues

### 👥 CODEOWNERS

Define code ownership for automated review requests:
```
# Example entries
/src/auth/ @your-org/auth-team
/docs/ @your-org/docs-team
*.yml @your-org/devops-team
```

### 🔒 Dependabot

Automated dependency updates with configuration for:
- npm/yarn (JavaScript/TypeScript)
- GitHub Actions
- pip (Python)
- Go modules
- And more...

### 📚 Instructions

Domain-specific coding guidelines that GitHub Copilot can reference:
- **testing.instructions.md**: Testing patterns and best practices
- **api-design.instructions.md**: API design principles
- **security.instructions.md**: Security guidelines

Add more instruction files as needed for your project's domains.

### 💡 Prompts

Reusable GitHub Copilot prompts for common tasks:
- **fix-bug.prompt.md**: Systematic bug fixing workflow
- **add-feature.prompt.md**: Feature implementation checklist
- **refactor-code.prompt.md**: Safe refactoring patterns
- **write-tests.prompt.md**: Comprehensive test writing guide
- **review-code.prompt.md**: Thorough code review checklist

### 🚀 Workflows

Example CI/CD workflows using GitHub Actions:
- Linting and code quality checks
- Building and testing across platforms
- Security scanning
- Coverage reporting

## Customization Guide

### 1. Update Copilot Instructions

Edit `.github/copilot-instructions.md`:
```markdown
## Project Overview
[Describe your project's architecture]

### Project Structure
[Document your folder structure]

## Coding Guidelines
[Add your specific conventions]
```

### 2. Configure CODEOWNERS

Edit `.github/CODEOWNERS`:
```
# Replace with your actual teams/users
* @your-username
/frontend/ @frontend-team
/backend/ @backend-team
```

### 3. Customize Issue Templates

Modify files in `.github/ISSUE_TEMPLATE/`:
- Update labels and assignees
- Add project-specific fields
- Modify the config.yml links

### 4. Adjust Dependabot

Edit `.github/dependabot.yml`:
- Enable/disable package ecosystems
- Set update frequency
- Configure reviewers and labels

### 5. Setup Workflows

Edit `.github/workflows/ci.yml`:
- Uncomment relevant steps
- Add your build/test commands
- Configure platform-specific testing

### 6. Add Instructions

Create new files in `.github/instructions/`:
```markdown
---
description: Guidelines for [topic]
---

# [Topic] Guidelines

[Your content]
```

### 7. Create Custom Prompts

Add files in `.github/prompts/`:
```markdown
---
description: Help with [task]
---

# [Task Name]

[Instructions and guidelines]
```

## Best Practices

### For GitHub Copilot

1. **Keep instructions updated**: Regularly update copilot-instructions.md as your project evolves
2. **Be specific**: Provide concrete examples in instructions
3. **Document patterns**: Create instruction files for recurring patterns
4. **Use prompts**: Reference prompts for complex tasks

### For Issues and PRs

1. **Enforce templates**: Require issue/PR templates in repository settings
2. **Use labels**: Configure automatic labeling based on templates
3. **Link issues**: Always link PRs to related issues

### For Code Ownership

1. **Start broad**: Begin with team-level ownership
2. **Refine gradually**: Add more specific owners as needed
3. **Keep updated**: Review and update as team structure changes

### For Dependencies

1. **Review regularly**: Don't just auto-merge Dependabot PRs
2. **Group updates**: Configure Dependabot to group related updates
3. **Test thoroughly**: Ensure CI/CD validates updates

## Using with GitHub Copilot

### In VS Code

1. Open a file in your project
2. Type `@workspace` to reference project context
3. Copilot will use copilot-instructions.md for context

### Using Prompts

1. Open a prompt file from `.github/prompts/`
2. Copy the content to Copilot chat
3. Follow the structured workflow

### Referencing Instructions

In Copilot chat, you can reference instructions:
```
@workspace /explain #file:security.instructions.md
```

## Contributing

We welcome contributions! Please:
1. Create an issue for major changes
2. Follow the existing structure
3. Update documentation
4. Test your changes

## Examples

Projects using this template:
- [Add your project here]

## Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Issue Templates Guide](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)

## License

[Choose an appropriate license for your project]

## Inspiration

This template is inspired by [microsoft/vscode](https://github.com/microsoft/vscode)'s excellent `.github` directory structure, adapted for general use across different types of projects.

---

**Happy coding! 🚀**
