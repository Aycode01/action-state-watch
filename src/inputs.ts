import * as core from "@actions/core";

/**
 * Parsing helpers for GitHub Actions `with:` inputs.
 *
 * Inputs always arrive as strings, so booleans need explicit parsing. Values
 * that aren't recognisable booleans fail fast instead of being silently
 * coerced — a wrong `fail-on-critical` value would otherwise change whether a
 * decaying contract turns a workflow red.
 */

/** Default for `fail-on-critical` when the input is not provided. */
export const DEFAULT_FAIL_ON_CRITICAL = true;

/**
 * Parse the `fail-on-critical` input.
 *
 * Accepts the YAML 1.2 core-schema booleans GitHub Actions allows
 * ("true"/"false", case-insensitive). An empty or missing value falls back to
 * the default, which keeps direct local invocations (where no input is set)
 * behaving like the action's declared default.
 */
export function parseFailOnCritical(raw: string | undefined): boolean {
  const value = (raw ?? "").trim().toLowerCase();

  if (value === "") return DEFAULT_FAIL_ON_CRITICAL;
  if (value === "true") return true;
  if (value === "false") return false;

  throw new Error(
    `Input 'fail-on-critical' must be 'true' or 'false', got: '${raw}'`
  );
}

/**
 * Read and parse the `fail-on-critical` input from the action environment.
 */
export function getFailOnCritical(): boolean {
  const parsed = parseFailOnCritical(core.getInput("fail-on-critical"));
  core.info(`Fail on Critical/Archived: ${parsed}`);
  return parsed;
}
