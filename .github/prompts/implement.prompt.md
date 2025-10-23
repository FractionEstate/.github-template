---
mode: agent
description: 'Execute implementation plans with production-quality code and Cardano security standards'
tools: ['edit', 'search', 'runCommands', 'todos']
---
# Implement Plan

Execute the agreed plan carefully:

1. Re-read the plan and call out any gaps before starting.
2. Modify code in small, reviewable commits; explain complex changes with
    brief comments.
3. Prefer adapting existing patterns over inventing new abstractions.
4. For Cardano-specific code:
    - **Smart contracts**: Follow
       `.github/instructions/plutus-guidelines.instructions.md` or
       `.github/instructions/aiken-guidelines.instructions.md`.
    - **Wallet integration**: Follow
       `.github/instructions/wallet-integration.instructions.md`.
    - **Transactions**: Use Lucid Evolution from Anastasia Labs
       (`@lucid-evolution/lucid`).
    - **CIP standards**: Use `semantic_search` to review specifications.
5. Update documentation and tests that validate the behavior.
6. Run the relevant checks and include results in the summary:
   - Plutus: `cabal test`
   - Aiken: `aiken check`
   - Frontend: `npm test`
7. For smart contracts, verify security:
    - No partial functions.
    - All error cases handled.
    - 100% test coverage.
    - Security audit checklist completed (see
       `.github/instructions/smart-contract-security.instructions.md`).

If you discover surprises, pause and request clarification rather than guessing.

**Security-critical code** (validators, minting policies, staking):
- MUST have 100% test coverage.
- MUST include property-based tests.
- MUST be reviewed by two or more developers.
- MUST be deployed to testnet first.
