---
description: Cardano node and CLI setup for development
applyTo: "scripts/**/*.sh"
---

# Cardano Infrastructure Setup

This document provides setup instructions for Cardano infrastructure components
needed for development.

## cardano-node installation

### Option 1: Pre-built binaries (Recommended)

```bash
# Download latest release (10.5.1)
wget https://github.com/IntersectMBO/cardano-node/releases/download/10.5.1/cardano-node-10.5.1-linux.tar.gz

# Extract
tar -xzf cardano-node-10.5.1-linux.tar.gz

# Move to PATH
sudo mv cardano-node cardano-cli /usr/local/bin/

# Verify installation
cardano-node version
cardano-cli version
```

### Option 2: Build from source

```bash
# Prerequisites
sudo apt-get update
sudo apt-get install -y \
  automake build-essential pkg-config \
  libffi-dev libgmp-dev libssl-dev \
  libtinfo-dev libsystemd-dev zlib1g-dev \
  make g++ tmux git jq wget libncursesw5 libtool autoconf

# Install GHCup (Haskell toolchain manager)
curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh

# Install GHC 9.6.6 and Cabal 3.10
ghcup install ghc 9.6.6
ghcup install cabal 3.10.3.0
ghcup set ghc 9.6.6
ghcup set cabal 3.10.3.0

# Clone and build cardano-node
git clone https://github.com/IntersectMBO/cardano-node.git
cd cardano-node
git checkout 10.5.1

# Build (takes 30-60 minutes)
cabal update
cabal build all
cabal install cardano-node cardano-cli
```

### Option 3: Nix (for Nix users)

```bash
# With flakes enabled
nix develop github:IntersectMBO/cardano-node/10.5.1

# Or traditional nix-shell
nix-shell https://github.com/IntersectMBO/cardano-node/archive/10.5.1.tar.gz
```

## Network configuration files

### Mainnet

```bash
# Create config directory
mkdir -p ~/.cardano/mainnet
cd ~/.cardano/mainnet

# Download configuration files
wget https://book.world.dev.cardano.org/environments/mainnet/config.json
wget https://book.world.dev.cardano.org/environments/mainnet/topology.json
wget https://book.world.dev.cardano.org/environments/mainnet/byron-genesis.json
wget https://book.world.dev.cardano.org/environments/mainnet/shelley-genesis.json
wget https://book.world.dev.cardano.org/environments/mainnet/alonzo-genesis.json
wget https://book.world.dev.cardano.org/environments/mainnet/conway-genesis.json
```

### Preprod (testnet)

```bash
mkdir -p ~/.cardano/preprod
cd ~/.cardano/preprod

wget https://book.world.dev.cardano.org/environments/preprod/config.json
wget https://book.world.dev.cardano.org/environments/preprod/topology.json
wget https://book.world.dev.cardano.org/environments/preprod/byron-genesis.json
wget https://book.world.dev.cardano.org/environments/preprod/shelley-genesis.json
wget https://book.world.dev.cardano.org/environments/preprod/alonzo-genesis.json
wget https://book.world.dev.cardano.org/environments/preprod/conway-genesis.json
```

### Preview (testnet)

```bash
mkdir -p ~/.cardano/preview
cd ~/.cardano/preview

wget https://book.world.dev.cardano.org/environments/preview/config.json
wget https://book.world.dev.cardano.org/environments/preview/topology.json
wget https://book.world.dev.cardano.org/environments/preview/byron-genesis.json
wget https://book.world.dev.cardano.org/environments/preview/shelley-genesis.json
wget https://book.world.dev.cardano.org/environments/preview/alonzo-genesis.json
wget https://book.world.dev.cardano.org/environments/preview/conway-genesis.json
```

## Running cardano-node

### Start preprod node

```bash
cardano-node run \
  --config ~/.cardano/preprod/config.json \
  --topology ~/.cardano/preprod/topology.json \
  --database-path ~/.cardano/preprod/db \
  --socket-path ~/.cardano/preprod/node.socket \
  --host-addr 0.0.0.0 \
  --port 3001
```

### Background service (systemd)

```bash
# Create service file
sudo nano /etc/systemd/system/cardano-node-preprod.service
```

```ini
[Unit]
Description=Cardano Node (Preprod)
After=network.target

[Service]
Type=simple
User=cardano
Environment="CARDANO_NODE_SOCKET_PATH=/home/cardano/.cardano/preprod/node.socket"
ExecStart=/usr/local/bin/cardano-node run \
  --config /home/cardano/.cardano/preprod/config.json \
  --topology /home/cardano/.cardano/preprod/topology.json \
  --database-path /home/cardano/.cardano/preprod/db \
  --socket-path /home/cardano/.cardano/preprod/node.socket \
  --host-addr 0.0.0.0 \
  --port 3001
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable cardano-node-preprod
sudo systemctl start cardano-node-preprod

# Check status
sudo systemctl status cardano-node-preprod

# View logs
journalctl -u cardano-node-preprod -f
```

## cardano-cli basic usage

### Set environment variable

```bash
# Add to ~/.bashrc or ~/.zshrc
export CARDANO_NODE_SOCKET_PATH="$HOME/.cardano/preprod/node.socket"

# For current session
export CARDANO_NODE_SOCKET_PATH="$HOME/.cardano/preprod/node.socket"
```

### Query blockchain

```bash
# Query tip
cardano-cli query tip --testnet-magic 1

# Query protocol parameters
cardano-cli query protocol-parameters \
  --testnet-magic 1 \
  --out-file protocol.json

# Query UTxOs at address
cardano-cli query utxo \
  --address addr_test1... \
  --testnet-magic 1
```

### Wallet operations

```bash
# Generate payment keys
cardano-cli address key-gen \
  --verification-key-file payment.vkey \
  --signing-key-file payment.skey

# Generate stake keys
cardano-cli stake-address key-gen \
  --verification-key-file stake.vkey \
  --signing-key-file stake.skey

# Build payment address
cardano-cli address build \
  --payment-verification-key-file payment.vkey \
  --stake-verification-key-file stake.vkey \
  --testnet-magic 1 \
  --out-file payment.addr

# Get testnet funds (faucet)
# Visit: https://docs.cardano.org/cardano-testnet/tools/faucet/
```

### Build and submit transaction

```bash
# Query UTxOs
cardano-cli query utxo \
  --address $(cat payment.addr) \
  --testnet-magic 1

# Build transaction
cardano-cli transaction build \
  --tx-in <UTXO_HASH>#<UTXO_INDEX> \
  --tx-out addr_test1...+5000000 \
  --change-address $(cat payment.addr) \
  --testnet-magic 1 \
  --out-file tx.raw

# Sign transaction
cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment.skey \
  --testnet-magic 1 \
  --out-file tx.signed

# Submit transaction
cardano-cli transaction submit \
  --tx-file tx.signed \
  --testnet-magic 1
```

## Aiken installation

### Option 1: Using Cargo (Rust)

```bash
# Install Rust if not already installed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Aiken
cargo install aiken --version 1.1.19

# Verify installation
aiken --version
```

### Option 2: Using npm

```bash
npm install -g @aiken-lang/aiken

# Verify
aiken --version
```

### Option 3: Pre-built binaries

```bash
# Download from releases
wget https://github.com/aiken-lang/aiken/releases/download/v1.1.19/aiken-x86_64-unknown-linux-gnu.tar.gz

# Extract and install
tar -xzf aiken-x86_64-unknown-linux-gnu.tar.gz
sudo mv aiken /usr/local/bin/

# Verify
aiken --version
```

## Aiken project setup

```bash
# Create new project
aiken new my-project
cd my-project

# Project structure created:
# ├── aiken.toml
# ├── lib/
# └── validators/

# Build validators
aiken build

# Run tests
aiken check

# Generate blueprint
aiken build  # Creates plutus.json
```

## Blockfrost API setup

### Get API key

1. Visit [Blockfrost.io](https://blockfrost.io/)
2. Sign up for free account
3. Create project (Preprod/Preview/Mainnet)
4. Copy API key

### Usage with Lucid Evolution

```typescript
import { Lucid, Blockfrost } from '@lucid-evolution/lucid';

const lucid = await Lucid(
  new Blockfrost(
    'https://cardano-preprod.blockfrost.io/api/v0',
    'your-project-id-here'
  ),
  'Preprod'
);
```

### Environment variables

```bash
# .env file
BLOCKFROST_PREPROD_KEY=preprod_xxxxxxxxx
BLOCKFROST_PREVIEW_KEY=preview_xxxxxxxxx
BLOCKFROST_MAINNET_KEY=mainnet_xxxxxxxxx

NEXT_PUBLIC_NETWORK=Preprod
NEXT_PUBLIC_BLOCKFROST_URL=https://cardano-preprod.blockfrost.io/api/v0
```

## Alternative providers

### Koios

```typescript
import { Lucid, Koios } from '@lucid-evolution/lucid';

const lucid = await Lucid(
  new Koios('https://preprod.koios.rest/api/v1'),
  'Preprod'
);
```

### Maestro

```typescript
import { Lucid, Maestro } from '@lucid-evolution/lucid';

const lucid = await Lucid(
  new Maestro({
    network: 'Preprod',
    apiKey: 'your-maestro-key'
  }),
  'Preprod'
);
```

### Kupmios (Local)

```bash
# Start Kupo (indexer)
kupo \
  --node-socket ~/.cardano/preprod/node.socket \
  --node-config ~/.cardano/preprod/config.json \
  --since origin \
  --match "*" \
  --workdir ~/.cardano/preprod/kupo

# Start Ogmios (query layer)
ogmios \
  --node-socket ~/.cardano/preprod/node.socket \
  --node-config ~/.cardano/preprod/config.json \
  --host 0.0.0.0 \
  --port 1337
```

```typescript
import { Lucid, Kupmios } from '@lucid-evolution/lucid';

const lucid = await Lucid(
  new Kupmios(
    'http://localhost:1442',  // Kupo
    'http://localhost:1337'   // Ogmios
  ),
  'Preprod'
);
```

## Docker setup

### cardano-node with Docker

```yaml
# docker-compose.yml
version: '3.8'

services:
  cardano-node:
    image: ghcr.io/intersectmbo/cardano-node:10.5.1
    volumes:
      - ./config:/config
      - ./data:/data
      - ./ipc:/ipc
    environment:
      - CARDANO_NODE_SOCKET_PATH=/ipc/node.socket
    command: run
      --config /config/config.json
      --topology /config/topology.json
      --database-path /data/db
      --socket-path /ipc/node.socket
    ports:
      - "3001:3001"
```

```bash
docker-compose up -d
```

## Development workflow

### Typical development flow

```bash
# 1. Start local node (or use testnet)
cardano-node run ...

# 2. Write validator (Plutus or Aiken)
cd validators/
# ... edit validator.hs or validator.ak ...

# 3. Build and test
# Plutus:
cabal build
cabal test

# Aiken:
aiken build
aiken check

# 4. Build transactions with Lucid Evolution
npm run dev  # Start Next.js dev server

# 5. Test on preprod network
# Deploy -> Test -> Iterate

# 6. Audit and deploy to mainnet
# Follow security checklist
```

## Troubleshooting

### Node won't sync

```bash
# Check logs
journalctl -u cardano-node-preprod -n 100

# Verify socket
ls -la $CARDANO_NODE_SOCKET_PATH

# Check network connectivity
ping relay-preprod.cardano.org
```

### Aiken build errors

```bash
# Clear cache
rm -rf build/

# Update dependencies
aiken packages update

# Rebuild
aiken build --trace-level verbose
```

### Transaction submission fails

```bash
# Query protocol parameters
cardano-cli query protocol-parameters \
  --testnet-magic 1 \
  --out-file protocol.json

# Check UTxO availability
cardano-cli query utxo \
  --address $(cat payment.addr) \
  --testnet-magic 1

# Verify balance
cardano-cli query utxo \
  --address $(cat payment.addr) \
  --testnet-magic 1 | grep lovelace
```

## Resources

- [Cardano Node Documentation](https://github.com/IntersectMBO/cardano-node/tree/master/doc)
- [Cardano Developer Portal](https://developers.cardano.org/)
- [Cardano Book](https://book.world.dev.cardano.org/)
- [Blockfrost Documentation](https://docs.blockfrost.io/)
- [Aiken Installation Guide](https://aiken-lang.org/installation-instructions)

## Learnings

- **Node sync takes hours on first run** - use Blockfrost for development
  (x6)
- **Socket path must be exported** - add to shell config permanently (x4)
- **Preprod is more stable than preview** - use preprod for main testing
  (x5)
- **Aiken is faster to set up than Plutus** - good for quick prototyping
  (x3)
```
