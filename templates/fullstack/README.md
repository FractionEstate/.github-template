# Full-Stack Cardano DApp Template

Complete full-stack application with smart contracts (Aiken/Plutus), Next.js frontend, and Node.js backend.

## Structure

```
fullstack/
├── contracts/               # Smart contracts
│   ├── validators/         # Aiken or Plutus validators
│   └── scripts/            # Deployment scripts
├── frontend/               # Next.js app
│   ├── app/
│   ├── components/
│   └── lib/
├── backend/                # Node.js API
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── shared/                 # Shared types/utils
│   └── types/
└── README.md
```

## Quick Start

```bash
# Copy template
cp -r templates/fullstack/ my-fullstack-dapp/
cd my-fullstack-dapp/

# Set up smart contracts
cd contracts/
aiken build  # Or: cabal build

# Set up backend
cd ../backend/
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev

# Set up frontend
cd ../frontend/
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

## Architecture

### Smart Contracts (`contracts/`)

- **Validators:** Aiken or Plutus smart contracts
- **Deployment:** Scripts to deploy to testnet/mainnet
- **Tests:** Comprehensive test suites

### Frontend (`frontend/`)

- **Framework:** Next.js 15 with App Router
- **Styling:** TailwindCSS
- **Wallet:** CIP-30 integration (Lucid Evolution)
- **State:** React Context or Zustand
- **Types:** TypeScript strict mode

### Backend (`backend/`)

- **Framework:** Express.js + TypeScript
- **API:** RESTful endpoints
- **Services:** Transaction building, monitoring
- **Database:** PostgreSQL (optional)
- **Queue:** Bull/Redis (optional)

### Shared (`shared/`)

- **Types:** TypeScript types shared across frontend/backend
- **Utils:** Common utilities
- **Validators:** Schema validation (Zod)

## Development Workflow

1. **Develop smart contracts:**
   ```bash
   cd contracts/
   aiken build
   aiken check
   ```

2. **Start backend:**
   ```bash
   cd backend/
   npm run dev  # http://localhost:3001
   ```

3. **Start frontend:**
   ```bash
   cd frontend/
   npm run dev  # http://localhost:3000
   ```

4. **Test integration:**
   - Connect wallet
   - Interact with smart contracts via frontend
   - Monitor transactions via backend

## Deployment

### Smart Contracts

```bash
cd contracts/
# Deploy to Preprod first
./scripts/deploy-preprod.sh

# After testing, deploy to Mainnet
./scripts/deploy-mainnet.sh
```

### Backend

```bash
cd backend/
npm run build
npm start  # Or deploy to cloud (Vercel, Railway, etc.)
```

### Frontend

```bash
cd frontend/
npm run build
npm start  # Or deploy to Vercel
```

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BLOCKFROST_URL=https://cardano-preprod.blockfrost.io/api/v0
NEXT_PUBLIC_BLOCKFROST_KEY=your_key
NEXT_PUBLIC_NETWORK=Preprod
```

### Backend (`.env`)

```env
PORT=3001
BLOCKFROST_URL=https://cardano-preprod.blockfrost.io/api/v0
BLOCKFROST_KEY=your_key
NETWORK=Preprod
DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

## Features

- ✅ Smart contract development (Aiken/Plutus)
- ✅ CIP-30 wallet integration
- ✅ Transaction building and signing
- ✅ RESTful API
- ✅ Transaction monitoring
- ✅ TypeScript end-to-end
- ✅ Comprehensive testing
- ✅ CI/CD ready

## Tech Stack

**Contracts:**
- Aiken 1.1.19+ or Plutus (Haskell + GHC 9.6.6)

**Frontend:**
- Next.js 15
- React 19
- Lucid Evolution
- TailwindCSS
- TypeScript

**Backend:**
- Node.js 20+
- Express.js
- Lucid Evolution (server-side)
- TypeScript

**Database (Optional):**
- PostgreSQL
- Prisma ORM

**DevOps:**
- Docker
- GitHub Actions
- Vercel/Railway

## Resources

- [SMART_CONTRACT_GUIDE.md](../../SMART_CONTRACT_GUIDE.md)
- [Wallet Integration](../../.github/instructions/wallet-integration.instructions.md)
- [Testing Guide](../../.github/instructions/testing.instructions.md)

## Support

For help with this template:
- See [CARDANO_SETUP.md](../../CARDANO_SETUP.md)
- Open an issue
- Use Copilot prompts (#validator, #transaction, #wallet-integration)
