# `contracts.yml` Configuration Schema

The `contracts.yml` file configures network target, monitored contract addresses, custom TTL thresholds, and alert behavior.

## Schema Reference

```yaml
network: string                      # Required: 'testnet' | 'mainnet' | 'futurenet'
contracts:                           # Required: Non-empty array of contracts
  - address: string                  # Required: Valid 56-char Stellar address starting with C or G
    label: string                    # Optional: Human-readable name for alerts
    keys:                            # Optional: Array of hex/base64 SCVal XDR keys
      - string
    healthy-days: number             # Optional: Minimum days remaining to be considered Healthy
    critical-days: number            # Optional: Maximum days remaining before Critical alert

alert:                               # Optional: Alert configuration block
  dedupe-window-hours: integer       # Optional: Hours between duplicate issue updates (min: 1)
```

## Field Validation Rules

Extracted from `src/config.ts`:
- **`network`**: Must be a non-empty string.
- **`contracts`**: Must be a non-empty array.
- **`address`**: Must match `/^[CG][A-Z0-9]{55}$/` (valid base32 Stellar contract `C...` or account `G...` address).
- **`healthy-days` / `critical-days`**: Must be non-negative numbers.
- **`dedupe-window-hours`**: Must be a positive integer (>= 1).

> **Note**: The obsolete `--safety-margin-ledgers` flag does not exist in `soroban-state-sentinel` CLI v1.1.0 and is not present in `contracts.yml`.

## Worked Example (`contracts.example.yml`)

The following example monitors the live `archival-fixtures-demo` testnet contract:

```yaml
# contracts.yml — Example configuration for action-state-watch
network: testnet

contracts:
  - address: 'CAEDHSOD3TXIAZF2BZMMNX7A2OKBCVE4WU7A6RWTHGGHWHJXHEQUMAT4'
    label: 'archival-fixtures-demo rapid-expiry entry'
    keys: []
    healthy-days: 1
    critical-days: 1

alert:
  dedupe-window-hours: 24
```

> ⚠️ **Important Threshold Note**: The `healthy-days: 1` and `critical-days: 1` thresholds in the example above are intentionally tight for testing against a short-lived testnet fixture. Production contracts typically use default thresholds (`healthy-days: 30`, `critical-days: 7`).
