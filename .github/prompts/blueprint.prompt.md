---
mode: agent
description: 'Generate CIP-57 Plutus blueprint for smart contracts'
tools: ['new', 'edit', 'search', 'runCommands']
---
Generate a CIP-57 compliant Plutus blueprint for validator documentation and tooling integration.

## Process

1. **Determine validator language**:
   - **Aiken**: Blueprints generated automatically by `aiken build`
   - **Plutus**: Must be generated manually or with tooling

2. **For Aiken** (automatic):

   ```bash

   aiken build

   ```

   Generates `plutus-blueprint.json` automatically with:
   - Validator titles and descriptions
   - Datum and redeemer schemas
   - Parameter schemas
   - Compiled code (CBOR hex)

   Example Aiken validator with blueprint annotations:
   ```aiken
   /// Lock validator that requires owner signature
   ///
   /// This validator allows funds to be locked and only unlocked by the owner.
   validator lock {
     /// Unlock funds from the validator
     spend(
       /// The datum containing owner information
       datum: Option<MyDatum>,
       redeemer: MyRedeemer,
       _own_ref: OutputReference,
       self: Transaction,
     ) {
       expect Some(d) = datum
       when redeemer is {
         Unlock -> list.has(self.extra_signatories, d.owner)
       }
     }
   }

   ```

3. **For Plutus** (manual generation):

   ### Step 1: Define types with documentation
   ```haskell
   -- | Datum for lock validator
   -- Contains the owner's public key hash and locked amount
   data MyDatum = MyDatum
     { owner :: PubKeyHash  -- ^ The owner who can unlock
     , amount :: Integer    -- ^ Amount locked (lovelaces)
     } deriving (Show, Generic)

   PlutusTx.unstableMakeIsData ''MyDatum

   -- | Redeemer for lock validator operations
   data MyRedeemer
     = Unlock          -- ^ Unlock all funds
     | Update Integer  -- ^ Update the locked amount
     deriving (Show, Generic)

   PlutusTx.unstableMakeIsData ''MyRedeemer
   ```

   ### Step 2: Generate JSON Schema

   ```typescript

   // generate-blueprint.ts
   import { writeFileSync } from 'fs';

   const blueprint = {
     preamble: {
       title: 'My Lock Validator',
       description: 'A simple lock validator requiring owner signature',
       version: '1.0.0',
       plutusVersion: 'v2',
       license: 'MIT'
     },
     validators: [
       {
         title: 'Lock Validator',
         description: 'Locks funds that can only be unlocked by owner',
         redeemer: {
           title: 'MyRedeemer',
           description: 'Actions that can be performed on locked funds',
           schema: {
             $ref: '#/definitions/MyRedeemer'
           }
         },
         datum: {
           title: 'MyDatum',
           description: 'Information about locked funds',
           schema: {
             $ref: '#/definitions/MyDatum'
           }
         },
         compiledCode: compiledValidatorHex,
         hash: validatorHash
       }
     ],
     definitions: {
       MyDatum: {
         title: 'MyDatum',
         description: 'Datum containing owner and amount',
         type: 'object',
         properties: {
           owner: {
             type: 'string',
             description: 'Public key hash of the owner (hex)',
             pattern: '^[a-f0-9]{56}$'
           },
           amount: {
             type: 'integer',
             description: 'Amount locked in lovelaces',
             minimum: 0
           }
         },
         required: ['owner', 'amount']
       },
       MyRedeemer: {
         title: 'MyRedeemer',
         description: 'Redeemer for validator actions',
         oneOf: [
           {
             title: 'Unlock',
             description: 'Unlock all funds',
             type: 'object',
             properties: {
               constructor: { const: 0 }
             }
           },
           {
             title: 'Update',
             description: 'Update locked amount',
             type: 'object',
             properties: {
               constructor: { const: 1 },
               fields: {
                 type: 'array',
                 items: [
                   {
                     type: 'integer',
                     description: 'New amount in lovelaces',
                     minimum: 0
                   }
                 ]
               }
             }
           }
         ]
       }
     }
   };

   writeFileSync('plutus-blueprint.json', JSON.stringify(blueprint, null, 2));

   ```

4. **Compile validator to get hash and compiled code**:

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

5. **Validate blueprint**:

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

6. **Use blueprint in off-chain code** (Lucid Evolution):

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

   const datum = Data.to({
     owner: ownerPubKeyHash,
     amount: 1000000n
   }, DatumSchema);

   // Use redeemer schema from blueprint
   const RedeemerSchema = Data.Enum([
     Data.Literal('Unlock'),
     Data.Object({ Update: Data.Integer() })
   ]);

   const redeemer = Data.to('Unlock', RedeemerSchema);
   ```

7. **Add to repository**:

   ```bash

   # Add blueprint to version control
   git add plutus-blueprint.json
   git commit -m "Add CIP-57 blueprint for lock validator"

   # Tag with version
   git tag v1.0.0
   git push --tags

   ```

8. **Publish blueprint**:

   ```json
   // package.json
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
    expect(blueprint.preamble.version).toMatch(/^\d+\.\d+\.\d+$/);
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
    expect(validator.datum.schema).toBeDefined();
    expect(validator.redeemer.schema).toBeDefined();
  });
});
```

## Benefits of blueprints

1. **Standardized documentation**: Clear spec for datum/redeemer structures
2. **Tooling integration**: IDEs, explorers, and wallets can parse automatically
3. **Type safety**: Generate TypeScript types from schemas
4. **Versioning**: Track changes to validator interfaces
5. **Discoverability**: Publish to registries for easy import

## Generating TypeScript types from blueprint

```typescript
// generate-types.ts
import blueprint from './plutus-blueprint.json';

function generateTypes(blueprint: Blueprint): string {
  let output = '';

  for (const [name, schema] of Object.entries(blueprint.definitions || {})) {
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

```
