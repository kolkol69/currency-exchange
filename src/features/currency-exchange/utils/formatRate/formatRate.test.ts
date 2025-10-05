import { describe, it, expect } from "vitest"
import Big from "big.js"
import { formatRate } from "./formatRate"

describe("formatRate", () => {
  it("formats normal exchange rates correctly", () => {
    const result = formatRate(Big(2.5), "USD", "ARS")

    expect(result.baseAmount.toString()).toBe("1")
    expect(result.displayAmount).toBe("2.50")
    expect(result.sourceCurrency).toBe("USD")
    expect(result.targetCurrency).toBe("ARS")
    expect(result.key).toBe("1-2.50-USD-ARS")
  })

  it("handles very small rates by using 100 as base amount", () => {
    const result = formatRate(Big("0.0001"), "USD", "ARS")

    expect(result.baseAmount.toString()).toBe("100")
    expect(result.displayAmount).toBe("0.01")
    expect(result.sourceCurrency).toBe("USD")
    expect(result.targetCurrency).toBe("ARS")
    expect(result.key).toBe("100-0.01-USD-ARS")
  })

  it("handles very small positive rates that don't round to zero", () => {
    const result = formatRate(Big("0.001"), "USD", "ARS")

    expect(result.baseAmount.toString()).toBe("100")
    expect(result.displayAmount).toBe("0.10")
    expect(result.sourceCurrency).toBe("USD")
    expect(result.targetCurrency).toBe("ARS")
    expect(result.key).toBe("100-0.10-USD-ARS")
  })

  it("handles COP to USD small rates with 100 COP base", () => {
    // This simulates a typical COP to USD rate (around 0.00025)
    const result = formatRate(Big("0.00025"), "COP", "USD")

    expect(result.baseAmount.toString()).toBe("100")
    expect(result.displayAmount).toBe("0.03")
    expect(result.sourceCurrency).toBe("COP")
    expect(result.targetCurrency).toBe("USD")
    expect(result.key).toBe("100-0.03-COP-USD")
  })

  it("uses 1 as base amount for rates >= 0.01", () => {
    const result = formatRate(Big("0.01"), "USD", "ARS")

    expect(result.baseAmount.toString()).toBe("1")
    expect(result.displayAmount).toBe("0.01")
    expect(result.sourceCurrency).toBe("USD")
    expect(result.targetCurrency).toBe("ARS")
    expect(result.key).toBe("1-0.01-USD-ARS")
  })

  it("handles rates with many decimal places", () => {
    const result = formatRate(Big("1.23456789"), "USD", "ARS")

    expect(result.baseAmount.toString()).toBe("1")
    expect(result.displayAmount).toBe("1.23")
    expect(result.sourceCurrency).toBe("USD")
    expect(result.targetCurrency).toBe("ARS")
    expect(result.key).toBe("1-1.23-USD-ARS")
  })

  it("handles COP currency with 0 decimal places", () => {
    const result = formatRate(Big("1.23456789"), "USD", "COP")

    expect(result.baseAmount.toString()).toBe("1")
    expect(result.displayAmount).toBe("1")
    expect(result.sourceCurrency).toBe("USD")
    expect(result.targetCurrency).toBe("COP")
    expect(result.key).toBe("1-1-USD-COP")
  })
})
