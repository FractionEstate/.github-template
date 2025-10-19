---
mode: agent
description: 'Create comprehensive implementation plans with detailed Cardano requirements analysis'
tools: ['search', 'new', 'todos', 'fetch', 'githubRepo']
---

Before diving into detailed research, gather a high-level overview of the problem space using quick exploration (limit to ~5 tool calls).

## Initial Context Gathering

1. Scan relevant files and patterns
2. Identify key components or modules involved
3. Note any obvious constraints or dependencies
4. **For Cardano**: Check which CIP standards apply (use `semantic_search`)
5. **For smart contracts**: Review security requirements

## Clarifying Questions

Then, ask **3 clarifying questions** to ensure you understand the full scope and requirements. Consider asking about:

- **Scope boundaries:** What's in scope vs. out of scope?
- **Constraints:** Performance, compatibility, or technical limitations?
- **Success criteria:** How will we know the solution is complete?
- **Edge cases:** Are there special scenarios to handle?
- **User expectations:** Who will use this and how?
- **For Cardano smart contracts:**
  - Plutus or Aiken preference?
  - Testnet deployment required before mainnet?
  - Security audit required?
  - Expected transaction volume/complexity?
- **For wallet integration:**
  - Which wallets to support?
  - Mainnet or testnet?
  - CIP-30 compliance requirements?

**PAUSE and wait for the user to answer these questions.**

## Detailed Planning

AFTER the user has answered, create a comprehensive plan using `.github/instructions` files as reference:
- `.github/instructions/plutus-guidelines.instructions.md`
- `.github/instructions/aiken-guidelines.instructions.md`
- `.github/instructions/smart-contract-security.instructions.md`
- `.github/instructions/wallet-integration.instructions.md`
- `.github/instructions/cip-compliance.instructions.md`

```

1. Resume with deeper research and analysis
2. Create a comprehensive implementation plan with:
   - Detailed step-by-step tasks
   - File-level changes required
   - Testing strategy for each component
   - Migration or rollout considerations
   - Risk assessment and mitigation

The plan should be thorough enough that implementation can proceed with confidence.
