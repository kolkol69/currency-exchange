import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import RateDisplay from "@/features/currency-exchange/components/RateDisplay/RateDisplay"
import Big from "big.js"

describe("RateDisplay", () => {
  it("shows loading skeleton when no crossRate", () => {
    const { container } = render(
      <RateDisplay
        crossRate={null}
        sourceCurrency="USD"
        targetCurrency="ARS"
      />,
    )
    expect(container.querySelector(".animate-pulse")).toBeTruthy()
  })

  it("shows formatted rate when available", () => {
    render(
      <RateDisplay
        crossRate={Big(2)}
        sourceCurrency="USD"
        targetCurrency="ARS"
      />,
    )
    expect(screen.getByText("1 USDc = 2.00 ARS")).toBeInTheDocument()
  })

  it("handles near-zero target with x100 display", () => {
    render(
      <RateDisplay
        crossRate={Big("0.0001")}
        sourceCurrency="USD"
        targetCurrency="ARS"
      />,
    )
    expect(screen.getByText("100 USDc = 0.01 ARS")).toBeInTheDocument()
  })
})
