---
mode: agent
description: 'Analyze data structures including Cardano datum/redeemer patterns'
tools: ['search', 'edit', 'runCommands']
---

Examine the data layer to understand how information flows through the system:

1. **For Cardano smart contracts**:
   - Locate datum and redeemer type definitions
   - Check CIP-57 blueprint schemas
   - Verify Data encoding/decoding (Lucid Evolution `Data.to`/`Data.from`)
   - Document validation rules in validators
2. **For traditional backends**:
   - Locate schema definitions, migrations, or data models
   - Trace how data is queried, transformed, and persisted
   - Identify validation rules and constraints applied at each stage
3. **For NFT projects**:
   - Check CIP-25 metadata structures
   - Verify CIP-68 datum metadata (if applicable)
   - Validate image URLs (IPFS/HTTP)
4. Document relationships between entities or structures.
5. Note any caching, indexing, or performance optimizations in place.

**Cardano-specific data patterns**:
- **Datum**: On-chain data attached to UTxOs
- **Redeemer**: Input data for spending/minting/staking
- **Metadata**: Transaction metadata (label 721 for NFTs, 674 for messages)
- **CIP-57 schemas**: JSON Schema definitions for datum/redeemer types

Summarize findings in a way that helps onboard new contributors or plan schema changes.

```
