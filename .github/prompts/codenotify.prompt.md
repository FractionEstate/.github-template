---
mode: agent
description: 'Add contributions to CODENOTIFY file based on git blame history'
tools: ['edit', 'search', 'runCommands', 'fetch', 'todos']
---

# Add My Contributions to CODENOTIFY

This prompt helps you add your code contributions to the `.github/CODENOTIFY`
file using git blame history.

## Instructions

**Before running this prompt, provide the following information:**

1. **Your GitHub handle:** (e.g., `@YOURHANDLE`)
2. **Alternative usernames in git blame:** (full name, email addresses, or any
   other identities that might appear in git commits)

## What This Prompt Does

This prompt will:

1. Search the repository history for files you have significantly contributed to.
2. Analyze which files and directories contain your contributions.
3. **Follow the existing structure** in the `.github/CODENOTIFY` file if it
   exists.
4. Add appropriate entries in the format:
   - Individual files: `path/to/file.ts @yourusername`
   - Directories: `path/to/directory/** @yourusername`
5. Place entries within existing sections, maintaining alphabetical or logical
   order.
6. Create new sections only if contributions do not fit existing categories.
7. Avoid duplicating existing entries.

## Expected Output Format

Entries will be added to **existing sections** based on their path. For example:

```text
# Core Utilities
src/utils/common.ts @existinguser
src/utils/helpers.ts @yourusername  # ← Your contribution added here

# Platform Services
src/services/auth/** @yourusername  # ← Your contribution added here

# API Layer
src/api/** @yourusername  # ← Your contribution added here
```

If you have contributions that do not fit existing sections, create new
sections at the end:

```text
# New Feature Area
src/new-feature/** @yourusername
```

## Notes

- **CRITICAL**: Add entries to the appropriate section based on path.
- Respect the existing organizational structure of the CODENOTIFY file.
- If you are already listed for certain files or directories, do not
   duplicate the entry.
- Use the `**` wildcard for directories where you touched multiple files.
- Maintain alphabetical or logical order within each section.

---

**Now, provide your GitHub handle and any alternative usernames found in git
blame, and I'll help you update the CODENOTIFY file.**
