---
mode: agent
description: 'Gather information for bug reports including Cardano-specific context (network, wallet, tx hash)'
tools: ['microsoft/playwright-mcp/*', 'chromedevtools/chrome-devtools-mcp/*', 'edit', 'search', 'todos', 'think', 'problems', 'changes']
---
# Bug Triage

When triaging a bug, gather enough detail for a developer to reproduce and
prioritize it:

- Summarize the reported symptoms using the reporter's phrasing when possible.
- List explicit reproduction steps, clarifying any assumptions or missing
  information.
- Capture observed vs expected results and attach relevant logs or
  screenshots.
- Identify affected versions, platforms, and severity.
- **For Cardano-specific bugs, also capture**:
  - Network (mainnet, preprod, preview, local testnet).
  - Wallet used (Nami, Eternl, Lace, Yoroi, etc.).
  - Transaction hash (if applicable).
  - Validator address (for smart contract issues).
  - Block or epoch number (for timing issues).
  - Library versions (Lucid Evolution, Mesh, cardano-node, Aiken, Plutus).
  - Browser console errors (for wallet integration).
  - Blockfrost or provider errors (if applicable).
- Recommend follow-up actions or labels (e.g., `needs-investigation`,
  `regression`, `testnet-only`, `mainnet-critical`).

**For smart contract bugs**:

- Include datum and redeemer values.
- Check if the issue reproduces on testnet.
- Verify the validator hash matches the deployment.
- Check for known vulnerabilities (double satisfaction, time range, etc.).

**For transaction bugs**:

- Include full transaction CBOR (if available).
- Check collateral settings.
- Verify the network ID matches the wallet network.
- Check fee calculation.

End the response with a checklist the reporter can confirm.

Use `semantic_search` to look up error codes or CIP standards if needed.
