---
mode: agent
description: 'Create fast, lightweight implementation plans for Cardano projects'
tools: ['search', 'new', 'todos']
---

Planning for faster iteration on straightforward tasks.

## Quick Research

1. Identify the main components or files involved
2. Look for existing patterns to follow
3. Note any obvious dependencies
4. **For Cardano tasks**: Check if CIP standards apply (use `semantic_search` if needed)

## Streamlined Plan

Draft a **focused, concise implementation plan** that covers:

- **Main steps only** (typically 3-7 steps)
- Essential file changes
- Key testing points
- **For smart contracts**: Note testnet deployment requirement
- **For wallet integration**: Note CIP-30 compliance

Skip detailed sub-steps and edge case analysis—those can be handled during implementation if needed.

## When to Use This vs. Deep Planning

- **Use plan-fast for:**
  - Well-understood tasks
  - Following established patterns
  - Simple features or bug fixes
  - Frontend wallet components
  - Transaction building with Lucid Evolution

- **Use plan-deep for:**
  - New smart contracts (validators, minting policies)
  - CIP standard implementations
  - Security-critical code
  - Complex multi-step workflows

```
  - Rapid prototyping

- **Use plan-deep for:**
  - Complex architectural changes
  - Unclear requirements
  - Multiple system interactions
  - High-risk modifications

Focus on getting started quickly while maintaining code quality.
