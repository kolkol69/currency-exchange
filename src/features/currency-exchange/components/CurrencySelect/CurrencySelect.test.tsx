import { describe, it, expect, vi } from "vitest"
import { fireEvent } from "@testing-library/react"
import { render } from "@testing-library/react"
import { CurrencySelect } from "@/features/currency-exchange/components/CurrencySelect/CurrencySelect"

const options = [
  { code: "USD" as const, label: "$", country: "US" },
  { code: "ARS" as const, label: "$", country: "AR" },
]

describe("CurrencySelect", () => {
  it("renders current flag and opens list", async () => {
    const onChange = vi.fn()
    const { getByRole, findByRole } = render(
      <CurrencySelect value="USD" onChange={onChange} options={options} />,
    )

    const trigger = getByRole("combobox")
    fireEvent.click(trigger)

    expect(await findByRole("option", { name: "USD" })).toBeInTheDocument()
    expect(await findByRole("option", { name: "ARS" })).toBeInTheDocument()
  })

  it("calls onChange when selecting an option", async () => {
    const onChange = vi.fn()
    const { getByRole, findByRole } = render(
      <CurrencySelect value="USD" onChange={onChange} options={options} />,
    )

    fireEvent.click(getByRole("combobox"))
    const item = await findByRole("option", { name: "ARS" })
    fireEvent.click(item)

    expect(onChange).toHaveBeenCalledWith("ARS")
  })
})
