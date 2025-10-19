---
mode: agent
description: 'Integrate CIP-30 wallet connection (Nami, Eternl, Lace, etc.)'
tools: ['new', 'edit', 'search']
---
Generate wallet integration code following CIP-30 standard.

## Process

1. **Clarify requirements**:
   - Framework (React, Next.js, Svelte, Vue, vanilla JS)
   - Wallets to support (Nami, Eternl, Lace, Yoroi, Flint, Typhon, Gero, NuFi)
   - Network (mainnet, preprod, preview)
   - State management (React Context, Zustand, Redux, none)

2. **Generate wallet detection**:

   ```typescript
   interface Wallet {
     name: string;
     icon: string;
     apiVersion: string;
     enable(): Promise<WalletAPI>;
     isEnabled(): Promise<boolean>;
   }

   function getAvailableWallets(): string[] {
     const wallets: string[] = [];

     if (window.cardano?.nami) wallets.push('nami');
     if (window.cardano?.eternl) wallets.push('eternl');
     if (window.cardano?.lace) wallets.push('lace');
     if (window.cardano?.yoroi) wallets.push('yoroi');
     if (window.cardano?.flint) wallets.push('flint');
     if (window.cardano?.typhon) wallets.push('typhon');
     if (window.cardano?.gerowallet) wallets.push('gerowallet');
     if (window.cardano?.nufi) wallets.push('nufi');

     return wallets;
   }
   ```

3. **Generate connection component** (React):

   ```typescript
   import { useState, useEffect } from 'react';
   import { Lucid, Blockfrost } from '@lucid-evolution/lucid';

   export function WalletConnect() {
     const [wallets, setWallets] = useState<string[]>([]);
     const [connected, setConnected] = useState<string | null>(null);
     const [address, setAddress] = useState<string>('');
     const [lucid, setLucid] = useState<Lucid | null>(null);

     useEffect(() => {
       setWallets(getAvailableWallets());
     }, []);

     async function connectWallet(walletName: string) {
       try {
         const lucidInstance = await Lucid(
           new Blockfrost(
             'https://cardano-mainnet.blockfrost.io/api/v0',
             process.env.NEXT_PUBLIC_BLOCKFROST_KEY!
           ),
           'Mainnet'
         );

         const api = await window.cardano[walletName].enable();
         lucidInstance.selectWallet.fromAPI(api);

         const addr = await lucidInstance.wallet.address();
         const network = await lucidInstance.wallet.network();

         if (network !== 1) {
           throw new Error('Please switch to mainnet');
         }

         setLucid(lucidInstance);
         setConnected(walletName);
         setAddress(addr);

         // Persist connection
         localStorage.setItem('wallet', walletName);
       } catch (error) {
         console.error(`Failed to connect ${walletName}:`, error);
         alert(error.message);
       }
     }

     async function disconnectWallet() {
       setConnected(null);
       setAddress('');
       setLucid(null);
       localStorage.removeItem('wallet');
     }

     // Auto-reconnect on page load
     useEffect(() => {
       const savedWallet = localStorage.getItem('wallet');
       if (savedWallet && wallets.includes(savedWallet)) {
         connectWallet(savedWallet);
       }
     }, [wallets]);

     if (connected) {
       return (
         <div>
           <p>Connected: {connected}</p>
           <p>Address: {address.slice(0, 10)}...{address.slice(-10)}</p>
           <button onClick={disconnectWallet}>Disconnect</button>
         </div>
       );
     }

     return (
       <div>
         <h3>Connect Wallet</h3>
         {wallets.length === 0 && (
           <p>No wallets found. Please install Nami, Eternl, or Lace.</p>
         )}
         {wallets.map(wallet => (
           <button key={wallet} onClick={() => connectWallet(wallet)}>
             Connect {wallet}
           </button>
         ))}
       </div>
     );
   }
   ```

4. **Generate wallet context** (React Context):

   ```typescript
   import { createContext, useContext, useState, useEffect } from 'react';
   import { Lucid, Blockfrost } from '@lucid-evolution/lucid';

   interface WalletContextType {
     lucid: Lucid | null;
     address: string | null;
     connected: string | null;
     connect: (wallet: string) => Promise<void>;
     disconnect: () => void;
   }

   const WalletContext = createContext<WalletContextType | null>(null);

   export function WalletProvider({ children }: { children: React.ReactNode }) {
     const [lucid, setLucid] = useState<Lucid | null>(null);
     const [address, setAddress] = useState<string | null>(null);
     const [connected, setConnected] = useState<string | null>(null);

     async function connect(walletName: string) {
       const lucidInstance = await Lucid(
         new Blockfrost(
           process.env.NEXT_PUBLIC_BLOCKFROST_URL!,
           process.env.NEXT_PUBLIC_BLOCKFROST_KEY!
         ),
         'Mainnet'
       );

       const api = await window.cardano[walletName].enable();
       lucidInstance.selectWallet.fromAPI(api);

       const addr = await lucidInstance.wallet.address();

       setLucid(lucidInstance);
       setAddress(addr);
       setConnected(walletName);
       localStorage.setItem('wallet', walletName);
     }

     function disconnect() {
       setLucid(null);
       setAddress(null);
       setConnected(null);
       localStorage.removeItem('wallet');
     }

     return (
       <WalletContext.Provider value={{ lucid, address, connected, connect, disconnect }}>
         {children}
       </WalletContext.Provider>
     );
   }

   export function useWallet() {
     const context = useContext(WalletContext);
     if (!context) throw new Error('useWallet must be used within WalletProvider');
     return context;
   }
   ```

5. **Usage in components**:

   ```typescript
   import { useWallet } from '@/contexts/WalletContext';

   export function SendADA() {
     const { lucid, address } = useWallet();

     if (!lucid || !address) {
       return <p>Please connect your wallet</p>;
     }

     async function sendPayment() {
       try {
         const tx = await lucid
           .newTx()
           .pay.ToAddress(recipientAddress, { lovelace: 5000000n })
           .complete();

         const signed = await tx.sign.withWallet().complete();
         const txHash = await signed.submit();

         alert(`Payment sent! Tx: ${txHash}`);
       } catch (error) {
         console.error(error);
         alert('Transaction failed');
       }
     }

     return (
       <div>
         <p>Your address: {address}</p>
         <button onClick={sendPayment}>Send 5 ADA</button>
       </div>
     );
   }
   ```

6. **Error handling**:

   ```typescript
   async function connectWallet(walletName: string) {
     try {
       const api = await window.cardano[walletName].enable();
       // ... rest of connection
     } catch (error) {
       if (error.code === -2) {
         alert('User declined connection');
       } else if (error.code === -1) {
         alert('Wallet not found or disabled');
       } else if (error.message.includes('network')) {
         alert('Please switch to the correct network');
       } else {
         alert(`Connection failed: ${error.message}`);
       }
     }
   }
   ```

7. **Network validation**:

   ```typescript
   async function validateNetwork(lucid: Lucid, expectedNetwork: 'Mainnet' | 'Preprod') {
     const network = await lucid.wallet.network();
     const expected = expectedNetwork === 'Mainnet' ? 1 : 0;

     if (network !== expected) {
       throw new Error(
         `Wrong network. Expected ${expectedNetwork}, got ${network === 1 ? 'Mainnet' : 'Testnet'}`
       );
     }
   }
   ```

## TypeScript declarations

Add to `types/cardano.d.ts`:

```typescript
interface Window {
  cardano?: {
    nami?: Wallet;
    eternl?: Wallet;
    lace?: Wallet;
    yoroi?: Wallet;
    flint?: Wallet;
    typhon?: Wallet;
    gerowallet?: Wallet;
    nufi?: Wallet;
  };
}

interface Wallet {
  enable(): Promise<WalletAPI>;
  isEnabled(): Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
}

interface WalletAPI {
  getNetworkId(): Promise<number>;
  getUtxos(): Promise<string[] | undefined>;
  getBalance(): Promise<string>;
  getUsedAddresses(): Promise<string[]>;
  getUnusedAddresses(): Promise<string[]>;
  getChangeAddress(): Promise<string>;
  getRewardAddresses(): Promise<string[]>;
  signTx(tx: string, partialSign: boolean): Promise<string>;
  signData(addr: string, payload: string): Promise<{ signature: string; key: string }>;
  submitTx(tx: string): Promise<string>;
}
```

## Testing

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Wallet Integration', () => {
  beforeEach(() => {
    // Mock wallet
    window.cardano = {
      nami: {
        enable: async () => ({
          getNetworkId: async () => 1,
          getUsedAddresses: async () => ['addr1...']
        }),
        isEnabled: async () => false,
        apiVersion: '0.1.0',
        name: 'Nami',
        icon: 'data:image/svg+xml,...'
      }
    };
  });

  it('should detect available wallets', () => {
    const wallets = getAvailableWallets();
    expect(wallets).toContain('nami');
  });

  it('should connect to wallet', async () => {
    render(<WalletConnect />);
    const connectButton = screen.getByText('Connect nami');
    await fireEvent.click(connectButton);
    expect(screen.getByText(/Connected:/)).toBeInTheDocument();
  });
});
```

## Best practices

1. **Validate network** on every transaction
2. **Persist wallet choice** in localStorage
3. **Auto-reconnect** on page load
4. **Show clear errors** for network mismatch
5. **Request collateral** for script interactions
6. **Handle wallet lock** (user might lock wallet mid-session)

## Resources

Reference:
- `.github/instructions/wallet-integration.instructions.md`
- `.github/instructions/cip-compliance.instructions.md` (CIP-30 section)

```
