---
description: CIP-30 wallet integration and transaction signing
applyTo: "src/**/*.{ts,tsx,js,jsx}"
---

# Wallet Integration

This document provides guidelines for integrating Cardano wallets using
the CIP-30 standard (dApp-Wallet Web Bridge).

## CIP-30 Overview

CIP-30 (<https://cips.cardano.org/cips/cip30/>) defines the standard API
for browser wallet connections, enabling dApps to:

- Request wallet connection
- Get user addresses
- Sign transactions
- Submit transactions to the blockchain

## Supported wallets

CIP-30 compatible wallets include:

- **Nami** - Popular lightweight wallet
- **Eternl** - Feature-rich wallet
- **Flint** - Simple and fast
- **Yoroi** - EMURGO's official wallet
- **Lace** - IOG's latest wallet
- **Typhon** - Advanced wallet with DeFi features
- **Gero** - Multi-chain wallet
- **NuFi** - Institutional-grade wallet

## Wallet detection

Check for available wallets in the browser:

```typescript
// Check if Cardano wallets are available
if (typeof window.cardano !== 'undefined') {
  console.log('Cardano wallets available:', Object.keys(window.cardano));

  // Check specific wallet
  if (window.cardano.nami) {
    console.log('Nami wallet detected');
  }
}
```

## Connection flow

### 1. Request wallet connection

```typescript
async function connectWallet(walletName: string) {
  try {
    // Request access to wallet
    const api = await window.cardano[walletName].enable();

    // Store API reference
    localStorage.setItem('connectedWallet', walletName);

    return api;
  } catch (error) {
    if (error.code === -1) {
      console.error('User declined wallet connection');
    } else if (error.code === -2) {
      console.error('Wallet not found');
    } else {
      console.error('Wallet connection error:', error);
    }
    throw error;
  }
}
```

### 2. Get wallet information

```typescript
async function getWalletInfo(api: any) {
  // Get network ID (0 = testnet, 1 = mainnet)
  const networkId = await api.getNetworkId();

  // Get change address
  const changeAddress = await api.getChangeAddress();

  // Get reward addresses
  const rewardAddresses = await api.getRewardAddresses();

  // Get used addresses
  const usedAddresses = await api.getUsedAddresses();

  // Get UTxOs
  const utxos = await api.getUtxos();

  // Get collateral (for script transactions)
  const collateral = await api.getCollateral();

  return {
    networkId,
    changeAddress,
    rewardAddresses,
    usedAddresses,
    utxos,
    collateral
  };
}
```

## Transaction signing

### Using Lucid Evolution

```typescript
import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

async function signAndSubmitTransaction() {
  // Initialize Lucid with provider
  const lucid = await Lucid(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "your-project-id"
    ),
    "Preprod"
  );

  // Connect wallet
  const api = await window.cardano.nami.enable();
  lucid.selectWalletFromAPI(api);

  // Build transaction
  const tx = await lucid
    .newTx()
    .pay.ToAddress("addr_test1...", { lovelace: 5000000n })
    .complete();

  // Sign transaction (handled by wallet)
  const signedTx = await tx.sign.withWallet().complete();

  // Submit to network
  const txHash = await signedTx.submit();

  console.log('Transaction submitted:', txHash);
  return txHash;
}
```

### Using Mesh SDK

```typescript
import { MeshWallet, BlockfrostProvider, Transaction } from "@meshsdk/core";
import { CardanoWallet } from "@meshsdk/react";

function WalletConnection() {
  return (
    <CardanoWallet
      label="Connect Wallet"
      onConnected={(wallet) => {
        console.log('Connected:', wallet.name);
      }}
    />
  );
}

async function buildTransaction(wallet: MeshWallet) {
  const tx = new Transaction({ initiator: wallet });

  tx.sendLovelace(
    "addr_test1...",
    "5000000"
  );

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  return txHash;
}
```

## Smart contract interactions

### Locking funds in a contract

```typescript
import { Lucid, Data } from "@lucid-evolution/lucid";

// Define datum type
const DatumSchema = Data.Object({
  owner: Data.Bytes(),
  deadline: Data.Integer(),
});
type Datum = Data.Static<typeof DatumSchema>;

async function lockFunds(lucid: Lucid, validatorScript: string) {
  const api = await window.cardano.nami.enable();
  lucid.selectWalletFromAPI(api);

  // Get user's public key hash
  const userAddress = await lucid.wallet.address();
  const userPKH = lucid.utils.getAddressDetails(userAddress).paymentCredential?.hash;

  // Create datum
  const datum: Datum = {
    owner: userPKH!,
    deadline: BigInt(Date.now() + 3600000) // 1 hour from now
  };

  // Get validator address
  const validatorAddress = lucid.utils.validatorToAddress(validatorScript);

  // Build and submit transaction
  const tx = await lucid
    .newTx()
    .pay.ToContract(
      validatorAddress,
      { inline: Data.to(datum, DatumSchema) },
      { lovelace: 10000000n }
    )
    .complete();

  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();

  return txHash;
}
```

### Unlocking funds from contract

```typescript
async function unlockFunds(
  lucid: Lucid,
  validatorScript: string,
  utxo: UTxO
) {
  const api = await window.cardano.nami.enable();
  lucid.selectWalletFromAPI(api);

  // Create redeemer
  const redeemer = Data.to("Unlock");

  // Build transaction
  const tx = await lucid
    .newTx()
    .collectFrom([utxo], redeemer)
    .attachSpendingValidator(validatorScript)
    .addSigner(await lucid.wallet.address())
    .complete();

  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();

  return txHash;
}
```

## Error handling

```typescript
async function safeWalletOperation<T>(
  operation: () => Promise<T>
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    // CIP-30 error codes
    if (error.code === -1) {
      console.error('User declined the request');
    } else if (error.code === -2) {
      console.error('Wallet not found or not accessible');
    } else if (error.code === -3) {
      console.error('Invalid request');
    } else if (error.info === 'User declined tx sign') {
      console.error('User declined transaction signing');
    } else {
      console.error('Wallet operation failed:', error);
    }

    // Show user-friendly message
    showErrorToUser(formatWalletError(error));

    return null;
  }
}
```

## Best practices

### 1. Wallet persistence

```typescript
// Save connected wallet
function saveWalletConnection(walletName: string) {
  localStorage.setItem('connectedWallet', walletName);
}

// Restore wallet connection
async function restoreWalletConnection() {
  const walletName = localStorage.getItem('connectedWallet');
  if (walletName && window.cardano?.[walletName]) {
    try {
      const api = await window.cardano[walletName].enable();
      return api;
    } catch {
      // Clear invalid connection
      localStorage.removeItem('connectedWallet');
      return null;
    }
  }
  return null;
}
```

### 2. Network validation

```typescript
async function validateNetwork(api: any, expectedNetwork: number) {
  const networkId = await api.getNetworkId();

  if (networkId !== expectedNetwork) {
    const networkName = networkId === 1 ? 'mainnet' : 'testnet';
    const expectedName = expectedNetwork === 1 ? 'mainnet' : 'testnet';

    throw new Error(
      `Wrong network: connected to ${networkName}, expected ${expectedName}`
    );
  }

  return true;
}
```

### 3. Collateral handling

```typescript
async function ensureCollateral(api: any) {
  try {
    const collateral = await api.getCollateral();

    if (!collateral || collateral.length === 0) {
      // Guide user to set up collateral
      showCollateralSetupGuide();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Collateral check failed:', error);
    return false;
  }
}
```

### 4. Transaction confirmation

```typescript
async function waitForTransaction(txHash: string, lucid: Lucid) {
  console.log('Awaiting confirmation...');

  await lucid.awaitTx(txHash);

  console.log('Transaction confirmed:', txHash);
  return txHash;
}
```

## Security considerations

⚠️ **Critical security practices:**

1. **Never request unnecessary permissions** - Only ask for what you need
2. **Validate all addresses** - Ensure addresses are valid before sending funds
3. **Check network before transactions** - Prevent testnet/mainnet confusion
4. **Verify transaction details** - Show user exactly what they're signing
5. **Handle rejections gracefully** - User can decline at any time
6. **Never store private keys** - Wallets manage keys, dApps never see them
7. **Use HTTPS only** - Wallet APIs only work over secure connections
8. **Implement timeout** - Don't wait forever for wallet responses

## Testing wallet integration

```typescript
// Mock wallet for testing
const mockWallet = {
  name: 'mockWallet',
  icon: 'data:image/svg+xml,...',
  apiVersion: '1.0.0',

  enable: async () => ({
    getNetworkId: async () => 0,
    getChangeAddress: async () => 'addr_test1...',
    getUtxos: async () => [],
    getCollateral: async () => [],
    signTx: async (tx: string) => tx,
    submitTx: async (tx: string) => 'mock_tx_hash',
  }),

  isEnabled: async () => true,
};

// Use in tests
if (process.env.NODE_ENV === 'test') {
  window.cardano = { mockWallet };
}
```

## Resources

<!-- markdownlint-disable MD013 -->
- CIP-30 Specification: <https://cips.cardano.org/cips/cip30/>
- Lucid Evolution Documentation: <https://anastasia-labs.github.io/lucid-evolution/>
- Mesh SDK Wallet Docs: <https://meshjs.dev/apis/wallets>
- Cardano Wallet Connector Examples: <https://developers.cardano.org/docs/integrate-cardano/user-wallet-authentication>
<!-- markdownlint-enable MD013 -->

## Learnings

- **Always check if wallet API is available before calling**: Users might
  not have wallets installed (x5).
- **Collateral is required for script transactions**: Guide users to set
  it up (x4).
- **Network mismatch is common**: Validate the network before every
  transaction (x6).
- **Users expect transaction previews**: Show clear details before
  signing (x3).
