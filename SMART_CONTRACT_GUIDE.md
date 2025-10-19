# Cardano Smart Contract Development Guide

Comprehensive guide for writing, testing, and deploying Cardano smart contracts using **Plutus (Haskell)** and **Aiken**.

## Table of Contents

- [Overview](#overview)
- [Choosing a Language](#choosing-a-language)
- [Plutus Development](#plutus-development)
  - [Simple Validator](#plutus-simple-validator)
  - [Lock and Unlock](#plutus-lock-and-unlock)
  - [NFT Minting](#plutus-nft-minting)
  - [Testing](#plutus-testing)
  - [Deployment](#plutus-deployment)
- [Aiken Development](#aiken-development)
  - [Simple Validator](#aiken-simple-validator)
  - [Lock and Unlock](#aiken-lock-and-unlock)
  - [NFT Minting](#aiken-nft-minting)
  - [Testing](#aiken-testing)
  - [Deployment](#aiken-deployment)
- [Off-Chain Integration](#off-chain-integration)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Security Checklist](#security-checklist)

## Overview

Cardano smart contracts (validators) are programs that run on-chain to validate transactions. They check conditions before allowing funds to be spent or tokens to be minted.

### Key Concepts

- **Validator:** Smart contract that validates spending conditions
- **Datum:** Data attached to UTXOs (on-chain state)
- **Redeemer:** Data provided when spending (like function arguments)
- **Script Context:** Transaction information available to validator
- **UTXO Model:** Unspent Transaction Output model (vs. account-based)

### Language Comparison

| Feature | Plutus (Haskell) | Aiken |
|---------|------------------|-------|
| **Maturity** | Established (2021) | Newer (2023) |
| **Syntax** | Haskell | Rust-like |
| **Type System** | Advanced Haskell | Simpler, Rust-inspired |
| **Tooling** | GHC, Cabal, HLS | Aiken CLI, LSP |
| **Learning Curve** | Steep | Moderate |
| **Performance** | Excellent | Excellent |
| **Community** | Large | Growing |
| **Best For** | Complex logic, DeFi | Rapid development, NFTs |

## Choosing a Language

**Choose Plutus if:**
- Complex business logic or DeFi protocols
- Need advanced type system features
- Team has Haskell experience
- Building on existing Plutus libraries

**Choose Aiken if:**
- Faster development cycle
- Simpler syntax preferred
- NFT or token projects
- Team new to Cardano development

**Both are production-ready and fully supported.**

## Plutus Development

### Prerequisites

```bash
# Install GHCup and GHC 9.6.6 (see CARDANO_SETUP.md)
ghcup install ghc 9.6.6
ghcup set ghc 9.6.6

# Install Cabal
ghcup install cabal 3.10.3.0

# Verify
ghc --version  # 9.6.6
cabal --version  # 3.10.3.0
```

### Plutus Simple Validator

**Goal:** Create a validator that always succeeds (useful for testing).

**File:** `validators/AlwaysSucceeds.hs`

```haskell
{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE ImportQualifiedPost #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE TemplateHaskell     #-}

module AlwaysSucceeds where

import PlutusLedgerApi.V3
import PlutusTx
import PlutusTx.Prelude

-- | Validator that always succeeds
{-# INLINABLE mkValidator #-}
mkValidator :: BuiltinData -> BuiltinData -> ScriptContext -> Bool
mkValidator _ _ _ = True

-- | Compile to Plutus Core
validator :: Validator
validator = mkValidatorScript $$(compile [|| mkValidator ||])

-- | Get validator hash
validatorHash :: ValidatorHash
validatorHash = validatorHash validator

-- | Get script address
scriptAddress :: Address
scriptAddress = scriptHashAddress validatorHash
```

**Build and serialize:**

```bash
# cabal.project
packages: .

-- Plutus dependencies
source-repository-package
  type: git
  location: https://github.com/IntersectMBO/plutus
  tag: v1.54.0.0
  subdir:
    plutus-core
    plutus-ledger-api
    plutus-tx
    plutus-tx-plugin

# Build
cabal build

# Serialize to file
cabal run serialize -- --validator AlwaysSucceeds --output always-succeeds.plutus
```

### Plutus Lock and Unlock

**Goal:** Validator that checks a secret (datum) matches redeemer.

**File:** `validators/SecretLock.hs`

```haskell
{-# LANGUAGE DataKinds         #-}
{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE TemplateHaskell   #-}
{-# LANGUAGE TypeApplications  #-}

module SecretLock where

import PlutusLedgerApi.V3
import PlutusTx
import PlutusTx.Prelude

-- | Datum: secret hash stored on-chain
newtype Secret = Secret { secretHash :: BuiltinByteString }
PlutusTx.unstableMakeIsData ''Secret

-- | Redeemer: secret value to unlock
newtype SecretGuess = SecretGuess { guess :: BuiltinByteString }
PlutusTx.unstableMakeIsData ''SecretGuess

-- | Validator: Check if hash(guess) == secretHash
{-# INLINABLE mkValidator #-}
mkValidator :: Secret -> SecretGuess -> ScriptContext -> Bool
mkValidator (Secret hash) (SecretGuess g) _ =
  traceIfFalse "Wrong secret!" (sha2_256 g == hash)

-- | Compile validator
validator :: Validator
validator = mkValidatorScript $$(compile [|| mkValidator ||])
```

**Usage (off-chain):**

```typescript
// Lock funds with secret
const secret = "my-secret-password";
const secretHash = sha256(secret);

const tx = await lucid
  .newTx()
  .pay.ToAddressWithData(
    scriptAddress,
    { kind: "inline", value: { secretHash } },  // Datum
    { lovelace: 10_000_000n }
  )
  .complete();

const signedTx = await tx.sign.withWallet().complete();
await signedTx.submit();

// Unlock funds
const utxos = await lucid.utxosAt(scriptAddress);
const txUnlock = await lucid
  .newTx()
  .collectFrom(utxos, { guess: secret })  // Redeemer
  .attach.SpendingValidator(validator)
  .complete();

const signedUnlock = await txUnlock.sign.withWallet().complete();
await signedUnlock.submit();
```

### Plutus NFT Minting

**Goal:** Minting policy that ensures one-time NFT creation.

**File:** `validators/NFTPolicy.hs`

```haskell
{-# LANGUAGE DataKinds         #-}
{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE TemplateHaskell   #-}

module NFTPolicy where

import PlutusLedgerApi.V3
import PlutusTx
import PlutusTx.Prelude

-- | Redeemer: token name to mint
newtype MintRedeemer = MintRedeemer { tokenName :: TokenName }
PlutusTx.unstableMakeIsData ''MintRedeemer

-- | Policy: Check that exactly 1 NFT is minted
{-# INLINABLE mkPolicy #-}
mkPolicy :: TxOutRef -> MintRedeemer -> ScriptContext -> Bool
mkPolicy utxo (MintRedeemer tn) ctx =
  traceIfFalse "UTXO not consumed" hasUTxO &&
  traceIfFalse "Wrong amount minted" checkMintedAmount
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx

    hasUTxO :: Bool
    hasUTxO = any (\i -> txInInfoOutRef i == utxo) $ txInfoInputs info

    checkMintedAmount :: Bool
    checkMintedAmount = case AssocMap.lookup (ownCurrencySymbol ctx) (txInfoMint info) of
      Nothing -> False
      Just m  -> case AssocMap.lookup tn m of
        Nothing -> False
        Just amt -> amt == 1

-- | Compile policy
policy :: TxOutRef -> MintingPolicy
policy utxo = mkMintingPolicyScript $
  $$(compile [|| \u -> mkPolicy u ||])
  `applyCode`
  liftCode utxo
```

### Plutus Testing

**File:** `test/Spec.hs`

```haskell
{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE ImportQualifiedPost #-}
{-# LANGUAGE NumericUnderscores  #-}
{-# LANGUAGE OverloadedStrings   #-}

module Main (main) where

import Test.Tasty
import Test.Tasty.HUnit
import PlutusLedgerApi.V3
import PlutusTx.Prelude qualified as P

import SecretLock

main :: IO ()
main = defaultMain tests

tests :: TestTree
tests = testGroup "SecretLock Tests"
  [ testCase "Correct secret unlocks" testCorrectSecret
  , testCase "Wrong secret fails" testWrongSecret
  ]

testCorrectSecret :: Assertion
testCorrectSecret = do
  let secret = "password123"
      hash = P.sha2_256 secret
      datum = Secret hash
      redeemer = SecretGuess secret
      ctx = undefined  -- Mock ScriptContext

  mkValidator datum redeemer ctx @?= True

testWrongSecret :: Assertion
testWrongSecret = do
  let secret = "password123"
      wrongGuess = "wrong"
      hash = P.sha2_256 secret
      datum = Secret hash
      redeemer = SecretGuess wrongGuess
      ctx = undefined

  mkValidator datum redeemer ctx @?= False
```

**Run tests:**

```bash
cabal test
```

### Plutus Deployment

**1. Serialize validator:**

```haskell
-- src/Serialize.hs
import Cardano.Api
import Codec.Serialise (serialise)
import Data.ByteString.Lazy qualified as LBS
import Data.ByteString.Short qualified as SBS

writeValidator :: Validator -> FilePath -> IO ()
writeValidator v path = do
  let script = PlutusScriptSerialised $ SBS.toShort $ LBS.toStrict $ serialise v
  writeFileTextEnvelope path Nothing script >>= \case
    Left err -> print err
    Right () -> putStrLn $ "Wrote validator to " ++ path
```

**2. Get script address:**

```bash
cardano-cli address build \
  --payment-script-file secret-lock.plutus \
  --testnet-magic 1 \
  --out-file secret-lock.addr
```

**3. Deploy to testnet:**

See [Off-Chain Integration](#off-chain-integration) section.

## Aiken Development

### Prerequisites

```bash
# Install Aiken (see CARDANO_SETUP.md)
aikup install latest

# Verify
aiken --version  # v1.1.19+
```

### Aiken Simple Validator

**Goal:** Create a validator that always succeeds.

```bash
# Create new project
aiken new always-succeeds
cd always-succeeds
```

**File:** `validators/always_succeeds.ak`

```aiken
use aiken/transaction.{ScriptContext}

validator always_succeeds {
  spend(_datum: Option<Data>, _redeemer: Data, _own_ref: Data, _ctx: ScriptContext) {
    True
  }
}
```

**Build:**

```bash
aiken build

# Output: plutus.json (CIP-57 blueprint)
```

### Aiken Lock and Unlock

**File:** `validators/secret_lock.ak`

```aiken
use aiken/hash.{Blake2b_256, Hash}
use aiken/transaction.{ScriptContext}
use aiken/transaction/value

// Datum: secret hash
pub type Datum {
  secret_hash: Hash<Blake2b_256, ByteArray>,
}

// Redeemer: secret guess
pub type Redeemer {
  secret: ByteArray,
}

validator secret_lock {
  spend(datum_opt: Option<Datum>, redeemer: Redeemer, _own_ref: Data, ctx: ScriptContext) {
    expect Some(datum) = datum_opt

    // Hash the guess and compare
    let guess_hash = hash.blake2b_256(redeemer.secret)

    guess_hash == datum.secret_hash
  }
}

// Tests
test secret_lock_correct_secret() {
  let secret = "password123"
  let secret_hash = hash.blake2b_256(secret)

  let datum = Datum { secret_hash }
  let redeemer = Redeemer { secret }

  secret_lock.spend(Some(datum), redeemer, Void, void_context()) == True
}

test secret_lock_wrong_secret() fail {
  let secret = "password123"
  let wrong_guess = "wrong"
  let secret_hash = hash.blake2b_256(secret)

  let datum = Datum { secret_hash }
  let redeemer = Redeemer { secret: wrong_guess }

  secret_lock.spend(Some(datum), redeemer, Void, void_context())
}
```

### Aiken NFT Minting

**File:** `validators/nft_policy.ak`

```aiken
use aiken/hash.{Blake2b_224, Hash}
use aiken/transaction.{ScriptContext, Mint, Transaction, TransactionId, OutputReference}
use aiken/transaction/credential.{ScriptCredential}
use aiken/transaction/value

pub type Redeemer {
  // UTXO to consume (ensures one-time mint)
  utxo_ref: OutputReference,
  token_name: ByteArray,
}

validator nft_policy {
  mint(redeemer: Redeemer, own_policy: Hash<Blake2b_224, Script>, ctx: ScriptContext) {
    expect Mint(policy_id) = ctx.purpose

    let ScriptContext { transaction, .. } = ctx
    let Transaction { inputs, mint, .. } = transaction

    // Check UTXO is consumed
    let utxo_consumed =
      inputs
        |> list.any(fn(input) { input.output_reference == redeemer.utxo_ref })

    // Check exactly 1 token minted
    let minted_amount =
      mint
        |> value.from_minted_value
        |> value.quantity_of(policy_id, redeemer.token_name)

    utxo_consumed && minted_amount == 1
  }
}

test nft_policy_mints_one() {
  let utxo_ref = OutputReference {
    transaction_id: TransactionId { hash: #"abcd" },
    output_index: 0,
  }

  let redeemer = Redeemer {
    utxo_ref,
    token_name: "MyNFT",
  }

  // Mock context with consumed UTXO and minted token
  let ctx = mock_mint_context(utxo_ref, "MyNFT", 1)

  nft_policy.mint(redeemer, #"policy123", ctx) == True
}
```

### Aiken Testing

**Built-in tests:**

```aiken
use aiken/transaction.{ScriptContext}

validator my_validator {
  spend(datum: Int, redeemer: Int, _own_ref: Data, _ctx: ScriptContext) {
    datum == redeemer
  }
}

// Property-based test
test my_validator_reflexive(n via int) {
  my_validator.spend(n, n, Void, void_context())
}

// Unit test
test my_validator_specific() {
  my_validator.spend(42, 42, Void, void_context()) == True
}

// Failure test
test my_validator_different() fail {
  my_validator.spend(1, 2, Void, void_context())
}
```

**Run tests:**

```bash
aiken check

# With coverage
aiken check --coverage

# Verbose output
aiken check --verbose
```

### Aiken Deployment

**1. Build validator:**

```bash
aiken build

# Generates:
# - plutus.json (CIP-57 blueprint)
# - Compiled validators in build/ directory
```

**2. Extract script address:**

```typescript
import { SpendingValidator } from "@lucid-evolution/lucid";
import blueprint from "./plutus.json" assert { type: "json" };

// Get validator from blueprint
const validator: SpendingValidator = {
  type: "PlutusV3",
  script: blueprint.validators.find((v) => v.title === "secret_lock.spend")!.compiledCode,
};

// Get address
const scriptAddress = lucid.utils.validatorToAddress(validator);
console.log("Script address:", scriptAddress);
```

**3. Deploy to testnet:**

See [Off-Chain Integration](#off-chain-integration) section.

## Off-Chain Integration

### Lucid Evolution Setup

```typescript
import { Lucid, Blockfrost, fromText } from "@lucid-evolution/lucid";

// Initialize Lucid
const lucid = await Lucid(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    process.env.BLOCKFROST_API_KEY!
  ),
  "Preprod"
);

// Connect wallet
lucid.selectWallet.fromSeed(process.env.SEED_PHRASE!);
// Or: await lucid.selectWallet.fromAPI(window.cardano.nami);
```

### Lock Funds at Script

```typescript
import { Data } from "@lucid-evolution/lucid";

// Define Datum schema
const DatumSchema = Data.Object({
  secretHash: Data.Bytes(),
});
type Datum = Data.Static<typeof DatumSchema>;

// Create datum
const secret = "password123";
const secretHash = crypto.subtle.digest("SHA-256", fromText(secret));
const datum: Datum = {
  secretHash: new Uint8Array(await secretHash),
};

// Lock funds
const tx = await lucid
  .newTx()
  .pay.ToAddressWithData(
    scriptAddress,
    {
      kind: "inline",
      value: Data.to(datum, DatumSchema),
    },
    { lovelace: 10_000_000n }  // 10 ADA
  )
  .complete();

const signedTx = await tx.sign.withWallet().complete();
const txHash = await signedTx.submit();

console.log(`Locked funds: ${txHash}`);
```

### Unlock Funds from Script

```typescript
// Define Redeemer schema
const RedeemerSchema = Data.Object({
  secret: Data.Bytes(),
});
type Redeemer = Data.Static<typeof RedeemerSchema>;

// Get UTXOs at script
const utxos = await lucid.utxosAt(scriptAddress);
const scriptUtxo = utxos[0];  // Choose UTXO to spend

// Create redeemer
const redeemer: Redeemer = {
  secret: fromText("password123"),
};

// Unlock funds
const tx = await lucid
  .newTx()
  .collectFrom(
    [scriptUtxo],
    Data.to(redeemer, RedeemerSchema)
  )
  .attach.SpendingValidator(validator)
  .addSigner(await lucid.wallet().address())
  .complete();

const signedTx = await tx.sign.withWallet().complete();
const txHash = await signedTx.submit();

console.log(`Unlocked funds: ${txHash}`);
```

### Mint NFT

```typescript
import { MintingPolicy, PolicyId, Unit } from "@lucid-evolution/lucid";

// Get minting policy
const policy: MintingPolicy = {
  type: "PlutusV3",
  script: compiledPolicyScript,
};
const policyId: PolicyId = lucid.utils.mintingPolicyToId(policy);

// Define token
const tokenName = "MyNFT001";
const unit: Unit = policyId + fromText(tokenName);

// Get UTXO to consume (for one-time mint)
const utxos = await lucid.wallet().getUtxos();
const utxoToConsume = utxos[0];

// Mint NFT
const tx = await lucid
  .newTx()
  .collectFrom([utxoToConsume])
  .mintAssets(
    { [unit]: 1n },
    Data.to({
      utxoRef: {
        transactionId: { hash: utxoToConsume.txHash },
        outputIndex: utxoToConsume.outputIndex,
      },
      tokenName: fromText(tokenName),
    })
  )
  .attach.MintingPolicy(policy)
  .complete();

const signedTx = await tx.sign.withWallet().complete();
const txHash = await signedTx.submit();

console.log(`Minted NFT: ${txHash}`);
```

## Best Practices

### Security

1. **Always validate inputs:**
   ```haskell
   -- Plutus
   traceIfFalse "Invalid datum" (validateDatum datum)
   ```

   ```aiken
   // Aiken
   expect Some(datum) = datum_opt
   expect datum.value > 0
   ```

2. **Check transaction boundaries:**
   - Verify inputs belong to script
   - Check outputs go to correct addresses
   - Validate amounts

3. **Prevent double satisfaction:**
   ```haskell
   -- Ensure unique UTXO is consumed
   hasUTxO utxoRef ctx
   ```

4. **Use time locks:**
   ```aiken
   // Check transaction is within valid time range
   let valid_from = ctx.transaction.validity_range.lower_bound.bound_type
   let valid_to = ctx.transaction.validity_range.upper_bound.bound_type
   ```

### Testing

1. **Test happy path:**
   - Valid inputs succeed
   - Expected outputs produced

2. **Test failure cases:**
   - Invalid inputs rejected
   - Wrong amounts fail
   - Unauthorized access blocked

3. **Property-based tests:**
   ```aiken
   test validator_reflexive(x via int) {
     validator.spend(x, x, Void, ctx)
   }
   ```

4. **Integration tests:**
   - Deploy to testnet
   - Test full transaction lifecycle
   - Verify on-chain behavior

### Code Organization

**Plutus:**
```
project/
├── cabal.project
├── validators.cabal
├── src/
│   ├── Validators/
│   │   ├── AlwaysSucceeds.hs
│   │   ├── SecretLock.hs
│   │   └── NFTPolicy.hs
│   └── Utils/
│       └── Serialization.hs
└── test/
    └── Spec.hs
```

**Aiken:**
```
project/
├── aiken.toml
├── validators/
│   ├── always_succeeds.ak
│   ├── secret_lock.ak
│   └── nft_policy.ak
├── lib/
│   └── utils.ak
└── plutus.json (generated)
```

## Common Patterns

### Parameterized Validators

**Plutus:**
```haskell
-- Pass parameters at compile time
mkValidator :: PubKeyHash -> BuiltinData -> BuiltinData -> ScriptContext -> Bool
mkValidator owner _ _ ctx = txSignedBy (scriptContextTxInfo ctx) owner

validator :: PubKeyHash -> Validator
validator pkh = mkValidatorScript $
  $$(compile [|| mkValidator ||])
  `applyCode`
  liftCode pkh
```

**Aiken:**
```aiken
validator(owner: ByteArray) {
  spend(_d: Data, _r: Data, _ref: Data, ctx: ScriptContext) {
    let signed_by_owner =
      ctx.transaction.extra_signatories
        |> list.has(owner)
    signed_by_owner
  }
}
```

### Multi-Signature

```aiken
validator multi_sig {
  spend(_d: Data, signers: List<ByteArray>, _ref: Data, ctx: ScriptContext) {
    let tx_signers = ctx.transaction.extra_signatories

    // Check all required signers are present
    signers
      |> list.all(fn(s) { list.has(tx_signers, s) })
  }
}
```

### Time-Locked Vesting

```aiken
use aiken/interval.{Finite}

pub type Datum {
  beneficiary: ByteArray,
  deadline: Int,  // POSIXTime
}

validator vesting {
  spend(datum: Datum, _r: Data, _ref: Data, ctx: ScriptContext) {
    let signed_by_beneficiary =
      list.has(ctx.transaction.extra_signatories, datum.beneficiary)

    let deadline_reached = when ctx.transaction.validity_range.lower_bound.bound_type is {
      Finite(tx_time) -> tx_time >= datum.deadline
      _ -> False
    }

    signed_by_beneficiary && deadline_reached
  }
}
```

## Security Checklist

Before deploying to mainnet:

- [ ] **Code review by 2+ developers**
- [ ] **All tests pass (100% coverage)**
- [ ] **Audit by security firm** (for high-value contracts)
- [ ] **Testnet deployment and testing**
  - [ ] Lock/unlock funds successfully
  - [ ] Test failure cases
  - [ ] Verify no unexpected behavior
- [ ] **Check for common vulnerabilities:**
  - [ ] Double satisfaction
  - [ ] Unbounded loops
  - [ ] Integer overflow/underflow
  - [ ] Insufficient validation
  - [ ] Missing signatures
  - [ ] Time manipulation
- [ ] **Gas estimation:**
  - [ ] Script within execution limits
  - [ ] Reasonable transaction fees
- [ ] **Emergency procedures:**
  - [ ] Upgrade path (if applicable)
  - [ ] Pause mechanism (if needed)
  - [ ] Recovery plan
- [ ] **Documentation:**
  - [ ] CIP-57 blueprint generated
  - [ ] Usage guide written
  - [ ] Known limitations documented

**Use `#security-audit` prompt for comprehensive pre-mainnet audit.**

## Resources

- **Plutus:**
  - [Official Docs](https://plutus.readthedocs.io)
  - [Plutus Pioneer Program](https://github.com/input-output-hk/plutus-pioneer-program)
  - [PlutusLedgerApi](https://intersectmbo.github.io/plutus/haddock/latest/plutus-ledger-api/)

- **Aiken:**
  - [Official Docs](https://aiken-lang.org)
  - [Aiken Stdlib](https://aiken-lang.github.io/stdlib/)
  - [Aiken Examples](https://github.com/aiken-lang/examples)

- **Off-Chain:**
  - [Lucid Evolution](https://github.com/Anastasia-Labs/lucid-evolution)
  - [Mesh SDK](https://meshjs.dev)
  - [CIP-57 Blueprint](https://cips.cardano.org/cip/CIP-0057)

- **Security:**
  - [MLabs Audit Reports](https://github.com/mlabs-haskell/audit-reports)
  - [Plutus Security Guidelines](https://plutus.readthedocs.io/en/latest/reference/writing-scripts/security.html)

## Next Steps

1. **Start small:** Build a simple validator first
2. **Test thoroughly:** Write comprehensive tests
3. **Deploy to testnet:** Get real-world experience
4. **Get feedback:** Share with community
5. **Audit before mainnet:** Use `#security-audit` prompt
6. **Monitor deployed contracts:** Watch for unexpected behavior

Use Copilot prompts to accelerate development:
- `#validator` - Generate validators
- `#transaction` - Build transactions
- `#security-audit` - Pre-mainnet audit
- `#cip-lookup` - Find CIP standards

Happy building! 🚀
