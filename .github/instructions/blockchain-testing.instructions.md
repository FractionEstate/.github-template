---
description: Blockchain testing strategies for Plutus, Aiken, and off-chain code
applyTo: "**/*.{spec,test}.{js,ts,hs,ak}"
---

# Blockchain Testing Guidelines

This document outlines testing approaches for Cardano smart contracts and DApp integrations.

## Testing pyramid for Cardano

```text
         /\
        /  \      E2E Tests (10%)
       /----\     - Full transaction flow on testnet
      /      \    - Wallet integration tests
     /--------\   Integration Tests (20%)
    /          \  - Transaction building with Lucid/Mesh
   /------------\ - Off-chain + on-chain integration
  /______________\ Unit Tests (70%)
                   - Validator logic (Plutus/Aiken)
                   - Helper functions
                   - Property-based tests
```

## Unit tests

### Plutus unit tests

**Setup** (`test/Spec.hs`):

```haskell
{-# LANGUAGE OverloadedStrings #-}

module Main where

import Test.Tasty
import Test.Tasty.HUnit
import Plutus.V3.Ledger.Api
import MyValidator (mkValidator)

main :: IO ()
main = defaultMain tests

tests :: TestTree
tests = testGroup "Validator Tests"
  [ testCase "accepts valid redeemer" test_validRedeemer
  , testCase "rejects invalid redeemer" test_invalidRedeemer
  , testCase "checks signature correctly" test_signatureCheck
  ]

test_validRedeemer :: Assertion
test_validRedeemer =
  let datum = MyDatum { owner = "abc123", amount = 100 }
      redeemer = Unlock
      ctx = mockScriptContext datum redeemer
  in mkValidator datum redeemer ctx @?= True

test_invalidRedeemer :: Assertion
test_invalidRedeemer =
  let datum = MyDatum { owner = "abc123", amount = 100 }
      redeemer = Update (-10)  -- Negative amount
      ctx = mockScriptContext datum redeemer
  in mkValidator datum redeemer ctx @?= False

-- Helper to create mock context
mockScriptContext :: MyDatum -> MyRedeemer -> ScriptContext
mockScriptContext datum redeemer =
  ScriptContext
    { scriptContextTxInfo = mockTxInfo
    , scriptContextPurpose = Spending (TxOutRef "txid" 0)
    }
```

**Run tests**:

```bash
cabal test
```

### Aiken unit tests

**Built-in test framework** (`validators/my_validator.ak`):

```aiken
use aiken/transaction.{ScriptContext}
use aiken/bytes

// Your validator
validator my_validator {
  spend(datum: Option<MyDatum>, redeemer: MyRedeemer, _ref, ctx: ScriptContext) {
    expect Some(d) = datum
    when redeemer is {
      Unlock -> check_signature(d, ctx)
      Update { amount } -> amount > d.amount
    }
  }
}

// Test successful unlock
test unlock_with_signature() {
  let datum = Some(MyDatum { owner: bytes.from_hex("abc123"), amount: 100 })
  let redeemer = Unlock
  let ctx = mock_context(bytes.from_hex("abc123"))

  my_validator.spend(datum, redeemer, bytes.empty(), ctx)
}

// Test unlock fails without signature
test unlock_without_signature() fail {
  let datum = Some(MyDatum { owner: bytes.from_hex("abc123"), amount: 100 })
  let redeemer = Unlock
  let ctx = mock_context(bytes.from_hex("77686f6e675f6b6579"))

  my_validator.spend(datum, redeemer, bytes.empty(), ctx)
}

// Test update with valid amount
test update_increases_amount() {
  let datum = Some(MyDatum { owner: bytes.from_hex("abc123"), amount: 100 })
  let redeemer = Update { amount: 150 }
  let ctx = mock_context(bytes.from_hex("abc123"))

  my_validator.spend(datum, redeemer, bytes.empty(), ctx)
}

// Test update fails with lower amount
test update_fails_with_lower_amount() fail {
  let datum = Some(MyDatum { owner: bytes.from_hex("abc123"), amount: 100 })
  let redeemer = Update { amount: 50 }
  let ctx = mock_context(bytes.from_hex("abc123"))

  my_validator.spend(datum, redeemer, bytes.empty(), ctx)
}

// Helper function
fn mock_context(signer: ByteArray) -> ScriptContext {
  ScriptContext {
    transaction: mock_tx(signer),
    purpose: Spend(bytes.from_hex("746573745f726566"))
  }
}
```

**Run Aiken tests**:

```bash
aiken check

# With verbose output
aiken check --verbose

# With coverage
aiken check --coverage
```

## Property-based testing

### Plutus with QuickCheck

```haskell
import Test.Tasty.QuickCheck
import Test.QuickCheck

-- Generate arbitrary datum
instance Arbitrary MyDatum where
  arbitrary = MyDatum
    <$> arbitrary  -- owner
    <*> choose (1, 1000000)  -- amount (positive)

-- Property: amount must always be positive
prop_amountAlwaysPositive :: MyDatum -> Property
prop_amountAlwaysPositive datum =
  amount datum > 0 === True

-- Property: valid redeemer always succeeds with correct signature
prop_validRedeemerSucceeds :: MyDatum -> Property
prop_validRedeemerSucceeds datum =
  forAll (elements [Unlock, Update 200]) $ \redeemer ->
    let ctx = mockScriptContextWithSigner (owner datum)
    in mkValidator datum redeemer ctx === True

-- Run property tests
prop_tests :: TestTree
prop_tests = testGroup "Property Tests"
  [ testProperty "amount always positive" prop_amountAlwaysPositive
  , testProperty "valid redeemer succeeds" prop_validRedeemerSucceeds
  ]
```

### Aiken fuzzing

```aiken
use aiken/bytes

// Property test with random inputs
test prop_amount_in_range(
  amount via int.between(1, 1000000),
  increase via int.between(1, 100)
) {
  let datum = MyDatum { owner: bytes.from_hex("74657374"), amount: amount }
  let new_amount = amount + increase

  new_amount > datum.amount
}

// Test with random byte arrays
test prop_valid_owner_length(
  owner via bytearray.between(28, 28)  // PKH is always 28 bytes
) {
  bytearray.length(owner) == 28
}
```

## Integration tests

### Transaction building with Lucid Evolution

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { Lucid, Blockfrost, Data } from '@lucid-evolution/lucid';

describe('Validator Integration Tests', () => {
  let lucid: Lucid;
  let validatorScript: string;

  beforeAll(async () => {
    // Initialize Lucid with preprod network
    lucid = await Lucid(
      new Blockfrost(
        'https://cardano-preprod.blockfrost.io/api/v0',
        process.env.BLOCKFROST_KEY!
      ),
      'Preprod'
    );

    // Load validator from plutus.json
    const blueprint = await import('./plutus.json');
    validatorScript = blueprint.validators[0].compiledCode;
  });

  it('should lock funds in contract', async () => {
    // Create datum
    const datum = Data.to({
      owner: 'abc123',
      amount: 100n
    });

    // Get validator address
    const validatorAddress = lucid.utils.validatorToAddress(validatorScript);

    // Build transaction
    const tx = await lucid
      .newTx()
      .payToContract(
        validatorAddress,
        { inline: datum },
        { lovelace: 10000000n }
      )
      .complete();

    expect(tx).toBeDefined();
    expect(tx.txComplete).toBeDefined();
  });

  it('should unlock funds from contract', async () => {
    // Find UTxO at contract
    const utxos = await lucid.utxosAt(validatorAddress);
    const utxo = utxos[0];

    // Build unlock transaction
    const redeemer = Data.to('Unlock');

    const tx = await lucid
      .newTx()
      .collectFrom([utxo], redeemer)
      .attachSpendingValidator(validatorScript)
      .complete();

    expect(tx).toBeDefined();
  });
});
```

### Transaction building with Mesh

```typescript
import { MeshWallet, BlockfrostProvider, Transaction } from '@meshsdk/core';
import { describe, it, expect } from 'vitest';

describe('Mesh Transaction Tests', () => {
  it('should build simple payment', async () => {
    const provider = new BlockfrostProvider(
      process.env.BLOCKFROST_KEY!
    );

    const wallet = new MeshWallet({
      networkId: 0,
      fetcher: provider,
      submitter: provider,
      key: {
        type: 'mnemonic',
        words: testMnemonic
      }
    });

    const tx = new Transaction({ initiator: wallet });

    tx.sendLovelace(
      'addr_test1...',
      '5000000'
    );

    const unsignedTx = await tx.build();
    expect(unsignedTx).toBeDefined();
  });
});
```

## E2E tests

### Wallet connection E2E

```typescript
import { test, expect } from '@playwright/test';

test.describe('Wallet Integration E2E', () => {
  test('should connect Nami wallet', async ({ page, context }) => {
    // Mock Nami wallet
    await context.addInitScript(() => {
      window.cardano = {
        nami: {
          enable: async () => ({
            getNetworkId: async () => 0,
            getChangeAddress: async () => 'addr_test1...',
            getUtxos: async () => [],
          }),
          isEnabled: async () => false
        }
      };
    });

    await page.goto('http://localhost:3000');

    // Click connect button
    await page.click('[data-testid="connect-wallet"]');

    // Select Nami
    await page.click('[data-testid="wallet-nami"]');

    // Verify connection
    await expect(page.locator('[data-testid="wallet-connected"]')).toBeVisible();
  });

  test('should display wallet balance', async ({ page }) => {
    // ... wallet connection ...

    const balance = await page.locator('[data-testid="wallet-balance"]').textContent();
    expect(balance).toMatch(/\d+\.\d+ ADA/);
  });
});
```

### Full transaction flow E2E

```typescript
test('should complete lock and unlock flow', async ({ page }) => {
  // Connect wallet
  await connectWallet(page, 'nami');

  // Lock funds
  await page.fill('[data-testid="lock-amount"]', '10');
  await page.click('[data-testid="lock-submit"]');

  // Wait for transaction confirmation
  await expect(page.locator('[data-testid="tx-confirmed"]')).toBeVisible({
    timeout: 60000
  });

  // Verify locked funds appear in UI
  const lockedAmount = await page.locator('[data-testid="locked-amount"]').textContent();
  expect(lockedAmount).toContain('10 ADA');

  // Unlock funds
  await page.click('[data-testid="unlock-submit"]');

  // Wait for unlock confirmation
  await expect(page.locator('[data-testid="unlock-confirmed"]')).toBeVisible({
    timeout: 60000
  });
});
```

## Testing on testnets

### Preprod network (recommended)

```typescript
// Lucid Evolution with Preprod
const lucid = await Lucid(
  new Blockfrost(
    'https://cardano-preprod.blockfrost.io/api/v0',
    BLOCKFROST_PREPROD_KEY
  ),
  'Preprod'
);
```

### Preview network

```typescript
// For testing new features
const lucid = await Lucid(
  new Blockfrost(
    'https://cardano-preview.blockfrost.io/api/v0',
    BLOCKFROST_PREVIEW_KEY
  ),
  'Preview'
);
```

### cardano-testnet (local)

```bash
# Start local testnet
cardano-testnet cardano \
  --testnet-magic 42 \
  --num-pool-nodes 2

# Use with Kupmios provider
const lucid = await Lucid(
  new Kupmios(
    'http://localhost:1442',
    'http://localhost:1337'
  ),
  'Custom'
);
```

## Test commands summary

```bash
# Plutus tests
cabal test                     # Run all tests
cabal test --test-show-details=direct  # Verbose output

# Aiken tests
aiken check                    # Run tests
aiken check --verbose          # Detailed output
aiken check --coverage         # Coverage report
aiken check --match "unlock"   # Run specific tests

# Frontend tests
npm test                       # Vitest/Jest tests
npm run test:e2e              # Playwright E2E tests
npm run test:coverage         # Coverage report

# All tests
npm run test:all              # Run everything
```

## Continuous testing

Add to CI workflow:

```yaml
- name: Run Plutus tests
  run: cabal test

- name: Run Aiken tests
  run: aiken check --coverage

- name: Run integration tests
  run: npm test
  env:
    BLOCKFROST_KEY: ${{ secrets.BLOCKFROST_PREPROD_KEY }}
```

## Resources

- Plutus Testing Guide: <https://plutus.cardano.intersectmbo.org/docs/working-with-scripts/testing>
- Aiken Testing Documentation: <https://aiken-lang.org/language-tour/tests>
- Lucid Evolution Examples: <https://github.com/Anastasia-Labs/lucid-evolution/tree/main/packages/lucid/test>
- Mesh Testing Guide: <https://meshjs.dev/guides/testing>

## Learnings

- **Property tests catch edge cases unit tests miss** - use fuzzing extensively (x5)
- **Testnet behavior sometimes differs from mainnet** - test both environments (x3)
- **E2E tests are slow but essential** - run them before every release (x4)
- **Mock wallet for fast iteration** - real wallet for final validation (x6)
