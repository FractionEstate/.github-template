---
name: Smart Contract Bug
about: Report a bug in a Plutus or Aiken validator
title: "[Smart Contract] "
labels: bug, smart-contract
assignees: ''
---

## Smart Contract Details

**Validator Name:**
**Language:** [Plutus / Aiken]
**Network:** [Mainnet / Preprod / Preview / Local]

## Describe the Bug

A clear and concise description of the smart contract bug.

## Transaction Information

**Transaction Hash:**
**Validator Address:**
**Script Hash:**

## To Reproduce

Steps to reproduce the behavior:

1. Deploy validator with '...'
2. Submit transaction with datum '...'
3. Observe error '...'

**Datum Used:**
```json
{
  "constructor": 0,
  "fields": []
}
```

**Redeemer Used:**
```json
{
  "constructor": 0,
  "fields": []
}
```

## Expected Behavior

What you expected the validator to do.

## Actual Behavior

What the validator actually did (error message, unexpected validation, etc.).

## Error Messages

```
Paste full error message here (from cardano-cli, Lucid Evolution, wallet, etc.)
```

## Smart Contract Code

**Validator Code (if relevant):**
```haskell
-- Or Aiken code
```

**Off-chain Code (if relevant):**
```typescript
// Lucid Evolution or Mesh code
```

## Environment

- **cardano-node Version:** [e.g. 10.5.1]
- **Plutus Version:** [e.g. 1.54.0.0] (if using Plutus)
- **Aiken Version:** [e.g. 1.1.19] (if using Aiken)
- **Lucid Evolution Version:** [e.g. @lucid-evolution/lucid@0.3.x]
- **Mesh SDK Version:** [e.g. @meshsdk/core@1.8.0]

## Blueprint

**CIP-57 Blueprint (if available):**
```json
{
  "preamble": {
    "title": "...",
    "version": "1.0.0"
  }
}
```

## Security Considerations

- [ ] This bug could result in fund loss
- [ ] This bug affects mainnet deployments
- [ ] Security audit completed: [Yes/No]

## Additional Context

Any other information about the smart contract bug (testnet testing, property tests, etc.).

## Checklist

- [ ] I have checked the [CIP Reference](../CIP_REFERENCE.md) for relevant standards
- [ ] I have tested on testnet (Preprod/Preview)
- [ ] I have reviewed the [Smart Contract Security Guidelines](../.github/instructions/smart-contract-security.instructions.md)
- [ ] I have run `cabal test` (Plutus) or `aiken check` (Aiken)
