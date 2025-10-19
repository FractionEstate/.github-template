---
name: Transaction Issue
about: Report a problem with transaction building or submission
title: "[TX] "
labels: transaction, bug
assignees: ''
---

## Transaction Details

**Transaction Hash:** [If submitted]
**Network:** [Mainnet / Preprod / Preview / Local]
**Transaction Type:** [Payment / Smart Contract Interaction / NFT Minting / Token Transfer / Multi-sig]

## Describe the Issue

A clear and concise description of the transaction problem.

## Transaction Builder

**Library Used:** [Lucid Evolution / Mesh SDK / cardano-cli / Other]
**Library Version:**

## To Reproduce

Steps to reproduce the transaction issue:

1. Build transaction with '...'
2. Sign with '...'
3. Submit and observe '...'

**Transaction Building Code:**
```typescript
// Lucid Evolution, Mesh, or cardano-cli commands
```

## Expected Behavior

What you expected the transaction to do.

## Actual Behavior

What actually happened (error message, failed validation, unexpected fees, etc.).

## Error Messages

```
Paste full error message here
```

## Transaction JSON

**Transaction CBOR (if available):**
```
Paste transaction CBOR hex here
```

**Unsigned Transaction:**
```json
{
  "type": "Tx ConwayEra",
  "description": "...",
  "cborHex": "..."
}
```

## UTxOs Used

**Input UTxOs:**
| TxHash | Index | Ada | Assets |
|--------|-------|-----|--------|
| ...    | 0     | 10  | 1 NFT  |

**Output UTxOs:**
| Address | Ada | Assets |
|---------|-----|--------|
| addr... | 5   | 1 NFT  |

## Fees and Collateral

**Transaction Fee:**
**Collateral:** [If script transaction]
**Min ADA Requirement:** [If applicable]

## Smart Contract Interaction

**Validator Address:** [If interacting with script]
**Datum Hash:**
**Redeemer:**

## Wallet Information

**Wallet Used:** [Nami / Eternl / Lace / Yoroi / Flint / Typhon / Other]
**Wallet Version:**
**CIP-30 API Version:**

## Environment

- **Browser:** [If web wallet]
- **Node.js Version:** [If backend]
- **cardano-node Version:** [If using CLI]
- **Network Magic:** [If testnet: 1 for Preprod, 2 for Preview]

## Provider Information

**Provider:** [Blockfrost / Koios / Maestro / Kupmios / Local Node]
**Provider Status:** [Operational / Degraded / Down]

## Additional Context

Any other information about the transaction issue (network congestion, mempool status, etc.).

## Checklist

- [ ] I have sufficient funds for transaction + fees
- [ ] I have checked the transaction on a block explorer
- [ ] I have verified UTxO availability
- [ ] I have confirmed wallet is on the correct network
- [ ] I have reviewed the [Wallet Integration Guidelines](../.github/instructions/wallet-integration.instructions.md)
