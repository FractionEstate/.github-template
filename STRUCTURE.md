# Repository Structure

This document provides an overview of the GitHub template structure created.

## Directory Tree

```
.github-template/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md          # Bug report template
│   │   ├── feature_request.md     # Feature request template
│   │   └── config.yml             # Issue template configuration
│   │
│   ├── instructions/
│   │   ├── api-design.instructions.md    # API design guidelines
│   │   ├── security.instructions.md      # Security best practices
│   │   └── testing.instructions.md       # Testing guidelines
│   │
│   ├── prompts/
│   │   ├── add-feature.prompt.md         # Feature implementation workflow
│   │   ├── document-code.prompt.md       # Documentation guide
│   │   ├── fix-bug.prompt.md             # Bug fixing workflow
│   │   ├── refactor-code.prompt.md       # Refactoring patterns
│   │   ├── review-code.prompt.md         # Code review checklist
│   │   ├── setup-project.prompt.md       # Project setup workflow
│   │   └── write-tests.prompt.md         # Test writing guide
│   │
│   ├── workflows/
│   │   └── ci.yml                        # CI/CD workflow template
│   │
│   ├── CODEOWNERS                        # Code ownership definitions
│   ├── USAGE.md                          # Detailed usage guide
│   ├── copilot-instructions.md           # GitHub Copilot instructions
│   ├── dependabot.yml                    # Dependabot configuration
│   └── pull_request_template.md          # PR template
│
├── CONTRIBUTING.md                       # Contribution guidelines
├── LICENSE                               # MIT License
└── README.md                            # Main documentation
```

## File Descriptions

### Core Configuration Files

| File | Purpose | Customization Priority |
|------|---------|----------------------|
| `copilot-instructions.md` | Main Copilot guidance for your project | 🔴 High |
| `CODEOWNERS` | Define code ownership and review assignments | 🔴 High |
| `dependabot.yml` | Configure automated dependency updates | 🟡 Medium |
| `pull_request_template.md` | Standardize PR descriptions | 🟢 Low |

### Issue Templates

| File | Purpose |
|------|---------|
| `bug_report.md` | Structured bug reporting |
| `feature_request.md` | Feature proposal template |
| `config.yml` | Issue template configuration |

### Instructions (for GitHub Copilot)

| File | Coverage |
|------|----------|
| `testing.instructions.md` | Testing patterns and best practices |
| `api-design.instructions.md` | API design principles |
| `security.instructions.md` | Security guidelines and patterns |

### Prompts (Reusable Copilot Workflows)

| File | Use Case |
|------|----------|
| `fix-bug.prompt.md` | Systematic bug fixing |
| `add-feature.prompt.md` | Feature implementation |
| `refactor-code.prompt.md` | Safe refactoring |
| `write-tests.prompt.md` | Comprehensive testing |
| `review-code.prompt.md` | Thorough code reviews |
| `document-code.prompt.md` | Documentation writing |
| `setup-project.prompt.md` | Project initialization |

### Workflows

| File | Purpose |
|------|---------|
| `ci.yml` | Example CI/CD pipeline with linting, building, testing, and security scanning |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Main repository documentation with quick start |
| `USAGE.md` | Detailed usage guide for all components |
| `CONTRIBUTING.md` | Contribution guidelines and development setup |
| `LICENSE` | MIT License |

## Quick Start

1. **For New Projects**: Use this repository as a template on GitHub
2. **For Existing Projects**: Copy the `.github/` directory to your project
3. **Customize**: Update `copilot-instructions.md` and `CODEOWNERS` with your project details
4. **Enable**: Configure repository settings for issue templates and Dependabot

## Key Features

✅ **GitHub Copilot Integration** - Comprehensive instructions and prompts
✅ **Issue Management** - Structured templates for bugs and features
✅ **Code Review** - Automated review requests via CODEOWNERS
✅ **Dependency Management** - Automated updates via Dependabot
✅ **CI/CD** - Example workflows for automated testing
✅ **Documentation** - Comprehensive guides for contributors
✅ **Best Practices** - Domain-specific coding guidelines

## Statistics

- 📁 **3 directories** (ISSUE_TEMPLATE, instructions, prompts, workflows)
- 📄 **19 template files** in `.github/`
- 📝 **7 prompt workflows** for common tasks
- 🔒 **3 instruction files** for best practices
- 🚀 **1 CI/CD workflow** example
- 📖 **4 documentation files**

---

**Total**: 22 files providing a complete GitHub setup for great developer experience
