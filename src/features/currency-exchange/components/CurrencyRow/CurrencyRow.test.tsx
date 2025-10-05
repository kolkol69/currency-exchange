import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import CurrencyRow from "./CurrencyRow"

describe("CurrencyRow", () => {
  it("renders and calls onAmountChange on input", () => {
    const onAmountChange = vi.fn()
    const onCurrencyChange = vi.fn()
    render(
      <CurrencyRow
        label="From"
        currency="USD"
        amount="1234"
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
      />,
    )

    const input = screen.getByLabelText(
      "From amount in USD",
    ) as HTMLInputElement
    fireEvent.change(input, { target: { value: "567" } })

    expect(onAmountChange).toHaveBeenLastCalledWith("567.00")
  })

  it("allows entering decimals for USD and passes raw numeric string", () => {
    const onAmountChange = vi.fn()
    const onCurrencyChange = vi.fn()
    render(
      <CurrencyRow
        label="From"
        currency="USD"
        amount=""
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
      />,
    )

    const input = screen.getByLabelText(
      "From amount in USD",
    ) as HTMLInputElement
    fireEvent.change(input, { target: { value: "12.34" } })

    expect(onAmountChange).toHaveBeenLastCalledWith("12.34")
  })

  it("clears value when deleting text", () => {
    const onAmountChange = vi.fn()
    const onCurrencyChange = vi.fn()
    render(
      <CurrencyRow
        label="From"
        currency="USD"
        amount="123"
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
      />,
    )

    const input = screen.getByLabelText(
      "From amount in USD",
    ) as HTMLInputElement
    fireEvent.change(input, { target: { value: "" } })
    expect(onAmountChange).toHaveBeenLastCalledWith("")
  })

  it("uses correct placeholders for currency minor units (USD vs COP)", () => {
    const noop = () => {}
    const { rerender } = render(
      <CurrencyRow
        label="From"
        currency="USD"
        amount=""
        onAmountChange={noop}
        onCurrencyChange={() => {}}
      />,
    )

    const usdInput = screen.getByLabelText(
      "From amount in USD",
    ) as HTMLInputElement
    expect(usdInput.getAttribute("placeholder")).toBe("0.00")

    rerender(
      <CurrencyRow
        label="From"
        currency="COP"
        amount=""
        onAmountChange={noop}
        onCurrencyChange={() => {}}
      />,
    )
    const copInput = screen.getByLabelText(
      "From amount in COP",
    ) as HTMLInputElement
    expect(copInput.getAttribute("placeholder")).toBe("0")
  })

  it("shows more decimal places for small amounts to avoid misleading rounding", () => {
    const onAmountChange = vi.fn()
    const onCurrencyChange = vi.fn()
    const { rerender } = render(
      <CurrencyRow
        label="To"
        currency="USD"
        amount="0.0051"
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
      />,
    )

    const input = screen.getByLabelText("To amount in USD") as HTMLInputElement
    // The input should display 0.0051 with 4 decimal places for small amounts
    expect(input.value).toBe("$0.0051")

    // Test with a normal amount - should use standard 2 decimal places
    rerender(
      <CurrencyRow
        label="To"
        currency="USD"
        amount="1.234"
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
      />,
    )
    const normalInput = screen.getByLabelText(
      "To amount in USD",
    ) as HTMLInputElement
    expect(normalInput.value).toBe("$1.23")
  })
})
