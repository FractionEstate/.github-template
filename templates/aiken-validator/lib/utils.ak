use aiken/hash.{Blake2b_256, Hash}
use aiken/transaction.{ScriptContext, Transaction}

/// Utility functions for validators

/// Check if a public key hash signed the transaction
pub fn signed_by(tx: Transaction, pkh: Hash<Blake2b_256, ByteArray>) -> Bool {
  list.has(tx.extra_signatories, pkh)
}

/// Check if a value is within a range
pub fn in_range(value: Int, min: Int, max: Int) -> Bool {
  value >= min && value <= max
}
