---
mode: agent
description: 'Look up Cardano Improvement Proposals (CIPs) and generate implementation code'
tools: ['search', 'fetch', 'new', 'edit']
---
Search for and implement Cardano Improvement Proposals (CIPs).

## Process

1. **Understand the request**:
   - Which CIP number? (e.g., CIP-25, CIP-30, CIP-57)
   - Or search by topic? (e.g., "NFT metadata", "wallet API", "blueprints")

2. **Search for CIP**:

   Use `semantic_search` with queries like:
   - "CIP-25 NFT metadata standard"
   - "CIP-30 wallet dApp connector"
   - "CIP-57 Plutus blueprint"
   - "CIP-68 datum metadata"
   - "CIP-1694 governance voting"

   Or use `fetch_webpage`:
   ```typescript
   fetch_webpage([
     'https://cips.cardano.org/cip/CIP-0025',
     'https://cips.cardano.org/cip/CIP-0030'
   ], 'Explain the specification')
   ```

3. **Common CIPs reference**:

   ### CIP-25: NFT Metadata Standard
   ```json
   {
     "721": {
       "<policy_id>": {
         "<asset_name>": {
           "name": "My NFT",
           "image": "ipfs://Qm...",
           "mediaType": "image/png",
           "description": "Description text",
           "files": [...],
           "attributes": {...}
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
     "validators": [{
       "title": "Lock Validator",
       "datum": { "schema": {...} },
       "redeemer": { "schema": {...} },
       "compiledCode": "590a4d01..."
     }]
   }
   ```

   ### CIP-68: Datum Metadata Standard
   ```typescript
   // Reference NFT (100 prefix)
   const referenceAsset = policyId + fromText("(100)MyNFT");

   // User NFT (222 prefix)
   const userAsset = policyId + fromText("(222)MyNFT");

   // Metadata stored in datum of reference NFT
   const datum = {
     metadata: {
       name: "My NFT",
       image: "ipfs://...",
       attributes: {...}
     },
     version: 1
   };
   ```

   ### CIP-1694: Governance Actions
   ```typescript
   // Vote on proposal
   const tx = await lucid
     .newTx()
     .voteGovernanceAction(
       { txHash: proposalTxHash, index: 0 },
       'Yes',
       drepCredential
     )
     .complete();
   ```

4. **Generate implementation** based on CIP:

   Example for CIP-25 NFT:
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
       attributes?: Record<string, any>;
     }
   ) {
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

     const tx = await lucid
       .newTx()
       .attach.MintingPolicy(mintingPolicy)
       .mintAssets({ [unit]: 1n })
       .attachMetadata(721, cip25Metadata)
       .complete();

     return tx;
   }
   ```

   Example for CIP-30 wallet connection:
   ```typescript
   async function connectCIP30Wallet(walletName: string) {
     // Check if wallet exists
     if (!window.cardano?.[walletName]) {
       throw new Error(`${walletName} wallet not installed`);
     }

     // Enable wallet (triggers user consent)
     const api = await window.cardano[walletName].enable();

     // Validate API version
     const apiVersion = window.cardano[walletName].apiVersion;
     if (!apiVersion.startsWith('0.1')) {
       console.warn(`Unsupported API version: ${apiVersion}`);
     }

     // Get network ID (0 = testnet, 1 = mainnet)
     const networkId = await api.getNetworkId();

     // Get wallet address
     const addresses = await api.getUsedAddresses();
     const address = addresses[0];

     return { api, address, networkId };
   }
   ```

5. **Add validation** for CIP compliance:

   ### CIP-25 Metadata Validation
   ```typescript
   function validateCIP25Metadata(metadata: any): boolean {
     if (!metadata['721']) return false;

     for (const policyId in metadata['721']) {
       for (const assetName in metadata['721'][policyId]) {
         const asset = metadata['721'][policyId][assetName];

         if (!asset.name || typeof asset.name !== 'string') return false;
         if (!asset.image || typeof asset.image !== 'string') return false;

         if (asset.image.startsWith('ipfs://') === false &&
             asset.image.startsWith('https://') === false) {
           return false;
         }
       }
     }

     return true;
   }
   ```

   ### CIP-30 Network Validation
   ```typescript
   async function validateNetwork(
     api: WalletAPI,
     expected: 'mainnet' | 'testnet'
   ) {
     const networkId = await api.getNetworkId();
     const expectedId = expected === 'mainnet' ? 1 : 0;

     if (networkId !== expectedId) {
       throw new Error(
         `Wrong network. Expected ${expected}, got ${networkId === 1 ? 'mainnet' : 'testnet'}`
       );
     }
   }
   ```

## CIP Index (150+ total)

**Most commonly used**:
- **CIP-5**: Bech32 address prefixes
- **CIP-8**: Message signing
- **CIP-14**: Asset fingerprints
- **CIP-19**: Cardano addresses
- **CIP-20**: Transaction message/comment
- **CIP-25**: NFT metadata
- **CIP-27**: CNFT community royalties
- **CIP-30**: dApp-Wallet Web Bridge
- **CIP-31**: Reference inputs
- **CIP-32**: Inline datums
- **CIP-33**: Reference scripts
- **CIP-57**: Plutus blueprints
- **CIP-68**: Datum metadata standard
- **CIP-1694**: Voltaire governance
- **CIP-1855**: Forging policy keys

**Search by topic**:
- NFTs: CIP-25, CIP-27, CIP-68
- Wallets: CIP-30, CIP-8, CIP-95
- Plutus: CIP-31, CIP-32, CIP-33, CIP-57
- Governance: CIP-1694, CIP-1855
- Metadata: CIP-20, CIP-25, CIP-68

## Testing CIP compliance

```typescript
import { describe, it, expect } from 'vitest';

describe('CIP-25 Compliance', () => {
  it('should generate valid CIP-25 metadata', () => {
    const metadata = generateCIP25Metadata('MyNFT', 'ipfs://Qm...');
    expect(validateCIP25Metadata(metadata)).toBe(true);
  });

  it('should reject invalid metadata', () => {
    const invalid = { '721': { 'policy': { 'asset': {} } } };
    expect(validateCIP25Metadata(invalid)).toBe(false);
  });
});

describe('CIP-30 Wallet API', () => {
  it('should connect to wallet', async () => {
    const { api, networkId } = await connectCIP30Wallet('nami');
    expect(api).toBeDefined();
    expect([0, 1]).toContain(networkId);
  });
});
```

## When to use which CIP

- **Building NFT marketplace?** → CIP-25, CIP-27 (royalties), CIP-68 (advanced)
- **Integrating wallets?** → CIP-30, CIP-95 (multi-sig)
- **Writing smart contracts?** → CIP-57 (blueprints), CIP-31/32/33 (Plutus V2 features)
- **Adding governance?** → CIP-1694 (voting), CIP-1855 (keys)
- **Storing metadata?** → CIP-20 (messages), CIP-25 (NFTs), CIP-68 (datum-based)

## Resources

- **CIP Repository**: https://cips.cardano.org/
- **Search CIPs**: Use `semantic_search` with CIP number or topic
- **Fetch CIP**: Use `fetch_webpage` with CIP URL

Reference:
- `.github/instructions/cip-compliance.instructions.md`

```
