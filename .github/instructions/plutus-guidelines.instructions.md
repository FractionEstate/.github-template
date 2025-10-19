---
description: Haskell and Plutus smart contract development conventions
applyTo: "src/**/*.hs"
---
# Plutus Guidelines

This document provides guidelines for writing Plutus smart contracts in
Haskell using the PlutusTx compiler.

## Language preferences

- **Use PlutusTx-compatible Haskell**:
  - Other GHC features often fail on-chain.
  - Follow the Prelude listed in Resources.
- **Prefer inlineable functions**:
  - Annotate on-chain helpers with `INLINABLE` for PlutusTx optimization.
- **Avoid partial functions**:
  - Swap `head`, `tail`, and `!!` for pattern matching or `Maybe`.
- **Use `BuiltinData` efficiently**:
  - Convert to and from `BuiltinData` only at validator edges to save space.
- **Banned patterns**:
  - Direct use of `String` (prefer `BuiltinByteString`)
  - `error` without context (use `traceError` with clear messages)
  - Recursive data types without deliberate script size analysis

## Module structure

```text
-- Recommended structure for Plutus projects
src/
    ├── Validators/
    │   ├── MyValidator.hs          -- Main validator logic
    │   └── MyMintingPolicy.hs      -- Minting policy scripts
    ├── Types/
    │   ├── Datum.hs                -- On-chain datum types
    │   └── Redeemer.hs             -- On-chain redeemer types
    ├── OffChain/
    │   └── Build.hs                -- Transaction building helpers
    └── Utils/
            └── OnChain.hs              -- Shared on-chain utilities
```

- **Validators** go in `Validators/` with one validator per file.
- **Datum and Redeemer types** must derive `ToData`, `FromData`, and
  `UnsafeFromData`.
- **Off-chain code** stays separate from on-chain code to prevent
  accidental inclusion in scripts.
- **Naming convention**: Use descriptive names like `mkMyValidator`,
  `myValidatorHash`, and `myValidatorScript`.

## Writing validators

### Basic validator template

Add these LANGUAGE pragmas at the top of the module to enable Plutus-compatible features:

- DataKinds
- NoImplicitPrelude
- TemplateHaskell
- ScopedTypeVariables

```haskell
module Validators.MyValidator where

import PlutusTx
import PlutusTx.Prelude
import Plutus.V3.Ledger.Api (ScriptContext, Validator, mkValidatorScript)
import Plutus.Script.Utils.V3.Typed.Scripts qualified as V3Scripts

data MyDatum = MyDatum
    { owner :: PubKeyHash
    , amount :: Integer
    }

PlutusTx.unstableMakeIsData ''MyDatum

data MyRedeemer = Unlock | Update Integer

PlutusTx.unstableMakeIsData ''MyRedeemer

mkValidator :: MyDatum -> MyRedeemer -> ScriptContext -> Bool
mkValidator datum redeemer ctx =
    traceIfFalse "validation failed" $
        case redeemer of
            Unlock -> checkSignature datum ctx
            Update n -> checkUpdate n datum ctx

checkSignature :: MyDatum -> ScriptContext -> Bool
checkSignature datum ctx =
    txSignedBy (scriptContextTxInfo ctx) (owner datum)

validator :: Validator
validator = mkValidatorScript $$(PlutusTx.compile [|| mkValidator ||])
```

### Key conventions

1. **Mark on-chain functions as INLINABLE** using the `INLINABLE` pragma so
  PlutusTx can optimize them.
2. **Trace errors with context**: Use `traceIfFalse "descriptive
  message"` not just `False`.
3. **Pattern match explicitly**: Avoid wildcards in validators for
  security.
4. **Check all constraints**: Time ranges, signatures, token amounts, and
  datum fields.
5. **Minimize script size**: Every byte costs. Use `BuiltinByteString` and
  avoid unnecessary conversions.

## Error handling & debugging

### Trace messages

```haskell
-- Good: Descriptive trace messages
traceIfFalse "Owner signature missing" $ txSignedBy info (owner datum)
traceIfFalse "Insufficient collateral" $ amount >= minAmount

-- Bad: Generic or missing messages
traceIfFalse "error" condition
if condition then True else False  -- No trace at all
```

### Common validation patterns

```haskell
-- Check signatures
txSignedBy (scriptContextTxInfo ctx) pkh

-- Check time ranges
from `contains` txInfoValidRange info

-- Check tokens
valueOf (valuePaidTo info addr) curSymbol tokenName >= expectedAmount

-- Check datum continuity
let Just outputDatum = getDatum output
    in inputDatum == outputDatum
```

## Testing & simulation

- **Use plutus-ledger-api for testing**: Import test utilities from
  `plutus-ledger-api-*` packages.
- **Test on preprod network before mainnet**: Deploy to testnet using
  `cardano-cli`.
- **Measure script costs**: Use `evaluateScriptCounting` to estimate
  execution units.
- **Property testing**: Use QuickCheck with `PlutusTx.Arbitrary`
  instances.

```haskell
-- Example property test
prop_validatorAcceptsCorrectRedeemer :: MyDatum -> Property
prop_validatorAcceptsCorrectRedeemer datum =
    let redeemer = Unlock
        ctx = mockScriptContext datum redeemer
    in mkValidator datum redeemer ctx === True
```

## Security considerations

⚠️ **CRITICAL FOR MAINNET:**

1. **No partial functions**: Every `case` must handle all constructors.
2. **Validate all inputs**: Check datum, redeemer, and context
  completely.
3. **Time range attacks**: Always validate `txInfoValidRange` for
  time-sensitive logic.
4. **Double satisfaction**: Ensure scripts cannot be exploited by clever
  UTxO combinations.
5. **Integer overflow**: Use checked arithmetic; the PlutusTx prelude has
  safe operations.
6. **Audit before deployment**: Get a professional audit for mainnet
  validators.

## Documentation

- **Add Haddock comments** to all exported functions.
- **Document the validator's purpose** and key security assumptions.
- **Include usage examples** that show how to build transactions with this
  validator.
- **Reference CIP standards** when the validator implements specific token
  standards.

## Resources

<!-- markdownlint-disable MD013 -->
- Plutus Documentation: <https://plutus.cardano.intersectmbo.org/docs/>
- PlutusTx API: <https://plutus.cardano.intersectmbo.org/haddock/latest/plutus-tx/PlutusTx.html>
- Ledger API: <https://plutus.cardano.intersectmbo.org/haddock/latest/plutus-ledger-api/Plutus-V3-Ledger-Api.html>
- Cardano Developer Portal: <https://developers.cardano.org/docs/smart-contracts/>
<!-- markdownlint-enable MD013 -->

## Learnings

- **Script size matters more than off-chain performance**: Optimize for
  small on-chain code (x3).
- **Always use `traceIfFalse`, never silent failures**: Debugging on-chain
  is hard (x5).
- **Test with realistic UTxO sets**: What works in unit tests may fail
  on-chain (x2).
