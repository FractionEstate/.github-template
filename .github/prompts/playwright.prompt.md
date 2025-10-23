---
mode: agent
description: 'Use playwright & automation tools to verify Cardano DApp changes'
tools: ['runCommands', 'runTasks', 'microsoft/playwright-mcp/*', 'github/github-mcp-server/get_commit', 'github/github-mcp-server/get_issue', 'github/github-mcp-server/get_issue_comments', 'edit/editFiles', 'runNotebooks', 'search', 'new', 'todos', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo']
---
# Playwright Verification

Visually confirm the Cardano DApp changes using vscode-playwright-mcp tools.

You MUST run `vscode_automation_start` and `browser_snapshot`.
You MUST verify the bad behavior you are investigating using
vscode-playwright-mcp.
You MUST verify the code changes you have made using vscode-playwright-mcp.
You MUST take before and after screenshots.

**For Cardano DApps, verify**:
- Wallet connection UI (connect and disconnect buttons).
- Wallet list displays available wallets (Nami, Eternl, Lace, and others).
- Address display shows correctly formatted Bech32 addresses.
- Transaction buttons enable or disable correctly.
- Loading states appear during transaction signing.
- Success or error messages display correctly.
- Network indicator shows the correct network (mainnet or testnet).

Remember, you are NOT writing Playwright tests; focus on using the tools to
validate and explore the changes.
You MAY need multiple passes, iterating between code changes and verification.
You MUST reload the window (`Developer: Reload Window`) after making changes to
ensure they apply correctly.
You MAY make temporary code changes to facilitate testing and exploration.

**Mock wallet for testing**:
```typescript
window.cardano = {
  nami: {
    enable: async () => ({
      getNetworkId: async () => 1,
      getUsedAddresses: async () => ['addr1...']
    })
  }
};
```

```
