---
name: Security Audit Request
about: Request a security review before mainnet deployment
title: "[Security Audit] "
labels: security, audit
assignees: ''
---

## Audit Request Type

- [ ] Pre-mainnet deployment audit
- [ ] Post-deployment security review
- [ ] Vulnerability disclosure
- [ ] Emergency security issue

**Urgency:** [Low / Medium / High / Critical]

## Smart Contract Information

**Validator Name:**
**Language:** [Plutus / Aiken]
**Version:**
**Deployment Target:** [Mainnet / Testnet]

**Validator Address (if deployed):**
**Script Hash:**
**Transaction Hash (deployment):**

## Contract Scope

**Contract Type:**
- [ ] Token validator
- [ ] NFT minting policy
- [ ] DEX / AMM
- [ ] Staking / Rewards
- [ ] DAO / Governance
- [ ] Oracle
- [ ] Multi-signature
- [ ] Other: ___________

**Total Value Locked (TVL):** [Expected or current]
**Number of Users:** [Expected or current]

## Audit Checklist

### Pre-Deployment Requirements

- [ ] **Testnet Validation**: Deployed and tested on Preprod for minimum 2 weeks
- [ ] **Test Coverage**: 100% branch coverage achieved
- [ ] **Property Testing**: QuickCheck (Plutus) or fuzzing (Aiken) implemented
- [ ] **CIP-57 Blueprint**: Generated and validated
- [ ] **Documentation**: Complete validator logic documentation
- [ ] **Emergency Plan**: Response procedure documented

### Security Concerns

**Known Vulnerabilities:** [List any known issues or concerns]

**Areas of Concern:**
- [ ] Double satisfaction attack
- [ ] Missing input validation
- [ ] Incomplete datum validation
- [ ] Redeemer manipulation
- [ ] Time-based vulnerabilities
- [ ] Oracle manipulation
- [ ] Front-running
- [ ] Other: ___________

## Code References

**Repository:**
**Branch:**
**Commit Hash:**

**Validator Files:**
```
validators/my-validator.hs  (or .ak)
```

**Off-chain Code:**
```
src/contracts/my-validator.ts
```

**Test Files:**
```
test/my-validator.test.ts
```

## Testnet Validation Results

**Testnet Deployment Date:**
**Testnet Address:**
**Number of Test Transactions:**
**Test Coverage Report:** [Link or paste]

**Testnet Testing Summary:**
- [ ] Happy path scenarios tested
- [ ] Edge cases tested
- [ ] Attack vectors tested
- [ ] Gas/fee optimization verified
- [ ] Multi-user scenarios tested

## Security Measures Implemented

**Validation Checks:**
```haskell
-- Or Aiken code showing key validation logic
```

**Access Controls:**
- [ ] Owner/admin checks
- [ ] Time locks
- [ ] Spending limits
- [ ] Multi-signature requirements
- [ ] Other: ___________

**Error Handling:**
```haskell
-- Error handling patterns used
```

## External Dependencies

**Libraries Used:**
- Plutus TX: [version]
- Aiken stdlib: [version]
- Lucid Evolution: [version]
- Other: ___________

**External Oracles/Services:**
- [ ] Price oracles
- [ ] Data feeds
- [ ] Other smart contracts
- List: ___________

## Previous Audits

**Prior Audit Reports:** [Link if available]
**Auditor:**
**Date:**
**Critical Issues Found:**
**All Issues Resolved:** [Yes / No]

## Audit Scope Request

**What to Review:**
- [ ] Validator logic correctness
- [ ] Double satisfaction attacks
- [ ] Input validation completeness
- [ ] Economic attack vectors
- [ ] Gas/execution unit optimization
- [ ] CIP compliance
- [ ] Off-chain code security
- [ ] Documentation accuracy

**Out of Scope:**
- List anything not to be reviewed

## Timeline

**Requested Audit Completion Date:**
**Planned Mainnet Deployment Date:**
**Emergency Contact:**

## Budget (if external audit)

**Budget Range:**
**Preferred Auditors:** [MLabs / Tweag / Runtime Verification / Certik / Other]

## Deployment Plan

**Deployment Strategy:**
- [ ] Full deployment
- [ ] Gradual rollout with limits
- [ ] Canary deployment
- [ ] Beta with whitelisted users

**Initial Limits:**
- Max transaction size: ___________
- Max TVL: ___________
- Max users: ___________

**Monitoring Plan:**
- [ ] Transaction monitoring
- [ ] Alert system configured
- [ ] Emergency pause mechanism
- [ ] Rollback procedure

## Emergency Contacts

**Primary Contact:**
**Email:**
**Discord/Telegram:**
**Response Time SLA:** [Expected response time for critical issues]

## Additional Context

Any other information relevant to the security audit.

## Security Disclosure

**Is this a vulnerability disclosure?** [Yes / No]

If Yes:
- **Severity:** [Low / Medium / High / Critical]
- **Affected Versions:**
- **Mitigation Available:** [Yes / No]
- **Public Disclosure Date:** [If coordinated disclosure]

## Checklist

- [ ] I have reviewed the [Smart Contract Security Guidelines](../.github/instructions/smart-contract-security.instructions.md)
- [ ] I have completed all pre-deployment security checks
- [ ] I have tested on testnet for minimum 2 weeks
- [ ] I have 100% test coverage
- [ ] I have documented all validator logic
- [ ] I have an emergency response plan
- [ ] I have checked for known vulnerability patterns
- [ ] I have reviewed CIP compliance requirements

## Confidentiality

- [ ] This audit request contains sensitive information
- [ ] Require NDA before sharing code
- [ ] Public disclosure after mainnet deployment
