import { describe, it, expect } from "vitest"
import Big from "big.js"
import { formatAmountForCurrency } from "./formatAmountForCurrency"

describe("formatAmountForCurrency", () => {
  it("rounds to currency minor units", () => {
    expect(formatAmountForCurrency(Big("1.234"), "USD")).toBe("1.23")
    expect(formatAmountForCurrency(Big("1.235"), "USD")).toBe("1.24")
  })

  it("uses 0 decimals for COP", () => {
    expect(formatAmountForCurrency(Big("1234.56"), "COP")).toBe("1235")
  })

  it("shows more precision for small amounts to avoid misleading rounding", () => {
    // Test case: 20 COP to USD should show 0.0051 instead of 0.01
    expect(formatAmountForCurrency(Big("0.0051"), "USD")).toBe("0.0051")
    expect(formatAmountForCurrency(Big("0.0049"), "USD")).toBe("0.0049")
    expect(formatAmountForCurrency(Big("0.0001"), "USD")).toBe("0.0001")
  })

  it("still rounds normally for amounts >= 0.01", () => {
    expect(formatAmountForCurrency(Big("0.01"), "USD")).toBe("0.01")
    expect(formatAmountForCurrency(Big("0.015"), "USD")).toBe("0.02")
    expect(formatAmountForCurrency(Big("1.234"), "USD")).toBe("1.23")
  })
})
