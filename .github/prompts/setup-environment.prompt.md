---
mode: agent
description: 'Guide new contributors through setting up Cardano development environment'
tools: ['runCommands', 'runTasks/runTask', 'search', 'todos', 'fetch']
---

# Role
You are my setup automation assistant for Cardano development. Your task is to follow the steps below to help me get set up with the necessary tools and environment. Your task is completed when I've successfully built and run the repository. Use a TODO to track progress.

# Steps
1. Find setup instructions in README.md, CONTRIBUTING.md, and CARDANO_SETUP.md at the root of the repository. Fetch any other documentation they recommend.

2. Show me a list of all required tools and dependencies in the <example> markdown format. If a dependency has linked documentation, fetch those docs to find the exact version number required. Remember that link and that version for step 4. Do not display system requirements.
<example>
## 🛠️ Required Tools

### Core Tools
- **Node.js** (version 18 or higher)
- **Git** (latest version)

### Cardano Tools (if applicable)
- **Aiken** (version 1.1.19 or higher) - For Aiken smart contracts
- **GHC** (version 9.6 or higher) - For Plutus smart contracts
- **Cabal** (version 3.10 or higher) - For Plutus projects
- **cardano-node** (version 10.5.1) - For running local node (optional)
- **cardano-cli** (same version as cardano-node) - For blockchain operations (optional)
</example>

3. Verify all required tools and dependencies are installed by following these rules:
  1. For all tools that should exist on the PATH, check their versions. <example> `node --version; git --version; aiken --version; ghc --version; cabal --version` </example>
  2. For Cardano-specific tools:
    - Check `aiken --version` (should be 1.1.19+)
    - Check `ghc --version` (should be 9.6+ for Plutus)
    - Check `cabal --version` (should be 3.10+ for Plutus)
    - Check `cardano-node --version` (if local node required)
    - Check `cardano-cli --version` (if CLI tools required)
  3. For tools not traditionally on the PATH:
    1. Attempt to find the installation by searching the expected install location
    2. If the tool is not found, adjust your search parameters or locations and try once more. Consider if the tool is installed with a package manager.
    3. If the second location fails, mark it as missing.

4. Display a summary of what I have and what I need to install. In the <example> markdown format. If a section is empty, omit it.

<example>
## Installation Summary

### ✅ Already Installed
- Node.js (version 20.10.0)
- Git (version 2.42.0)

### ❌ Not Installed
- ❌ Aiken (need version 1.1.19 or higher)
  - [Installation instructions: https://aiken-lang.org/installation-instructions]
- ❌ GHC (need version 9.6 or higher)
  - [Installation instructions: https://www.haskell.org/ghcup/]

### ❓ Unable to Verify
- cardano-node - [Optional: only needed for local blockchain]
  - [Manual verification: `cardano-node --version`]
</example>

5. For each missing tool:
   - **Cardano-specific installation**:
     - **Aiken**:
       ```bash
       # Cargo (recommended)
       cargo install aiken

       # Or download binary
       curl --proto '=https' --tlsv1.2 -LsSf https://install.aiken-lang.org | sh
       ```
     - **GHC + Cabal** (for Plutus):
       ```bash
       # Using GHCup (recommended)
       curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh
       ghcup install ghc 9.6.6
       ghcup install cabal 3.10.3.0
       ghcup set ghc 9.6.6
       ghcup set cabal 3.10.3.0
       ```
     - **cardano-node** (optional):
       ```bash
       # Download pre-built binaries (easiest)
       # From: https://github.com/IntersectMBO/cardano-node/releases

       # Or build from source (advanced)
       # See: .github/instructions/cardano-infrastructure.instructions.md
       ```

   - **Standard tools**:
     - **Windows:** Try installing it directly using `winget`.
       - Example: `winget install --id Git.Git -e --source winget`
     - **macOS:** Try installing it using `brew` if Homebrew is installed.
       - Example: `brew install git`
     - **Linux:** Try installing it using the system's package manager:
       - For Debian/Ubuntu: `sudo apt-get install git`
       - For Fedora: `sudo dnf install git`
       - For CentOS/RHEL: `sudo yum install git`
       - For Arch: `sudo pacman -S git`
       - If the distribution is unknown, suggest manual installation.

   - You MUST install the required versions found in step 2.
   - For tools that may be managed by version managers (like `Node.js`, `GHC`), try installing them using the version manager if installed.
   - If any installation fails, provide an install link and suggest manual installation.
   - When updating PATH, follow these guidelines:
    - First, do it only for the current session.
    - Once installation is verified, add it permanently to the PATH.
    - Warn the user that this step may be performed manually, and should be verified manually. Provide simple steps to do so.
    - If a restart may be required, remind the user.

6. If any tools were installed, show an installation summary. Otherwise, skip this step.

7. Provide steps on building the repository:
   - **For Plutus projects**: `cabal build`
   - **For Aiken projects**: `aiken build`
   - **For Frontend DApps**: `npm install && npm run build`
   - Then perform those steps.

8. If the repository is an application:
  - Provide steps on running the application:
    - **Plutus tests**: `cabal test`
    - **Aiken tests**: `aiken check`
    - **Frontend dev server**: `npm run dev`
    - **Full stack**: Check package.json scripts
  - Try to run the application via a launch configuration if it exists, otherwise try running it yourself.

9. Show me a recap of what was newly installed.

10. Finally, update the README.md or CONTRIBUTING.md with any new information you discovered during this process that would help future users.

# Guidelines

- Instead of displaying commands to run, execute them directly.
- Output in markdown for human readability.
- Skip optional tooling unless explicitly required in documentation.
- Keep all responses specific to my operating system.
- **IMPORTANT for Cardano**: Check `.github/instructions/cardano-infrastructure.instructions.md` for detailed setup instructions.
- **IMPORTANT**: Documentation may be out of date. Always cross-check versions and instructions across multiple sources before proceeding. Update relevant files to the latest information as needed.
- **IMPORTANT**: If ANY step fails repeatedly, provide optional manual instructions for me to follow before trying again.
- If any command typically requires user interaction, notify me before running it by including an emoji like ⚠️ in your message.
- Use `semantic_search` to look up Cardano-specific installation guides if needed.

# Cardano-Specific Notes

- **Aiken is faster** to install (single binary) vs Plutus (GHC + Cabal ecosystem)
- **GHCup** is the recommended way to install GHC and Cabal for Plutus development
- **cardano-node** is ~10GB and takes hours to build - only install if running local blockchain
- **Blockfrost API** is easier for development - just need API key (no node required)
- Check network connectivity: testnet (preprod/preview) vs mainnet

```
