---
mode: agent
description: 'Generate Plutus or Aiken smart contract validators with tests and security checks'
tools: ['new', 'edit', 'search']
---
# Validator Prompt

Generate a production-ready Cardano validator based on user requirements.

## Process

1. **Clarify requirements**:
   - Purpose of validator (lock/unlock, minting policy, staking, etc.)
   - Language preference (Plutus or Aiken - ask if not specified)
   - Datum and redeemer structure
   - Validation rules
   - Security considerations

2. **Choose language**:
   - **Plutus** (Haskell): For complex logic, existing Haskell codebase,
     maximum compatibility
   - **Aiken**: For modern syntax, faster compilation, better DX, built-in testing

3. **Generate validator**:

   **Plutus template**

   ```haskell
   -- LANGUAGE pragmas: DataKinds, TemplateHaskell, NoImplicitPrelude, OverloadedStrings

   module MyValidator where

   import PlutusTx
   import PlutusTx.Prelude
   import Plutus.V2.Ledger.Api
   import Plutus.V2.Ledger.Contexts

   data MyDatum = MyDatum
     { owner :: PubKeyHash
     , amount :: Integer
     }
   PlutusTx.unstableMakeIsData ''MyDatum

   data MyRedeemer = Unlock | Update Integer
   PlutusTx.unstableMakeIsData ''MyRedeemer

   -- INLINABLE pragma recommended here for on-chain performance
   mkValidator :: MyDatum -> MyRedeemer -> ScriptContext -> Bool
   mkValidator datum redeemer ctx = case redeemer of
     Unlock ->
       traceIfFalse "wrong signer" signedByOwner
     Update newAmount ->
       traceIfFalse "amount must be positive" (newAmount > 0) &&
       traceIfFalse "wrong signer" signedByOwner
     where
       info :: TxInfo
       info = scriptContextTxInfo ctx

       signedByOwner :: Bool
       signedByOwner = txSignedBy info (owner datum)
   ```

   **Aiken template**

   ```aiken
   use aiken/collection/list
   use aiken/crypto.{VerificationKeyHash}
   use cardano/transaction.{OutputReference, Transaction}

   pub type MyDatum {
     owner: VerificationKeyHash,
     amount: Int,
   }

   pub type MyRedeemer {
     Unlock
     Update(Int)
   }

   validator my_validator {
     spend(
       datum: Option<MyDatum>,
       redeemer: MyRedeemer,
       _own_ref: OutputReference,
       self: Transaction,
     ) {
       expect Some(d) = datum

       when redeemer is {
         Unlock -> {
           expect list.has(self.extra_signatories, d.owner)
           True
         }
         Update(new_amount) -> {
           expect new_amount > 0
           expect list.has(self.extra_signatories, d.owner)
           True
         }
       }
     }
   }
   ```

4. **Add tests**:

   **Plutus tests**

   ```haskell
   import Test.Tasty
   import Test.Tasty.HUnit

   test_validUnlock :: Assertion
   test_validUnlock = do
     let datum = MyDatum (PubKeyHash "abc") 100
         redeemer = Unlock
         ctx = mockContextWithSigner (PubKeyHash "abc")
     mkValidator datum redeemer ctx @?= True
   ```

   **Aiken tests**

   ```aiken
   use aiken/bytes

   test unlock_success() {
     let datum = Some(MyDatum { owner: bytes.from_hex("616263"), amount: 100 })
     let redeemer = Unlock
     my_validator.spend(datum, redeemer, mock_utxo_ref(1), mock_tx())
   }

   test prop_amount_positive(amt via int.between(1, 1000000)) {
     amt > 0
   }
   ```

5. **Add documentation**:

   - Explain validation logic
   - Document datum/redeemer fields
   - Provide usage examples with Lucid Evolution
   - Note security considerations

6. **Security checklist**:

   - [ ] No partial functions (Plutus)
   - [ ] All branches validated
   - [ ] Time range checked (if applicable)
   - [ ] Datum validated
   - [ ] No double satisfaction vulnerability
   - [ ] Integer overflow protection
   - [ ] Proper error messages (traceIfFalse/expect)

## Required files

- `validators/MyValidator.hs` or `validators/my_validator.ak`
- `test/MyValidatorSpec.hs` or tests in Aiken file
- `README.md` section explaining validator
- Off-chain code example (Lucid Evolution)

## Resources

Use `semantic_search` to look up CIP standards if needed:

- CIP-57 for blueprint generation
- CIP-30 for wallet integration
- CIP-68 for datum metadata patterns

Reference these instructions:

- `.github/instructions/plutus-guidelines.instructions.md`
- `.github/instructions/aiken-guidelines.instructions.md`
- `.github/instructions/smart-contract-security.instructions.md`
- `.github/instructions/blockchain-testing.instructions.md`
