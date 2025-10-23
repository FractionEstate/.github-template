---
mode: agent
description: 'Generate a reusable component for Cardano DApps'
tools: ['edit', 'search', 'new']
---
# Component Generator

Create a new component that fits seamlessly into the existing Cardano DApp
codebase:

1. Identify similar components by searching for comparable functionality.
2. Copy the structure, naming conventions, and file organization from
   established patterns.
3. For Cardano-specific components:
   - **Wallet components**: Use the CIP-30 standard (see
     `.github/instructions/wallet-integration.instructions.md`).
   - **Transaction components**: Use Lucid Evolution from Anastasia Labs.
   - **NFT display**: Follow the CIP-25 metadata standard.
   - **Address display**: Use proper Bech32 formatting.
4. Implement the required behavior with tests that mirror existing test
   styles.
5. Document props, parameters, or configuration options clearly.
6. Add the component to relevant indexes, exports, or registries if
   applicable.

Avoid reinventing patterns—reuse what already exists unless there is a
compelling reason to diverge.

**Common Cardano component patterns**:
- `<WalletConnect />`: Wallet connection UI.
- `<AddressDisplay address={string} />`: Formatted address with copy button.
- `<TransactionButton />`: Button that builds and signs transactions.
- `<NFTCard metadata={CIP25} />`: NFT display with CIP-25 metadata.
- `<AssetAmount asset={string} amount={bigint} />`: Token amount display.
