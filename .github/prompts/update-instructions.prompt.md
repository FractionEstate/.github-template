---
description: Update instruction files based on code changes
---

# Update Instructions

Review code changes and update instruction files if they become outdated.

## Process

### 1. Identify Changes

Review **ALL** changes on the current branch:

**Uncommitted changes:**
- Staged changes: `git diff --cached`
- Unstaged changes: `git diff`

**Committed but not pushed:**
- Find merge base: `git merge-base HEAD origin/main`
- Get diff: `git diff <merge-base>...HEAD`

### 2. Review Instructions

Read every instruction file in `.github/instructions/`:
- `testing.instructions.md`
- `api-design.instructions.md`
- `security.instructions.md`
- [Any other project-specific instructions]

### 3. Assess Impact

For each instruction file, determine if code changes:
- Introduce new patterns not documented
- Contradict existing guidance
- Make examples outdated
- Require new best practices
- Invalidate assumptions

### 4. Propose Updates

If updates are needed:
- Keep changes **minimal**
- Update only what's necessary
- Preserve existing structure
- Be **conservative** - don't over-update

If no updates are needed, respond with:
```
No updates needed
```

## Update Guidelines

### What to Update

✅ **DO UPDATE:**
- Outdated code examples
- Contradicted best practices
- New patterns now in use
- Changed conventions
- Deprecated approaches

### What NOT to Update

❌ **DON'T UPDATE:**
- Style preferences (unless changed)
- Still-valid examples
- General principles
- Unaffected sections
- Working patterns

## Example Updates

### Minimal Update Example

If code introduces a new error handling pattern:

**Before:**
```markdown
Always throw errors:
\`\`\`typescript
throw new Error('Something went wrong');
\`\`\`
```

**After:**
```markdown
Use the ErrorHandler utility:
\`\`\`typescript
ErrorHandler.handle(error, context);
\`\`\`
```

### When NOT to Update

If code changes:
- Are isolated to one feature
- Don't establish a new pattern
- Are experimental
- Don't contradict instructions

Then respond: **"No updates needed"**

## Checklist

- [ ] Reviewed all uncommitted changes
- [ ] Reviewed all committed but unpushed changes
- [ ] Read every `.github/instructions/*.instructions.md` file
- [ ] Identified invalidated instructions (if any)
- [ ] Proposed minimal necessary updates (if needed)
- [ ] Kept changes conservative

## Output

Either:
1. **"No updates needed"** - if instructions remain valid
2. **Specific minimal updates** - if instructions must be changed

Be concise and only suggest absolutely necessary changes.
