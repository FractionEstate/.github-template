---
description: Testing expectations for Cardano smart contracts and DApps
applyTo: "**/*.{spec,test}.{js,ts,hs,ak}"
---

# Cardano Testing Expectations

This document outlines testing requirements for Cardano development across all
layers.

## Test pyramid

```text
         /\
        /  \      E2E Tests (10%) - Full flow on testnet
       /----\
      /      \    Integration Tests (20%) - Transaction building
     /--------\
    /          \  Unit Tests (70%) - Validator logic
   /____________\
```

### Distribution

- **70% Unit Tests**: Validator logic, helper functions, property-based tests
- **20% Integration Tests**: Transaction building with Lucid Evolution/Mesh
- **10% E2E Tests**: Full wallet-to-chain flows on testnet

## Unit tests

### Plutus (Haskell)

Test framework: Tasty + HUnit + QuickCheck

```haskell
module Main where

import Test.Tasty
import Test.Tasty.HUnit
import Test.Tasty.QuickCheck

main :: IO ()
main = defaultMain tests

tests :: TestTree
tests = testGroup "Validator Tests"
  [ testCase "accepts valid unlock" test_validUnlock
  , testProperty "amount always positive" prop_amountPositive
  ]
```

#### Commands (Plutus)

```bash
cabal test                              # Run all tests
cabal test --test-show-details=direct   # Verbose output
```

### Aiken

#### Built-in test framework (zero configuration)

```aiken
use aiken/bytes

test unlock_success() {

  let datum = Some(MyDatum { owner: bytes.from_hex("616263"), amount: 100 })
  let redeemer = Unlock
  my_validator.spend(datum, redeemer, bytes.empty(), mock_ctx())
}

test prop_amount_positive(amt via int.between(1, 1000000)) {
  amt > 0
}
```

#### Commands (Aiken)

```bash
aiken check                  # Run tests
aiken check --verbose        # Detailed output
aiken check --coverage       # Coverage report
aiken check --match "unlock" # Specific tests
```

### TypeScript (Vitest)

```typescript
import { describe, it, expect } from 'vitest';

describe('Transaction Building', () => {
  it('should build valid payment', async () => {
    const tx = await buildTransaction();
    expect(tx).toBeDefined();
  });
});
```

#### Commands (TypeScript)

```bash
npm test                    # Run tests
npm run test:coverage       # Coverage report
npm run test:watch          # Watch mode
```

## Integration tests

### With Lucid Evolution (Anastasia Labs)

```typescript
import { Lucid, Blockfrost, Data } from '@lucid-evolution/lucid';

describe('Contract Integration', () => {
  let lucid: Lucid;

  beforeAll(async () => {
    lucid = await Lucid(
      new Blockfrost(url, apiKey),
      'Preprod'
    );
  });

  it('should lock funds', async () => {
    const tx = await lucid
      .newTx()
      .payToContract(address, { inline: datum }, assets)
      .complete();

    expect(tx).toBeDefined();
  });
});
```

### With Mesh SDK

```typescript
import { MeshWallet, Transaction } from '@meshsdk/core';

it('should build transaction', async () => {
  const tx = new Transaction({ initiator: wallet });
  tx.sendLovelace(address, amount);

  const unsignedTx = await tx.build();
  expect(unsignedTx).toBeDefined();
});
```

## Property-based testing

### Plutus (QuickCheck)

```haskell
prop_validatorAcceptsValidInput :: MyDatum -> Property
prop_validatorAcceptsValidInput datum =
  forAll (validRedeemer datum) $ \redeemer ->
    mkValidator datum redeemer mockCtx === True

instance Arbitrary MyDatum where
  arbitrary = MyDatum
    <$> arbitrary
    <*> choose (1, 1000000)
```

### Aiken (Built-in fuzzing)

```aiken
test prop_update_increases(
  initial via int.between(0, 1000000),
  increase via int.between(1, 100)
) {
  let new_amount = initial + increase
  new_amount > initial
}
```

## E2E tests

### Wallet connection (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('should connect wallet and transact', async ({ page, context }) => {
  // Mock wallet
  await context.addInitScript(() => {
    window.cardano = {
      nami: {
        enable: async () => ({
          getNetworkId: async () => 0,
          signTx: async (tx) => tx,
        })
      }
    };
  });

  await page.goto('http://localhost:3000');
  await page.click('[data-testid="connect-wallet"]');

  await expect(page.locator('[data-testid="wallet-connected"]'))
    .toBeVisible();
});
```

### Full transaction flow

```typescript
test('lock and unlock flow', async ({ page }) => {
  await connectWallet(page);

  // Lock funds
  await page.fill('[data-testid="amount"]', '10');
  await page.click('[data-testid="lock-button"]');

  await expect(page.locator('[data-testid="tx-confirmed"]'))
    .toBeVisible({ timeout: 60000 });

  // Unlock funds
  await page.click('[data-testid="unlock-button"]');

  await expect(page.locator('[data-testid="unlock-confirmed"]'))
    .toBeVisible({ timeout: 60000 });
});
```

## Commands summary

```bash
# Smart contract tests
cabal test              # Plutus
aiken check            # Aiken

# Frontend tests
npm test               # Unit + Integration
npm run test:e2e       # E2E with Playwright

# Coverage
cabal test --enable-coverage       # Plutus
aiken check --coverage             # Aiken
npm run test:coverage              # TypeScript

# All tests
npm run test:all       # Run everything
```

## Testing on networks

### Preprod (recommended)

```typescript
const lucid = await Lucid(
  new Blockfrost(
    'https://cardano-preprod.blockfrost.io/api/v0',
    process.env.BLOCKFROST_PREPROD_KEY!
  ),
  'Preprod'
);
```

### Preview (for new features)

```typescript
const lucid = await Lucid(
  new Blockfrost(
    'https://cardano-preview.blockfrost.io/api/v0',
    process.env.BLOCKFROST_PREVIEW_KEY!
  ),
  'Preview'
);
```

### Local testnet

```bash
cardano-testnet cardano \
  --testnet-magic 42 \
  --num-pool-nodes 2
```

## Continuous testing (CI)

```yaml
# .github/workflows/cardano-ci.yml
- name: Run Plutus tests
  run: cabal test

- name: Run Aiken tests
  run: aiken check --coverage

- name: Run frontend tests
  run: npm test
  env:
    BLOCKFROST_KEY: ${{ secrets.BLOCKFROST_PREPROD_KEY }}

- name: E2E tests
  run: npm run test:e2e
```

## Coverage requirements

### Mainnet deployment requires

- ✅ 100% branch coverage for validators
- ✅ Property tests for all numeric operations
- ✅ Integration tests for all transaction types
- ✅ E2E tests for critical user flows
- ✅ Testnet validation (minimum 2 weeks)

## Writing new tests

### Unit test checklist

- [ ] Test happy path
- [ ] Test all error conditions
- [ ] Test boundary values
- [ ] Test with invalid inputs
- [ ] Test time-based logic

### Integration test checklist

- [ ] Test transaction building
- [ ] Test datum/redeemer construction
- [ ] Test with realistic UTxO sets
- [ ] Test collateral handling
- [ ] Test network-specific logic

### E2E test checklist

- [ ] Test wallet connection flow
- [ ] Test transaction signing
- [ ] Test error states
- [ ] Test with multiple wallets
- [ ] Test on actual testnet

## Troubleshooting

### Common issues

#### Plutus tests fail to compile

```bash
cabal clean
cabal update
cabal build --enable-tests
```

#### Aiken tests timeout

```bash
aiken check --timeout 60  # Increase timeout
```

#### Frontend tests cannot find wallet

```typescript
// Mock wallet in beforeAll
beforeAll(() => {
  window.cardano = { /* mock */ };
});
```

#### E2E tests flaky on testnet

- Increase timeouts (testnet is slower)
- Add retry logic for network errors
- Use stable testnet (preprod over preview)

## Resources

- Plutus Testing Guide: <https://plutus.cardano.intersectmbo.org/docs/>
- Aiken Testing Docs: <https://aiken-lang.org/language-tour/tests>
- Lucid Evolution Tests: <https://github.com/Anastasia-Labs/lucid-evolution>
- Mesh Testing: <https://meshjs.dev/guides/testing>
- Playwright Docs: <https://playwright.dev/>

## Learnings

- **Property tests catch what unit tests miss** - mandatory for validators (x8)
- **Testnet sometimes behaves differently than mainnet** - test both (x5)
- **E2E tests are slow but essential** - run before every release (x6)
- **Mock wallets for fast iteration** - real wallets for final validation (x7)
- **Aiken's fuzzing is powerful** - use it extensively (x4)
