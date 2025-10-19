---
mode: agent
description: 'Outline a high-level implementation strategy for Cardano projects'
tools: ['search', 'new', 'todos']
---
1. Restate the problem in your own words so stakeholders can confirm scope.
2. List the known constraints and acceptance criteria.
3. Identify Cardano-specific requirements:
   - Smart contracts (Plutus/Aiken)?
   - Wallet integration (CIP-30)?
   - Blockchain interactions (Lucid Evolution/Mesh)?
   - CIP standards compliance?
4. Break the solution into ordered, testable tasks.
5. Highlight risks, unknowns, or dependencies that need investigation.
6. Note security considerations for smart contracts (if applicable).
7. End with a short checklist the implementation prompt can follow.

Keep the plan concise (5-10 steps). If the work is trivial, note that a full plan is unnecessary and suggest moving straight to implementation.

**Cardano-specific considerations**:
- For smart contracts: Plan testnet deployment before mainnet
- For CIP standards: Use `semantic_search` to look up specifications
- For security-critical code: Include audit step in plan

Reference these instructions when planning:
- `.github/instructions/plutus-guidelines.instructions.md`
- `.github/instructions/aiken-guidelines.instructions.md`
- `.github/instructions/wallet-integration.instructions.md`
- `.github/instructions/cip-compliance.instructions.md`
- `.github/instructions/smart-contract-security.instructions.md`

```
