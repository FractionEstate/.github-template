# Contributing to Cardano Projects

Thank you for helping improve Cardano smart contracts and DApps! This guide covers contribution standards for Cardano development projects using this `.github` template.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Smart Contract Contributions](#smart-contract-contributions)
- [DApp Contributions](#dapp-contributions)
- [Testing Requirements](#testing-requirements)
- [Security Guidelines](#security-guidelines)
- [Pull Request Process](#pull-request-process)
- [CIP Compliance](#cip-compliance)
- [Style Guide](#style-guide)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn about Cardano development
- Report security issues privately (see [SECURITY.md](../SECURITY.md))

## Getting Started

### Prerequisites

1. **Set up development environment:**
   - Follow [CARDANO_SETUP.md](../CARDANO_SETUP.md)
   - Install required tools (cardano-node, Aiken/Plutus, Node.js)
   - Get testnet ADA from [faucet](https://docs.cardano.org/cardano-testnets/tools/faucet/)

2. **Search existing work:**
   - Check [existing issues](https://github.com/yourusername/yourrepo/issues)
   - Review [open pull requests](https://github.com/yourusername/yourrepo/pulls)
   - Search CIPs at [cips.cardano.org](https://cips.cardano.org)

3. **Choose an issue:**
   - Look for `good-first-issue` or `help-wanted` labels
   - Comment to claim the issue
   - Ask questions if requirements are unclear

## Development Workflow

### 1. Fork and Clone

```bash
# Fork repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/REPO_NAME.git
```

### 2. Create Feature Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# Or: fix/bug-description
# Or: chore/update-docs
```

### 3. Make Changes

- Follow [code guidelines](.github/instructions/code-guidelines.instructions.md)
- Write tests for all new functionality
- Update documentation
- Commit frequently with clear messages

### 4. Test Locally

```bash
# For smart contracts
aiken check              # Aiken tests
cabal test               # Plutus tests

# For DApps
npm test                 # Unit tests
npm run test:integration # Integration tests

# Run linters
npm run lint
cabal format
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
# Open PR on GitHub with detailed description
```

## Smart Contract Contributions

### Plutus (Haskell) Validators

**Requirements:**
- [ ] Follow [Plutus Guidelines](instructions/plutus-guidelines.instructions.md)
- [ ] Use GHC 9.6.6 or 9.8.2
- [ ] Include comprehensive tests
- [ ] Add property-based tests (QuickCheck)
- [ ] Document all exported functions
- [ ] Run HLint and fix warnings

**Code Structure:**
```haskell
{-# LANGUAGE DataKinds         #-}
{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE TemplateHaskell   #-}

module MyValidator where

import PlutusLedgerApi.V3
import PlutusTx
import PlutusTx.Prelude

-- | Clear documentation for datum
newtype MyDatum = MyDatum { field :: Integer }
PlutusTx.unstableMakeIsData ''MyDatum

-- | Clear documentation for redeemer
newtype MyRedeemer = MyRedeemer { action :: Integer }
PlutusTx.unstableMakeIsData ''MyRedeemer

-- | Validator logic with traceIfFalse for debugging
{-# INLINABLE mkValidator #-}
mkValidator :: MyDatum -> MyRedeemer -> ScriptContext -> Bool
mkValidator datum redeemer ctx =
  traceIfFalse "Validation failed" (field datum == action redeemer)

-- | Compiled validator
validator :: Validator
validator = mkValidatorScript $$(compile [|| mkValidator ||])
```

### Aiken Validators

**Requirements:**
- [ ] Follow [Aiken Guidelines](instructions/aiken-guidelines.instructions.md)
- [ ] Use Aiken 1.1.19+
- [ ] Include unit and property tests
- [ ] Generate CIP-57 blueprint (`aiken build`)
- [ ] Document all public functions
- [ ] Use explicit type annotations

**Code Structure:**
```aiken
use aiken/transaction.{ScriptContext}

/// Clear documentation for datum
pub type Datum {
  field: Int,
}

/// Clear documentation for redeemer
pub type Redeemer {
  action: Int,
}

/// Validator with clear logic
validator my_validator {
  spend(datum: Datum, redeemer: Redeemer, _ref: Data, _ctx: ScriptContext) {
    datum.field == redeemer.action
  }
}

// Unit test
test my_validator_passes() {
  let datum = Datum { field: 42 }
  let redeemer = Redeemer { action: 42 }
  my_validator.spend(datum, redeemer, Void, mock_context())
}

// Property test
test my_validator_reflexive(n via int) {
  let datum = Datum { field: n }
  let redeemer = Redeemer { action: n }
  my_validator.spend(datum, redeemer, Void, mock_context())
}
```

### Deployment Requirements

Before merging smart contract PRs:

1. **Deploy to Preprod testnet**
   ```bash
   # Build and deploy
   aiken build
   # Or: cabal build && cabal run serialize

   # Deploy to preprod (see SMART_CONTRACT_GUIDE.md)
   ```

2. **Provide deployment evidence:**
   - Testnet transaction hash
   - Script address
   - Test transaction showing successful execution

3. **Security review:**
   - Run `#security-audit` prompt
   - Address all HIGH and CRITICAL findings
   - Document known limitations

## DApp Contributions

### Frontend (React/Next.js)

**Requirements:**
- [ ] Follow [Wallet Integration Guide](instructions/wallet-integration.instructions.md)
- [ ] Use TypeScript (strict mode)
- [ ] Implement CIP-30 wallet connection
- [ ] Handle all error cases gracefully
- [ ] Add loading states
- [ ] Test with multiple wallets (Nami, Eternl, Lace)

**Example: Wallet Connection**
```typescript
import { Lucid, Blockfrost } from "@lucid-evolution/lucid";
import { useState } from "react";

export function WalletConnect() {
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async (walletName: string) => {
    try {
      const api = await window.cardano[walletName].enable();
      const lucidInstance = await Lucid(
        new Blockfrost(
          process.env.NEXT_PUBLIC_BLOCKFROST_URL!,
          process.env.NEXT_PUBLIC_BLOCKFROST_KEY!
        ),
        "Preprod"
      );
      lucidInstance.selectWallet.fromAPI(api);
      setLucid(lucidInstance);
    } catch (err) {
      setError(`Failed to connect: ${err.message}`);
    }
  };

  return (
    <div>
      {!lucid ? (
        <>
          <button onClick={() => connect("nami")}>Connect Nami</button>
          <button onClick={() => connect("eternl")}>Connect Eternl</button>
        </>
      ) : (
        <p>Connected!</p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Transaction Building

**Requirements:**
- [ ] Use Lucid Evolution from [Anastasia-Labs](https://github.com/Anastasia-Labs/lucid-evolution)
- [ ] Handle all error cases
- [ ] Show transaction details to user before signing
- [ ] Wait for confirmation (1-3 blocks)
- [ ] Provide transaction hash and explorer link

## Testing Requirements

### Unit Tests

**Smart Contracts:**
```bash
# Aiken
aiken check --coverage  # Aim for 100%

# Plutus
cabal test             # All tests must pass
```

**DApps:**
```bash
npm test               # Jest/Vitest tests
npm run test:coverage  # Aim for 80%+
```

### Integration Tests

**Requirements:**
- [ ] Test on Preprod testnet
- [ ] Test full transaction lifecycle (lock → unlock)
- [ ] Test failure cases (wrong redeemer, insufficient funds)
- [ ] Test with multiple wallets

**Example:**
```typescript
// tests/integration/lock-unlock.test.ts
describe("Lock and Unlock Flow", () => {
  it("should lock and unlock funds successfully", async () => {
    // 1. Lock funds at script
    const txLock = await lucid
      .newTx()
      .pay.ToAddressWithData(scriptAddr, datum, { lovelace: 10_000_000n })
      .complete();
    const signedLock = await txLock.sign.withWallet().complete();
    const txHashLock = await signedLock.submit();
    await lucid.awaitTx(txHashLock);

    // 2. Unlock funds
    const utxos = await lucid.utxosAt(scriptAddr);
    const txUnlock = await lucid
      .newTx()
      .collectFrom(utxos, redeemer)
      .attach.SpendingValidator(validator)
      .complete();
    const signedUnlock = await txUnlock.sign.withWallet().complete();
    const txHashUnlock = await signedUnlock.submit();

    // 3. Verify success
    await lucid.awaitTx(txHashUnlock);
    const finalUtxos = await lucid.utxosAt(scriptAddr);
    expect(finalUtxos.length).toBe(0); // All funds unlocked
  });
});
```

### Security Tests

Run security audit before mainnet deployment:

```bash
# Use #security-audit prompt
# Check: double satisfaction, unbounded loops, overflow, etc.
```

See [Security Guidelines](instructions/smart-contract-security.instructions.md).

## Security Guidelines

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

1. Email security contact (see [SECURITY.md](../SECURITY.md))
2. Include:
   - Vulnerability description
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Secure Coding Practices

**Smart Contracts:**
- Validate all inputs with `traceIfFalse` (Plutus) or `expect` (Aiken)
- Check transaction boundaries (inputs, outputs, signers)
- Prevent double satisfaction attacks
- Use time locks when appropriate
- Test with adversarial inputs

**DApps:**
- Never expose private keys or mnemonics
- Validate all user inputs
- Use environment variables for secrets
- Implement rate limiting for API calls
- Test with malicious transaction attempts

## Pull Request Process

### Before Opening PR

- [ ] Run all tests (`aiken check` / `cabal test` / `npm test`)
- [ ] Run linters and formatters
- [ ] Update documentation
- [ ] Add entry to CHANGELOG.md (if applicable)
- [ ] Test on Preprod testnet (for smart contracts)
- [ ] Rebase on latest `main`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that changes existing functionality)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Tested on Preprod testnet (if applicable)

## Testnet Evidence (Smart Contracts Only)
- Script address: `addr_test1...`
- Lock transaction: `https://preprod.cardanoscan.io/transaction/abc123`
- Unlock transaction: `https://preprod.cardanoscan.io/transaction/def456`

## CIP Compliance
- [ ] Follows CIP-25 (NFT metadata)
- [ ] Follows CIP-30 (wallet connector)
- [ ] Follows CIP-57 (blueprint)
- [ ] N/A

## Security Checklist
- [ ] No double satisfaction vulnerabilities
- [ ] All inputs validated
- [ ] No unbounded loops
- [ ] No integer overflow/underflow
- [ ] Ran `#security-audit` prompt
- [ ] N/A (non-contract change)

## Screenshots (if applicable)
```

### Review Process

1. **Automated checks:**
   - CI pipeline runs (GHC, Aiken, Node.js tests)
   - Linters pass
   - Test coverage maintained

2. **Code review:**
   - 1+ approvals required
   - Security review for smart contracts
   - CIP compliance check

3. **Merge:**
   - Squash and merge (default)
   - Descriptive commit message
   - Delete feature branch

## CIP Compliance

### Implementing CIPs

When implementing a CIP:

1. **Read specification:** [cips.cardano.org](https://cips.cardano.org)
2. **Follow exactly:** Don't deviate from standard
3. **Test interoperability:** Verify works with other tools
4. **Document compliance:** List CIPs in README

### Common CIPs

- **CIP-25:** NFT metadata (use for all NFTs)
- **CIP-30:** Wallet connector (use for all DApps)
- **CIP-57:** Blueprint (auto-generated by Aiken)
- **CIP-68:** Datum metadata (use for dynamic metadata)

See [CIP_REFERENCE.md](../CIP_REFERENCE.md) for examples.

## Style Guide

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `test`: Adding/updating tests
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

**Examples:**
```
feat(validator): add time-locked vesting contract
fix(wallet): handle disconnect edge case
docs(setup): update Aiken installation steps
test(nft): add property-based minting tests
```

### Code Formatting

**Haskell/Plutus:**
```bash
# Use fourmolu or ormolu
fourmolu --mode inplace src/**/*.hs
```

**Aiken:**
```bash
# Use Aiken formatter
aiken fmt
```

**TypeScript:**
```bash
# Use Prettier
npm run format
```

## Questions?

- Open an issue with the `question` label
- Use `#cip-lookup` prompt for CIP questions
- See [CARDANO_SETUP.md](../CARDANO_SETUP.md) for environment setup
- See [SMART_CONTRACT_GUIDE.md](../SMART_CONTRACT_GUIDE.md) for development tutorials

Thank you for contributing to the Cardano ecosystem! 🚀
