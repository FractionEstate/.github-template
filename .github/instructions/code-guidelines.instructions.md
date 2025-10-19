---
description: Core coding conventions for Cardano smart contracts and DApps
applyTo: "src/**/*.{hs,ak,ts,tsx,js,jsx}"
---

# Cardano Code Guidelines

This document defines coding standards for Cardano development across Plutus
(Haskell), Aiken, and TypeScript/JavaScript.

## Language preferences

### Plutus (Haskell)

- **Use PlutusTx-compatible Haskell**: Not all GHC features work on-chain
- **Prefer `{-# INLINABLE #-}`**: Mark all on-chain functions for optimization
- **Avoid partial functions**: Never use `head`, `tail`, `!!` without checks
- **Use `BuiltinData` efficiently**: Convert only at validator boundaries
- **Banned patterns**:
  - `String` (use `BuiltinByteString`)
  - `error` without context (use `traceError`)
  - Recursive types without size consideration

### Aiken

- **Type everything explicitly**: Even when inference works, be clear
- **Use pattern matching extensively**: Compiler enforces exhaustiveness
- **Leverage `expect`**: Makes code clearer than nested when expressions
- **Use stdlib functions**: `list.has`, `dict.get` are optimized
- **Banned patterns**:
  - `todo` or `fail` in production
  - Wildcard `_` in critical validation
  - Hardcoded addresses or policy IDs

### TypeScript/JavaScript

- **Use TypeScript**: Required for all new code
- **Prefer `@lucid-evolution/lucid`**: Modern transaction library from
  Anastasia Labs
- **Use `@meshsdk/core`** for React integrations
- **Follow CIP standards**: CIP-30 for wallets, CIP-25 for NFTs, CIP-57 for
  blueprints
- **Banned patterns**:
  - Storing private keys in code
  - Hardcoded addresses (use env variables)
  - Missing wallet error handling

## Module structure

### Plutus projects

```text
src/
  ├── Validators/
  │   ├── MyValidator.hs        -- Validator logic
  │   └── MyMintingPolicy.hs    -- Minting policies
  ├── Types/
  │   ├── Datum.hs              -- On-chain data types
  │   └── Redeemer.hs           -- Redeemer types
  ├── OffChain/
  │   └── Build.hs              -- Transaction builders
  └── Utils/
      └── OnChain.hs            -- Shared utilities
test/
  └── Spec.hs                    -- Test suite
```

### Aiken projects

```text
validators/
  ├── my_validator.ak            -- Main validator
  └── minting_policy.ak          -- Minting logic
lib/
  ├── types.ak                   -- Shared types
  └── utils.ak                   -- Utility functions
```

### Next.js DApp structure

```text
src/
  ├── app/                       -- Next.js 14+ app router
  ├── components/
  │   ├── wallet/                -- Wallet connection
  │   └── transactions/          -- TX components
  ├── lib/
  │   ├── cardano.ts            -- Lucid/Mesh setup
  │   └── contracts.ts          -- Contract interactions
  └── types/
      └── cardano.ts            -- Cardano type definitions
```

**Naming conventions**:
- Haskell: `mkValidator`, `myValidatorHash`
- Aiken: `my_validator`, `check_signature`
- TypeScript: `connectWallet`, `buildTransaction`

## Error handling & logging

### Plutus trace messages

```haskell
-- Good: Descriptive messages
traceIfFalse "Owner signature required" $ txSignedBy info owner
traceIfFalse "Insufficient funds" $ amount >= minAmount

-- Bad: Generic messages
traceIfFalse "error" condition
```

### Aiken validation

```aiken
// Good: Use expect with clear patterns
expect Some(datum) = datum_opt
expect Spend(_) = ctx.purpose

// Bad: Silent failures
when datum_opt is {
  Some(d) -> d
  None -> error  // What went wrong?
}
```

### TypeScript error handling

```typescript
// Good: Handle all wallet error codes
try {
  const api = await window.cardano.nami.enable();
} catch (error) {
  if (error.code === -1) {
    // User declined
  } else if (error.code === -2) {
    // Wallet not found
  } else {
    // Unknown error
  }
}

// Bad: Generic catch
try {
  await connectWallet();
} catch (e) {
  console.log('error');
}
```

## Smart contract best practices

### Security (MANDATORY for mainnet)

1. **Complete pattern matching**: Handle all cases
2. **Validate all inputs**: Datum, redeemer, and context
3. **Check time ranges**: For time-sensitive logic
4. **Verify token policies**: Don't trust datum alone
5. **No partial functions**: Every branch must be handled
6. **Audit before deployment**: Professional review required

### Performance optimization

**Plutus**:
- Use `{-# INLINABLE #-}` on all on-chain functions
- Minimize `BuiltinData` conversions
- Avoid unnecessary list operations
- Keep scripts small (every byte costs)

**Aiken**:
- Use stdlib functions (pre-optimized)
- Prefer `when` over nested `if`
- Use `expect` for guaranteed patterns
- Let the compiler optimize

### Transaction building

**With Lucid Evolution**:
```typescript
import { Lucid, Blockfrost, Data } from '@lucid-evolution/lucid';

const lucid = await Lucid(
  new Blockfrost(url, apiKey),
  'Preprod'
);

const tx = await lucid
  .newTx()
  .payToContract(address, { inline: datum }, assets)
  .complete();

const signedTx = await tx.sign.withWallet().complete();
const txHash = await signedTx.submit();
```

**With Mesh**:
```typescript
import { MeshWallet, Transaction } from '@meshsdk/core';

const tx = new Transaction({ initiator: wallet });
tx.sendLovelace(address, amount);

const unsignedTx = await tx.build();
const signedTx = await wallet.signTx(unsignedTx);
const txHash = await wallet.submitTx(signedTx);
```

## Testing requirements

- **Plutus**: QuickCheck property tests + unit tests
- **Aiken**: Built-in fuzzing + unit tests
- **TypeScript**: Vitest for integration, Playwright for E2E
- **100% coverage** for validator logic (mainnet requirement)

See `testing.instructions.md` and `blockchain-testing.instructions.md` for details.

## Documentation standards

### Haskell (Haddock)

```haskell
-- | Validates that only the owner can unlock funds
-- Checks that the transaction is signed by the owner's public key
mkValidator :: MyDatum -> MyRedeemer -> ScriptContext -> Bool
```

### Aiken (doc comments)

```aiken
/// Validates owner signature
///
/// # Security
/// - Requires transaction signed by owner
/// - No time restrictions
pub fn check_signature(datum: MyDatum, ctx: ScriptContext) -> Bool
```

### TypeScript (JSDoc)

```typescript
/**
 * Connects to a CIP-30 compatible wallet
 * @param walletName - Name of the wallet (e.g., 'nami', 'eternl')
 * @returns Wallet API instance
 * @throws Error if wallet not available or user declines
 */
async function connectWallet(walletName: string): Promise<WalletApi>
```

## Learnings

- **Script size matters more than off-chain performance** - optimize on-chain
  code first (x5)
- **Always use traceIfFalse with descriptive messages** - debugging on-chain is
  hard (x7)
- **CIP-30 wallets require collateral for script transactions** - check and
  guide users (x6)
- **Aiken's built-in formatter saves time** - don't fight it (x3)
- **Lucid Evolution is production-ready** - use it over legacy Lucid (x4)
- **Property tests catch edge cases unit tests miss** - mandatory for
  validators (x6)
- **Testnet behavior sometimes differs from mainnet** - always test both (x3)

## Resources

- [Plutus Documentation](https://plutus.cardano.intersectmbo.org/docs/)
- [Aiken Language Guide](https://aiken-lang.org/)
- [Lucid Evolution Docs](https://anastasia-labs.github.io/lucid-evolution/)
- [Mesh SDK Documentation](https://meshjs.dev/)
- [Cardano CIPs](https://cips.cardano.org/)

```
