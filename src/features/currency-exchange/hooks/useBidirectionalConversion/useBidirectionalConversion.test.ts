import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import Big from "big.js"
import { useBidirectionalConversion } from "./useBidirectionalConversion"

describe("useBidirectionalConversion", () => {
  it("computes target when editing source (from)", () => {
    const crossRate = Big(2)
    const { result } = renderHook(() =>
      useBidirectionalConversion({
        crossRate,
        sourceCurrency: "USD",
        targetCurrency: "ARS",
      }),
    )

    act(() => {
      result.current.onSourceAmountChange("10")
    })

    expect(result.current.activeSide).toBe("from")
    expect(result.current.targetAmount).toBe("20.00")
  })

  it("computes source when editing target (to)", () => {
    const crossRate = Big(2)
    const { result } = renderHook(() =>
      useBidirectionalConversion({
        crossRate,
        sourceCurrency: "USD",
        targetCurrency: "ARS",
      }),
    )

    act(() => {
      result.current.setActiveSide("to")
      result.current.onTargetAmountChange("20")
    })

    expect(result.current.activeSide).toBe("to")
    expect(result.current.sourceAmount).toBe("10.00")
  })

  it("clears outputs for invalid inputs", () => {
    const crossRate = Big(2)
    const { result } = renderHook(() =>
      useBidirectionalConversion({
        crossRate,
        sourceCurrency: "USD",
        targetCurrency: "ARS",
      }),
    )

    act(() => {
      result.current.onSourceAmountChange("")
    })
    expect(result.current.targetAmount).toBe("")

    act(() => {
      result.current.onTargetAmountChange("")
    })
    expect(result.current.sourceAmount).toBe("")
  })
})
