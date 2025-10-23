---
mode: agent
description: 'Generate CIP-57 Plutus blueprint for smart contracts'
---

### 1. Create validator

```haskell
-- In validator file
validatorCode :: CompiledCode (BuiltinData -> BuiltinData -> BuiltinData -> ())
validatorCode = $$(PlutusTx.compile [|| mkValidator ||])

validator :: Validator
validator = Plutus.mkValidatorScript validatorCode

validatorHash :: ValidatorHash
validatorHash = Scripts.validatorHash validator

compiledCode :: Text
compiledCode = Text.pack $ show $ serialiseToTextEnvelope validator
```

Or use Aiken for Plutus compilation:

```bash
# Convert Plutus to Aiken-generated blueprint
aiken blueprint convert --from-plutus validator.plutus --to plutus-blueprint.json
```

### 2. Compile validator to get hash and compiled code

### 3. Validate blueprint

```typescript
import Ajv from 'ajv';
import blueprint from './plutus-blueprint.json';

const ajv = new Ajv();

// Validate blueprint structure
const valid = ajv.validate(cip57Schema, blueprint);

if (!valid) {
  console.error('Invalid blueprint:', ajv.errors);
} else {
  console.log('✅ Blueprint is CIP-57 compliant');
}
```

### 4. Use blueprint in off-chain code (Lucid Evolution)

```typescript
import { Lucid, Data } from '@lucid-evolution/lucid';
import blueprint from './plutus-blueprint.json';

// Load validator from blueprint
const validator = {
  type: 'PlutusV2',
  script: blueprint.validators[0].compiledCode
};

const validatorAddress = lucid.utils.validatorToAddress(validator);

// Use datum schema from blueprint
const DatumSchema = Data.Object({
  owner: Data.Bytes(),
  amount: Data.Integer()
});

const datum = Data.to(
  { owner: ownerPubKeyHash, amount: 1_000_000n },
  DatumSchema
);

// Use redeemer schema from blueprint
const RedeemerSchema = Data.Enum([
  Data.Literal('Unlock'),
  Data.Object({ Update: Data.Integer() })
]);

const redeemer = Data.to('Unlock', RedeemerSchema);
```

### 5. Add to repository

```bash
# Add blueprint to version control
git add plutus-blueprint.json

# Tag with version
git tag v1.0.0
```

### 6. Publish blueprint

```json
{
  "name": "@myorg/lock-validator",
  "version": "1.0.0",
  "files": [
    "plutus-blueprint.json"
  ],
  "exports": {
    "./blueprint": "./plutus-blueprint.json"
  }
}
```

```typescript
// Usage by consumers
import blueprint from '@myorg/lock-validator/blueprint';

const validator = {
  type: 'PlutusV2',
  script: blueprint.validators[0].compiledCode
};
```

## Blueprint structure (CIP-57)

```typescript
interface Blueprint {
  preamble: {
    title: string;
    description?: string;
    version: string;
    plutusVersion: 'v1' | 'v2' | 'v3';
    license?: string;
  };
  validators: Array<{
    title: string;
    description?: string;
    redeemer: {
      title: string;
      description?: string;
      schema: JSONSchema;
    };
    datum?: {
      title: string;
      description?: string;
      schema: JSONSchema;
    };
    parameters?: Array<{
      title: string;
      description?: string;
      schema: JSONSchema;
    }>;
    compiledCode: string; // CBOR hex
    hash: string; // Validator hash
  }>;
  definitions?: Record<string, JSONSchema>;
}
```

## Testing blueprint

```typescript
import { describe, it, expect } from 'vitest';
import blueprint from './plutus-blueprint.json';

describe('CIP-57 Blueprint', () => {
  it('should have required preamble fields', () => {
    expect(blueprint.preamble.title).toBeDefined();
    expect(blueprint.preamble.version).toMatch(/^[0-9]+\.[0-9]+\.[0-9]+$/);
    expect(['v1', 'v2', 'v3']).toContain(blueprint.preamble.plutusVersion);
  });

  it('should have at least one validator', () => {
    expect(blueprint.validators.length).toBeGreaterThan(0);
  });

  it('should have compiled code in hex', () => {
    const code = blueprint.validators[0].compiledCode;
    expect(code).toMatch(/^[a-f0-9]+$/i);
  });

  it('should have valid JSON schemas', () => {
    const validator = blueprint.validators[0];
    expect(validator.datum?.schema).toBeDefined();
    expect(validator.redeemer.schema).toBeDefined();
  });
});
```

## Benefits of blueprints

1. **Standardized documentation**: Clear spec for datum and redeemer structures
2. **Tooling integration**: IDEs, explorers, and wallets can parse automatically
3. **Type safety**: Generate TypeScript types from schemas
4. **Versioning**: Track changes to validator interfaces
5. **Discoverability**: Publish to registries for easy import

## Generating TypeScript types from blueprint

```typescript
// generate-types.ts
import blueprint from './plutus-blueprint.json';

function generateTypes(bp: Blueprint): string {
  let output = '';

  for (const [name, schema] of Object.entries(bp.definitions || {})) {
    output += `export interface ${name} {\n`;

    for (const [prop, propSchema] of Object.entries(schema.properties || {})) {
      const required = schema.required?.includes(prop) ? '' : '?';
      output += `  ${prop}${required}: ${mapType(propSchema.type)};\n`;
    }

    output += '}\n\n';
  }

  return output;
}

// Generate: types/validator.ts
```

## Resources

- [CIP-57 Specification](https://cips.cardano.org/cip/CIP-0057)
- [Aiken Blueprint Docs](https://aiken-lang.org/language-tour/blueprints)
- [Lucid Evolution Blueprint Usage](https://github.com/Anastasia-Labs/lucid-evolution)

Reference:

- `.github/instructions/cip-compliance.instructions.md` (CIP-57 section)
- `.github/instructions/plutus-guidelines.instructions.md`
- `.github/instructions/aiken-guidelines.instructions.md`
