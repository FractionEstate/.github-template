# Usage Examples

This document provides examples of how to customize this GitHub template for different types of projects.

## Example 1: Node.js/TypeScript Web Application

### Customizing copilot-instructions.md

```markdown
# Project Overview

MyWebApp is a modern web application built with React, TypeScript, and Node.js.

### Technology Stack
- Frontend: React 18, TypeScript, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL
- Testing: Jest, React Testing Library
- Build: Vite

### Project Structure
- src/
  - client/       # React frontend
  - server/       # Express backend
  - shared/       # Shared types and utilities
  - tests/        # Test files
```

### Customizing dependabot.yml

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Customizing workflows/ci.yml

```yaml
steps:
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
  
  - name: Install dependencies
    run: npm ci
  
  - name: Lint
    run: npm run lint
  
  - name: Build
    run: npm run build
  
  - name: Test
    run: npm test -- --coverage
```

## Example 2: Python Data Science Project

### Customizing copilot-instructions.md

```markdown
# Project Overview

DataAnalyzer is a data science project using Python, Pandas, and Scikit-learn.

### Technology Stack
- Python 3.11+
- Pandas, NumPy, Scikit-learn
- Jupyter Notebooks
- Pytest for testing

### Project Structure
- src/
  - data/         # Data processing
  - models/       # ML models
  - analysis/     # Analysis notebooks
- tests/
- notebooks/
```

### Customizing dependabot.yml

```yaml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Customizing workflows/ci.yml

```yaml
steps:
  - name: Setup Python
    uses: actions/setup-python@v5
    with:
      python-version: '3.11'
      cache: 'pip'
  
  - name: Install dependencies
    run: pip install -r requirements.txt
  
  - name: Lint
    run: |
      pip install flake8
      flake8 src tests
  
  - name: Test
    run: pytest tests/ --cov=src
```

## Example 3: Go Microservice

### Customizing copilot-instructions.md

```markdown
# Project Overview

API Gateway is a microservice built with Go.

### Technology Stack
- Go 1.21+
- Gorilla Mux for routing
- PostgreSQL
- Docker for containerization

### Project Structure
- cmd/
  - api/          # API server entry point
- internal/
  - handlers/     # HTTP handlers
  - models/       # Data models
  - repository/   # Database layer
- pkg/
  - middleware/   # Reusable middleware
```

### Customizing dependabot.yml

```yaml
version: 2
updates:
  - package-ecosystem: "gomod"
    directory: "/"
    schedule:
      interval: "weekly"
  
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Customizing workflows/ci.yml

```yaml
steps:
  - name: Setup Go
    uses: actions/setup-go@v5
    with:
      go-version: '1.21'
      cache: true
  
  - name: Build
    run: go build -v ./...
  
  - name: Test
    run: go test -v -race -coverprofile=coverage.out ./...
  
  - name: Lint
    uses: golangci/golangci-lint-action@v3
```

## Example 4: React Native Mobile App

### Customizing copilot-instructions.md

```markdown
# Project Overview

MobileApp is a cross-platform mobile application built with React Native.

### Technology Stack
- React Native 0.72+
- TypeScript
- Redux for state management
- Expo for development

### Project Structure
- src/
  - components/   # Reusable UI components
  - screens/      # Screen components
  - navigation/   # Navigation setup
  - store/        # Redux store
  - services/     # API services
```

### Customizing workflows/ci.yml

```yaml
steps:
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
  
  - name: Install dependencies
    run: npm ci
  
  - name: Lint
    run: npm run lint
  
  - name: Type check
    run: npm run type-check
  
  - name: Test
    run: npm test
  
  - name: Build Android
    run: |
      cd android
      ./gradlew assembleRelease
```

## Example 5: Rust CLI Tool

### Customizing copilot-instructions.md

```markdown
# Project Overview

CLI Tool is a command-line utility written in Rust.

### Technology Stack
- Rust 1.70+
- clap for CLI parsing
- tokio for async runtime
- serde for serialization

### Project Structure
- src/
  - main.rs       # Entry point
  - commands/     # Command implementations
  - config/       # Configuration handling
- tests/
```

### Customizing dependabot.yml

```yaml
version: 2
updates:
  - package-ecosystem: "cargo"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Customizing workflows/ci.yml

```yaml
steps:
  - name: Setup Rust
    uses: dtolnay/rust-toolchain@stable
  
  - name: Cache dependencies
    uses: Swatinem/rust-cache@v2
  
  - name: Build
    run: cargo build --verbose
  
  - name: Test
    run: cargo test --verbose
  
  - name: Lint
    run: |
      cargo fmt -- --check
      cargo clippy -- -D warnings
```

## Example 6: Documentation Site

### Customizing copilot-instructions.md

```markdown
# Project Overview

This is a documentation site built with VitePress.

### Technology Stack
- VitePress
- Markdown
- Vue 3 for custom components

### Project Structure
- docs/
  - .vitepress/   # VitePress config
  - guide/        # User guides
  - api/          # API reference
  - examples/     # Code examples
```

### Customizing workflows/ci.yml

```yaml
steps:
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
  
  - name: Install dependencies
    run: npm ci
  
  - name: Build docs
    run: npm run docs:build
  
  - name: Deploy to GitHub Pages
    uses: peaceiris/actions-gh-pages@v3
    if: github.ref == 'refs/heads/main'
    with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
      publish_dir: docs/.vitepress/dist
```

## Example 7: Monorepo with Multiple Packages

### Customizing copilot-instructions.md

```markdown
# Project Overview

This is a monorepo containing multiple related packages.

### Technology Stack
- Turborepo for monorepo management
- TypeScript
- Multiple packages (UI components, utilities, services)

### Project Structure
- packages/
  - ui/           # UI component library
  - utils/        # Shared utilities
  - api-client/   # API client package
- apps/
  - web/          # Main web application
  - admin/        # Admin dashboard
```

### Customizing CODEOWNERS

```
# Monorepo-specific ownership
/packages/ui/ @frontend-team
/packages/utils/ @core-team
/packages/api-client/ @api-team
/apps/web/ @web-team @frontend-team
/apps/admin/ @admin-team
```

### Customizing workflows/ci.yml

```yaml
steps:
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
  
  - name: Install dependencies
    run: npm ci
  
  - name: Build all packages
    run: npm run build
  
  - name: Test all packages
    run: npm run test
  
  - name: Lint all packages
    run: npm run lint
```

## Customization Checklist

For any project type:

- [ ] Update `copilot-instructions.md` with project-specific information
- [ ] Modify `CODEOWNERS` with actual team/user handles
- [ ] Enable relevant package ecosystems in `dependabot.yml`
- [ ] Uncomment and customize `workflows/ci.yml` steps
- [ ] Update issue template labels to match your repository
- [ ] Adjust PR template checklist for your workflow
- [ ] Add project-specific instruction files if needed
- [ ] Create custom prompts for your common tasks
- [ ] Update README.md with project-specific details
- [ ] Configure repository settings on GitHub

## Tips for Customization

1. **Start Small**: Begin with just the essential files and expand
2. **Keep Examples**: Reference existing examples when adding new content
3. **Test Locally**: Validate YAML files before committing
4. **Iterate**: Improve templates based on team feedback
5. **Document**: Explain any project-specific conventions
6. **Share**: Help your team understand the new structure

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [CODEOWNERS Syntax](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Issue Template Syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)
