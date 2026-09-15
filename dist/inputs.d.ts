/**
 * Parsing helpers for GitHub Actions `with:` inputs.
 *
 * Inputs always arrive as strings, so booleans need explicit parsing. Values
 * that aren't recognisable booleans fail fast instead of being silently
 * coerced — a wrong `fail-on-critical` value would otherwise change whether a
 * decaying contract turns a workflow red.
 */
/** Default for `fail-on-critical` when the input is not provided. */
export declare const DEFAULT_FAIL_ON_CRITICAL = true;
/**
 * Parse the `fail-on-critical` input.
 *
 * Accepts the YAML 1.2 core-schema booleans GitHub Actions allows
 * ("true"/"false", case-insensitive). An empty or missing value falls back to
 * the default, which keeps direct local invocations (where no input is set)
 * behaving like the action's declared default.
 */
export declare function parseFailOnCritical(raw: string | undefined): boolean;
/**
 * Read and parse the `fail-on-critical` input from the action environment.
 */
export declare function getFailOnCritical(): boolean;
