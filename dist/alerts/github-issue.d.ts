import { ContractScanResult } from "../types";
/** Label applied to state-watch issues for dedup search. */
export declare const STATE_WATCH_LABEL = "state-watch";
/**
 * Create or update issues for Critical/Archived contracts.
 * Deduplicates by searching for open issues with `state-watch` label
 * whose title contains the contract address.
 *
 * Respects `dedupeWindowHours` — if a comment or issue was created within
 * the window, no new comment is posted to avoid spam.
 */
export declare function handleGitHubIssues(token: string, results: ContractScanResult[], dedupeWindowHours?: number): Promise<void>;
//# sourceMappingURL=github-issue.d.ts.map