import { describe, it, expect } from "vitest"
import { computeCrossRateFromUsdTable } from "./computeCrossRateFromUsdTable"

describe("computeCrossRateFromUsdTable", () => {
  it("returns null when table is missing", () => {
    expect(computeCrossRateFromUsdTable(undefined, "USD", "ARS")).toBeNull()
  })

  it("returns 1 when currencies are the same", () => {
    const table = { USD: 1, ARS: 900, MXN: 20, COP: 1000 }
    const result = computeCrossRateFromUsdTable(table, "USD", "USD")
    expect(result?.toString()).toBe("1")
  })

  it("returns null when a rate is missing", () => {
    const table = { USD: 1, ARS: 900 } as const
    expect(computeCrossRateFromUsdTable(table as any, "USD", "MXN")).toBeNull()
  })

  it("computes usdToTarget / usdToSource", () => {
    const table = { USD: 1, ARS: 900, MXN: 20, COP: 1000 }
    const result = computeCrossRateFromUsdTable(table, "ARS", "MXN")
    // 20 / 900
    expect(result?.toString()).toBe("0.02222222222222222222")
  })
})
