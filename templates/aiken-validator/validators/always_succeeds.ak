use aiken/transaction.{ScriptContext}

/// Validator that always succeeds (useful for testing)
validator always_succeeds {
  spend(_datum: Option<Data>, _redeemer: Data, _own_ref: Data, _ctx: ScriptContext) {
    True
  }
}

test always_succeeds_test() {
  always_succeeds.spend(None, Void, Void, mock_context()) == True
}

// Mock context for testing
fn mock_context() -> ScriptContext {
  todo @"Implement mock ScriptContext for tests"
}
