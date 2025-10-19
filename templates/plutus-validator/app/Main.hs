{-# LANGUAGE ImportQualifiedPost #-}

module Main (main) where

import System.Environment (getArgs)
import Validators.AlwaysSucceeds qualified as AlwaysSucceeds
import Validators.MyValidator qualified as MyValidator
import Utils.Serialization

main :: IO ()
main = do
  args <- getArgs
  case args of
    ["--validator", name, "--output", path] -> serializeValidator name path
    _ -> putStrLn "Usage: serialize --validator <name> --output <path>"

serializeValidator :: String -> FilePath -> IO ()
serializeValidator name path = case name of
  "AlwaysSucceeds" -> writeValidator AlwaysSucceeds.validator path
  "MyValidator"    -> writeValidator MyValidator.validator path
  _                -> putStrLn $ "Unknown validator: " ++ name
