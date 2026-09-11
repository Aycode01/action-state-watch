# The Trust Boundary

`action-state-watch` maintains a strict, non-negotiable security boundary: **it operates purely as a read-only monitoring and alerting system**.

This document mirrors the primary security guarantees established in [`SECURITY.md`](../SECURITY.md).

## What This Action Does

- **Scans** contract TTL/archival status by invoking `soroban-state-sentinel` CLI.
- **Reads** public ledger state via Stellar RPC nodes (`getLedgerEntries`).
- **Posts** alert notifications to Slack or Discord webhooks.
- **Creates & Manages** GitHub Issues using `github-token`.
- **Uploads** unsigned restore XDR files as workflow artifacts.

## What This Action NEVER Does

- ❌ **Never holds, generates, or uses private keys** or secret seeds (`S...`).
- ❌ **Never signs transactions**.
- ❌ **Never submits transactions** to the Stellar network.
- ❌ **Never mutates on-chain state** or writes to the blockchain.

## Security Architecture & Data Flow

```
contracts.yml ──► sentinel CLI ──► Read-Only RPC ──► Health Classification
                                                            │
                                        ┌───────────────────┴───────────────────┐
                                        ▼                                       ▼
                              Webhook / Issue Alerts                  Unsigned Restore XDR
                              (Slack, Discord, GitHub)                 (Workflow Artifact)
```

1. **Read-Only RPC**: All network queries access public Stellar RPC endpoints (`getLedgerEntries`).
2. **Unsigned XDR Artifacts**: Remediation XDR generated during critical states is output as an unsigned payload. Operators must download, inspect, sign, and submit the transaction out-of-band using their own secure key-management infrastructure.
3. **No Private Key Scope**: If future automation requires automatic state restoration or transaction signing, that capability **must** reside in a separate, explicitly-scoped repository with appropriate secret management safeguards.

For reporting security issues, refer to [`SECURITY.md`](../SECURITY.md).
