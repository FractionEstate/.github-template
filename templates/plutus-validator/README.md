# Plutus Validator Template

A basic Plutus validator template using Haskell and GHC 9.6.6.

## Structure

```
plutus-validator/
├── cabal.project           # Project configuration
├── validators.cabal        # Package definition
├── src/
│   ├── Validators/
│   │   ├── AlwaysSucceeds.hs
│   │   └── MyValidator.hs
│   └── Utils/
│       └── Serialization.hs
├── test/
│   └── Spec.hs
└── README.md
```

## Quick Start

```bash
# Copy template
cp -r templates/plutus-validator/ my-validator/
cd my-validator/

# Update cabal.project and validators.cabal with your project name

# Install dependencies
cabal update
cabal build

# Run tests
cabal test

# Serialize validators
cabal run serialize
```

## Development

1. **Add validators:** Create `.hs` files in `src/Validators/`
2. **Add tests:** Add tests in `test/Spec.hs`
3. **Build:** `cabal build`
4. **Test:** `cabal test`

See [SMART_CONTRACT_GUIDE.md](../../SMART_CONTRACT_GUIDE.md) for tutorials.

## Deployment

```bash
# Serialize validator
cabal run serialize -- --validator MyValidator --output my-validator.plutus

# Get script address
cardano-cli address build \
  --payment-script-file my-validator.plutus \
  --testnet-magic 1 \
  --out-file my-validator.addr
```

## Resources

- [Plutus Documentation](https://plutus.readthedocs.io)
- [Plutus Guidelines](../../.github/instructions/plutus-guidelines.instructions.md)
- [Smart Contract Security](../../.github/instructions/smart-contract-security.instructions.md)
