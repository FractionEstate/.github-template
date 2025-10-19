{-# LANGUAGE ImportQualifiedPost #-}

module Utils.Serialization (
  writeValidator,
  writeMintingPolicy,
) where

import Cardano.Api
import Cardano.Api.Shelley (PlutusScript (..))
import Codec.Serialise (serialise)
import Data.ByteString.Lazy qualified as LBS
import Data.ByteString.Short qualified as SBS
import PlutusLedgerApi.V3 (Validator, MintingPolicy)

-- | Write validator to file
writeValidator :: Validator -> FilePath -> IO ()
writeValidator v path = do
  let script = PlutusScriptSerialised $ SBS.toShort $ LBS.toStrict $ serialise v
  result <- writeFileTextEnvelope @(PlutusScript PlutusScriptV3) path Nothing script
  case result of
    Left err -> print err
    Right () -> putStrLn $ "Wrote validator to " ++ path

-- | Write minting policy to file
writeMintingPolicy :: MintingPolicy -> FilePath -> IO ()
writeMintingPolicy p path = do
  let script = PlutusScriptSerialised $ SBS.toShort $ LBS.toStrict $ serialise p
  result <- writeFileTextEnvelope @(PlutusScript PlutusScriptV3) path Nothing script
  case result of
    Left err -> print err
    Right () -> putStrLn $ "Wrote minting policy to " ++ path
