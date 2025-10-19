# Usage Guide for GitHub Template

This guide explains how to use the various components of this GitHub template in your projects.

## Table of Contents

- [Getting Started](#getting-started)
- [Using Copilot Instructions](#using-copilot-instructions)
- [Working with Issue Templates](#working-with-issue-templates)
- [Using Pull Request Templates](#using-pull-request-templates)
- [Configuring CODEOWNERS](#configuring-codeowners)
- [Setting Up Dependabot](#setting-up-dependabot)
- [Leveraging Instructions Files](#leveraging-instructions-files)
- [Using Copilot Prompts](#using-copilot-prompts)
- [Configuring Workflows](#configuring-workflows)

## Getting Started

### Option 1: Use as Template Repository

1. Click "Use this template" button on GitHub
2. Create your new repository
3. Clone and customize for your project

### Option 2: Copy to Existing Project

```bash
# In your existing project
cd your-project
git clone https://github.com/FractionEstate/.github-template.git temp-template
cp -r temp-template/.github .
rm -rf temp-template
```

### Initial Customization

After adding the template to your project:

```bash
# 1. Update copilot-instructions.md
# Edit .github/copilot-instructions.md with your project info

# 2. Update CODEOWNERS
# Replace YOUR_ORG with your organization/username

# 3. Configure Dependabot
# Enable/disable package ecosystems in dependabot.yml

# 4. Customize workflows
# Uncomment and modify CI/CD steps in workflows/

# 5. Commit changes
git add .github/
git commit -m "chore: add GitHub template structure"
git push
```

## Using Copilot Instructions

### What It Does

The `copilot-instructions.md` file provides GitHub Copilot with context about your project:
- Project architecture and structure
- Coding conventions
- Development workflows
- Common patterns

### How to Use

1. **Update with your project details**:
   ```markdown
   ## Project Overview
   
   MyApp is a [description] built with [tech stack].
   
   ### Project Structure
   - src/api/ - REST API endpoints
   - src/models/ - Data models
   - src/services/ - Business logic
   ```

2. **Add technology-specific guidelines**:
   ```markdown
   ### React Components
   - Use functional components with hooks
   - Place styles in .module.css files
   - Export one component per file
   ```

3. **Document key patterns**:
   ```markdown
   ### Error Handling
   All API calls should use try-catch with our ErrorHandler:
   
   \`\`\`typescript
   try {
     const result = await apiCall();
   } catch (error) {
     ErrorHandler.handle(error);
   }
   \`\`\`
   ```

### In VS Code

When you use GitHub Copilot in VS Code:
- Type `@workspace` to reference project context
- Copilot reads copilot-instructions.md for guidance
- It understands your project structure and conventions

## Working with Issue Templates

### Enabling Templates

1. Go to repository Settings
2. Navigate to Features → Issues
3. Check "Set up templates"
4. Select the templates you want to use

### Customizing Templates

Edit files in `.github/ISSUE_TEMPLATE/`:

**bug_report.md**:
```yaml
---
name: Bug report
about: Create a report to help us improve
title: '[Bug] '
labels: bug, needs-triage  # Customize labels
assignees: ''  # Or add default assignees
---
```

**Adding New Templates**:
```bash
# Create a new template
cat > .github/ISSUE_TEMPLATE/documentation.md << 'EOF'
---
name: Documentation
about: Suggest improvements to documentation
title: '[Docs] '
labels: documentation
---

## Documentation Issue

<!-- Describe the documentation problem -->

## Suggested Improvement

<!-- How should it be improved? -->
EOF
```

### Using Templates

When creating an issue:
1. Click "New issue"
2. Select appropriate template
3. Fill in the sections
4. Submit

## Using Pull Request Templates

### How It Works

The `pull_request_template.md` is automatically loaded when creating a PR.

### Customizing

Edit `.github/pull_request_template.md`:

```markdown
## What This PR Does

<!-- Brief description -->

## Testing

- [ ] Unit tests added
- [ ] Integration tests updated
- [ ] Manual testing completed

## Screenshots

<!-- If UI changes, add screenshots -->

## Performance Impact

<!-- Describe any performance considerations -->
```

### Multiple PR Templates

For different PR types:

```bash
# Create template directory
mkdir -p .github/PULL_REQUEST_TEMPLATE

# Create specific templates
cat > .github/PULL_REQUEST_TEMPLATE/bugfix.md
cat > .github/PULL_REQUEST_TEMPLATE/feature.md
cat > .github/PULL_REQUEST_TEMPLATE/hotfix.md
```

Users can then select: `?template=bugfix.md`

## Configuring CODEOWNERS

### Basic Usage

Edit `.github/CODEOWNERS`:

```
# Each line is a file pattern followed by owners

# Default owner for everything
* @your-username

# Specific directories
/docs/ @doc-team
/frontend/ @frontend-lead @frontend-team
/backend/ @backend-lead

# Specific files
package.json @devops-team
*.yml @devops-team

# Using teams (organization only)
/api/ @your-org/api-team
```

### Testing Locally

```bash
# View what would be requested for review
gh pr view 123 --json reviewRequests
```

### Best Practices

- Start broad, refine over time
- Use teams for better management
- Keep CODEOWNERS updated as team changes
- Don't over-assign; focus on key reviewers

## Setting Up Dependabot

### Enabling Dependabot

1. Dependabot is enabled by default when you add `dependabot.yml`
2. Ensure "Dependabot alerts" is enabled in Security settings

### Configuring Updates

Edit `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # Enable for your package manager
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"  # or daily, monthly
      day: "monday"
      time: "09:00"
    # Group updates
    groups:
      dev-dependencies:
        patterns:
          - "@types/*"
          - "*-eslint*"
        update-types:
          - "minor"
          - "patch"
```

### Handling Dependabot PRs

1. **Review the PR**: Check what's changing
2. **Review release notes**: Understand breaking changes
3. **Check CI**: Ensure tests pass
4. **Test locally**: For major updates
5. **Merge**: Use "Squash and merge"

### Auto-merge Configuration

```yaml
# In dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    # Only for certain types
    open-pull-requests-limit: 5
```

Then enable auto-merge in repository settings.

## Leveraging Instructions Files

### What They're For

Instructions in `.github/instructions/` provide domain-specific guidance to GitHub Copilot.

### Using Instructions

1. **Reference in Copilot Chat**:
   ```
   @workspace How should I implement authentication?
   #file:.github/instructions/security.instructions.md
   ```

2. **Copilot Reads Automatically**:
   - When working in related files
   - When you ask related questions
   - Based on file content and context

### Creating Custom Instructions

```bash
# Create a new instruction file
cat > .github/instructions/database.instructions.md << 'EOF'
---
description: Database access patterns
---

# Database Guidelines

## Connection Management

Always use the connection pool:

\`\`\`typescript
const db = getConnectionPool();
try {
  const result = await db.query('SELECT * FROM users');
} finally {
  db.release();
}
\`\`\`

## Transactions

Use the transaction helper:

\`\`\`typescript
await withTransaction(async (tx) => {
  await tx.query('INSERT ...');
  await tx.query('UPDATE ...');
});
\`\`\`
EOF
```

### Instructions Library

Build a library of instructions:
- `error-handling.instructions.md`
- `performance.instructions.md`
- `logging.instructions.md`
- `state-management.instructions.md`

## Using Copilot Prompts

### What Are Prompts?

Prompts in `.github/prompts/` are reusable workflows for common tasks.

### Available Prompts

**Planning Prompts:**
- `plan.prompt.md` - Start planning a task with structured approach
- `plan-fast.prompt.md` - Quick planning for straightforward tasks
- `plan-deep.prompt.md` - Detailed planning that asks clarifying questions first

**Implementation Prompts:**
- `implement.prompt.md` - Implement general-purpose solutions following best practices
- `add-feature.prompt.md` - Feature implementation checklist and workflow
- `fix-bug.prompt.md` - Systematic bug fixing approach
- `refactor-code.prompt.md` - Safe refactoring patterns and steps

**Quality Assurance Prompts:**
- `write-tests.prompt.md` - Comprehensive test writing guide
- `review-code.prompt.md` - Thorough code review checklist

**Documentation Prompts:**
- `document-code.prompt.md` - Documentation standards and examples
- `setup-project.prompt.md` - Complete project initialization workflow
- `update-instructions.prompt.md` - Keep instruction files up to date

### Using a Prompt

1. **Open the prompt file**: `.github/prompts/fix-bug.prompt.md`
2. **Copy to Copilot Chat**: Copy the entire content
3. **Follow the workflow**: Work through the steps
4. **Adapt as needed**: Customize for your situation

### Example: Using fix-bug.prompt.md

1. Open `.github/prompts/fix-bug.prompt.md`
2. Copy content to Copilot Chat
3. Copilot will guide you through:
   - Understanding the bug
   - Locating the problem
   - Reproducing the issue
   - Fixing and testing

### Creating Custom Prompts

```markdown
---
description: Help with [task]
---

# [Task Name]

Instructions for completing the task.

## Steps

1. Step one
2. Step two
3. Step three

## Example

\`\`\`typescript
// Example code
\`\`\`

## Output

What to provide at the end.
```

### Prompt Library

Build prompts for your specific workflows:
- `deploy-production.prompt.md`
- `onboard-developer.prompt.md`
- `investigate-incident.prompt.md`

## Configuring Workflows

### Enabling GitHub Actions

1. Actions are enabled by default
2. Workflows run automatically on push/PR
3. View runs in the "Actions" tab

### Customizing CI Workflow

Edit `.github/workflows/ci.yml`:

```yaml
# Uncomment sections you need
steps:
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'  # Your version
      cache: 'npm'
  
  - name: Install dependencies
    run: npm ci  # Your command
  
  - name: Lint
    run: npm run lint  # Your command
  
  - name: Build
    run: npm run build  # Your command
  
  - name: Test
    run: npm test  # Your command
```

### Adding More Workflows

```bash
# Create new workflow
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: ./deploy.sh
EOF
```

### Common Workflow Patterns

**Deploy on Release**:
```yaml
on:
  release:
    types: [published]
```

**Run on Schedule**:
```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
```

**Manual Trigger**:
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
```

## Tips and Best Practices

### Keep Templates Updated
- Review quarterly
- Update based on team feedback
- Remove unused templates
- Add new ones as needed

### Engage Your Team
- Get team input on instructions
- Share effective prompts
- Document tribal knowledge
- Review CODEOWNERS regularly

### Iterate and Improve
- Track what works well
- Adjust based on usage
- Remove friction points
- Share learnings

### Security
- Review Dependabot PRs promptly
- Keep workflows secure
- Protect sensitive data in workflows
- Use secrets for credentials

## Getting Help

- Check GitHub's [official documentation](https://docs.github.com)
- Review [GitHub Copilot docs](https://docs.github.com/en/copilot)
- Ask in project discussions
- Contact maintainers

## Next Steps

1. ✅ Customize copilot-instructions.md
2. ✅ Update CODEOWNERS
3. ✅ Configure Dependabot
4. ✅ Set up workflows
5. ✅ Create project-specific instructions
6. ✅ Share with your team
7. ✅ Start using prompts
8. ✅ Iterate and improve

Happy coding! 🚀
