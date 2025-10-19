---
description: Help set up a new project or development environment
---

# Setup Project

You are helping to set up a new project or development environment.

## Instructions

1. **Understand requirements**:
   - What type of project? (web app, library, CLI tool, etc.)
   - What language/framework?
   - What development tools are needed?
   - What dependencies are required?

2. **Initialize project structure**:
   - Create appropriate directory structure
   - Initialize package manager (npm, pip, go mod, etc.)
   - Set up version control
   - Add necessary configuration files

3. **Configure development tools**:
   - Set up linter and formatter
   - Configure build tools
   - Set up test framework
   - Add development scripts

4. **Add documentation**:
   - Create README with setup instructions
   - Add CONTRIBUTING guide
   - Document project structure
   - Provide examples

5. **Set up CI/CD**:
   - Configure GitHub Actions or similar
   - Add build and test workflows
   - Set up code quality checks
   - Configure deployment (if applicable)

## Project Initialization Steps

### 1. Create Project Structure

```bash
# Basic structure for most projects
mkdir -p src tests docs scripts
touch README.md CONTRIBUTING.md LICENSE
```

### 2. Initialize Package Manager

```bash
# Node.js/npm
npm init -y

# Python
python -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate on Windows
pip install -r requirements.txt

# Go
go mod init github.com/username/project

# Rust
cargo new project-name
```

### 3. Add Configuration Files

Create essential configuration files:

**.gitignore**
```gitignore
# Dependencies
node_modules/
venv/
__pycache__/

# Build outputs
dist/
build/
*.exe

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

**package.json** (Node.js)
```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "Project description",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
```

**.editorconfig**
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,ts,json,yml,yaml}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

### 4. Set Up Linting and Formatting

**ESLint** (TypeScript/JavaScript)
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npx eslint --init
```

**.eslintrc.json**
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

**Prettier**
```bash
npm install -D prettier
```

**.prettierrc**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### 5. Configure Testing

**Jest** (TypeScript/JavaScript)
```bash
npm install -D jest @types/jest ts-jest
npx ts-jest config:init
```

**pytest** (Python)
```bash
pip install pytest pytest-cov
```

**pytest.ini**
```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
```

### 6. Set Up TypeScript (if applicable)

```bash
npm install -D typescript @types/node
npx tsc --init
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 7. Add npm Scripts

Update package.json scripts:
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "format:check": "prettier --check src/**/*.ts",
    "clean": "rm -rf dist",
    "prebuild": "npm run clean",
    "prepublishOnly": "npm run build && npm test"
  }
}
```

### 8. Create README Template

```markdown
# Project Name

Brief description of the project.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
npm install project-name
\`\`\`

## Usage

\`\`\`typescript
import { something } from 'project-name';

// Example usage
\`\`\`

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

\`\`\`bash
# Clone repository
git clone https://github.com/username/project-name.git
cd project-name

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
\`\`\`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
```

### 9. Set Up GitHub Actions

**.github/workflows/ci.yml**
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

### 10. Initialize Git Repository

```bash
# Initialize repository
git init

# Add GitHub template files
cp -r .github-template/.github .

# Add all files
git add .

# Initial commit
git commit -m "Initial commit"

# Add remote and push
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

## Project-Specific Setup

### Web Application
- Set up webpack/vite/etc.
- Configure dev server
- Add HTML/CSS files
- Set up static asset handling

### Library/Package
- Configure package exports
- Set up build for distribution
- Add type definitions
- Configure npm publishing

### CLI Tool
- Set up command parsing
- Add bin configuration
- Create command help
- Handle process signals

### API Server
- Set up routing
- Configure middleware
- Add database connection
- Set up environment config

## Checklist

- [ ] Project structure created
- [ ] Package manager initialized
- [ ] Dependencies installed
- [ ] Linter configured
- [ ] Formatter configured
- [ ] Tests configured
- [ ] Build process set up
- [ ] Scripts added to package.json
- [ ] README created
- [ ] CONTRIBUTING guide added
- [ ] LICENSE file added
- [ ] .gitignore configured
- [ ] CI/CD workflow added
- [ ] Git repository initialized
- [ ] Initial commit made

## Output

Provide:
- Complete project structure
- All configuration files
- Development scripts
- Documentation
- Clear setup instructions
