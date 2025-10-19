---
name: Wallet Integration Issue
about: Report a problem with CIP-30 wallet connectivity or functionality
title: "[Wallet] "
labels: wallet, cip-30
assignees: ''
---

## Wallet Information

**Wallet Name:** [Nami / Eternl / Lace / Yoroi / Flint / Typhon / Gero / NuFi / Other]
**Wallet Version:**
**Browser:** [Chrome / Firefox / Edge / Brave]
**Browser Version:**

## Network

**Connected Network:** [Mainnet / Preprod / Preview]
**Expected Network:** [Mainnet / Preprod / Preview]

## Describe the Issue

A clear and concise description of the wallet integration problem.

## Issue Type

- [ ] Wallet not detected
- [ ] Connection fails
- [ ] Transaction signing fails
- [ ] Wrong network
- [ ] Address not returned
- [ ] Balance not updated
- [ ] UTxOs not accessible
- [ ] Collateral issue
- [ ] Other (describe below)

## To Reproduce

Steps to reproduce the behavior:

1. Click 'Connect Wallet'
2. Select wallet '...'
3. Observe error '...'

**Connection Code:**
```typescript
// Your wallet connection code (Lucid Evolution, Mesh, or custom)
```

## Expected Behavior

What you expected the wallet integration to do.

## Actual Behavior

What actually happened (error message, popup not appearing, wrong data returned, etc.).

## Error Messages

**Console Errors:**
```javascript
// Paste browser console errors
```

**Wallet Error:**
```
// Any error message from the wallet popup
```

## CIP-30 API Check

**API Available:**
```javascript
console.log(window.cardano);
// Paste output
```

**Enabled Extensions:**
```javascript
console.log(Object.keys(window.cardano || {}));
// Paste output
```

**API Version:**
```javascript
// If wallet connected
console.log(await wallet.getApiVersion());
```

## Wallet State

**Connection Status:** [Disconnected / Connecting / Connected / Error]
**Address Retrieved:** [Yes / No]
**Network ID:** [0 for testnet, 1 for mainnet]

**Wallet Address:**
```
addr1... (if available)
```

**Change Address:**
```
addr1... (if available)
```

**UTxOs Count:**
**Balance:**

## Transaction Details (if signing issue)

**Transaction Type:** [Payment / Smart Contract / NFT Mint / Token Transfer]
**Transaction Size:** [bytes]
**Transaction Fee:** [Ada]

**Unsigned Transaction:**
```
Paste transaction CBOR or JSON
```

## DApp Integration

**Framework:** [Next.js / React / Vue / Svelte / Vanilla JS]
**Framework Version:**
**Lucid Evolution Version:** [e.g. @lucid-evolution/lucid@0.3.x]
**Mesh SDK Version:** [e.g. @meshsdk/core@1.8.0]

**Integration Code:**
```typescript
// Your wallet integration setup
```

## Environment

- **OS:** [Windows / macOS / Linux]
- **Screen Resolution:** [If UI issue]
- **Wallet Extension ID:** [From chrome://extensions]

## Network Validation

- [ ] Wallet is on the correct network (Mainnet/Testnet)
- [ ] DApp is configured for the same network
- [ ] Network magic matches: [Mainnet: 764824073, Preprod: 1, Preview: 2]

## Permissions

**Requested Permissions:**
- [ ] Read wallet address
- [ ] Read network
- [ ] Read UTxOs
- [ ] Sign transactions
- [ ] Sign data
- [ ] Submit transactions

**Granted Permissions:**
- [ ] [List permissions that were granted]

## Screenshots

If applicable, add screenshots of:
- Wallet popup
- Browser console
- DApp UI
- Network indicator

## Additional Context

Any other information about the wallet integration issue.

## Checklist

- [ ] I have checked the [Wallet Integration Guidelines](../.github/instructions/wallet-integration.instructions.md)
- [ ] I have verified CIP-30 API is available
- [ ] I have tested with multiple wallets (if possible)
- [ ] I have checked wallet extension is up to date
- [ ] I have reviewed browser console for errors
- [ ] I have confirmed wallet has test funds (if testnet)
