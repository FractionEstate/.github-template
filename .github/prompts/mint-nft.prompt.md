---
mode: agent
description: 'Generate CIP-25 compliant NFT minting code with metadata validation'
tools: ['new', 'edit', 'search']
---
Generate complete NFT minting code following CIP-25 standard.

## Process

1. **Clarify NFT requirements**:
   - Single NFT or collection?
   - Metadata (name, image, description, traits)
   - One-time mint or ongoing minting?
   - Policy locking date (if any)

2. **Generate minting policy**:

   ### Aiken Minting Policy
   ```aiken
   use aiken/crypto.{VerificationKeyHash}
   use aiken/collection/list
   use cardano/transaction.{OutputReference, Transaction}

   validator nft_policy(utxo_ref: OutputReference, owner: VerificationKeyHash) {
     mint(redeemer: Void, policy_id: PolicyId, self: Transaction) {
       let must_spend_utxo =
         list.any(self.inputs, fn(input) { input.output_reference == utxo_ref })

       let must_be_signed =
         list.has(self.extra_signatories, owner)

       must_spend_utxo && must_be_signed
     }
   }
   ```

   ### Plutus Minting Policy
   ```haskell
   {-# INLINABLE mkPolicy #-}
   mkPolicy :: TxOutRef -> PubKeyHash -> () -> ScriptContext -> Bool
   mkPolicy utxoRef owner () ctx =
     traceIfFalse "UTxO not consumed" hasUTxO &&
     traceIfFalse "wrong signature" checkSig
     where
       info :: TxInfo
       info = scriptContextTxInfo ctx

       hasUTxO :: Bool
       hasUTxO = any (\i -> txInInfoOutRef i == utxoRef) $ txInfoInputs info

       checkSig :: Bool
       checkSig = txSignedBy info owner
   ```

3. **Generate minting transaction** (Lucid Evolution):

   ```typescript
   import { Lucid, Blockfrost, Data, fromText } from '@lucid-evolution/lucid';

   const lucid = await Lucid(
     new Blockfrost(url, apiKey),
     'Preprod'
   );

   lucid.selectWallet.fromAPI(window.cardano.nami);

   // Get a UTxO to use as unique identifier
   const utxos = await lucid.wallet.getUtxos();
   const utxo = utxos[0];

   // Compile minting policy with parameters
   const mintingPolicy = applyParams(
     compiledPolicy,
     [utxo.txHash + utxo.outputIndex, ownerPubKeyHash]
   );

   const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);

   // Asset name (max 32 bytes)
   const assetName = 'MyNFT001';
   const unit = policyId + fromText(assetName);

   // CIP-25 metadata
   const metadata = {
     [policyId]: {
       [assetName]: {
         name: 'My Cool NFT',
         image: 'ipfs://QmX...', // IPFS hash
         description: 'A unique digital artwork',
         mediaType: 'image/png',
         attributes: {
           Background: 'Blue',
           Rarity: 'Legendary'
         }
       }
     }
   };

   const tx = await lucid
     .newTx()
     .collectFrom([utxo])
     .attach.MintingPolicy(mintingPolicy)
     .mintAssets({ [unit]: 1n })
     .attachMetadata(721, metadata) // CIP-25 uses label 721
     .complete();

   const signed = await tx.sign.withWallet().complete();
   const txHash = await signed.submit();

   console.log(`NFT minted! Policy ID: ${policyId}`);
   console.log(`Asset: ${unit}`);
   console.log(`Tx: ${txHash}`);
   ```

4. **Generate metadata JSON** (CIP-25 compliant):

   ```json
   {
     "721": {
       "<policy_id>": {
         "<asset_name>": {
           "name": "My Cool NFT",
           "image": "ipfs://QmX...",
           "description": "A unique digital artwork on Cardano",
           "mediaType": "image/png",
           "files": [
             {
               "name": "My Cool NFT - High Res",
               "mediaType": "image/png",
               "src": "ipfs://QmY..."
             }
           ],
           "attributes": {
             "Background": "Blue",
             "Eyes": "Green",
             "Rarity": "Legendary",
             "Generation": "1"
           }
         }
       }
     }
   }
   ```

5. **For collections**, generate sequential minting:

   ```typescript
   async function mintCollection(count: number) {
     for (let i = 1; i <= count; i++) {
       const assetName = `MyNFT${i.toString().padStart(4, '0')}`;
       const unit = policyId + fromText(assetName);

       const metadata = {
         [policyId]: {
           [assetName]: {
             name: `My NFT #${i}`,
             image: `ipfs://Qm${i}...`,
             description: `NFT number ${i} of ${count}`,
             attributes: generateRandomAttributes()
           }
         }
       };

       const tx = await lucid
         .newTx()
         .attach.MintingPolicy(mintingPolicy)
         .mintAssets({ [unit]: 1n })
         .attachMetadata(721, metadata)
         .complete();

       const signed = await tx.sign.withWallet().complete();
       const txHash = await signed.submit();

       await lucid.awaitTx(txHash); // Wait before next mint
       console.log(`Minted ${i}/${count}: ${txHash}`);
     }
   }
   ```

6. **Upload images to IPFS**:

   ```typescript
   import { create } from 'ipfs-http-client';

   const ipfs = create({ url: 'https://ipfs.infura.io:5001' });

   async function uploadToIPFS(file: File): Promise<string> {
     const result = await ipfs.add(file);
     return `ipfs://${result.path}`;
   }

   // Usage
   const imageFile = document.getElementById('image-input').files[0];
   const imageUrl = await uploadToIPFS(imageFile);
   ```

7. **Verify NFT**:

   ```typescript
   // Check if NFT exists
   const utxos = await lucid.utxosAt(ownerAddress);
   const hasNFT = utxos.some(utxo =>
     Object.keys(utxo.assets).includes(unit)
   );

   // Get metadata from blockchain
   const metadata = await fetch(
     `https://cardano-mainnet.blockfrost.io/api/v0/assets/${unit}`,
     { headers: { project_id: apiKey } }
   ).then(r => r.json());
   ```

## CIP-25 Metadata Schema

**Required fields**:
- `name`: NFT display name
- `image`: IPFS/HTTP URL to image

**Optional fields**:
- `description`: Text description
- `mediaType`: MIME type (image/png, image/jpeg, video/mp4, etc.)
- `files`: Array of additional files
- `attributes`: Key-value pairs for traits

**Valid image formats**:
- IPFS: `ipfs://Qm...` (recommended)
- HTTP: `https://example.com/image.png`
- Data URI: `data:image/png;base64,...` (not recommended)

## Testing

```typescript
import { describe, it, expect } from 'vitest';

describe('NFT Minting', () => {
  it('should generate valid CIP-25 metadata', () => {
    const metadata = generateMetadata('MyNFT', 'ipfs://Qm...');
    expect(metadata['721']).toBeDefined();
    expect(metadata['721'][policyId]).toBeDefined();
  });

  it('should mint NFT successfully', async () => {
    const txHash = await mintNFT('Test NFT', 'ipfs://test');
    expect(txHash).toMatch(/^[a-f0-9]{64}$/);
  });
});
```

## Common pitfalls

1. **Asset name too long**: Max 32 bytes (use `fromText()` to encode)
2. **Invalid IPFS URL**: Must be `ipfs://` not `https://ipfs.io/ipfs/`
3. **Wrong metadata label**: CIP-25 uses label `721`, not `20`
4. **Minting too many at once**: Can hit tx size limits, batch in groups of 10-20
5. **Policy not locked**: For true NFTs, ensure policy can't mint more

## Resources

Use `semantic_search` to find:
- CIP-25 full specification
- CIP-68 for advanced datum metadata

Reference:
- `.github/instructions/cip-compliance.instructions.md`
- `.github/instructions/wallet-integration.instructions.md`

```
