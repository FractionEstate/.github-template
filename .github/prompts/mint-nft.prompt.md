---
mode: agent
description: 'Generate CIP-25 compliant NFT minting code with metadata validation'
tools: ['new', 'edit', 'search']
---
# NFT Minting

Generate complete NFT minting code that follows the CIP-25 standard.

## Process

1. **Clarify NFT requirements**

   - Single NFT or collection?
   - Metadata (name, image, description, traits).
   - One-time mint or ongoing minting?
   - Policy locking date (if any).

1. **Generate minting policy**

### Aiken minting policy

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

### Plutus minting policy

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

1. **Build the minting transaction** (Lucid Evolution)

```typescript
import { Lucid, Blockfrost, Data, fromText } from '@lucid-evolution/lucid';

const lucid = await Lucid(new Blockfrost(url, apiKey), 'Preprod');
await lucid.selectWallet.fromAPI(window.cardano.nami);

const [utxo] = await lucid.wallet.getUtxos();

const mintingPolicy = applyParams(compiledPolicy, [
  utxo.txHash + utxo.outputIndex,
  ownerPubKeyHash
]);

const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
const assetName = 'MyNFT001';
const unit = policyId + fromText(assetName);

const metadata = {
  [policyId]: {
    [assetName]: {
      name: 'My Cool NFT',
      image: 'ipfs://QmX...',
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
  .attachMintingPolicy(mintingPolicy)
  .mintAssets({ [unit]: 1n })
  .attachMetadata(721, metadata)
  .complete();

const signed = await tx.sign.withWallet().complete();
const txHash = await signed.submit();

console.log(`NFT minted! Policy ID: ${policyId}`);
console.log(`Asset: ${unit}`);
console.log(`Tx: ${txHash}`);
```

1. **Produce metadata JSON** (CIP-25 compliant)

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

1. **Handle collections** with sequential minting

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
      .attachMintingPolicy(mintingPolicy)
      .mintAssets({ [unit]: 1n })
      .attachMetadata(721, metadata)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();

    await lucid.awaitTx(txHash);
    console.log(`Minted ${i}/${count}: ${txHash}`);
  }
}
```

1. **Upload images to IPFS**

```typescript
import { create } from 'ipfs-http-client';

const ipfs = create({ url: 'https://ipfs.infura.io:5001' });

async function uploadToIPFS(file: File): Promise<string> {
  const result = await ipfs.add(file);
  return `ipfs://${result.path}`;
}

const input = document.getElementById('image-input') as HTMLInputElement;
const imageFile = input.files?.[0];
if (!imageFile) throw new Error('Missing image file');

const imageUrl = await uploadToIPFS(imageFile);
```

1. **Verify NFT on-chain**

```typescript
const utxos = await lucid.utxosAt(ownerAddress);
const hasNFT = utxos.some(utxo => Object.keys(utxo.assets).includes(unit));

const metadata = await fetch(
  `https://cardano-mainnet.blockfrost.io/api/v0/assets/${unit}`,
  { headers: { project_id: apiKey } }
).then(response => response.json());
```

## CIP-25 metadata schema

### Required fields

- `name`: NFT display name.
- `image`: IPFS or HTTPS URL to the image.

### Optional fields

- `description`: Text description.
- `mediaType`: MIME type such as `image/png` or `video/mp4`.
- `files`: Array of additional files.
- `attributes`: Key-value traits.

### Valid image formats

- IPFS: `ipfs://Qm...` (recommended).
- HTTPS: `https://example.com/image.png`.
- Data URI: `data:image/png;base64,...` (not recommended).

## Testing

```typescript
import { describe, it, expect } from 'vitest';

describe('NFT Minting', () => {
  it('generates valid CIP-25 metadata', () => {
    const metadata = generateMetadata('MyNFT', 'ipfs://Qm...');
    expect(metadata['721']).toBeDefined();
    expect(metadata['721'][policyId]).toBeDefined();
  });

  it('mints an NFT successfully', async () => {
    const txHash = await mintNFT('Test NFT', 'ipfs://test');
    expect(txHash).toMatch(/^[a-f0-9]{64}$/);
  });
});
```

## Common pitfalls

1. **Asset name too long**: Max 32 bytes (use `fromText()` to encode).
2. **Invalid IPFS URL**: Must be `ipfs://`, not `https://ipfs.io/ipfs/`.
3. **Wrong metadata label**: CIP-25 uses label `721`, not `20`.
4. **Large batch size**: Minting many assets can hit size limits; batch in
   groups of 10-20.
5. **Policy not locked**: For true NFTs, ensure the policy cannot mint more.

## Resources

Use `semantic_search` to find:

- CIP-25 full specification.
- CIP-68 for advanced datum metadata.

Reference:

- `.github/instructions/cip-compliance.instructions.md`.
- `.github/instructions/wallet-integration.instructions.md`.
