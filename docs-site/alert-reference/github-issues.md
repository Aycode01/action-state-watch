# GitHub Issues Reference

`action-state-watch` integrates with GitHub's REST API via Octokit (`src/alerts/github-issue.ts`) to manage tracking issues for `Critical` and `Archived` contracts.

## Key Features

### 1. Label Tagging & Address Matching
All issues created by the action are tagged with the dedicated label:
```
state-watch
```
Address validation in `src/config.ts` enforces the regex `/^[CG][A-Z0-9]{55}$/`, matching both contract addresses (`C...`) and account addresses (`G...`).

### 2. Deduplication & Cooldown Windows
Before creating a new issue, the action searches for existing open issues matching:
- **Label**: `state-watch`
- **Title**: Contains the target contract address (`C...` or `G...`)

If an open issue exists:
- The action checks the `alert.dedupe-window-hours` setting (default: 24 hours).
- If the issue or last comment was updated within the cooldown window, no new comment is added (preventing alert spam).
- If the window has elapsed, a status comment update is appended to the existing issue.

### 3. Auto-Resolution on Recovery
When a previously degraded contract recovers to the `Healthy` health band (e.g. following a successful TTL bump or extension transaction):
1. The action detects the contract is now `Healthy`.
2. It queries for open issues matching the contract address and `state-watch` label.
3. It appends a recovery notification comment: `✅ Contract recovered to Healthy state.`
4. It automatically closes the issue with reason `completed`.

## Required Permissions

To use GitHub Issues alerting, pass the `github-token` input in your workflow:

```yaml
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
```

Ensure workflow job permissions include:
```yaml
permissions:
  issues: write
```
