# Discord Alert Reference

`action-state-watch` formats notifications for Discord using rich **Embed** objects defined in `src/alerts/discord.ts`.

## Severity Color Mapping

Embed border colors visually distinguish severity levels:

| Severity Level | Hex Color | Color Name | Triggering Health Band |
|---|---|---|---|
| `info` | `0x3498DB` | Blue | `expiring_soon` |
| `high` | `0xE74C3C` | Red | `critical` |
| `critical` | `0x1A1A2E` | Dark Navy | `archived` |

## JSON Payload Schema

When a contract scan requires alerting, the action builds a Discord message payload:

```json
{
  "content": "🚨 Soroban State Watch — 1 alert(s)",
  "embeds": [
    {
      "title": "🔴 HIGH — archival-fixtures-demo rapid-expiry entry",
      "description": "⚠️ *CRITICAL* — `archival-fixtures-demo rapid-expiry entry` (`CAEDHSOD3TXIAZF2BZMMNX7A2OKBCVE4WU7A6RWTHGGHWHJXHEQUMAT4`)",
      "color": 15158332,
      "fields": [
        {
          "name": "Ledgers Remaining",
          "value": "12,450",
          "inline": true
        },
        {
          "name": "Days Remaining",
          "value": "~0",
          "inline": true
        },
        {
          "name": "Live Until Ledger",
          "value": "4,710,000",
          "inline": true
        }
      ],
      "footer": {
        "text": "Soroban State Watch"
      },
      "timestamp": "2026-09-10T08:33:01.000Z"
    }
  ]
}
```

## Behavior Notes
- **Timestamps**: Uses the scan generation timestamp (`scanned_at`) for accurate event tracking.
- **Suppression on Healthy**: If all monitored contracts are healthy, no Discord webhook POST is dispatched.
