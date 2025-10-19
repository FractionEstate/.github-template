---
description: Steps for preparing and publishing Cardano smart contracts and DApps
applyTo: ".github/workflows/release/**"
---

# Cardano Release Process

This document outlines the release process for Cardano projects including smart
contract deployment, DApp publishing, and mainnet launches.

## Overview

Cardano releases involve multiple components:

- **Smart contracts**: Plutus/Aiken validators deployed on-chain
- **Frontend DApps**: Next.js/React applications
- **CLI tools**: TypeScript/Haskell command-line utilities
- **Documentation**: CIP-57 blueprints, API docs, user guides

## Pre-release checklist

### For smart contracts (Plutus/Aiken)

**MANDATORY before mainnet deployment**:

- [ ] ✅ Security audit completed (see `.github/instructions/smart-contract-security.instructions.md`)
- [ ] ✅ 100% test coverage on validators
- [ ] ✅ Property-based tests for all numeric operations
- [ ] ✅ Testnet validation (minimum 2 weeks on Preprod)
- [ ] ✅ CIP-57 blueprint generated and validated
- [ ] ✅ Code review by minimum 2 senior developers
- [ ] ✅ Formal verification (if available)
- [ ] ✅ Gas optimization completed
- [ ] ✅ Documentation complete (validator logic, parameters, usage)
- [ ] ✅ Emergency response plan documented

**Recommended**:
- [ ] Bug bounty program launched
- [ ] Gradual rollout plan (start with limited TVL)
- [ ] Monitoring and alerting configured
- [ ] Incident response team identified

### For DApps (Frontend)

- [ ] End-to-end tests passing
- [ ] Wallet integration tested (Nami, Eternl, Lace, Yoroi)
- [ ] Network switching tested (mainnet/testnet)
- [ ] Error handling for all user flows
- [ ] Performance optimized (Lighthouse score > 90)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] SEO metadata configured
- [ ] Analytics configured
- [ ] CHANGELOG.md updated

### For all releases

- [ ] Version bumped in package.json/cabal file/aiken.toml
- [ ] Git tags created
- [ ] Release notes written
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)

## Smart contract deployment

### Step 1: Generate deployment artifacts

**Plutus**:

```bash
cabal build
cabal run validator-script -- \
  --out validators/my-validator.plutus \
  --params "param1,param2"
```

**Aiken**:

```bash
aiken build
# Generates:
# - plutus.json (compiled validators)
# - plutus-blueprint.json (CIP-57 blueprint)
```

### Step 2: Validate blueprint (CIP-57)

```bash
# Aiken auto-generates, Plutus needs manual creation
cat plutus-blueprint.json | jq .
```

**Blueprint structure**:

```json
{
  "preamble": {
    "title": "My Validator",
    "version": "1.0.0",
    "plutusVersion": "v2"
  },
  "validators": [
    {
      "title": "Lock Validator",
      "datum": { "schema": { "$ref": "#/definitions/MyDatum" } },
      "redeemer": { "schema": { "$ref": "#/definitions/MyRedeemer" } }
    }
  ]
}
```

### Step 3: Deploy to testnet (REQUIRED)

**Using Lucid Evolution**:

```typescript
import { Lucid, Blockfrost } from '@lucid-evolution/lucid';
import validatorBlueprint from './plutus-blueprint.json';

const lucid = await Lucid(
  new Blockfrost(
    'https://cardano-preprod.blockfrost.io/api/v0',
    process.env.BLOCKFROST_PREPROD_KEY!
  ),
  'Preprod'
);

lucid.selectWallet.fromSeed(deployerSeed);

// Reference script deployment
const tx = await lucid
  .newTx()
  .payToAddressWithData(
    referenceAddress,
    { scriptRef: validatorBlueprint.validators[0].compiledCode },
    {}
  )
  .complete();

const signed = await tx.sign().complete();
const txHash = await signed.submit();

console.log(`Reference script: ${txHash}`);
```

**Store deployment info**:

```json
{
  "network": "preprod",
  "deployedAt": "2024-01-15T10:30:00Z",
  "txHash": "abc123...",
  "validatorAddress": "addr_test1...",
  "referenceScriptUtxo": "abc123#0",
  "policyId": "def456...",
  "deployer": "addr_test1..."
}
```

### Step 4: Testnet validation period

**Minimum 2 weeks on Preprod**:

- Monitor all transactions
- Test with real users (beta program)
- Collect metrics (success rate, gas usage, error types)
- Run stress tests
- Verify edge cases

**Create testnet report**:

```markdown
## Testnet Validation Report

**Period**: 2024-01-15 to 2024-01-30 (15 days)
**Network**: Preprod
**Transactions**: 1,247

### Metrics
- Success rate: 99.8%
- Average gas: 1.2M
- Max gas: 2.1M
- Errors: 3 (all user input validation)

### Issues Found
1. Edge case with zero amount (fixed in commit abc123)
2. Time range validation too strict (relaxed in commit def456)

### Conclusion
✅ Ready for mainnet deployment

```

### Step 5: Mainnet deployment

#### ⚠️ CRITICAL: This is irreversible

```typescript
const lucid = await Lucid(
  new Blockfrost(
    'https://cardano-mainnet.blockfrost.io/api/v0',
    process.env.BLOCKFROST_MAINNET_KEY!
  ),
  'Mainnet'
);

// Deploy reference script
const tx = await lucid
  .newTx()
  .payToAddressWithData(
    mainnetReferenceAddress,
    { scriptRef: validatorCompiledCode },
    {}
  )
  .complete();

const signed = await tx.sign().complete();
const txHash = await signed.submit();

console.log(`🚀 MAINNET deployment: ${txHash}`);
console.log(`🔍 Explorer: https://cardanoscan.io/transaction/${txHash}`);
```

**Announcement template**:
```markdown
## 🚀 Mainnet Launch: My Validator v1.0.0

We're excited to announce the mainnet deployment of My Validator!

**Deployment Details**:
- Tx Hash: `abc123...`
- Validator Address: `addr1...`
- Reference Script: `abc123#0`
- Policy ID: `def456...`

**Security**:
- ✅ Audited by [Audit Firm]
- ✅ 2 weeks testnet validation
- ✅ 100% test coverage
- ✅ Bug bounty program active

**Documentation**:
- Blueprint: https://github.com/org/repo/blob/main/plutus-blueprint.json
- User Guide: https://docs.example.com
- API Reference: https://api.example.com

**Gradual Rollout**:

- Week 1: Max TVL 100K ADA
- Week 2: Max TVL 500K ADA
- Week 3+: Unlimited

Please report issues: security@example.com
```

### Step 6: Post-deployment monitoring

**Set up alerts**:

```typescript
// Monitor with Blockfrost webhooks
{
  "type": "transaction",
  "webhook_url": "https://api.example.com/webhook/tx",
  "condition_asset": policyId
}
```

**Metrics to track**:

- Transaction success rate
- Gas usage trends
- Error types and frequency
- Total value locked (TVL)
- Number of unique users

**Emergency response plan**:

1. **Critical bug detected** → Pause frontend, announce via Twitter/Discord,
  prepare migration
1. **Exploit attempt** → Contact auditors, analyze attack vector, notify
  community
1. **Network congestion** → Increase gas fees in frontend, batch transactions
1. **Blueprint mismatch** → Verify deployment, update documentation

## DApp releases

### Step 1: Build production bundle

```bash
# Next.js
npm run build
npm run export  # Static export if needed

# Vite
npm run build
```

### Step 2: Environment configuration

```env
# .env.production
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_BLOCKFROST_KEY=mainnet...
NEXT_PUBLIC_VALIDATOR_ADDRESS=addr1...
NEXT_PUBLIC_POLICY_ID=abc123...
```

### Step 3: Deploy to hosting

**Vercel** (recommended for Next.js):
```bash
vercel --prod
```

**Netlify**:
```bash
netlify deploy --prod
```

**IPFS** (decentralized):
```bash
npm run build
npx ipfs-car pack out/ --output dapp.car
# Upload to Pinata/Infura
```

### Step 4: Verify deployment

- [ ] Homepage loads
- [ ] Wallet connection works (test 3+ wallets)
- [ ] Transactions submit successfully
- [ ] Error handling displays correctly
- [ ] Network is set to mainnet
- [ ] Analytics recording events

## Versioning strategy

Follow **Semantic Versioning** (semver):

**Smart contracts**:
- `MAJOR`: Breaking changes to validator logic or datum/redeemer structure
- `MINOR`: New features (new validators, new endpoints)
- `PATCH`: Bug fixes, gas optimizations

**DApps**:
- `MAJOR`: Breaking UI changes, new wallet requirements
- `MINOR`: New features, new pages
- `PATCH`: Bug fixes, performance improvements

**Examples**:
- `1.0.0` → `2.0.0`: Changed datum structure (BREAKING)
- `1.0.0` → `1.1.0`: Added new unlock condition (FEATURE)
- `1.0.0` → `1.0.1`: Fixed gas optimization (PATCH)

## Release notes template

```markdown
# [Project Name] v1.2.0

## 🎉 Highlights

- Added support for multi-sig validators
- Improved gas efficiency by 15%
- New wallet integration: Lace

## 🚀 New Features

- **Multi-sig validator** (#123): Allows M-of-N signing
- **Batch transactions** (#145): Process multiple UTxOs in one tx

## 🐛 Bug Fixes

- Fixed datum validation edge case (#167)
- Resolved time range calculation issue (#178)

## 📝 Documentation

- Added multi-sig tutorial
- Updated API reference

## 🔐 Security

- No security issues in this release
- Audit report: https://example.com/audit-v1.2.0.pdf

## 📦 Deployment

**Mainnet**:
- Validator: `addr1...`
- Tx Hash: `abc123...`

**Breaking Changes**: None

## 🙏 Contributors

Thanks to @alice, @bob, and @charlie!
```

## Rollback procedure

**If critical bug found after mainnet deployment**:

1. **Pause frontend immediately**:

```typescript
// Add to frontend
if (EMERGENCY_PAUSE) {
  return <EmergencyMessage />;
}
```

1. **Announce via all channels**:

- Twitter/X
- Discord/Telegram
- Status page
- Email to users

1. **Assess damage**:

- Check all transactions since deployment
- Identify affected users
- Calculate potential losses

1. **Prepare migration**:

- Deploy fixed validator (new address)
- Create migration script
- Test migration on testnet
- Provide user instructions

1. **Execute migration**:

```typescript
// Migration script
const oldUtxos = await lucid.utxosAt(oldValidatorAddress);

for (const utxo of oldUtxos) {
  const tx = await lucid
    .newTx()
    .collectFrom([utxo], oldRedeemer)
    .payToContract(newValidatorAddress, newDatum, utxo.assets)
    .complete();

  await tx.sign().complete().submit();
}
```

1. **Post-mortem**:

- Document what went wrong
- Update tests to catch issue
- Improve audit process
- Compensate affected users (if applicable)

## Continuous deployment (testnet only)

#### ⚠️ NEVER auto-deploy to mainnet

```yaml
# .github/workflows/testnet-deploy.yml
name: Deploy to Preprod

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Aiken validator
        run: |
          curl -sSfL https://install.aiken-lang.org | bash
          aiken build

      - name: Deploy to preprod
        env:
          BLOCKFROST_PREPROD_KEY: ${{ secrets.BLOCKFROST_PREPROD_KEY }}
          DEPLOYER_SEED: ${{ secrets.DEPLOYER_SEED }}
        run: |
          npm run deploy:preprod
```

## Resources

- [Semantic Versioning](https://semver.org/)
- [CIP-57 Blueprints](https://cips.cardano.org/cip/CIP-0057)
- [Cardano Smart Contract Audit Guide](https://docs.cardano.org/plutus/audit/)
- [Lucid Evolution Deployment](https://github.com/Anastasia-Labs/lucid-evolution)

## Learnings

- **Never skip testnet validation** - saved us from 3 critical bugs (x12)
- **Gradual rollout reduces risk** - caught issues before full TVL exposed (x8)
- **CIP-57 blueprints are essential** - standardize integration for all
  consumers (x6)
- **Post-deployment monitoring is critical** - detected exploit attempts early
  (x5)
- **Emergency pause button is mandatory** - used twice in production (x4)
- **Mainnet deployment is permanent** - triple-check everything (x15)

```
