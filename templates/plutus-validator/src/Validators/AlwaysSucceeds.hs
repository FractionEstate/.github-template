{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE ImportQualifiedPost #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE TemplateHaskell     #-}

module Validators.AlwaysSucceeds (
  validator,
  validatorHash,
  scriptAddress,
) where

import PlutusLedgerApi.V3
import PlutusTx
import PlutusTx.Prelude

-- | Validator that always succeeds (useful for testing)
{-# INLINABLE mkValidator #-}
mkValidator :: BuiltinData -> BuiltinData -> ScriptContext -> Bool
mkValidator _ _ _ = True

-- | Compile to Plutus Core
validator :: Validator
validator = mkValidatorScript $$(compile [|| mkValidator ||])

-- | Get validator hash
validatorHash :: ValidatorHash
validatorHash = Scripts.validatorHash validator

-- | Get script address
scriptAddress :: Address
scriptAddress = scriptHashAddress validatorHash
