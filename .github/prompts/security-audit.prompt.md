---
mode: agent
description: 'Run pre-mainnet security audit checklist for Cardano smart contracts'
tools: ['search', 'edit', 'runCommands']
---
# Security Audit

Perform a comprehensive security audit before mainnet deployment.

## Process

1. **Confirm scope**:
   - Which validators to audit?
   - Plutus or Aiken?
   - Already deployed on testnet?

2. **Run automated security checklist**:

   ### Code Review Checklist

   **Critical vulnerabilities to check**:

   - [ ] **Double satisfaction attack**: Can validator be satisfied twice in same tx?
   - [ ] **Time range validation**: Are time constraints properly validated?
   - [ ] **Datum validation**: Is datum structure validated before use?
   - [ ] **Token validation**: Are policy IDs and asset names verified?
   - [ ] **Integer overflow**: Are all arithmetic operations safe?
   - [ ] **Signature validation**: Are required signatures checked?
   - [ ] **UTxO reference validation**: Are input references properly validated?

3. **Search for common vulnerabilities**:

   Use `grep_search` to find:

   ### Dangerous patterns (Plutus)
   ```bash
   # Search for partial functions
   grep_search("head|tail|init|last|!!|fromJust", isRegexp=true, includePattern="**/*.hs")

   # Search for missing INLINABLE
   grep_search("mkValidator|mkPolicy", isRegexp=true, includePattern="**/*.hs")

   # Search for arithmetic without overflow checks
   grep_search("\\+|\\-|\\*", isRegexp=true, includePattern="**/*.hs")
   ```

   ### Dangerous patterns (Aiken)
   ```bash
   # Search for unwrap without validation
   grep_search("expect Some", isRegexp=false, includePattern="**/*.ak")

   # Search for list operations without checks
   grep_search("list.head|list.tail", isRegexp=true, includePattern="**/*.ak")
   ```

4. **Run test coverage**:

   ```bash
   # Plutus
   cabal test --enable-coverage
   hpc report dist/hpc/tix/**/*.tix

   # Aiken
   aiken check --coverage
   ```

   **Requirement**: 100% branch coverage for validators

5. **Check for specific vulnerabilities**:

   ### Double Satisfaction
   ```typescript
   // Vulnerable: Same validator unlocked twice
   const tx = await lucid.newTx()
     .collectFrom([utxo1], redeemer)
     .collectFrom([utxo2], redeemer) // DANGEROUS!
     .complete();
   ```

   **Fix**: Add unique token or UTxO reference validation:
   ```haskell
   -- Check that specific UTxO is consumed
   let mustConsumeUtxo = any (\i -> txInInfoOutRef i == expectedRef) (txInfoInputs info)
   ```

   ### Time Range Issues
   ```haskell
   -- Vulnerable: No time validation
   mkValidator datum redeemer ctx = True
   ```

   **Fix**: Validate time constraints:
   ```haskell
   let deadline = deadlineField datum
       validRange = txInfoValidRange info
       beforeDeadline = to deadline `contains` validRange
   traceIfFalse "deadline passed" beforeDeadline
   ```

   ### Datum Validation
   ```aiken
   // Vulnerable: Assumes datum structure without validation
   validator unsafe {
     spend(datum: Option<MyDatum>, ...) {
       let d = datum |> unsafe_unwrap  // DANGEROUS!
       d.amount > 0
     }
   }
   ```

   **Fix**: Use expect with error messages:
   ```aiken
   validator safe {
     spend(datum: Option<MyDatum>, ...) {
       expect Some(d) = datum
       expect d.amount > 0
       True
     }
   }
   ```

   ### Integer Overflow
   ```haskell
   -- Vulnerable: Can overflow on large numbers
   let total = amount1 + amount2 + amount3
   ```

   **Fix**: Use safe arithmetic:
   ```haskell
   import PlutusTx.Numeric (addInteger)

   let total = addInteger (addInteger amount1 amount2) amount3
   ```

6. **Review test coverage**:

   Use `read_file` to check test files:
   - Are all branches tested?
   - Are edge cases covered?
   - Are property-based tests included?
   - Are integration tests present?

7. **Generate security report**:

   ```markdown
   # Security Audit Report

   **Validator**: MyValidator v1.0.0
   **Date**: 2024-01-15
   **Auditor**: [Your Name]

   ## Summary

   - **Critical Issues**: 0
   - **High Issues**: 0
   - **Medium Issues**: 1
   - **Low Issues**: 2
   - **Test Coverage**: 100%

   ## Findings

   ### MEDIUM: Insufficient error messages

   **Location**: `validators/MyValidator.hs:45`

   **Issue**: Error messages are not descriptive enough for debugging.

   ```haskell
   traceIfFalse "error" condition
   ```

   **Recommendation**: Add specific error messages:

   ```haskell
   traceIfFalse "owner signature missing" signedByOwner
   ```

   ### LOW: Missing input validation

   **Location**: `validators/MyValidator.hs:52`

   **Issue**: Amount not validated for maximum value.

   **Recommendation**: Add maximum amount check to prevent economic attacks.

   ## Test Coverage

   - Unit tests: 45/45 passed (100%)
   - Property tests: 12/12 passed (100%)
   - Integration tests: 8/8 passed (100%)

   ## Testnet Validation

   - **Network**: Preprod
   - **Duration**: 15 days
   - **Transactions**: 1,247
   - **Success Rate**: 99.8%
   - **Issues**: None

   ## Recommendations

   1. ✅ Fix medium severity issue before mainnet
   2. ✅ Consider formal verification
   3. ✅ Implement gradual rollout (start with 100K ADA limit)
   4. ✅ Set up monitoring and alerting
   5. ✅ Prepare emergency response plan

   ## Approval

   **Status**: APPROVED for mainnet deployment after addressing medium issue

   **Sign-off**: [Auditor Name], [Date]
   ```

8. **Pre-deployment checklist**:

   ```bash
   # Run all checks
   #!/bin/bash

   echo "🔍 Running security audit..."

   # 1. Test coverage
   echo "1. Checking test coverage..."
   cabal test --enable-coverage || aiken check --coverage

   # 2. Search for dangerous patterns
   echo "2. Searching for vulnerabilities..."
   grep -r "head\|tail\|!!" validators/ && echo "⚠️  Found partial functions!"

   # 3. Run linter
   echo "3. Running linter..."
   hlint validators/ || echo "⚠️  Lint warnings found"

   # 4. Build artifacts
   echo "4. Building deployment artifacts..."
   cabal build || aiken build

   # 5. Validate blueprint
   echo "5. Validating CIP-57 blueprint..."
   cat plutus-blueprint.json | jq . || echo "⚠️  Invalid blueprint JSON"

   # 6. Check testnet deployment
   echo "6. Verifying testnet deployment..."
   if [ -f "deployments/preprod.json" ]; then
     cat deployments/preprod.json | jq .
   else
     echo "❌ No testnet deployment found! Deploy to preprod first."
     exit 1
   fi

   echo "✅ Security audit complete!"
   ```

## External audit providers

If critical smart contract (high TVL), consider professional audit:

1. **MLabs**: https://mlabs.city/ (Haskell/Plutus specialists)
2. **Tweag**: https://www.tweag.io/ (Formal verification)
3. **Runtime Verification**: https://runtimeverification.com/ (K framework)
4. **Certik**: https://www.certik.com/ (Blockchain security)

**Cost**: $10K-$50K depending on complexity
**Duration**: 2-4 weeks

## Mainnet deployment approval gate

Create GitHub workflow (`.github/workflows/mainnet-checklist.yml`):

```yaml
name: Mainnet Deployment Checklist

on:
  workflow_dispatch:
    inputs:
      validator_name:
        description: 'Validator to deploy'
        required: true

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check test coverage
        run: cabal test --enable-coverage

      - name: Security scan
        run: |
          grep -r "head\|tail\|!!" validators/ && exit 1 || true

      - name: Verify testnet deployment
        run: |
          test -f deployments/preprod.json || exit 1

      - name: Human approval required
        uses: trstringer/manual-approval@v1
        with:
          approvers: security-team
          minimum-approvals: 2
```

## Resources

Reference:
- `.github/instructions/smart-contract-security.instructions.md`
- `.github/instructions/testing.instructions.md`
- `.github/instructions/release-process.instructions.md`

```
