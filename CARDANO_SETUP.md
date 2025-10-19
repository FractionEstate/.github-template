# Cardano Development Environment Setup

Complete guide for setting up a Cardano development environment for smart contracts (Plutus/Aiken) and DApp development.

## Table of Contents

- [Prerequisites](#prerequisites)
- [cardano-node Installation](#cardano-node-installation)
- [Aiken Installation](#aiken-installation)
- [Plutus/Haskell Setup](#plutushaskell-setup)
- [DApp Development Tools](#dapp-development-tools)
- [Network Configuration](#network-configuration)
- [Provider Setup](#provider-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

**Minimum:**
- **RAM:** 16 GB (24 GB recommended for cardano-node)
- **Storage:** 150 GB free (for mainnet blockchain data)
- **CPU:** 4 cores (8 cores recommended)
- **OS:** Linux (Ubuntu 22.04+), macOS (11+), Windows (WSL2)

### Base Tools

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y \
  build-essential \
  curl \
  git \
  jq \
  libffi-dev \
  libgmp-dev \
  libncursesw5 \
  libssl-dev \
  libtinfo-dev \
  pkg-config \
  zlib1g-dev

# macOS
brew install \
  autoconf \
  automake \
  gmp \
  jq \
  libsodium \
  libtool \
  pkg-config
```

## cardano-node Installation

**Version:** 10.5.1+ (Latest: [IntersectMBO/cardano-node](https://github.com/IntersectMBO/cardano-node/releases))

### Method 1: Pre-built Binaries (Fastest)

```bash
# Download latest release
CARDANO_VERSION="10.5.1"
curl -L -o cardano-node.tar.gz \
  "https://github.com/IntersectMBO/cardano-node/releases/download/${CARDANO_VERSION}/cardano-node-${CARDANO_VERSION}-linux.tar.gz"

# Extract to /usr/local/bin
sudo tar -xzf cardano-node.tar.gz -C /usr/local/bin/

# Verify installation
cardano-node version
cardano-cli version
```

### Method 2: Build from Source (Recommended for Development)

```bash
# Install GHC and Cabal via GHCup (see Plutus/Haskell Setup below)

# Clone repository
git clone https://github.com/IntersectMBO/cardano-node.git
cd cardano-node
git checkout tags/10.5.1

# Build (takes 30-60 minutes)
cabal update
cabal build all

# Install to ~/.local/bin
cabal install cardano-node cardano-cli --installdir=$HOME/.local/bin

# Add to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Method 3: Docker (Easiest for Testing)

```bash
# Pull official image
docker pull ghcr.io/intersectmbo/cardano-node:10.5.1

# Run node (preprod example)
docker run -d \
  --name cardano-node \
  -v cardano-data:/data \
  -p 3001:3001 \
  ghcr.io/intersectmbo/cardano-node:10.5.1 \
  run \
  --config /config/preprod/config.json \
  --topology /config/preprod/topology.json \
  --database-path /data/db \
  --socket-path /data/node.socket
```

### Node Configuration Files

Download network configurations:

```bash
# Create config directory
mkdir -p ~/.cardano

# Preprod (Testnet)
curl -O -J https://book.world.dev.cardano.org/environments/preprod/config.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/topology.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/byron-genesis.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/shelley-genesis.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/alonzo-genesis.json
curl -O -J https://book.world.dev.cardano.org/environments/preprod/conway-genesis.json

mv *.json ~/.cardano/preprod/

# Preview (Testnet)
# Similar commands for preview network
mkdir -p ~/.cardano/preview
# ... download preview configs

# Mainnet
mkdir -p ~/.cardano/mainnet
# ... download mainnet configs
```

### Start Node

```bash
# Preprod (recommended for development)
cardano-node run \
  --config ~/.cardano/preprod/config.json \
  --topology ~/.cardano/preprod/topology.json \
  --database-path ~/.cardano/preprod/db \
  --socket-path ~/.cardano/preprod/node.socket \
  --port 3001

# Set environment variable
export CARDANO_NODE_SOCKET_PATH="$HOME/.cardano/preprod/node.socket"
echo 'export CARDANO_NODE_SOCKET_PATH="$HOME/.cardano/preprod/node.socket"' >> ~/.bashrc
```

**Note:** Initial sync takes 2-6 hours (preprod) or 24-48 hours (mainnet).

## Aiken Installation

**Version:** 1.1.19+ (Latest: [aiken-lang/aiken](https://github.com/aiken-lang/aiken/releases))

### Method 1: aikup (Recommended)

```bash
# Install aikup (Aiken installer)
curl --proto '=https' --tlsv1.2 -LsSf https://install.aiken-lang.org | sh

# Install latest Aiken
aikup install latest

# Verify installation
aiken --version  # Should show v1.1.19+
```

### Method 2: Pre-built Binaries

```bash
# Download latest release
AIKEN_VERSION="v1.1.19"
curl -L -o aiken-x86_64-unknown-linux-gnu.tar.gz \
  "https://github.com/aiken-lang/aiken/releases/download/${AIKEN_VERSION}/aiken-x86_64-unknown-linux-gnu.tar.gz"

# Extract to /usr/local/bin
sudo tar -xzf aiken-x86_64-unknown-linux-gnu.tar.gz -C /usr/local/bin/

# Verify
aiken --version
```

### Method 3: Build from Source

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Clone and build
git clone https://github.com/aiken-lang/aiken.git
cd aiken
git checkout v1.1.19
cargo install --path .

# Verify
aiken --version
```

### Aiken Language Server (LSP)

```bash
# Install Aiken LSP (included with Aiken 1.1.19+)
aiken lsp --help

# VS Code extension (install via Extensions view)
# Search: "Aiken" by TxPipe
# Or: code --install-extension txpipe.aiken
```

## Plutus/Haskell Setup

**GHC Version:** 9.6.6 or 9.8.2
**Cabal Version:** 3.10+
**Plutus Version:** 1.54.0.0

### GHCup (Haskell Toolchain Manager)

```bash
# Install GHCup
curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh

# Follow prompts to add to PATH
source ~/.bashrc

# Install GHC 9.6.6 (recommended for Plutus)
ghcup install ghc 9.6.6
ghcup set ghc 9.6.6

# Install Cabal 3.10+
ghcup install cabal 3.10.3.0
ghcup set cabal 3.10.3.0

# Install HLS (Haskell Language Server)
ghcup install hls 2.9.0.1
ghcup set hls 2.9.0.1

# Verify
ghc --version      # Should show 9.6.6
cabal --version    # Should show 3.10.3.0
haskell-language-server-wrapper --version
```

### Plutus Dependencies

```bash
# Update Cabal package list
cabal update

# Install common Plutus dependencies
cabal install \
  plutus-ledger-api-1.54.0.0 \
  plutus-tx-1.54.0.0 \
  plutus-tx-plugin-1.54.0.0 \
  plutus-script-utils-3.4.0 \
  cardano-api-9.4.1.0

# Create cabal.project.freeze for reproducible builds
# (This will be project-specific)
```

### Haskell LSP Configuration

Create `.vscode/settings.json` (see Task 18 for full configuration):

```json
{
  "haskell.plugin.ghcide.globalOn": true,
  "haskell.plugin.hlint.globalOn": true,
  "haskell.serverExecutablePath": "haskell-language-server-wrapper"
}
```

## DApp Development Tools

### Node.js and npm

```bash
# Install Node.js 20.x LTS (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc

nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Lucid Evolution

```bash
# Install in your project
npm install @lucid-evolution/lucid@latest

# Or with Yarn
yarn add @lucid-evolution/lucid@latest

# Verify version
npm list @lucid-evolution/lucid
```

**Repository:** [Anastasia-Labs/lucid-evolution](https://github.com/Anastasia-Labs/lucid-evolution)

### Mesh SDK

```bash
# Install Mesh (React/Svelte components)
npm install @meshsdk/core@1.8.0 @meshsdk/react@1.8.0

# Verify
npm list @meshsdk/core
```

### cardano-serialization-lib (CSL)

```bash
# Install CSL (low-level transaction building)
npm install @emurgo/cardano-serialization-lib-browser@latest
npm install @emurgo/cardano-serialization-lib-nodejs@latest
```

## Network Configuration

### Network Magic Numbers

```typescript
// Network identifiers
const NETWORKS = {
  MAINNET: 764824073,
  PREPROD: 1,
  PREVIEW: 2,
  SANCHO: 4,        // Governance testnet
  GUILNET: 1097911063,
  VASIL_DEV: 9,
};

// Use in Lucid Evolution
import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

const lucid = await Lucid(
  new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "YOUR_API_KEY"),
  "Preprod" // "Mainnet" | "Preprod" | "Preview"
);
```

### Network Endpoints

**Preprod (Recommended for Development):**
```bash
# Node socket
export CARDANO_NODE_SOCKET_PATH="$HOME/.cardano/preprod/node.socket"

# Network magic
export CARDANO_NETWORK_MAGIC=1

# Testnet magic flag
--testnet-magic 1
```

**Preview (Latest Features):**
```bash
export CARDANO_NODE_SOCKET_PATH="$HOME/.cardano/preview/node.socket"
export CARDANO_NETWORK_MAGIC=2
```

**Mainnet (Production):**
```bash
export CARDANO_NODE_SOCKET_PATH="$HOME/.cardano/mainnet/node.socket"
export CARDANO_NETWORK_MAGIC=764824073
```

## Provider Setup

### Blockfrost (Recommended)

1. **Sign up:** [https://blockfrost.io](https://blockfrost.io)
2. **Create project:** Select network (Preprod, Preview, or Mainnet)
3. **Copy API key:** Save to `.env`

```bash
# .env
BLOCKFROST_PROJECT_ID_PREPROD="preprodXXXXXXXXXXXXXXXX"
BLOCKFROST_PROJECT_ID_MAINNET="mainnetXXXXXXXXXXXXXXXX"
```

**Usage in Lucid Evolution:**
```typescript
import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

const lucid = await Lucid(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    process.env.BLOCKFROST_PROJECT_ID_PREPROD
  ),
  "Preprod"
);
```

### Koios (Free, No API Key)

```typescript
import { Lucid, Koios } from "@lucid-evolution/lucid";

const lucid = await Lucid(
  new Koios("https://preprod.koios.rest/api/v1"),
  "Preprod"
);
```

**Endpoints:**
- Preprod: `https://preprod.koios.rest/api/v1`
- Preview: `https://preview.koios.rest/api/v1`
- Mainnet: `https://api.koios.rest/api/v1`

### Maestro

1. **Sign up:** [https://www.gomaestro.org](https://www.gomaestro.org)
2. **Get API key**
3. **Use in Lucid Evolution:**

```typescript
import { Lucid, Maestro } from "@lucid-evolution/lucid";

const lucid = await Lucid(
  new Maestro({
    network: "Preprod",
    apiKey: process.env.MAESTRO_API_KEY,
  }),
  "Preprod"
);
```

### Kupmios (Self-Hosted)

Run your own Ogmios + Kupo stack:

```bash
# Using Docker Compose
version: "3.8"
services:
  cardano-node:
    image: ghcr.io/intersectmbo/cardano-node:10.5.1
    volumes:
      - cardano-node-data:/data
    # ... config

  ogmios:
    image: cardanosolutions/ogmios:v6.8.0
    depends_on:
      - cardano-node
    ports:
      - "1337:1337"

  kupo:
    image: cardanosolutions/kupo:v2.9.2
    depends_on:
      - cardano-node
    ports:
      - "1442:1442"
```

**Usage:**
```typescript
import { Lucid, Kupmios } from "@lucid-evolution/lucid";

const lucid = await Lucid(
  new Kupmios(
    "http://localhost:1337", // Ogmios
    "http://localhost:1442"  // Kupo
  ),
  "Preprod"
);
```

## Verification

### Test cardano-cli

```bash
# Query tip (requires synced node)
cardano-cli query tip --testnet-magic 1

# Expected output:
# {
#   "block": 12345678,
#   "epoch": 123,
#   "era": "Conway",
#   "hash": "abc123...",
#   "slot": 12345678,
#   "slotInEpoch": 12345,
#   "slotsToEpochEnd": 12345,
#   "syncProgress": "100.00"
# }
```

### Test Aiken

```bash
# Create new project
mkdir test-validator
cd test-validator
aiken new test-project

# Build
cd test-project
aiken build

# Run tests
aiken check

# Expected: "All tests passed"
```

### Test Plutus

```bash
# Create new Cabal project
cabal init -n --is-executable -p test-plutus

# Add Plutus dependencies to test-plutus.cabal
# build-depends:
#   base,
#   plutus-ledger-api,
#   plutus-tx,
#   plutus-tx-plugin

# Build
cabal build

# Run
cabal run test-plutus
```

### Test Lucid Evolution

```bash
# Create Node.js test
mkdir test-lucid && cd test-lucid
npm init -y
npm install @lucid-evolution/lucid

# Create test.js
cat > test.js << 'EOF'
import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

const lucid = await Lucid(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    "YOUR_API_KEY"
  ),
  "Preprod"
);

console.log("Lucid Evolution initialized successfully!");
console.log("Network:", lucid.config().network);
EOF

# Run (with ES modules)
node --input-type=module test.js
```

## Troubleshooting

### cardano-node Won't Start

**Issue:** Node fails to start or crashes immediately

**Solutions:**
1. Check config files exist: `ls ~/.cardano/preprod/*.json`
2. Verify sufficient disk space: `df -h`
3. Check socket path permissions: `ls -l $CARDANO_NODE_SOCKET_PATH`
4. View logs: `journalctl -u cardano-node -f` (if running as service)

### Aiken Build Fails

**Issue:** `aiken build` fails with dependency errors

**Solutions:**
1. Update Aiken: `aikup install latest`
2. Clear build cache: `rm -rf build/`
3. Check `aiken.toml` dependencies
4. Verify Rust version: `rustc --version` (1.75+)

### Plutus Compilation Errors

**Issue:** GHC fails to compile Plutus code

**Solutions:**
1. Verify GHC version: `ghc --version` (9.6.6 or 9.8.2)
2. Update Cabal: `cabal update`
3. Check plutus-tx-plugin is enabled:
   ```haskell
   {-# OPTIONS_GHC -fplugin PlutusTx.Plugin #-}
   ```
4. Clear build cache: `cabal clean && cabal build`

### Lucid Evolution Provider Issues

**Issue:** Provider connection fails or times out

**Solutions:**
1. Verify API key: Check Blockfrost/Maestro dashboard
2. Check network endpoint: `curl https://cardano-preprod.blockfrost.io/api/v0/health`
3. Test with Koios (no API key): Switch provider temporarily
4. Check firewall/proxy settings

### Node Sync Stuck

**Issue:** cardano-node stops syncing

**Solutions:**
1. Check disk space: `df -h` (need 20+ GB free)
2. Restart node: `sudo systemctl restart cardano-node`
3. Update topology: Download latest `topology.json`
4. Check network connectivity: `ping relay.preprod.cardano.org`

### HLS (Haskell Language Server) Not Working

**Issue:** VS Code doesn't show Haskell completions

**Solutions:**
1. Verify HLS installed: `haskell-language-server-wrapper --version`
2. Check VS Code output: View → Output → Haskell
3. Restart HLS: Command Palette → "Haskell: Restart Haskell LSP Server"
4. Match GHC version: `ghcup list` (HLS must support your GHC version)

## Next Steps

1. **Choose your path:**
   - Smart Contracts: See [SMART_CONTRACT_GUIDE.md](SMART_CONTRACT_GUIDE.md)
   - DApp Development: See README.md → Usage Examples
   - Full-Stack: Combine both approaches

2. **Set up IDE:**
   - Install VS Code extensions (see `.vscode/extensions.json`)
   - Configure LSP settings (see `.vscode/settings.json`)

3. **Start building:**
   - Use `#validator` prompt for smart contracts
   - Use `#transaction` prompt for transactions
   - Use `#wallet-integration` for CIP-30 wallets

4. **Test on testnet:**
   - Get test ADA: [Preprod Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet/)
   - Deploy to preprod first
   - Run security audit before mainnet

## Resources

- **Official Docs:** [docs.cardano.org](https://docs.cardano.org)
- **Aiken Docs:** [aiken-lang.org](https://aiken-lang.org)
- **Plutus Docs:** [plutus.readthedocs.io](https://plutus.readthedocs.io)
- **Lucid Evolution:** [github.com/Anastasia-Labs/lucid-evolution](https://github.com/Anastasia-Labs/lucid-evolution)
- **Mesh Docs:** [meshjs.dev](https://meshjs.dev)
- **CIPs:** [cips.cardano.org](https://cips.cardano.org)
- **Testnet Faucet:** [docs.cardano.org/cardano-testnets/tools/faucet](https://docs.cardano.org/cardano-testnets/tools/faucet)
- **Blockfrost:** [blockfrost.io](https://blockfrost.io)
- **Koios:** [koios.rest](https://koios.rest)

## Support

- **GitHub Issues:** [.github/ISSUE_TEMPLATE/](../.github/ISSUE_TEMPLATE/)
- **CIP Questions:** Use `#cip-lookup` prompt
- **Security Issues:** Use `#security-audit` prompt or [SECURITY.md](SECURITY.md)
