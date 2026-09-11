# Slack Alert Reference

`action-state-watch` formats notifications for Slack using native **Block Kit** structures defined in `src/alerts/slack.ts`.

## Message Structure

When contracts enter `ExpiringSoon`, `Critical`, or `Archived` states, the action generates a structured Block Kit payload sent to the configured incoming webhook URL.

### JSON Payload Schema

```json
{
  "text": "🚨 Soroban State Watch — 1 alert(s)",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚨 Soroban State Watch — 1 alert(s)"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "⚠️ *CRITICAL* — `archival-fixtures-demo rapid-expiry entry` (`CAEDHSOD3TXIAZF2BZMMNX7A2OKBCVE4WU7A6RWTHGGHWHJXHEQUMAT4`)"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Health Band:*\nCRITICAL"
        },
        {
          "type": "mrkdwn",
          "text": "*Ledgers Remaining:*\n12,450"
        },
        {
          "type": "mrkdwn",
          "text": "*Days Remaining:*\n~0"
        },
        {
          "type": "mrkdwn",
          "text": "*Live Until Ledger:*\n4,710,000"
        }
      ]
    }
  ]
}
```

## Behavior Notes
- **Suppression on Healthy**: If all contracts are in the `Healthy` band, no webhook request is sent.
- **Error Handling**: Failed POST requests to Slack log warnings to the Action output without crashing the overall scanning job.
