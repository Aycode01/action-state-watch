# How Monitoring Works

`action-state-watch` follows a deterministic execution pipeline designed for secure, unattended scheduled runs.

## Monitoring Pipeline

```
Trigger (Cron / Dispatch)
       │
       ▼
1. Load Config ────────► Parse & validate contracts.yml
       │
       ▼
2. Resolve CLI ────────► Check PATH or fetch soroban-state-sentinel
       │
       ▼
3. Execute Scan ───────► Shell out via execFileSync (no shell interpolation)
       │
       ▼
4. Parse Output ───────► Validate JSON matching SCHEMA.md v1.1.0
       │
       ▼
5. Map Severity ───────► Map HealthBand to AlertSeverity
       │
       ▼
6. Dispatch Alerts ────► Send Slack / Discord / GitHub Issue notifications
       │
       ▼
7. Artifact Output ────► Upload unsigned restore XDR (if Critical/Archived)
```

## Detailed Execution Steps

### 1. Trigger & Config Loading
The action is triggered on a schedule (e.g. `0 */6 * * *`) or manually via `workflow_dispatch`. It reads the configuration file (defaulting to `contracts.yml`) using `loadConfig()`, parsing contract addresses, label overrides, and threshold options.

### 2. CLI Resolution
The action resolves the `soroban-state-sentinel` CLI location. It checks if the binary is present on PATH, falling back to compiling from source or downloading the pinned release binary.

### 3. Secure Execution via `execFileSync`
Contract scanning invokes `soroban-state-sentinel scan --json` for each configured contract. To prevent command injection vulnerabilities, execution uses Node.js `execFileSync` with explicit argument arrays (`[ 'scan', '--rpc-url', rpcUrl, '--json', contractAddress ]`). **No shell string interpolation is used**, eliminating shell expansion risks.

### 4. JSON Schema Parsing
The CLI output is parsed into a `SentinelScanOutput` structure matching `SCHEMA.md v1.1.0`. The worst entry health band (`archived` > `critical` > `expiring_soon` > `healthy`) determines the overall contract health band.

### 5. Severity Mapping
Health bands map directly to operational alert severity:
- `healthy` → `none` (No alert sent)
- `expiring_soon` → `info`
- `critical` → `high`
- `archived` → `critical`

### 6. Multi-Channel Alert Dispatch
If alerts are warranted, notifications are formatted and dispatched to configured channels (Slack Block Kit, Discord Embeds, or GitHub Issues).

### 7. Unsigned Restore Artifact Upload
When contracts enter `Critical` or `Archived` state, unsigned restore transaction XDR is generated and uploaded as a GitHub Actions workflow artifact for operator retrieval and manual signing.
