# Aiken Validator Template

A basic Aiken validator template using Aiken 1.1.19+.

## Structure

```
aiken-validator/
├── aiken.toml              # Project configuration
├── validators/
│   ├── always_succeeds.ak
│   └── my_validator.ak
├── lib/
│   └── utils.ak
├── plutus.json             # Generated CIP-57 blueprint
└── README.md
```

## Quick Start

```bash
# Copy template
cp -r templates/aiken-validator/ my-validator/
cd my-validator/

# Update aiken.toml with your project name

# Build
aiken build

# Run tests
aiken check

# With coverage
aiken check --coverage
```

## Development

1. **Add validators:** Create `.ak` files in `validators/`
2. **Add libraries:** Create `.ak` files in `lib/`
3. **Build:** `aiken build`
4. **Test:** `aiken check`

See [SMART_CONTRACT_GUIDE.md](../../SMART_CONTRACT_GUIDE.md) for tutorials.

## Deployment

```bash
# Build generates plutus.json (CIP-57 blueprint)
aiken build

# Use blueprint in your DApp
# See off-chain integration examples
```

## Resources

- [Aiken Documentation](https://aiken-lang.org)
- [Aiken Guidelines](../../.github/instructions/aiken-guidelines.instructions.md)
- [Smart Contract Security](../../.github/instructions/smart-contract-security.instructions.md)
