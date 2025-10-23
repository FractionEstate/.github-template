---
mode: agent
description: 'Create comprehensive implementation plans with detailed Cardano requirements analysis'
tools: ['search', 'new', 'todos', 'fetch', 'githubRepo']
---
# Deep Planning

Before diving into detailed research, gather a high-level overview of the
problem space using quick exploration (limit to roughly five tool calls).

## Initial Context Gathering

1. Scan relevant files and patterns.
2. Identify key components or modules involved.
3. Note any obvious constraints or dependencies.
4. **For Cardano**: Check applicable CIP standards (use `semantic_search`).
5. **For smart contracts**: Review security requirements.

## Clarifying Questions

Ask **three clarifying questions** to confirm scope and requirements.
Consider topics such as:

- **Scope boundaries:** What is in scope versus out of scope?
- **Constraints:** Performance, compatibility, or technical limits?
- **Success criteria:** How will we confirm the solution is complete?
- **Edge cases:** Are there special scenarios to handle?
- **User expectations:** Who will use the outcome and how?
- **For Cardano smart contracts:**
  - Plutus or Aiken preference?
  - Testnet deployment required before mainnet?
  - Security audit required?
  - Expected transaction volume or complexity?
- **For wallet integration:**
  - Which wallets to support?
  - Mainnet or testnet coverage?
  - CIP-30 compliance requirements?

**PAUSE and wait for the user to answer these questions.**

## Detailed Planning

After the user answers, create a comprehensive plan using the instruction
files as references:

- `.github/instructions/plutus-guidelines.instructions.md`
- `.github/instructions/aiken-guidelines.instructions.md`
- `.github/instructions/smart-contract-security.instructions.md`
- `.github/instructions/wallet-integration.instructions.md`
- `.github/instructions/cip-compliance.instructions.md`

Then:

1. Resume with deeper research and analysis.
2. Draft the plan covering:
   - Detailed step-by-step tasks.
   - File-level changes required.
   - Testing strategy for each component.
   - Migration or rollout considerations.
   - Risk assessment and mitigation.

The plan should be thorough enough that implementation can proceed with
confidence.
