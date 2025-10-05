import { describe, it, expect } from "vitest"
import { getCurrencyDisplayName } from "./getCurrencyDisplayName"

describe("getCurrencyDisplayName", () => {
  it("returns USDc for USD currency", () => {
    expect(getCurrencyDisplayName("USD")).toBe("USDc")
  })

  it("returns the same code for other currencies", () => {
    expect(getCurrencyDisplayName("ARS")).toBe("ARS")
    expect(getCurrencyDisplayName("MXN")).toBe("MXN")
    expect(getCurrencyDisplayName("COP")).toBe("COP")
  })
})
