# Cardano .github Template# .github Template



A comprehensive `.github` directory template **specialized for Cardano blockchain development**. This template provides smart contract guidelines, wallet integration patterns, CIP compliance instructions, CI/CD workflows for Plutus and Aiken, and AI-powered development tools to accelerate Cardano DApp and smart contract projects.A comprehensive `.github` directory template for new projects. This template provides community health files, issue/PR templates, GitHub Copilot prompts, coding instructions, and CI workflows to help teams maintain consistency and leverage AI assistance effectively.



> 🎯 **Perfect for:** Plutus validators, Aiken smart contracts, NFT projects, DEX/AMM protocols, wallet integrations, full-stack Cardano DApps, and enterprise Cardano solutions.## 📋 What's Included



## 🌟 Why This Template?### Community Files

- **CONTRIBUTING.md** - Contribution guidelines and PR checklist

- **🔒 Production-Ready Security**: Pre-mainnet audit checklists, testnet validation workflows, and vulnerability pattern detection- **CODE_OF_CONDUCT.md** - Community standards and reporting

- **⚡ Dual Language Support**: Equal support for Plutus (Haskell) and Aiken smart contract development- **SECURITY.md** - Security vulnerability reporting process

- **🤖 AI-Powered Development**: 20 specialized GitHub Copilot prompts for validators, transactions, NFTs, and wallet integration- **SUPPORT.md** - Getting help and support channels

- **📋 CIP Compliance**: Built-in standards for CIP-25 (NFT), CIP-30 (Wallet), CIP-57 (Blueprint), CIP-68 (Datum), CIP-1694 (Governance)- **FUNDING.yml** - Sponsorship and funding links

- **🚀 Complete CI/CD**: Automated testing, testnet deployment, and mainnet security gates

- **📚 Comprehensive Docs**: Setup guides, tutorials, and quick references for Cardano development### Issue & PR Templates

- **PULL_REQUEST_TEMPLATE.md** - Standard PR description template

## 📦 What's Included- **ISSUE_TEMPLATE/** - Bug reports, feature requests, and questions

  - `bug_report.md` - Bug report template

### 🤖 GitHub Copilot Prompts (`.github/prompts/`) - 20 Total  - `feature_request.md` - Feature request template

  - `question.md` - General question template

**Cardano-Specific Prompts (7 new):**  - `config.yml` - Issue template configuration

- **validator.prompt.md** - Generate Plutus/Aiken validators with tests and security checks

- **transaction.prompt.md** - Build transactions with Lucid Evolution (lock/unlock, payments, NFT minting)### GitHub Copilot Prompts (`.github/prompts/`)

- **mint-nft.prompt.md** - CIP-25 compliant NFT minting with metadata validation

- **wallet-integration.prompt.md** - CIP-30 wallet connection (React Context, multi-wallet support)Reusable prompt snippets that guide AI coding assistants (13 prompts):

- **cip-lookup.prompt.md** - Search and implement CIP standards with code examples

- **security-audit.prompt.md** - Pre-mainnet security checklist and vulnerability scanning**Planning & Implementation:**

- **blueprint.prompt.md** - Generate CIP-57 blueprints for validator documentation- **plan.prompt.md** - Create balanced implementation plans

- **plan-fast.prompt.md** - Quick planning for simple tasks

**Enhanced General Prompts (11 modified):**- **plan-deep.prompt.md** - Detailed planning with clarifying questions

- **plan.prompt.md** - Implementation planning with Cardano requirements identification- **implement.prompt.md** - Execute plans with production-quality code

- **implement.prompt.md** - Execution with smart contract security requirements

- **bug-triage.prompt.md** - Bug analysis with network/wallet/tx hash fields**Issue & Bug Management:**

- **component.prompt.md** - UI components with wallet integration patterns- **bug-triage.prompt.md** - Gather bug report details

- **setup-environment.prompt.md** - Environment setup including Aiken, GHC, Cabal, cardano-node- **fixIssueNo.prompt.md** - Analyze and solve GitHub issues

- **plan-fast.prompt.md** - Quick planning with CIP semantic search

- **plan-deep.prompt.md** - Deep planning with Cardano clarifying questions**Code Generation & Quality:**

- **data.prompt.md** - Data analysis including datum/redeemer structures- **component.prompt.md** - Generate components following project patterns

- **playwright.prompt.md** - E2E testing with wallet connection verification- **data.prompt.md** - Analyze data structures and schemas

- **no-any.prompt.md** - TypeScript safety with Lucid Evolution types- **no-any.prompt.md** - Eliminate TypeScript `any` types

- **fixIssueNo.prompt.md** - Issue fixing with smart contract bug patterns

**Testing & Environment:**

**Unchanged General Prompts (2):**- **playwright.prompt.md** - Write end-to-end tests with Playwright

- **codenotify.prompt.md** - Contribution tracking- **setup-environment.prompt.md** - Guide new contributor onboarding

- **update-instructions.prompt.md** - Instruction file maintenance

**Maintenance:**

### 📋 Coding Instructions (`.github/instructions/`) - 10 Total- **codenotify.prompt.md** - Add contributions to CODENOTIFY file

- **update-instructions.prompt.md** - Maintain instruction files

**Cardano-Specific Instructions (7 new):**

- **plutus-guidelines.instructions.md** - Haskell/Plutus conventions (INLINABLE, traceIfFalse, no partial functions)Learn more: [GitHub Copilot Prompt Snippets](https://aka.ms/vscode-ghcp-prompt-snippets)

  - `applyTo: "src/**/*.hs"`

- **aiken-guidelines.instructions.md** - Aiken best practices (expect, pattern matching, fuzzing)### Coding Instructions (`.github/instructions/`)

  - `applyTo: "validators/**/*.ak"`

- **smart-contract-security.instructions.md** - Security audit requirements and vulnerability patternsAutomatically attached guidelines that teach AI assistants project-specific patterns:

  - `applyTo: "validators/**/*.{hs,ak}"`

- **wallet-integration.instructions.md** - CIP-30 wallet API patterns (8 wallets supported)- **code-guidelines.instructions.md** - Core coding conventions (applies to `src/**/*.{ts,tsx,js,jsx,py,rb,go}`)

  - `applyTo: "src/**/*.{ts,tsx,js,jsx}"`- **testing.instructions.md** - Testing expectations (applies to `**/*.{spec,test}.*`)

- **cip-compliance.instructions.md** - CIP implementation guides (CIP-25/30/57/68/1694)- **release-process.instructions.md** - Release workflow (applies to `.github/workflows/release/**`)

  - `applyTo: "src/**/*.{ts,tsx,js,jsx,hs,ak}"`

- **blockchain-testing.instructions.md** - Testing pyramid for Cardano (unit, integration, E2E)Learn more: [GitHub Copilot Custom Instructions](https://aka.ms/vscode-ghcp-custom-instructions)

  - `applyTo: "**/*.{spec,test}.{js,ts,hs,ak}"`

- **cardano-infrastructure.instructions.md** - Node setup and tooling (cardano-node, Blockfrost, Koios)### GitHub Actions Workflows (`.github/workflows/`)

  - `applyTo: "scripts/**/*.sh"`

- **ci.yml** - Multi-language CI pipeline (Node.js and Python support)

**Enhanced General Instructions (3 modified):**

- **code-guidelines.instructions.md** - Core conventions including Cardano patterns## 🚀 Usage

  - `applyTo: "src/**/*.{hs,ak,ts,tsx,js,jsx}"`

- **testing.instructions.md** - Testing pyramid for Cardano (cabal test, aiken check)### Option 1: Copy the Entire `.github` Directory

  - `applyTo: "**/*.{spec,test}.{js,ts,hs,ak}"`

- **release-process.instructions.md** - Smart contract deployment workflow (testnet → mainnet)```bash

  - `applyTo: ".github/workflows/release/**"`# Clone this template

git clone https://github.com/FractionEstate/.github-template.git

### 🔄 GitHub Actions Workflows (`.github/workflows/`) - 3 Total

# Copy to your project

**Cardano CI/CD Pipelines:**cp -r .github-template/.github /path/to/your/project/

- **cardano-ci.yml** - Multi-language CI with matrix builds:

  - Haskell (GHC 9.6.6, 9.8.2) with cabal test# Customize the files

  - Aiken 1.1.19 with aiken check and coveragecd /path/to/your/project/.github

  - Node.js (18.x, 20.x) with TypeScript and linting```

  - Integration tests and security scanning (Trivy, TruffleHog)

  ### Option 2: Use as a GitHub Template Repository

- **testnet-deploy.yml** - Automated testnet deployment:

  - Builds validators (Aiken + Plutus)1. Click "Use this template" on GitHub

  - Deploys to Preprod/Preview testnet2. Create a new repository

  - Runs verification and smoke tests3. Copy the `.github` folder to your actual project

  - Notifications (Discord/Slack)

  ### Option 3: Cherry-Pick Specific Files

- **mainnet-checklist.yml** - Production deployment gate:

  - 6 mandatory pre-deployment checksCopy only what you need:

  - Security audit validation

  - Testnet validation (2+ weeks minimum)```bash

  - 100% test coverage requirement# Just the prompts

  - Manual approval gatecp -r .github-template/.github/prompts /path/to/your/project/.github/

  - Automated release creation

# Just the instructions

### 📝 Issue Templates (`.github/ISSUE_TEMPLATE/`) - 6 Totalcp -r .github-template/.github/instructions /path/to/your/project/.github/



**Cardano-Specific Templates (4 new):**# Just community files

- **smart-contract-bug.md** - Report validator bugs with datum/redeemer, tx hash, networkcp .github-template/.github/{CONTRIBUTING,SECURITY,CODE_OF_CONDUCT}.md /path/to/your/project/.github/

- **transaction-issue.md** - Transaction building/submission problems with CBOR, UTxOs```

- **wallet-integration.md** - CIP-30 wallet connectivity issues with API checks

- **security-audit.md** - Pre-mainnet security audit requests with TVL, scope, timeline## ✏️ Customization Guide



**Enhanced General Templates (2 modified):**After copying the template, customize these placeholders:

- **bug_report.md** - Bug reports with Cardano-specific fields (network, wallet, tx hash)

- **feature_request.md** - Feature requests with CIP context and smart contract impact1. **Replace repository-specific values:**

   - `OWNER` → Your GitHub username or organization

### 📚 Community Files   - `REPO` → Your repository name

   - `REPO_OWNER` → Your organization domain or contact

- **CONTRIBUTING.md** - Contribution guidelines and PR checklist

- **CODE_OF_CONDUCT.md** - Community standards and reporting2. **Update file patterns in instructions:**

- **SECURITY.md** - Security vulnerability reporting process   - Edit `applyTo` patterns in `.instructions.md` files to match your project structure

- **SUPPORT.md** - Getting help and support channels   - Examples: `src/**/*.ts`, `lib/**/*.py`, `tests/**/*.spec.js`

- **FUNDING.yml** - Sponsorship and funding links

- **PULL_REQUEST_TEMPLATE.md** - Standard PR description template3. **Customize prompts and instructions:**

   - Add project-specific coding conventions to `code-guidelines.instructions.md`

## 🚀 Quick Start   - Document your test setup in `testing.instructions.md`

   - Fill in release steps in `release-process.instructions.md`

### Prerequisites   - **Customize prompt tools:** Some prompts include MCP server references (e.g., `microsoft/playwright-mcp/*`). Remove or replace these with standard tools if you're not using those MCP servers.



```bash4. **Configure CI workflow:**

# Required versions   - Adjust Node.js/Python versions in `workflows/ci.yml`

cardano-node: 10.5.1+   - Add language-specific steps for Go, Ruby, Rust, etc.

Plutus: 1.54.0.0+   - Configure deployment steps if needed

Aiken: 1.1.19+

GHC: 9.6+ (for Plutus)5. **Update issue templates:**

Cabal: 3.10+   - Modify labels in issue templates to match your repo labels

Node.js: 18+ or 20+   - Update discussion links in `ISSUE_TEMPLATE/config.yml`

```

## 🧪 Testing the Setup

### Installation

1. **Verify GitHub recognizes templates:**

**Option 1: Use as Template Repository**   - Create a new issue → templates should appear

```bash   - Create a new PR → template should auto-populate

# Click "Use this template" on GitHub

# Then clone your new repository2. **Test Copilot prompts:**

git clone https://github.com/YOUR_ORG/YOUR_REPO.git   - In VS Code with GitHub Copilot, type `#` in chat

cd YOUR_REPO   - Your custom prompts should appear in autocomplete

```

3. **Test instructions:**

**Option 2: Copy to Existing Project**   - Edit a file matching an `applyTo` pattern

```bash   - Ask Copilot about coding standards → it should reference your instructions

# Clone this template

git clone https://github.com/FractionEstate/.github-template.git4. **Verify CI workflow:**

   - Push a commit or open a PR

# Copy .github directory to your project   - Check the Actions tab for workflow runs

cp -r .github-template/.github /path/to/your/cardano-project/

```## 📚 Learn More



**Option 3: Cherry-Pick Components**- [GitHub Community Health Files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions)

```bash- [GitHub Issue & PR Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests)

# Just Cardano prompts- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)

cp .github-template/.github/prompts/{validator,transaction,mint-nft,wallet-integration,cip-lookup,security-audit,blueprint}.prompt.md /path/to/your/project/.github/prompts/- [VS Code .github Reference](https://github.com/microsoft/vscode/tree/main/.github)



# Just smart contract instructions## 🤝 Contributing

cp .github-template/.github/instructions/{plutus-guidelines,aiken-guidelines,smart-contract-security}.instructions.md /path/to/your/project/.github/instructions/

Contributions welcome! If you've created useful prompts or instructions, please open a PR to share them with the community.

# Just CI workflows

cp .github-template/.github/workflows/{cardano-ci,testnet-deploy,mainnet-checklist}.yml /path/to/your/project/.github/workflows/## 📄 License

```

This template is provided as-is for public use. Customize freely for your projects.

### Initial Setup

1. **Configure GitHub Secrets** (for CI/CD):
   ```bash
   # Add to your repository secrets:
   BLOCKFROST_PREPROD_KEY=preprodXXXXXXXXXXXX
   BLOCKFROST_MAINNET_KEY=mainnetXXXXXXXXXXXX
   DEPLOYER_SEED_PREPROD=word1 word2 word3 ... (24 words)
   DEPLOYER_SEED_MAINNET=word1 word2 word3 ... (24 words)
   DISCORD_WEBHOOK=https://discord.com/api/webhooks/... (optional)
   SLACK_WEBHOOK=https://hooks.slack.com/services/... (optional)
   ```

2. **Customize Instructions**:
   ```bash
   # Update applyTo patterns to match your project structure
   # Edit .github/instructions/*.instructions.md
   ```

3. **Test AI Assistance**:
   ```bash
   # In VS Code with GitHub Copilot:
   # 1. Type # in chat to see custom prompts
   # 2. Try: #validator or #wallet-integration
   # 3. Edit a .hs or .ak file and ask about conventions
   ```

## 🎯 Usage Examples

### Generate a Validator

```
GitHub Copilot Chat:
> #validator Create a simple time-locked validator in Aiken
```

Copilot will:
- Generate Aiken validator with expect patterns
- Create test file with aiken check tests
- Add security checklist
- Generate CIP-57 blueprint

### Build a Transaction

```
GitHub Copilot Chat:
> #transaction Build a transaction to lock 10 ADA at a script address with custom datum
```

Copilot will:
- Use Lucid Evolution patterns
- Handle UTxO selection
- Calculate proper fees
- Build and sign transaction

### Integrate a Wallet

```
GitHub Copilot Chat:
> #wallet-integration Create a React Context for CIP-30 wallet connection with Nami and Eternl
```

Copilot will:
- Generate React Context with multi-wallet support
- Handle network validation
- Add error boundaries
- Include wallet state management

### Look Up a CIP

```
GitHub Copilot Chat:
> #cip-lookup Show me how to implement CIP-68 datum metadata
```

Copilot will:
- Search CIP standards
- Provide implementation code
- Show validation patterns
- Link to official specs

### Run Security Audit

```
GitHub Copilot Chat:
> #security-audit Check my validator for common vulnerabilities before mainnet
```

Copilot will:
- Check pre-deployment requirements
- Scan for dangerous patterns (head, tail, fromJust)
- Verify test coverage
- Generate audit report

## 🔧 Technology Stack

### Smart Contract Languages
- **Plutus** v1.54.0.0 (Haskell) - [IntersectMBO/plutus](https://github.com/IntersectMBO/plutus)
  - plutus-tx, plutus-ledger-api, PlutusTx.Prelude
  - Testing: QuickCheck, tasty, HSpec

- **Aiken** v1.1.19 - [aiken-lang/aiken](https://github.com/aiken-lang/aiken)
  - Built-in testing, fuzzing, LSP support
  - Automatic CIP-57 blueprint generation

### Off-Chain Libraries
- **Lucid Evolution** @lucid-evolution/lucid - [Anastasia-Labs/lucid-evolution](https://github.com/Anastasia-Labs/lucid-evolution)
  - Production-ready, Conway era support
  - Transaction builder, wallet integration

- **Mesh SDK** v1.8.0 - [@meshsdk/core](https://meshjs.dev)
  - React/Svelte components
  - 9 smart contract templates

### Wallet Integration (CIP-30)
- Nami, Eternl, Lace, Yoroi, Flint, Typhon, Gero, NuFi
- Full CIP-30 API support
- Multi-wallet connection patterns

### Node & Infrastructure
- **cardano-node** v10.5.1 - [IntersectMBO/cardano-node](https://github.com/IntersectMBO/cardano-node)
- **Providers**: Blockfrost, Koios, Maestro, Kupmios
- **Networks**: Mainnet, Preprod, Preview

### CIP Standards (150+ supported)
- **CIP-25**: NFT Metadata Standard
- **CIP-30**: DApp-Wallet Web Bridge (Wallet API)
- **CIP-57**: Plutus Smart Contract Blueprints
- **CIP-68**: Datum Metadata Standard
- **CIP-1694**: Voltaire Governance

## 🧪 Testing & Deployment

### Local Testing

```bash
# Plutus validator tests
cabal test

# Aiken validator tests (with coverage)
aiken check --coverage

# Frontend tests
npm test

# Integration tests
npm run test:integration

# E2E tests (with wallet mocking)
npm run test:e2e
```

### Testnet Deployment

```bash
# Manual deployment
npm run deploy:preprod

# Automatic (via GitHub Actions)
git push origin main  # Triggers testnet-deploy.yml
```

### Mainnet Deployment

```bash
# Via GitHub Actions (with approval gate)
# Go to Actions tab → Run workflow: mainnet-checklist.yml
# Complete pre-deployment checks
# Get manual approval
# Deploy to mainnet
```

## 📋 Pre-Mainnet Checklist

Before deploying to mainnet, ensure:

- [ ] ✅ Security audit completed (MLabs, Tweag, Runtime Verification, or Certik)
- [ ] ✅ Testnet validation minimum 2 weeks (Preprod)
- [ ] ✅ 100% branch coverage on validators
- [ ] ✅ CIP-57 blueprint generated and validated
- [ ] ✅ Complete validator documentation
- [ ] ✅ Emergency response plan documented

See [Smart Contract Security Guidelines](.github/instructions/smart-contract-security.instructions.md) for full checklist.

## ✏️ Customization Guide

### 1. Update Project Information

Replace in all files:
- `FractionEstate` → Your organization
- `YOUR_PROJECT` → Your project name
- API keys and secrets in GitHub Secrets

### 2. Customize Instructions

Edit `applyTo` patterns to match your structure:
```markdown
applyTo: "validators/**/*.ak"  # Your Aiken validators
applyTo: "src/**/*.hs"         # Your Plutus code
applyTo: "app/**/*.ts"         # Your TypeScript frontend
```

### 3. Configure CI/CD

Adjust versions in `.github/workflows/cardano-ci.yml`:
```yaml
matrix:
  ghc: ['9.6.6', '9.8.2']      # Your GHC versions
  aiken: ['1.1.19']            # Your Aiken version
  node-version: [18.x, 20.x]   # Your Node.js versions
```

### 4. Customize Prompts

Edit prompts to match your patterns:
- Update library imports (Lucid Evolution versions)
- Modify file structure references
- Add project-specific examples

### 5. Update Issue Templates

Modify labels to match your repository:
```yaml
labels: bug, smart-contract  # Your labels
```

## 📚 Learn More

### External Resources

- [Plutus Documentation](https://plutus.cardano.intersectmbo.org/docs/)
- [Aiken Language](https://aiken-lang.org/)
- [Lucid Evolution](https://anastasia-labs.github.io/lucid-evolution/)
- [Mesh SDK](https://meshjs.dev/)
- [CIP Standards](https://cips.cardano.org/)
- [Cardano Developers Portal](https://developers.cardano.org/)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [VS Code .github Reference](https://github.com/microsoft/vscode/tree/main/.github)

## 🔍 Verification

### Test GitHub Integration

1. **Issue Templates**: Create issue → templates appear
2. **PR Template**: Create PR → template auto-populates
3. **CI Workflow**: Push commit → Actions tab shows workflow
4. **Copilot Prompts**: Type `#` in VS Code → custom prompts appear

### Test Smart Contract Development

1. **Plutus**: Edit `.hs` file → Copilot suggests INLINABLE patterns
2. **Aiken**: Edit `.ak` file → Copilot suggests expect patterns
3. **Testing**: Run `cabal test` or `aiken check` → 100% coverage
4. **Security**: Use `#security-audit` → vulnerability scan runs

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-prompt`
3. Commit your changes: `git commit -m 'Add amazing validator prompt'`
4. Push to the branch: `git push origin feature/amazing-prompt`
5. Open a Pull Request

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This template is provided as-is for public use. Customize freely for your Cardano projects.

## 🙏 Acknowledgments

- Inspired by [VS Code .github repository](https://github.com/microsoft/vscode)
- Built for the Cardano developer community
- Powered by GitHub Copilot and AI-assisted development

---

**Ready to build on Cardano?** 🚀

Start with `#validator` to generate your first smart contract!

**Questions?** Open an issue or check our [SUPPORT.md](.github/SUPPORT.md)
