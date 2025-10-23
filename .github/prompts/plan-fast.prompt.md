---
mode: agent
description: 'Create fast, lightweight implementation plans for Cardano projects'
tools: ['search', 'new', 'todos']
---
# Fast Planning

Planning for faster iteration on straightforward tasks.

## Quick Research

1. Identify the main components or files involved.
2. Look for existing patterns to follow.
3. Note any obvious dependencies.
4. **For Cardano tasks**: Check if CIP standards apply (use `semantic_search` when needed).

## Streamlined Plan

Draft a focused, concise implementation plan that covers:

- Main steps only (typically three to seven steps).
- Essential file changes.
- Key testing points.
- **For smart contracts**: Note testnet deployment requirements.
- **For wallet integration**: Note CIP-30 compliance expectations.

Skip detailed sub-steps and edge case analysis—handle those during implementation if
required.

## When to Use This vs. Deep Planning

- **Use plan-fast for:**
  - Well-understood tasks.
  - Following established patterns.
  - Simple features or bug fixes.
  - Frontend wallet components.
  - Transaction building with Lucid Evolution.
  - Rapid prototyping with low risk.

- **Use plan-deep for:**
  - New smart contracts (validators or minting policies).
  - CIP standard implementations.
  - Security-critical code.
  - Complex multi-step workflows.
  - Architectural changes across multiple systems.

Focus on getting started quickly.
Keep overall code quality in mind to avoid rework.
