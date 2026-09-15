import * as core from "@actions/core";

import {
  DEFAULT_FAIL_ON_CRITICAL,
  getFailOnCritical,
  parseFailOnCritical,
} from "../src/inputs";

jest.mock("@actions/core", () => ({
  info: jest.fn(),
  getInput: jest.fn(),
}));

const mockGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

describe("inputs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("parseFailOnCritical", () => {
    test("defaults to true when the input is missing or empty", () => {
      expect(DEFAULT_FAIL_ON_CRITICAL).toBe(true);
      expect(parseFailOnCritical(undefined)).toBe(true);
      expect(parseFailOnCritical("")).toBe(true);
      expect(parseFailOnCritical("   ")).toBe(true);
    });

    test("parses true case-insensitively", () => {
      expect(parseFailOnCritical("true")).toBe(true);
      expect(parseFailOnCritical("True")).toBe(true);
      expect(parseFailOnCritical("TRUE")).toBe(true);
      expect(parseFailOnCritical(" true ")).toBe(true);
    });

    test("parses false case-insensitively", () => {
      expect(parseFailOnCritical("false")).toBe(false);
      expect(parseFailOnCritical("False")).toBe(false);
      expect(parseFailOnCritical("FALSE")).toBe(false);
      expect(parseFailOnCritical(" false ")).toBe(false);
    });

    test("throws on values that are not booleans", () => {
      expect(() => parseFailOnCritical("yes")).toThrow("must be 'true' or 'false'");
      expect(() => parseFailOnCritical("1")).toThrow("must be 'true' or 'false'");
      expect(() => parseFailOnCritical("no")).toThrow("must be 'true' or 'false'");
    });
  });

  describe("getFailOnCritical", () => {
    test("reads the fail-on-critical input", () => {
      mockGetInput.mockReturnValue("false");

      expect(getFailOnCritical()).toBe(false);
      expect(mockGetInput).toHaveBeenCalledWith("fail-on-critical");
    });

    test("falls back to the default when the input is unset", () => {
      mockGetInput.mockReturnValue("");

      expect(getFailOnCritical()).toBe(true);
    });

    test("propagates invalid input values", () => {
      mockGetInput.mockReturnValue("maybe");

      expect(() => getFailOnCritical()).toThrow("must be 'true' or 'false'");
    });
  });
});
