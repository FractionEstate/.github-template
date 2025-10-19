---
description: Clarify requirements before detailed planning
---

# Deep Planning with Clarification

Before creating a detailed plan, gather context and ask clarifying questions.

## Phase 1: Initial Context Gathering

Perform a quick exploration (use maximum 5 operations):

1. Read the relevant issue or requirement
2. Scan key related files
3. Check existing patterns
4. Review recent changes in the area
5. Note any obvious constraints

## Phase 2: Clarifying Questions

Based on initial context, ask **3 clarifying questions** to ensure proper understanding:

### Example Questions

**Scope Questions:**
- Should this change affect [component A] as well, or just [component B]?
- Are we solving this for [scenario X] only, or should it work for [scenario Y] too?

**Technical Questions:**
- Should we follow the pattern used in [existing feature], or take a different approach?
- Do we need to maintain backward compatibility with [existing API]?

**Priority Questions:**
- Is this change urgent, or can we take time to refactor related code?
- Should we prioritize performance, readability, or minimal changes?

## ⏸️ PAUSE

**Wait for the user to answer the questions before proceeding.**

## Phase 3: Detailed Planning

After receiving answers, create a comprehensive plan:

### Detailed Plan Structure

#### Goal
[Clear objective incorporating user's answers]

#### Background
[Context from initial exploration]

#### Clarifications Received
1. [Answer to question 1]
2. [Answer to question 2]
3. [Answer to question 3]

#### Detailed Approach
1. [Step 1 with rationale]
2. [Step 2 with rationale]
3. [Step 3 with rationale]
...

#### Files to Modify
- `path/to/file1` - [detailed changes needed]
- `path/to/file2` - [detailed changes needed]

#### Testing Strategy
- Unit tests for [specific scenarios]
- Integration tests for [workflows]
- Edge cases to cover: [list]

#### Implementation Notes
- [Important consideration 1]
- [Important consideration 2]

#### Risks and Mitigations
- **Risk**: [potential issue]
  **Mitigation**: [how to handle it]

#### Timeline
- [Estimated effort and phases]

## When to Use

- Complex features with multiple approaches
- Changes affecting multiple components
- Tasks with unclear requirements
- Architectural decisions needed
- Stakeholder input required

## Output

A comprehensive plan that incorporates user feedback and addresses all clarified requirements with detailed implementation steps.
