---
mode: agent
description: 'Analyze and solve GitHub issues including Cardano smart contract bugs'
tools: ['runCommands', 'search', 'new', 'usages', 'problems', 'fetch', 'todos']
---
# Fix Issue Workflow

The user has provided a GitHub issue number or URL. Retrieve the issue details
and understand the problem thoroughly.

## Workflow

1. **Get the issue:** Use available tools to fetch details (title, description,
   comments, labels).
2. **Understand the context:**
   - Read the issue description and any reproduction steps.
   - Check for related code files mentioned in the issue.
   - Search for similar issues or existing patterns in the codebase.
   - **For Cardano issues**: Confirm network (mainnet or testnet), transaction
     hash, and validator address.
3. **Analyze the problem:**
   - Identify the root cause if it is a bug.
   - Evaluate feasibility if it is a feature request.
   - Check for edge cases or dependencies.
   - **For smart contract issues**: Review known vulnerabilities (see
     `.github/instructions/smart-contract-security.instructions.md`).
   - **For wallet issues**: Verify CIP-30 compliance.
   - **For transaction issues**: Check datum or redeemer encoding, collateral,
     and fees.
4. **Propose a solution:**
   - Break down the fix or implementation into clear steps.
   - Reference specific files and functions that need changes.
   - Consider testing requirements.
   - Flag any breaking changes or risks.
   - **For mainnet issues**: Plan testnet validation first.
   - **For CIP-related issues**: Use `semantic_search` to review the spec.

## Output

Present a concise plan that includes:
- Summary of the issue in your own words.
- Root cause (for bugs) or rationale (for features).
- Proposed solution with implementation steps.
- Testing strategy (include testnet if smart contract related).
- Security considerations (if applicable).
