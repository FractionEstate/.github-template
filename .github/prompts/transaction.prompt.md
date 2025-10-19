---
mode: agent
description: 'Build a Cardano transaction with Lucid Evolution or Mesh'
tools: ['new', 'edit', 'search']
---
Generate transaction building code using Lucid Evolution (preferred) or Mesh SDK.

## Process

1. **Clarify transaction type**:
   - Simple payment
   - Lock funds to validator
   - Unlock funds from validator
   - Mint NFT/tokens
   - Multi-signature
   - Metadata attachment

2. **Choose library**:
   - **Lucid Evolution** (Anastasia-Labs): Production-ready, Conway era, comprehensive API
   - **Mesh SDK**: React components, simpler API, good for beginners

3. **Generate transaction code**:

   ### Lucid Evolution - Simple Payment
   ```typescript
   import { Lucid, Blockfrost } from '@lucid-evolution/lucid';

   const lucid = await Lucid(
     new Blockfrost(
       'https://cardano-mainnet.blockfrost.io/api/v0',
       process.env.BLOCKFROST_KEY!
     ),
     'Mainnet'
   );

   // Set wallet
   lucid.selectWallet.fromSeed(seed);
   // or
   lucid.selectWallet.fromAPI(window.cardano.nami);

   const tx = await lucid
     .newTx()
     .pay.ToAddress(recipientAddress, { lovelace: 5000000n })
     .complete();

   const signed = await tx.sign.withWallet().complete();
   const txHash = await signed.submit();
   ```

   ### Lucid Evolution - Lock Funds
   ```typescript
   import { Data } from '@lucid-evolution/lucid';

   const Datum = Data.Object({
     owner: Data.Bytes(),
     amount: Data.Integer()
   });
   type Datum = Data.Static<typeof Datum>;

   const datum: Datum = {
     owner: ownerPubKeyHash,
     amount: 1000000n
   };

   const tx = await lucid
     .newTx()
     .pay.ToContract(
       validatorAddress,
       { kind: "inline", value: Data.to(datum, Datum) },
       { lovelace: 2000000n }
     )
     .complete();

   const signed = await tx.sign.withWallet().complete();
   const txHash = await signed.submit();
   ```

   ### Lucid Evolution - Unlock Funds
   ```typescript
   const Redeemer = Data.Enum([
     Data.Literal("Unlock"),
     Data.Object({ Update: Data.Integer() })
   ]);
   type Redeemer = Data.Static<typeof Redeemer>;

   const utxos = await lucid.utxosAt(validatorAddress);
   const utxo = utxos[0];

   const redeemer: Redeemer = "Unlock";

   const tx = await lucid
     .newTx()
     .collectFrom([utxo], Data.to(redeemer, Redeemer))
     .attach.SpendingValidator(validatorScript)
     .addSigner(ownerAddress)
     .complete();

   const signed = await tx.sign.withWallet().complete();
   const txHash = await signed.submit();
   ```

   ### Mesh SDK - Simple Payment
   ```typescript
   import { MeshWallet, Transaction } from '@meshsdk/core';

   const wallet = new MeshWallet({
     networkId: 1,
     fetcher: blockchainProvider,
     submitter: blockchainProvider,
     key: {
       type: 'mnemonic',
       words: mnemonic.split(' ')
     }
   });

   const tx = new Transaction({ initiator: wallet })
     .sendLovelace(recipientAddress, '5000000');

   const unsignedTx = await tx.build();
   const signedTx = await wallet.signTx(unsignedTx);
   const txHash = await wallet.submitTx(signedTx);
   ```

   ### Mesh SDK - Lock Funds
   ```typescript
   const tx = new Transaction({ initiator: wallet });

   tx.sendLovelace(
     {
       address: validatorAddress,
       datum: {
         value: { owner: ownerPubKeyHash, amount: 1000000 },
         inline: true
       }
     },
     '2000000'
   );

   const unsignedTx = await tx.build();
   const signedTx = await wallet.signTx(unsignedTx);
   const txHash = await wallet.submitTx(signedTx);
   ```

4. **Add error handling**:
   ```typescript
   try {
     const tx = await lucid.newTx()...complete();
     const signed = await tx.sign.withWallet().complete();
     const txHash = await signed.submit();
     console.log('Success:', txHash);
   } catch (error) {
     if (error.message.includes('insufficient funds')) {
       console.error('Not enough ADA');
     } else if (error.message.includes('user declined')) {
       console.error('User cancelled transaction');
     } else {
       console.error('Transaction failed:', error);
     }
   }
   ```

5. **Add time constraints** (if needed):
   ```typescript
   const now = Date.now();
   const oneHourLater = now + 60 * 60 * 1000;

   const tx = await lucid
     .newTx()
     .validFrom(now)
     .validTo(oneHourLater)
     // ... rest of transaction
     .complete();
   ```

6. **Add metadata** (if needed):
   ```typescript
   const tx = await lucid
     .newTx()
     .pay.ToAddress(address, assets)
     .attachMetadata(674, { msg: ['Hello Cardano'] })
     .complete();
   ```

## Testing

```typescript
import { describe, it, expect } from 'vitest';

describe('Transaction Building', () => {
  it('should build valid payment', async () => {
    const tx = await lucid.newTx()
      .pay.ToAddress(address, { lovelace: 1000000n })
      .complete();

    expect(tx).toBeDefined();
    expect(tx.toString()).toContain('84'); // CBOR prefix
  });

  it('should handle insufficient funds', async () => {
    await expect(async () => {
      await lucid.newTx()
        .pay.ToAddress(address, { lovelace: 1000000000000n })
        .complete();
    }).rejects.toThrow('insufficient');
  });
});
```

## Common patterns

### Check balance before transaction
```typescript
const utxos = await lucid.wallet.getUtxos();
const balance = utxos.reduce((sum, utxo) => sum + utxo.assets.lovelace, 0n);

if (balance < requiredAmount) {
  throw new Error('Insufficient balance');
}
```

### Wait for confirmation
```typescript
const txHash = await signed.submit();

// Wait for confirmation
await lucid.awaitTx(txHash);
console.log('Transaction confirmed!');
```

### Batch multiple operations
```typescript
const tx = await lucid
  .newTx()
  .pay.ToAddress(address1, assets1)
  .pay.ToAddress(address2, assets2)
  .pay.ToAddress(address3, assets3)
  .complete();
```

## Resources

Reference these instructions:
- `.github/instructions/wallet-integration.instructions.md`
- `.github/instructions/blockchain-testing.instructions.md`

```
