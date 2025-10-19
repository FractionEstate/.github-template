---
description: CIP compliance for Cardano standards
applyTo: "src/**/*.{ts,tsx,js,jsx,hs,ak}"
---

# CIP Compliance

This document provides guidelines for implementing Cardano Improvement
Proposals (CIPs) in your project.

## Core CIPs for dApp development

### CIP-25: NFT Metadata Standard

**Purpose**: Standardized metadata structure for NFTs

**Implementation** (Lucid Evolution):

```typescript
import { Lucid, Data } from "@lucid-evolution/lucid";

// CIP-25 metadata structure
const metadata = {
  "721": {
    [policyId]: {
        [assetName]: {
          name: "My NFT 001",
        image: "ipfs://QmXxxx...",
        mediaType: "image/png",
        description: "A unique NFT collection",
          files: [{
            name: "My NFT 001",
          mediaType: "image/png",
          src: "ipfs://QmXxxx..."
        }],
        // Optional fields
        attributes: {
          rarity: "Rare",
          power: "100"
        },
        version: "1.0"
      }
    }
  }
};

// Mint NFT with CIP-25 metadata
const tx = await lucid
  .newTx()
  .mintAssets({
    [policyId + assetName]: 1n
  })
  .attachMetadata(721, metadata["721"])
  .attachMintingPolicy(mintingPolicy)
  .complete();
```

**Validation**:

```typescript
function validateCIP25Metadata(metadata: any): boolean {
  const nft = metadata["721"]?.[policyId]?.[assetName];

  return (
    typeof nft?.name === 'string' &&
    typeof nft?.image === 'string' &&
    (nft?.mediaType === undefined || typeof nft.mediaType === 'string') &&
    nft?.image.startsWith('ipfs://') || nft?.image.startsWith('https://')
  );
}
```

### CIP-30: dApp-Wallet Web Bridge

**Purpose**: Standard API for browser wallet connections

**Implementation**:

```typescript
// Check wallet availability
if (window.cardano?.nami) {
  // Enable wallet
  const api = await window.cardano.nami.enable();

  // CIP-30 methods
  const networkId = await api.getNetworkId();
  const changeAddress = await api.getChangeAddress();
  const utxos = await api.getUtxos();
  const collateral = await api.getCollateral();

  // Sign transaction
  const signedTx = await api.signTx(txCbor, partialSign);

  // Submit transaction
  const txHash = await api.submitTx(signedTx);
}
```

See `wallet-integration.instructions.md` for detailed CIP-30 implementation.

### CIP-57: Plutus Smart-Contract Blueprint

**Purpose**: Machine-readable smart contract specifications

**Plutus Blueprint Generation**:

```typescript
// Include in cabal.project
// Blueprint generation happens automatically with compilation

// Example blueprint structure (auto-generated):
const REF_PREFIX = String.fromCharCode(35) + "/definitions/";

const blueprint = {
  preamble: {
    title: "My Validator",
    description: "A simple validator contract",
    version: "1.0.0",
  },
  validators: [
    {
      title: "My Validator",
      datum: {
        title: "MyDatum",
        schema: { $ref: REF_PREFIX + "MyDatum" },
      },
      redeemer: {
        title: "MyRedeemer",
        schema: { $ref: REF_PREFIX + "MyRedeemer" },
      },
    },
  ],
  definitions: { /* Type definitions */ },
};
```

**Aiken Blueprint** (Automatic):

```bash
# Build project generates plutus.json automatically
aiken build

# Blueprint at plutus.json
{
  "preamble": {
    "title": "my-project",
    "version": "0.0.1",
    "plutusVersion": "v3"
  },
  "validators": [...],
  "definitions": {...}
}
```

**Using Blueprint with Lucid Evolution**:

```typescript
import blueprint from "./plutus.json";

// Load validator from blueprint
const validator = {
  type: "PlutusV3",
  script: blueprint.validators[0].compiledCode
};

const validatorAddress = lucid.utils.validatorToAddress(validator);

// Use blueprint for datum/redeemer construction
const DatumSchema = Data.Object({
  owner: Data.Bytes(),
  amount: Data.Integer()
});

const datum = Data.to({ owner: "abc123", amount: 100n }, DatumSchema);
```

### CIP-68: Datum Metadata Standard

**Purpose**: On-chain metadata with reference token pattern

**Implementation**:

```typescript
// Reference token (333) + User token (444)
const refTokenName = "000de140" + "MyNFT"; // (100) prefix
const userTokenName = "000643b0" + "MyNFT"; // (222) prefix

// Reference NFT with datum metadata
const metadata = {
  name: "My NFT",
  image: "ipfs://...",
  attributes: [...]
};

const tx = await lucid
  .newTx()
  // Mint reference token (stays in contract)
  .mintAssets({
    [policyId + refTokenName]: 1n
  })
  .payToContract(
    scriptAddress,
    { inline: Data.to(metadata, MetadataSchema) },
    { [policyId + refTokenName]: 1n }
  )
  // Mint user token (sent to user)
  .mintAssets({
    [policyId + userTokenName]: 1n
  })
  .attachMintingPolicy(policy)
  .complete();
```

### CIP-1694: On-Chain Governance

**Purpose**: Decentralized governance for Cardano

**Voting Transactions**:

```typescript
// Create governance action
const tx = await lucid
  .newTx()
  .registerStake(rewardAddress)
  .delegateVote(
    rewardAddress,
    { dRepId: "drep1..." }
  )
  .complete();

// Vote on proposal
const voteTx = await lucid
  .newTx()
  .voteGovernance({
    governanceActionId: actionId,
    voter: { dRepId: myDRepId },
    vote: "Yes", // or "No", "Abstain"
    anchor: {
      url: "https://...",
      dataHash: "hash..."
    }
  })
  .complete();
```

## Additional Important CIPs

### CIP-5: Common Bech32 Prefixes

**Address prefixes**:

- `addr` - Mainnet payment address
- `addr_test` - Testnet payment address
- `stake` - Mainnet stake address
- `stake_test` - Testnet stake address
- `pool` - Pool ID
- `drep` - DRep ID (governance)
- `cc_hot` - Constitutional Committee hot key
- `cc_cold` - Constitutional Committee cold key

**Validation**:

```typescript
function validateAddress(
  address: string,
  network: "mainnet" | "testnet"
): boolean {
  const expectedPrefix = network === "mainnet" ? "addr" : "addr_test";
  return address.startsWith(expectedPrefix);
}
```

### CIP-8: Message Signing

**Sign message with wallet**:

```typescript
// CIP-8 message signing
const payload = {
  address: userAddress,
  payload: "Please sign this message"
};

const signature = await api.signData(
  userAddress,
  Buffer.from(payload.payload).toString('hex')
);

// Verify signature
const isValid = await lucid.verifyMessage(
  userAddress,
  payload.payload,
  signature
);
```

### CIP-14: User-Facing Asset Fingerprint

**Generate asset fingerprint**:

```typescript
import { Lucid } from "@lucid-evolution/lucid";

// Create fingerprint from policy ID and asset name
const policyId = "e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed72";
const assetName = "4d494c4b"; // "MILK" in hex

const fingerprint = lucid.utils.fingerprint(policyId, assetName);
// Returns: asset1cvmyrfrc7lpht2hcjwr9l2fpdqgj5xj34c3d9q
```

## CIP compliance checklist

### For NFT Projects (CIP-25)

- [ ] Metadata follows CIP-25 structure
- [ ] Required fields present: `name`, `image`
- [ ] IPFS or HTTPS URLs used for `image`
- [ ] Optional `mediaType` specified correctly
- [ ] `files` array included if multiple assets
- [ ] `version` field included

### For DApp Projects (CIP-30)

- [ ] Supports multiple wallets
- [ ] Handles wallet connection errors gracefully
- [ ] Validates network ID before signing
- [ ] Checks for collateral before script transactions
- [ ] Implements timeout for wallet operations

### For Smart Contracts (CIP-57)

- [ ] Blueprint generated (`plutus.json`)
- [ ] All validators documented in blueprint
- [ ] Datum and redeemer schemas included
- [ ] Blueprint published alongside contract
- [ ] Off-chain code uses blueprint types

### For Token Projects (CIP-68)

- [ ] Reference token minted with metadata
- [ ] User token minted separately
- [ ] Correct prefix labels used (333/444)
- [ ] Metadata stored on-chain in datum
- [ ] Reference token locked in contract

## Testing CIP compliance

```typescript
import { describe, it, expect } from 'vitest';

describe('CIP-25 Compliance', () => {
  it('should have valid NFT metadata structure', () => {
    const metadata = buildNFTMetadata();
    expect(validateCIP25Metadata(metadata)).toBe(true);
  });

  it('should have IPFS or HTTPS image URL', () => {
    const metadata = buildNFTMetadata();
    const image = metadata["721"][policyId][assetName].image;
    expect(
      image.startsWith('ipfs://') || image.startsWith('https://')
    ).toBe(true);
  });
});

describe('CIP-30 Integration', () => {
  it('should handle wallet not available', async () => {
    delete window.cardano;
    await expect(connectWallet('nami')).rejects.toThrow();
  });

  it('should validate network ID', async () => {
    const api = await mockWallet.enable();
    const networkId = await api.getNetworkId();
    expect([0, 1]).toContain(networkId);
  });
});

describe('CIP-57 Blueprint', () => {
  it('should have valid blueprint structure', () => {
    const blueprint = require('./plutus.json');
    expect(blueprint.preamble).toBeDefined();
    expect(blueprint.validators).toBeInstanceOf(Array);
    expect(blueprint.definitions).toBeDefined();
  });
});
## Resources

<!-- markdownlint-disable MD013 -->
- Cardano CIPs Repository: <https://github.com/cardano-foundation/CIPs>
- CIPs Website: <https://cips.cardano.org/>
- CIP-25 NFT Metadata: <https://cips.cardano.org/cips/cip25/>
- CIP-30 Wallet Bridge: <https://cips.cardano.org/cips/cip30/>
- CIP-57 Plutus Blueprints: <https://cips.cardano.org/cips/cip57/>
- CIP-68 Datum Metadata: <https://cips.cardano.org/cips/cip68/>
- CIP-1694 Governance: <https://cips.cardano.org/cips/cip1694/>
<!-- markdownlint-enable MD013 -->

## Learnings

- **CIP-25 is mandatory for NFT marketplaces** - follow it exactly (x7)
- **CIP-57 blueprints eliminate integration errors** - always generate them (x4)
- **CIP-30 collateral requirement surprises users** - check and guide (x5)
- **CIP-68 reduces on-chain metadata duplication** - use for large collections (x2)
