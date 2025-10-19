# Cardano Improvement Proposal (CIP) Quick Reference

Fast lookup guide for commonly used CIPs in Cardano development. For complete specifications, see [cips.cardano.org](https://cips.cardano.org).

## Table of Contents

- [Overview](#overview)
- [Token Standards](#token-standards)
  - [CIP-25: NFT Metadata](#cip-25-nft-metadata)
  - [CIP-26: Fungible Token Metadata](#cip-26-fungible-token-metadata)
  - [CIP-27: Royalty Standard](#cip-27-royalty-standard)
  - [CIP-68: Datum Metadata](#cip-68-datum-metadata)
- [Wallet & DApp](#wallet--dapp)
  - [CIP-30: Wallet Connector](#cip-30-wallet-connector)
  - [CIP-95: Web-Wallet Bridge](#cip-95-web-wallet-bridge)
- [Smart Contracts](#smart-contracts)
  - [CIP-57: Blueprint](#cip-57-blueprint)
  - [CIP-112: Observation](#cip-112-observation)
- [Governance](#governance)
  - [CIP-1694: Voltaire Governance](#cip-1694-voltaire-governance)
- [Miscellaneous](#miscellaneous)
  - [CIP-19: Cardano Addresses](#cip-19-cardano-addresses)
  - [CIP-8: Message Signing](#cip-8-message-signing)
  - [CIP-67: Asset Name Labels](#cip-67-asset-name-labels)

## Overview

**CIPs (Cardano Improvement Proposals)** are standards that define protocols, processes, and conventions for the Cardano ecosystem. They ensure interoperability between wallets, DApps, and tools.

**Categories:**
- **Standards Track:** Technical standards (wallets, tokens, smart contracts)
- **Process:** Development processes and guidelines
- **Informational:** Design issues, best practices

**Status:**
- **Proposed:** Under review
- **Active:** Accepted and implemented
- **Draft:** Work in progress

## Token Standards

### CIP-25: NFT Metadata

**Status:** Active
**Category:** Standards Track
**Purpose:** Standard metadata format for NFTs

#### Key Fields

```json
{
  "721": {
    "<policy_id>": {
      "<asset_name>": {
        "name": "NFT Name",
        "image": "ipfs://Qm...",
        "mediaType": "image/png",
        "description": "NFT description",
        "files": [
          {
            "name": "High-res version",
            "mediaType": "image/png",
            "src": "ipfs://Qm..."
          }
        ],
        "attributes": {
          "Rarity": "Legendary",
          "Edition": "1/100"
        }
      }
    }
  }
}
```

#### Mint NFT Example (Lucid Evolution)

```typescript
import { Lucid, fromText } from "@lucid-evolution/lucid";

const policyId = "your_policy_id";
const assetName = fromText("MyNFT001");
const metadata = {
  721: {
    [policyId]: {
      [assetName]: {
        name: "My First NFT",
        image: "ipfs://QmHash123",
        mediaType: "image/png",
        description: "A beautiful NFT",
        attributes: {
          Rarity: "Common",
          Edition: "1/1000",
        },
      },
    },
  },
};

const tx = await lucid
  .newTx()
  .mintAssets({ [policyId + assetName]: 1n })
  .attach.MintingPolicy(policy)
  .attachMetadata(721, metadata[721])
  .complete();
```

#### Required vs Optional Fields

**Required:**
- `name`: Display name (max 64 chars)
- `image`: URI to image (IPFS, HTTPS, etc.)

**Optional:**
- `mediaType`: MIME type (e.g., `image/png`)
- `description`: Text description
- `files`: Array of additional files
- Custom attributes (any key-value pairs)

#### Best Practices

- Use IPFS for permanent storage
- Provide multiple resolutions in `files`
- Keep `name` short and descriptive
- Avoid PII in metadata (immutable)

**Full Spec:** [CIP-25](https://cips.cardano.org/cip/CIP-0025)

---

### CIP-26: Fungible Token Metadata

**Status:** Active
**Category:** Standards Track
**Purpose:** Metadata for fungible tokens (FTs)

#### Metadata Structure

```json
{
  "20": {
    "version": 1,
    "subjects": [
      "<policy_id><asset_name>"
    ],
    "decimals": 6,
    "name": "MyToken",
    "ticker": "MYTK",
    "description": "My fungible token",
    "url": "https://mytoken.io",
    "logo": "iVBORw0KGgoAAAANS..." // base64 PNG
  }
}
```

#### Mint FT Example

```typescript
const metadata = {
  20: {
    version: 1,
    subjects: [policyId + fromText("MyToken")],
    decimals: 6,
    name: "MyToken",
    ticker: "MYTK",
    description: "A fungible token",
    url: "https://mytoken.io",
    logo: logoBase64,
  },
};

const tx = await lucid
  .newTx()
  .mintAssets({ [policyId + fromText("MyToken")]: 1_000_000n })
  .attach.MintingPolicy(policy)
  .attachMetadata(20, metadata[20])
  .complete();
```

**Full Spec:** [CIP-26](https://cips.cardano.org/cip/CIP-0026)

---

### CIP-27: Royalty Standard

**Status:** Draft
**Category:** Standards Track
**Purpose:** On-chain royalty payments for NFTs

#### Royalty Metadata

```json
{
  "777": {
    "<policy_id>": {
      "rate": "0.05",  // 5% royalty
      "address": "addr1..."  // Payment address
    }
  }
}
```

#### Implementation

```typescript
const royaltyMetadata = {
  777: {
    [policyId]: {
      rate: "0.05",  // 5%
      address: creatorAddress,
    },
  },
};

// When minting
const tx = await lucid
  .newTx()
  .mintAssets({ [unit]: 1n })
  .attachMetadata(721, nftMetadata[721])
  .attachMetadata(777, royaltyMetadata[777])
  .complete();
```

**Note:** Marketplace support required for enforcement.

**Full Spec:** [CIP-27](https://cips.cardano.org/cip/CIP-0027)

---

### CIP-68: Datum Metadata

**Status:** Active
**Category:** Standards Track
**Purpose:** Store metadata in UTXOs (datum) instead of transaction metadata

#### Benefits

- More flexible metadata (not limited to 16KB)
- Metadata can be updated
- Reduces transaction metadata bloat

#### Asset Name Labels

```
Label | Type
------|------
000   | Reference NFT (immutable metadata)
001   | NFT (mutable metadata)
222   | FT (fungible token)
333   | RFT (refundable token)
444   | Rich FT (FT with metadata)
```

#### Example: NFT with Datum Metadata

```typescript
import { Data } from "@lucid-evolution/lucid";

// Metadata schema
const MetadataSchema = Data.Object({
  name: Data.String(),
  image: Data.String(),
  attributes: Data.Map(Data.String(), Data.String()),
});

// Create metadata
const metadata = {
  name: "My NFT",
  image: "ipfs://QmHash",
  attributes: new Map([
    ["Rarity", "Legendary"],
    ["Edition", "1/100"],
  ]),
};

// Mint reference NFT (label 000) and user NFT (label 001)
const referenceAssetName = "000643b0" + fromText("MyNFT001");  // 000 prefix
const userAssetName = "001643b0" + fromText("MyNFT001");  // 001 prefix

const tx = await lucid
  .newTx()
  // Mint reference NFT (metadata holder)
  .mintAssets({ [policyId + referenceAssetName]: 1n })
  .pay.ToAddressWithData(
    scriptAddress,
    { kind: "inline", value: Data.to(metadata, MetadataSchema) },
    { [policyId + referenceAssetName]: 1n }
  )
  // Mint user NFT (points to reference)
  .mintAssets({ [policyId + userAssetName]: 1n })
  .complete();
```

**Full Spec:** [CIP-68](https://cips.cardano.org/cip/CIP-0068)

---

## Wallet & DApp

### CIP-30: Wallet Connector

**Status:** Active
**Category:** Standards Track
**Purpose:** Standard API for DApps to interact with wallets

#### Wallet Detection

```typescript
// Check if wallet is available
if (window.cardano?.nami) {
  console.log("Nami wallet detected");
}

// List all available wallets
const wallets = Object.keys(window.cardano || {});
console.log("Available wallets:", wallets);
```

#### Connect Wallet

```typescript
// Enable wallet
const api = await window.cardano.nami.enable();

// Get network ID
const networkId = await api.getNetworkId();
console.log("Network:", networkId === 1 ? "Mainnet" : "Testnet");

// Get wallet addresses
const usedAddresses = await api.getUsedAddresses();
const unusedAddresses = await api.getUnusedAddresses();
const changeAddress = await api.getChangeAddress();

// Get UTXOs
const utxos = await api.getUtxos();

// Get balance
const balance = await api.getBalance();
```

#### Sign Transaction

```typescript
// Build transaction with Lucid
const tx = await lucid
  .newTx()
  .pay.ToAddress(recipientAddress, { lovelace: 5_000_000n })
  .complete();

// Get CBOR
const txCBOR = tx.toCBOR();

// Sign with wallet
const witnessSet = await api.signTx(txCBOR, true);

// Assemble and submit
const signedTx = tx.assemble([witnessSet]);
const txHash = await signedTx.submit();
```

#### CIP-30 Methods

| Method | Description |
|--------|-------------|
| `enable()` | Request access to wallet |
| `isEnabled()` | Check if DApp has access |
| `getNetworkId()` | Get network ID (1=mainnet, 0=testnet) |
| `getUtxos()` | Get all UTXOs |
| `getBalance()` | Get total balance |
| `getUsedAddresses()` | Get addresses with transactions |
| `getUnusedAddresses()` | Get unused addresses |
| `getChangeAddress()` | Get change address |
| `signTx()` | Sign transaction |
| `signData()` | Sign arbitrary data (CIP-8) |
| `submitTx()` | Submit signed transaction |

**Full Spec:** [CIP-30](https://cips.cardano.org/cip/CIP-0030)

---

### CIP-95: Web-Wallet Bridge

**Status:** Proposed
**Category:** Standards Track
**Purpose:** Extended wallet API for DRep, governance, and advanced features

#### Additional Methods

```typescript
// Get public DRep key
const dRepKey = await api.cip95.getPubDRepKey();

// Get registered stake keys
const stakeKeys = await api.cip95.getRegisteredPubStakeKeys();

// Sign with DRep key
const dRepSignature = await api.cip95.signData(dRepKey, payload);
```

**Full Spec:** [CIP-95](https://cips.cardano.org/cip/CIP-0095)

---

## Smart Contracts

### CIP-57: Blueprint

**Status:** Active
**Category:** Standards Track
**Purpose:** Standard format for Plutus contract metadata

#### Blueprint Structure

```json
{
  "preamble": {
    "title": "My Contract",
    "description": "A simple validator",
    "version": "1.0.0",
    "plutusVersion": "v3",
    "license": "MIT"
  },
  "validators": [
    {
      "title": "my_validator.spend",
      "datum": {
        "title": "Datum",
        "schema": { "$ref": "#/definitions/my_validator~1Datum" }
      },
      "redeemer": {
        "title": "Redeemer",
        "schema": { "$ref": "#/definitions/my_validator~1Redeemer" }
      },
      "compiledCode": "590a4e590a4b...",
      "hash": "abc123..."
    }
  ],
  "definitions": {
    "my_validator/Datum": {
      "title": "Datum",
      "dataType": "constructor",
      "index": 0,
      "fields": [
        { "title": "secret_hash", "type": "bytes" }
      ]
    }
  }
}
```

#### Generate Blueprint (Aiken)

```bash
# Aiken automatically generates plutus.json
aiken build

# Output: plutus.json (CIP-57 compliant)
```

#### Generate Blueprint (Plutus)

```haskell
-- Use plutus-ledger-api to generate blueprint
import Plutus.ApiCommon (serialiseUPLC)
import Plutus.V3.Ledger.Api (Script)

generateBlueprint :: Script -> Blueprint
generateBlueprint script = Blueprint
  { preamble = Preamble
      { title = "My Contract"
      , description = Just "A validator"
      , version = "1.0.0"
      , plutusVersion = PlutusV3
      }
  , validators = [validatorInfo script]
  , definitions = datumRedeemer definitions
  }
```

#### Use Blueprint in DApp

```typescript
import blueprint from "./plutus.json" assert { type: "json" };

// Get validator
const validator = {
  type: "PlutusV3",
  script: blueprint.validators[0].compiledCode,
};

// Get schema for datum/redeemer
const datumSchema = blueprint.definitions["my_validator/Datum"];
```

**Full Spec:** [CIP-57](https://cips.cardano.org/cip/CIP-0057)

---

### CIP-112: Observation

**Status:** Proposed
**Category:** Standards Track
**Purpose:** Read blockchain state in smart contracts

#### Use Case

Allow validators to observe UTXOs at specific addresses without consuming them.

```haskell
-- Hypothetical syntax (CIP-112 not finalized)
validator observe_example {
  spend(_, _, ctx) {
    let oracle_utxo = observe(oracleAddress)
    let price = decode_datum(oracle_utxo.datum)

    -- Use observed data in validation logic
    price > 100
  }
}
```

**Status:** Still in proposal stage. Check CIP for updates.

**Full Spec:** [CIP-112](https://cips.cardano.org/cip/CIP-0112)

---

## Governance

### CIP-1694: Voltaire Governance

**Status:** Active
**Category:** Standards Track
**Purpose:** On-chain governance for Cardano

#### Key Concepts

- **DReps (Delegated Representatives):** Voting delegates
- **Constitutional Committee:** Governance oversight
- **Governance Actions:** Proposals for protocol changes
- **Voting:** Stake-weighted voting system

#### Governance Action Types

1. **Parameter Change:** Update protocol parameters
2. **Hard Fork Initiation:** Trigger protocol upgrade
3. **Treasury Withdrawal:** Spend from treasury
4. **Info Action:** Non-binding signaling
5. **No Confidence:** Remove constitutional committee
6. **Update Committee:** Change committee members
7. **Constitution:** Amend constitution

#### Submit Governance Action

```bash
# Create proposal
cardano-cli conway governance action create-info \
  --testnet \
  --governance-action-deposit 1000000000 \
  --deposit-return-stake-verification-key-file drep.vkey \
  --anchor-url "https://example.com/proposal.json" \
  --anchor-data-hash $(cardano-cli hash anchor-data --file-text proposal.json) \
  --out-file proposal.action

# Submit proposal
cardano-cli conway transaction build \
  --testnet-magic 1 \
  --tx-in $UTXO \
  --proposal-file proposal.action \
  --change-address $(cat payment.addr) \
  --out-file tx.raw

cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment.skey \
  --out-file tx.signed

cardano-cli transaction submit \
  --testnet-magic 1 \
  --tx-file tx.signed
```

#### Vote on Proposal

```bash
# Vote as DRep
cardano-cli conway governance vote create \
  --yes \
  --governance-action-tx-id $PROPOSAL_TX \
  --governance-action-index 0 \
  --drep-verification-key-file drep.vkey \
  --out-file vote.vote

# Submit vote
cardano-cli conway transaction build \
  --testnet-magic 1 \
  --tx-in $UTXO \
  --vote-file vote.vote \
  --change-address $(cat payment.addr) \
  --out-file vote-tx.raw
```

**Full Spec:** [CIP-1694](https://cips.cardano.org/cip/CIP-1694)

---

## Miscellaneous

### CIP-19: Cardano Addresses

**Status:** Active
**Category:** Standards Track
**Purpose:** Address format and encoding

#### Address Types

| Type | Prefix | Description |
|------|--------|-------------|
| Base | `addr` | Payment + stake keys |
| Enterprise | `addr` | Payment key only (no staking) |
| Pointer | `addr` | Payment + stake pointer |
| Reward | `stake` | Stake rewards address |
| Script | `addr` | Script hash address |

#### Bech32 Encoding

```typescript
import { Lucid } from "@lucid-evolution/lucid";

// Decode address
const addressDetails = lucid.utils.getAddressDetails(
  "addr1q9xyz..."
);

console.log(addressDetails);
// {
//   type: "Base",
//   networkId: 1,
//   address: {
//     bech32: "addr1...",
//     paymentCredential: { type: "Key", hash: "..." },
//     stakeCredential: { type: "Key", hash: "..." }
//   }
// }
```

**Full Spec:** [CIP-19](https://cips.cardano.org/cip/CIP-0019)

---

### CIP-8: Message Signing

**Status:** Active
**Category:** Standards Track
**Purpose:** Sign and verify arbitrary messages

#### Sign Message

```typescript
// Sign message with wallet
const address = await lucid.wallet().address();
const payload = new TextEncoder().encode("Hello, Cardano!");

const signature = await window.cardano.nami.signData(
  address,
  Buffer.from(payload).toString("hex")
);

console.log("Signature:", signature);
// {
//   signature: "845846a2...",
//   key: "a4010103..."
// }
```

#### Verify Signature

```typescript
import { verifySignature } from "@lucid-evolution/lucid";

const isValid = verifySignature(
  address,
  payload,
  signature
);

console.log("Valid signature:", isValid);
```

**Full Spec:** [CIP-8](https://cips.cardano.org/cip/CIP-0008)

---

### CIP-67: Asset Name Labels

**Status:** Active
**Category:** Standards Track
**Purpose:** Standard labels for asset names (used in CIP-68)

#### Label Format

```
<label><asset_name_hash>
```

Where:
- Label: 3-digit hex prefix
- Asset name hash: First 4 bytes of BLAKE2b-224 hash

#### Standard Labels

| Label | Type | Usage |
|-------|------|-------|
| 000 | Reference NFT | Immutable metadata (CIP-68) |
| 001 | NFT | Mutable metadata (CIP-68) |
| 222 | FT | Fungible token (CIP-68) |
| 333 | RFT | Refundable token |
| 444 | Rich FT | FT with metadata |

#### Create Labeled Asset Name

```typescript
import { fromText, toHex } from "@lucid-evolution/lucid";
import { blake2b } from "blakejs";

const assetName = "MyNFT001";
const hash = blake2b(fromText(assetName), undefined, 28); // 224 bits
const hashPrefix = toHex(hash.slice(0, 4));  // First 4 bytes

// Reference NFT
const refAssetName = "000" + hashPrefix;  // 000 + hash

// User NFT
const userAssetName = "001" + hashPrefix;  // 001 + hash
```

**Full Spec:** [CIP-67](https://cips.cardano.org/cip/CIP-0067)

---

## Additional Resources

- **CIP Repository:** [github.com/cardano-foundation/CIPs](https://github.com/cardano-foundation/CIPs)
- **CIP Website:** [cips.cardano.org](https://cips.cardano.org)
- **CIP Editor's Guide:** [CIP-1](https://cips.cardano.org/cip/CIP-0001)

## Using Copilot for CIPs

Use the `#cip-lookup` prompt to quickly find CIP information:

```
#cip-lookup How do I implement CIP-30 wallet connection?
#cip-lookup Show me CIP-25 NFT metadata example
#cip-lookup What is CIP-68 and when should I use it?
```

## Contributing New CIPs

1. **Draft:** Write CIP following [CIP-1](https://cips.cardano.org/cip/CIP-0001)
2. **Submit:** Create PR to [CIPs repository](https://github.com/cardano-foundation/CIPs)
3. **Review:** CIP editors and community review
4. **Iterate:** Address feedback
5. **Merge:** CIP becomes "Proposed" or "Active"

---

**Last Updated:** 2024 (Check [cips.cardano.org](https://cips.cardano.org) for latest)
