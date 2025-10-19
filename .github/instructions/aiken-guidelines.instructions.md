---
description: Aiken smart contract development conventions
applyTo: "validators/**/*.ak"
---

# Aiken Guidelines

This document provides guidance for writing Cardano smart contracts in
Aiken, a functional language designed for Plutus development.

## Language preferences

- **Type everything explicitly**: Aiken's type inference is powerful, but
  explicit annotations improve readability.
- **Use pattern matching extensively**: Exhaustiveness checking prevents
  latent bugs.
- **Prefer immutability**: All values stay immutable by default; embrace
  that model.
- **Leverage built-in validation helpers**: The stdlib includes optimized
  functions for common checks.
- **Banned patterns**:
  - `todo` or `fail` in production code
  - Wildcard patterns `_` in critical validation logic
  - Hardcoded addresses or policy IDs (use constants or parameterize)

## Module structure

```text
validators/
  ├── my_validator.ak           -- Main validator logic
  ├── minting_policy.ak         -- Minting policies
lib/
  ├── types.ak                  -- Shared type definitions
  └── utils.ak                  -- Utility functions
```

- **One validator per file** in the `validators/` directory.
- **Shared types** belong in `lib/types.ak`.
- **Helper functions** live in `lib/utils.ak`.
- **Test files** match validator names:
  `validators/my_validator.ak` → `validators/my_validator_test.ak`.

## Project configuration

```toml
# aiken.toml
name = "my-project"
version = "0.0.1"
license = "Apache-2.0"
description = "My Cardano smart contract"

[repository]
user = "my-org"
project = "my-project"
platform = "github"

[[dependencies]]
name = "aiken-lang/stdlib"
version = "1.9.0"
source = "github"
```

## Writing validators

### Basic validator template

```aiken
use aiken/hash.{Blake2b_224, Hash}
use aiken/transaction.{ScriptContext, Spend}
use aiken/transaction/credential.{VerificationKey}

// Define datum type
pub type MyDatum {
  owner: Hash<Blake2b_224, VerificationKey>,
  amount: Int,
}

// Define redeemer type
pub type MyRedeemer {
  Unlock
  Update { new_amount: Int }
}

// Main validator function
validator my_validator {
  spend(
    datum: Option<MyDatum>,
    redeemer: MyRedeemer,
    _own_ref: Data,
    ctx: ScriptContext,
  ) {
    // Extract datum
    expect Some(my_datum) = datum

    // Pattern match on redeemer
    when redeemer is {
      Unlock -> check_signature(my_datum, ctx)
      Update { new_amount } -> check_update(my_datum, new_amount, ctx)
    }
  }
}

fn check_signature(datum: MyDatum, ctx: ScriptContext) -> Bool {
  let ScriptContext { transaction, purpose } = ctx
  expect Spend(_) = purpose

  list.has(transaction.extra_signatories, datum.owner)
}

fn check_update(datum: MyDatum, new_amount: Int, ctx: ScriptContext) -> Bool {
  // Validation logic
  new_amount > datum.amount
}
```

### Key conventions

1. **Use `expect` for guaranteed patterns**: It clarifies intent and
  produces better error messages.
2. **Name validator functions descriptively**: Choose `spend`, `mint`, or
  `withdraw` based on purpose.
3. **Extract `ScriptContext` fields explicitly**: Avoid passing the entire
  context to helpers.
4. **Use stdlib functions**: Helpers like `list.has`, `dict.get`, and
  `bytearray.concat` are optimized.
5. **Add type annotations to public functions**: They improve
  documentation and catch mistakes.

## Error handling

### Using expect

```aiken
// Good: Clear error messages with expect
expect Some(datum) = datum_opt
expect Spend(own_ref) = ctx.purpose
expect [input] = own_inputs  // Pattern matching in expect

// Bad: Unclear failures
when datum_opt is {
  Some(d) -> d
  None -> error  // What went wrong?
}
```

### Validation patterns

```aiken
// Check signatures
list.has(transaction.extra_signatories, owner)

// Check time ranges
interval.is_entirely_after(transaction.validity_range, deadline)

// Check tokens
value.quantity_of(input.value, policy_id, asset_name) >= required_amount

// Check datum continuity
expect Some(output_datum) = dict.get(transaction.datums, output.datum)
input_datum == output_datum
```

## Testing with Aiken

Aiken has built-in testing framework:

```aiken
use aiken/bytes
use aiken/transaction.{ScriptContext, Transaction}
use aiken/transaction/value

test unlock_with_owner_signature() {
  let owner_pkh = bytes.from_hex("00112233")
  let datum = MyDatum {
    owner: owner_pkh,
    amount: 1000,
  }

  let redeemer = Unlock

  let ctx = ScriptContext {
    transaction: Transaction {
      extra_signatories: [owner_pkh],
      ..placeholder()
    },
    purpose: Spend(bytes.from_hex("abcd")),
  }

  my_validator.spend(Some(datum), redeemer, bytes.empty(), ctx)
}

test update_increases_amount() {
  // Negative test case
  let datum = MyDatum { owner: bytes.from_hex("00112233"), amount: 1000 }
  let redeemer = Update { new_amount: 500 }

  !check_update(datum, 500, placeholder_ctx())
}
```

Run tests with:

```bash
aiken check
```

## Property-based testing

Aiken supports property testing (fuzzing):

```aiken
test prop_amount_always_positive(amount via int.between(1, 1000000)) {
  let datum = MyDatum { owner: bytes.from_hex("00"), amount: amount }
  amount > 0
}
```

## Blueprint generation (CIP-57)

Aiken automatically generates blueprints:

```bash
aiken build
```

This creates `plutus.json` which contains:

- Validator compiled code
- Parameter schemas
- Type definitions
- Documentation

Use this for off-chain integration with Lucid Evolution or Mesh.

## Security considerations

⚠️ **CRITICAL FOR MAINNET:**

1. **Complete pattern matching**: The compiler enforces exhaustiveness, so
  avoid wildcards in security logic.
2. **Validate all script purposes**: Check `expect Spend(_) = purpose`
  before handling spending logic.
3. **Time range validation**: Use `interval` functions to check
  transaction validity ranges.
4. **Token validation**: Always verify policy IDs and asset names; do not
  trust the datum alone.
5. **Integer bounds**: Aiken integers are unbounded, so enforce realistic
  limits.
6. **Audit before deployment**: A professional security audit is
  mandatory for mainnet.

## Documentation

- **Add doc comments** with `///` for public functions.
- **Document validator purpose** and key security assumptions.
- **Include usage examples** directly in doc comments.
- **Reference CIP standards** when implementing token standards.

```aiken

/// Validates that only the owner can unlock funds
///
/// # Security Assumptions
/// - Owner's public key hash is correctly set in datum
/// - No time-based restrictions (can unlock anytime)
///
/// # Arguments
/// - `datum`: Must contain valid owner public key hash
/// - `redeemer`: Must be Unlock variant
/// - `ctx`: Transaction context with owner signature
pub fn check_signature(datum: MyDatum, ctx: ScriptContext) -> Bool {
  list.has(ctx.transaction.extra_signatories, datum.owner)
}

```

## Code style

- **Use Aiken's built-in formatter**: It runs automatically on
  `aiken check`.
- **Snake_case for functions and variables**: Prefer names like
  `check_signature` and `my_datum`.
- **PascalCase for types**: Use names such as `MyDatum` and `MyRedeemer`.
- **Group related functions**: Keep validation helpers close to their
  validator.
- **Prefer `when` over `if`**: Pattern matching is clearer than nested
  conditionals.

## Resources

<!-- markdownlint-disable MD013 -->
- Aiken Documentation: <https://aiken-lang.org/>
- Aiken Language Tour: <https://aiken-lang.org/language-tour/primitive-types>
- Aiken Standard Library: <https://aiken-lang.github.io/stdlib/>
- Aiken Examples: <https://github.com/aiken-lang/aiken/tree/main/examples>
- Hello World Tutorial: <https://aiken-lang.org/example--hello-world/basics>
<!-- markdownlint-enable MD013 -->

## Learnings

- **Expect makes code clearer than pattern matching everywhere**: Use it
  liberally (x4).
- **Aiken's fuzzing catches edge cases unit tests miss**: Add property
  tests (x3).
- **Blueprint generation is automatic**: No manual JSON writing needed
  (x2).
- **List operations are optimized in the stdlib**: Use `list.has`, not
  manual recursion (x3).
