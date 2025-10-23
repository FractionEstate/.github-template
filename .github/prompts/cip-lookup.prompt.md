---
mode: agent
description: 'Look up Cardano Improvement Proposals (CIPs) and generate implementation code'
tools: ['search', 'fetch', 'new', 'edit']
---
# CIP Lookup

Use this prompt to research Cardano Improvement Proposals (CIPs) and deliver
implementation-ready code samples.

## Process

1. **Understand the request**

   - Identify the CIP number (for example, CIP-25, CIP-30, CIP-57).
   - If the number is unknown, capture the topic (NFT metadata, wallet API,
     blueprints, governance, and so on).

2. **Search for the CIP**

   - Prefer `semantic_search` queries such as "CIP-25 NFT metadata" or
     "CIP-57 blueprint schema".
   - When the official text is required, call `fetch_webpage`:

     ```typescript
     fetch_webpage(
       [
         'https://cips.cardano.org/cip/CIP-0025',
         'https://cips.cardano.org/cip/CIP-0030'
       ],
       'Summarize the specification'
     );
     ```

3. **Extract key requirements**

   - Note version requirements, required fields, and breaking changes.
   - Capture reference code from the CIP text when possible.

4. **Produce implementation guidance**

   - Provide concise code examples with inline comments for context.
   - Highlight validation steps that guarantee CIP compliance.
   - Mention testing guidelines and tools used (for example, `vitest`).

## Common CIPs

### CIP-25: NFT Metadata Standard

```json
{
  "721": {
    "<policy_id>": {
      "<asset_name>": {
        "name": "My NFT",
        "image": "ipfs://Qm...",
        "mediaType": "image/png",
        "description": "Optional description",
        "files": [],
        "attributes": {}
      }
    }
  }
}
```

### CIP-30: Wallet dApp Connector

```typescript
const api = await window.cardano.nami.enable();
const networkId = await api.getNetworkId();
const usedAddresses = await api.getUsedAddresses();
const signedTx = await api.signTx(txCBOR, true);
const txHash = await api.submitTx(signedTx);
```

### CIP-57: Plutus Blueprints

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
      "datum": { "schema": {} },
      "redeemer": { "schema": {} },
      "compiledCode": "590a4d01..."
    }
  ]
}
```

### CIP-68: Datum Metadata Standard

```typescript
const referenceAsset = policyId + fromText('(100)MyNFT');
const userAsset = policyId + fromText('(222)MyNFT');

const datum = {
  metadata: {
    name: 'My NFT',
    image: 'ipfs://...',
    attributes: {}
  },
  version: 1
};
```

### CIP-1694: Governance Actions

```typescript
const tx = await lucid
  .newTx()
  .voteGovernanceAction(
    { txHash: proposalTxHash, index: 0 },
    'Yes',
    drepCredential
  )
  .complete();
```

## Implementation Patterns

### Minting with CIP-25 metadata

```typescript
import { Lucid, fromText } from '@lucid-evolution/lucid';

async function mintCIP25NFT(
  lucid: Lucid,
  policyId: string,
  assetName: string,
  metadata: {
    name: string;
    image: string;
    description?: string;
    attributes?: Record<string, unknown>;
  }
): Promise<Transaction>
{
  const unit = policyId + fromText(assetName);

  const cip25Metadata = {
    721: {
      [policyId]: {
        [assetName]: {
          name: metadata.name,
          image: metadata.image,
          ...(metadata.description && { description: metadata.description }),
          ...(metadata.attributes && { attributes: metadata.attributes })
        }
      }
    }
  };

  return lucid
    .newTx()
    .attachMintingPolicy(mintingPolicy)
    .mintAssets({ [unit]: 1n })
    .attachMetadata(721, cip25Metadata)
    .complete();
}
```

### Connecting to a CIP-30 wallet

```typescript
async function connectCIP30Wallet(walletName: string) {
  if (!window.cardano?.[walletName]) {
    throw new Error(`${walletName} wallet not installed`);
  }

  const api = await window.cardano[walletName].enable();
  const apiVersion = window.cardano[walletName].apiVersion;

  if (!apiVersion.startsWith('0.1')) {
    console.warn(`Unexpected API version: ${apiVersion}`);
  }

  const networkId = await api.getNetworkId();
  const [address] = await api.getUsedAddresses();

  return { api, address, networkId };
}
```

## Validation Helpers

### CIP-25 metadata guard

```typescript
function validateCIP25Metadata(metadata: Record<string, unknown>): boolean {
  if (!metadata['721']) return false;

  for (const policyId of Object.keys(metadata['721'] as object)) {
    const assets = (metadata['721'] as Record<string, unknown>)[
      policyId
    ] as Record<string, unknown>;

    for (const assetName of Object.keys(assets)) {
      const asset = assets[assetName] as Record<string, unknown>;

      if (typeof asset.name !== 'string') return false;
      if (typeof asset.image !== 'string') return false;

      const image = asset.image as string;
      if (!image.startsWith('ipfs://') && !image.startsWith('https://')) {
        return false;
      }
    }
  }

  return true;
}
```

### CIP-30 network assertion

```typescript
async function assertNetwork(
  api: WalletAPI,
  expected: 'mainnet' | 'testnet'
): Promise<void>
{
  const networkId = await api.getNetworkId();
  const expectedId = expected === 'mainnet' ? 1 : 0;

  if (networkId !== expectedId) {
    const actual = networkId === 1 ? 'mainnet' : 'testnet';
    throw new Error(`Wrong network. Expected ${expected}, got ${actual}`);
  }
}
```

## CIP Index (selected)

**Common picks**

- **CIP-5**: Bech32 address prefixes.
- **CIP-8**: Message signing specification.
- **CIP-25**: NFT metadata layout.
- **CIP-27**: Community royalties for NFTs.
- **CIP-30**: Wallet web bridge API.
- **CIP-31/32/33**: Reference inputs, inline datums, reference
  scripts.
- **CIP-57**: Plutus blueprint packaging.
- **CIP-68**: Datum-backed metadata standard.
- **CIP-95**: Multisig wallet coordination.
- **CIP-1694**: Voltaire governance actions.

**Topic search tips**

- NFTs → CIP-25, CIP-27, CIP-68.
- Wallets → CIP-8, CIP-30, CIP-95.
- Plutus upgrades → CIP-31, CIP-32, CIP-33, CIP-57.
- Governance → CIP-1694, CIP-1855.
- Metadata → CIP-20, CIP-25, CIP-68.

## Testing guidance

```typescript
import { describe, it, expect } from 'vitest';

describe('CIP-25 compliance', () => {
  it('accepts valid metadata', () => {
    const metadata = generateCIP25Metadata('MyNFT', 'ipfs://Qm...');
    expect(validateCIP25Metadata(metadata)).toBe(true);
  });

  it('rejects invalid metadata', () => {
    const invalid = { '721': { policy: { asset: {} } } };
    expect(validateCIP25Metadata(invalid)).toBe(false);
  });
});

describe('CIP-30 wallet API', () => {
  it('connects to a wallet', async () => {
    const { api, networkId } = await connectCIP30Wallet('nami');
    expect(api).toBeDefined();
    expect([0, 1]).toContain(networkId);
  });
});
```

## Resources

- **CIP repository**: <https://cips.cardano.org/>
- **Semantic search tips**: use CIP numbers or targeted topics.
- **Fetching specs**: call `fetch_webpage` with the CIP URL.
- Reference instructions: `.github/instructions/cip-compliance.instructions.md`.

```
