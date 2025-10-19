---
mode: agent
description: 'Use playwright & automation tools to verify Cardano DApp changes'
tools: ['runCommands', 'runTasks', 'microsoft/playwright-mcp/*', 'github/github-mcp-server/get_commit', 'github/github-mcp-server/get_issue', 'github/github-mcp-server/get_issue_comments', 'edit/editFiles', 'runNotebooks', 'search', 'new', 'todos', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo']
---
You are being requested to visually confirm the code changes you are making for a Cardano DApp using vscode-playwright-mcp.

You MUST run vscode_automation_start & browser_snapshot.
You MUST verify the bad behavior you are investigating using vscode-playwright-mcp.
You MUST verify the code changes you have made using vscode-playwright-mcp.
You MUST take before and after screenshots.

**For Cardano DApps, verify**:
- Wallet connection UI (connect/disconnect buttons)
- Wallet list displays available wallets (Nami, Eternl, Lace, etc.)
- Address display shows correctly formatted Bech32 address
- Transaction buttons are enabled/disabled correctly
- Loading states during transaction signing
- Success/error messages display correctly
- Network indicator shows correct network (mainnet/testnet)

Remember, you are NOT writing playwright tests; instead, focus on using the tools to validate and explore the changes.
You MAY need to make multiple passes, iterating between making code changes and verifying them with the tools.
You MUST reload the window (`Developer: Reload Window` command) after making changes to ensure they are applied correctly.
You MAY make temporary changes to the code to facilitate testing and exploration.

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
