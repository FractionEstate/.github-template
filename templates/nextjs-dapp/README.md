# Next.js DApp Template

A Next.js 15 DApp template with Lucid Evolution and CIP-30 wallet integration.

## Structure

```
nextjs-dapp/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
├── components/
│   ├── WalletConnect.tsx
│   └── TransactionBuilder.tsx
├── lib/
│   ├── lucid.ts
│   └── validators.ts
├── public/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Quick Start

```bash
# Copy template
cp -r templates/nextjs-dapp/ my-dapp/
cd my-dapp/

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Blockfrost API key

# Run development server
npm run dev

# Open http://localhost:3000
```

## Environment Variables

```env
NEXT_PUBLIC_BLOCKFROST_URL=https://cardano-preprod.blockfrost.io/api/v0
NEXT_PUBLIC_BLOCKFROST_KEY=your_api_key_here
NEXT_PUBLIC_NETWORK=Preprod
```

## Features

- ✅ CIP-30 wallet connection (Nami, Eternl, Lace, etc.)
- ✅ Lucid Evolution integration
- ✅ Transaction building and signing
- ✅ TypeScript strict mode
- ✅ TailwindCSS styling
- ✅ Error handling
- ✅ Loading states

## Development

See [SMART_CONTRACT_GUIDE.md](../../SMART_CONTRACT_GUIDE.md) for off-chain integration examples.

## Resources

- [Lucid Evolution](https://github.com/Anastasia-Labs/lucid-evolution)
- [Next.js Docs](https://nextjs.org/docs)
- [Wallet Integration Guide](../../.github/instructions/wallet-integration.instructions.md)
