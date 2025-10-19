{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE ImportQualifiedPost #-}
{-# LANGUAGE NumericUnderscores  #-}
{-# LANGUAGE OverloadedStrings   #-}

module Main (main) where

import Test.Tasty
import Test.Tasty.HUnit
import PlutusLedgerApi.V3
import PlutusTx.Prelude qualified as P

import Validators.MyValidator

main :: IO ()
main = defaultMain tests

tests :: TestTree
tests = testGroup "Validator Tests"
  [ testCase "Valid datum and redeemer" testValid
  , testCase "Invalid datum and redeemer" testInvalid
  ]

testValid :: Assertion
testValid = do
  let datum = MyDatum 42
      redeemer = MyRedeemer 42
      ctx = undefined  -- Mock ScriptContext

  mkValidator datum redeemer ctx @?= True

testInvalid :: Assertion
testInvalid = do
  let datum = MyDatum 42
      redeemer = MyRedeemer 99
      ctx = undefined

  mkValidator datum redeemer ctx @?= False
