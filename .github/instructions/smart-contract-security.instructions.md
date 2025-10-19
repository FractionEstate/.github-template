---
description: Smart contract security auditing and mainnet deployment checklist
applyTo: "validators/**/*.{hs,ak}"
---

# Smart Contract Security

This document outlines security requirements for Cardano smart
contracts, with **mandatory** checks for mainnet deployment.

## Security philosophy

> **Mainnet Deployment Rule**: No smart contract handling real value
> should reach mainnet without completing the Pre-Deployment Checklist
> and passing all security scans.

Smart contracts are immutable once deployed. Vulnerabilities can cause
permanent loss of funds. Security is not optional.

## Pre-deployment checklist

⚠️ **MANDATORY FOR MAINNET DEPLOYMENT**

- [ ] **Security Audit Completed**
  - Professional third-party audit performed
  - All critical and high-severity issues resolved
  - Audit report published and linked in repository

- [ ] **Testnet Validation**
  - Deployed to preprod/preview network
  - Tested with realistic scenarios and edge cases
  - Monitored for at least 2 weeks under real conditions
  - No unexpected behaviors or failures observed

- [ ] **Security Scanning**
  - Automated security scanners run (see Tools section)
  - Static analysis completed
  - No critical vulnerabilities detected
  - All warnings reviewed and addressed

- [ ] **CIP-57 Blueprint Published**
  - `plutus.json` or blueprint file generated
  - Schema validated and published
  - Off-chain code tested against blueprint

- [ ] **Documentation Complete**
  - Validator purpose and logic documented
  - Security assumptions clearly stated
  - Known limitations documented
  - Deployment parameters recorded

- [ ] **Code Review**
  - At least 2 experienced developers reviewed code
  - All edge cases considered
  - Attack vectors analyzed
  - Formal verification considered for high-value contracts

## Known vulnerabilities

### 1. Double Satisfaction Attack

**Description**: Validator can be satisfied multiple times in a single
transaction, draining funds.

**Example (Plutus)**:

```haskell
-- VULNERABLE
mkValidator :: Datum -> Redeemer -> ScriptContext -> Bool
mkValidator _ _ ctx =
    -- Only checks that owner signed, but doesn't ensure
    -- this specific UTxO is being spent correctly
    txSignedBy (scriptContextTxInfo ctx) owner
```

**Fix**:

```haskell
-- SECURE
mkValidator :: Datum -> Redeemer -> ScriptContext -> Bool
mkValidator datum redeemer ctx =
    let ownInput = findOwnInput ctx
        ownOutput = getContinuingOutput ctx
    in checkInputOutput ownInput ownOutput && txSignedBy info owner
```

**Example (Aiken)**:

```aiken
// VULNERABLE
validator my_validator {
  spend(_datum, _redeemer, _ref, ctx) {
    list.has(ctx.transaction.extra_signatories, owner)
  }
}

// SECURE
validator my_validator {
    spend(datum, redeemer, own_ref, ctx) {
      expect Some(own_input) =
        list.find(
          ctx.transaction.inputs,
          fn(input) { input.output_reference == own_ref }
        )

    // Check this specific input's conditions
    check_input_specific_logic(own_input, datum) &&
    list.has(ctx.transaction.extra_signatories, owner)
  }
}
```

### 2. Time Range Validation

**Description**: Failing to validate transaction time ranges properly
allows time-based exploits.

**Plutus Fix**:

```haskell
-- Check time range properly
checkTimeRange :: ScriptContext -> Bool
checkTimeRange ctx =
    let range = txInfoValidRange (scriptContextTxInfo ctx)
        deadline = POSIXTime 1699999999000
    in deadline `contains` range
```

**Aiken Fix**:

```aiken
use aiken/interval

fn check_deadline(ctx: ScriptContext, deadline: Int) -> Bool {
  interval.is_entirely_before(ctx.transaction.validity_range, deadline)
}
```

### 3. Datum Validation

**Description**: Not validating datum structure or continuity allows data corruption.

**Plutus Fix**:

```haskell
-- Validate datum structure
checkDatum :: MyDatum -> Bool
checkDatum datum =
    amount datum > 0 &&
    isJust (owner datum) &&
    isValidAddress (beneficiary datum)

-- Check datum continuity
checkContinuity :: MyDatum -> TxOut -> Bool
checkContinuity inputDatum outputDatum =
    inputDatum == outputDatum
```

**Aiken Fix**:

```aiken
fn validate_datum(datum: MyDatum) -> Bool {
  datum.amount > 0 &&
  bytearray.length(datum.owner) == 28  // Valid PKH length
}

fn check_continuity(input_datum: MyDatum, output_datum: MyDatum) -> Bool {
  input_datum == output_datum
}
```

### 4. Token Policy Validation

**Description**: Not verifying token policy IDs allows fake tokens to be accepted.

**Plutus Fix**:

```haskell
-- Always check policy ID
checkToken :: Value -> CurrencySymbol -> TokenName -> Integer -> Bool
checkToken val expectedPolicy expectedName minAmount =
    valueOf val expectedPolicy expectedName >= minAmount
```

**Aiken Fix**:

```aiken
fn check_token(val: Value, policy: PolicyId, name: AssetName, min: Int) -> Bool {
  value.quantity_of(val, policy, name) >= min
}
```

### 5. Integer Overflow/Underflow

**Description**: Arithmetic operations without bounds checking.

**Plutus Fix**:

```haskell
-- Use safe arithmetic
safeAdd :: Integer -> Integer -> Maybe Integer
safeAdd a b
    | b > 0 && a > maxBound - b = Nothing
    | b < 0 && a < minBound - b = Nothing
    | otherwise = Just (a + b)
```

**Aiken Fix**:

```aiken
// Aiken integers are unbounded, but check realistic limits
fn safe_add(a: Int, b: Int, max_value: Int) -> Bool {
  let result = a + b
  result <= max_value && result >= 0
}
```

## Security tools

### Automated Scanning (Required)

1. **Plutus Static Analysis**

  ```bash
   # Use HLint for Haskell
   hlint src/

   # Check for common pitfalls
   cabal test --test-show-details=direct
   ```

1. **Aiken Built-in Checks**

  ```bash
   # Aiken has built-in security checks
   aiken check --verbose

   # Generate coverage report
   aiken check --coverage
   ```

1. **Script Size Analysis**

  ```bash
   # Plutus
   cabal run script-size-analyzer

   # Aiken
   aiken build --trace-level compact
   ```

### Manual Audit Checklist

- [ ] All inputs validated (datum, redeemer, script context)
- [ ] No partial functions used
- [ ] Time ranges checked where relevant
- [ ] Token policies verified
- [ ] Signature checks are complete
- [ ] No information leakage in error messages
- [ ] Script size optimized (every byte matters)
- [ ] Execution units within limits (mem/cpu)

### Testing Requirements

**Unit Tests**: 100% path coverage

```haskell
-- Plutus: Test all validator branches
test_unlockWithSignature :: TestTree
test_unlockWithOwnerSignature :: TestTree
test_unlockWithoutSignatureFails :: TestTree
test_updateWithValidAmount :: TestTree
test_updateWithInvalidAmountFails :: TestTree
```

```aiken
// Aiken: Use built-in test framework
test unlock_success() { ... }
test unlock_fails_without_signature() { ... }
test update_increases_amount() { ... }
test update_fails_with_negative() { ... }
```

**Property Tests**: Fuzz testing for edge cases

```haskell
-- Plutus with QuickCheck
prop_validatorRejectsNegativeAmounts :: Property
```

```aiken
// Aiken built-in fuzzing
test prop_amount_positive(amt via int.between(0, 1000000)) {
  amt >= 0
}
```

**Integration Tests**: Test with Lucid Evolution/Mesh

```typescript
// Transaction building test
describe('Validator Integration', () => {
  it('should lock and unlock funds', async () => {
    const lucid = await Lucid(provider, "Preprod");
    const tx = await lucid.newTx()
      .payToContract(validatorAddress, datum)
      .complete();
    // ... assertions
  });
});
```

## Responsible disclosure

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email security@[your-domain].com with:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fixes (if any)
3. Wait for confirmation before public disclosure
4. Allow 90 days for patch development

## Security audit providers

Recommended audit firms for Cardano:

- MLabs (<https://mlabs.city/>): Specialized in Plutus audits.
- Tweag (<https://www.tweag.io/>): Formal verification experts.
- Runtime Verification (<https://runtimeverification.com/>): K framework
  audits.
- Certik (<https://www.certik.com/>): Blockchain security audits.

## Mainnet deployment process

1. ✅ Complete pre-deployment checklist
2. ✅ Security audit performed and passed
3. ✅ Testnet deployment validated (minimum 2 weeks)
4. ✅ Community review period (optional but recommended)
5. ✅ Generate and publish CIP-57 blueprint
6. 🚀 Deploy to mainnet
7. 📢 Announce deployment with:
   - Validator hash
   - Script address
   - Audit report link
   - Blueprint JSON link
   - Usage documentation

## Post-deployment monitoring

⚠️ **Contract is live and immutable**: Monitor carefully.

- Set up alerting for unusual activity
- Monitor script execution counts
- Track value locked in contract
- Watch for failed transaction patterns
- Document any edge cases discovered
- Prepare incident response plan

## Learnings

- **Time-range attacks are the most common vulnerability**: Always
  validate time bounds (x7).
- **Manual audits catch what automated tools miss**: Both approaches are
  necessary (x5).
- **Testnet behavior differs from mainnet**: Test with realistic
  scenarios (x4).
- **Integer arithmetic needs explicit bounds**: Be careful with lovelace
  calculations (x3).
- **Documentation is part of security**: Unclear docs lead to misuse
  (x6).

## Resources

<!-- markdownlint-disable MD013 -->
- IOHK Security Advisories: <https://github.com/input-output-hk/cardano-node/security/advisories>
- Plutus Security Best Practices: <https://plutus.cardano.intersectmbo.org/docs/security>
- Cardano Smart Contract Security: <https://developers.cardano.org/docs/smart-contracts/security/>
<!-- markdownlint-enable MD013 -->
