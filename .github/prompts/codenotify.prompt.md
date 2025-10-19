---
mode: agent
description: 'Add contributions to CODENOTIFY file based on git blame history'
tools: ['edit', 'search', 'runCommands', 'fetch', 'todos']
---

# Add My Contributions to CODENOTIFY

This prompt helps you add your code contributions to the `.github/CODENOTIFY` file based on git blame history.

## Instructions

**Before running this prompt, provide the following information:**

1. **Your GitHub handle:** (e.g., `@YOURHANDLE`)
2. **Alternative usernames in git blame:** (e.g., your full name, email addresses, or any other identities that might appear in git commits)

## What This Prompt Does

This prompt will:
1. Search through the repository's git blame history for files you've significantly contributed to
2. Analyze which files and directories have your contributions
3. **Follow the existing structure** in the `.github/CODENOTIFY` file if it exists
4. Add appropriate entries in the format:
   - Individual files: `path/to/file.ts @yourusername`
   - Directories: `path/to/directory/** @yourusername`
5. Place entries within existing sections, maintaining alphabetical or logical order
6. Create new sections only if contributions don't fit existing categories
7. Avoid duplicating existing entries

## Expected Output Format

Entries will be added to **existing sections** based on their path. For example:

```
# Core Utilities
src/utils/common.ts @existinguser
src/utils/helpers.ts @yourusername  # ← Your contribution added here

# Platform Services
src/services/auth/** @yourusername  # ← Your contribution added here

# API Layer
src/api/** @yourusername  # ← Your contribution added here
```

If you have contributions that don't fit existing sections, new sections can be created at the end:

```
# New Feature Area
src/new-feature/** @yourusername
```

## Notes

- **CRITICAL**: Entries must be added to the appropriate existing section based on their path
- Respect the existing organizational structure of the CODENOTIFY file
- If you're already listed for certain files/directories, those won't be duplicated
- Use `**` wildcard for directories where you've touched multiple files
- Maintain alphabetical or logical order within each section

---

**Now, provide your GitHub handle and any alternative usernames found in git blame, and I'll help you update the CODENOTIFY file.**
