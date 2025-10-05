import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ExchangeCurrency } from "./ExchangeCurrency"
import { useGetConversionRates } from "@/features/currency-exchange/api"

vi.mock("@/features/currency-exchange/api", () => {
  return {
    useGetConversionRates: vi.fn(),
  }
})

const getFromInput = () =>
  screen.getByLabelText("From amount in USD") as HTMLInputElement
const getToInput = (code: string) =>
  screen.getByLabelText(`To amount in ${code}`) as HTMLInputElement

const focusFrom = () => {
  const input = getFromInput()
  fireEvent.focus(input)
}
const focusTo = (code: string) => {
  const input = getToInput(code)
  fireEvent.focus(input)
}

const getExchangeButton = () =>
  screen.getByRole("button", { name: /exchange now/i })

const mockUseGetConversionRates = vi.mocked(useGetConversionRates)

describe("ExchangeCurrency", () => {
  it("shows loading indicators while rates are loading", () => {
    vi.clearAllMocks()
    mockUseGetConversionRates.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any)
    render(<ExchangeCurrency />)
    // Loading spinner in the direction control
    expect(document.querySelector(".animate-spin")).toBeTruthy()
    // RateDisplay skeleton
    expect(document.querySelector(".animate-pulse")).toBeTruthy()
    // Button should be disabled initially
    expect(getExchangeButton()).toBeDisabled()
  })

  it("disables button when inputs are empty or zero", async () => {
    vi.clearAllMocks()
    mockUseGetConversionRates.mockReturnValue({
      data: { USD: 1, ARS: 900, MXN: 17, COP: 4000 },
      isLoading: false,
    } as any)
    render(<ExchangeCurrency />)

    const btn = getExchangeButton()
    expect(btn).toBeDisabled()

    // Focus and enter 0 on From
    focusFrom()
    fireEvent.change(getFromInput(), { target: { value: "0" } })
    await waitFor(() => expect(btn).toBeDisabled())

    // Enter 0 on To as well; first move focus to To
    focusTo("COP")
    fireEvent.change(getToInput("COP"), { target: { value: "0" } })
    await waitFor(() => expect(btn).toBeDisabled())
  })

  it("enables button when either side has a valid non-zero amount and cross rate exists", async () => {
    vi.clearAllMocks()
    mockUseGetConversionRates.mockReturnValue({
      data: { USD: 1, ARS: 900, MXN: 17, COP: 4000 },
      isLoading: false,
    } as any)
    render(<ExchangeCurrency />)

    // Edit From side (USD -> COP)
    focusFrom()
    fireEvent.change(getFromInput(), { target: { value: "10" } })
    await waitFor(() => expect(getExchangeButton()).not.toBeDisabled())
  })

  it("computes To when typing on From; computes From when typing on To", async () => {
    vi.clearAllMocks()
    mockUseGetConversionRates.mockReturnValue({
      data: { USD: 1, ARS: 900, MXN: 17, COP: 4000 },
      isLoading: false,
    } as any)
    render(<ExchangeCurrency />)

    // From editing: USD -> COP cross ~ 4000
    focusFrom()
    fireEvent.change(getFromInput(), { target: { value: "2" } })
    const toInput1 = getToInput("COP")
    await waitFor(() => expect(toInput1.value).toBe("$8,000"))

    // Switch to To editing and type value; From should update
    focusTo("COP")
    fireEvent.change(toInput1, { target: { value: "8000" } })
    await waitFor(() => expect(getFromInput().value).toBe("$2.00"))
  })

  it("clears the opposite input when typing invalid/empty on active side", async () => {
    vi.clearAllMocks()
    mockUseGetConversionRates.mockReturnValue({
      data: { USD: 1, ARS: 900, MXN: 17, COP: 4000 },
      isLoading: false,
    } as any)
    render(<ExchangeCurrency />)

    // From side invalid
    focusFrom()
    fireEvent.change(getFromInput(), { target: { value: "." } })
    await waitFor(() => expect(getToInput("COP").value).toBe("$0"))

    // To side invalid
    focusTo("COP")
    fireEvent.change(getToInput("COP"), { target: { value: "." } })
    await waitFor(() => expect(getFromInput().value).toBe("$0.00"))
  })

  it("shows 1:1 rate when currencies are equal and updates when changed", async () => {
    vi.clearAllMocks()
    mockUseGetConversionRates.mockReturnValue({
      data: { USD: 1, ARS: 900, MXN: 17, COP: 4000 },
      isLoading: false,
    } as any)
    render(<ExchangeCurrency />)

    // Initially USD > COP; change To select to USD to make equal
    const toSelect = screen.getAllByRole("combobox")[1]!
    fireEvent.click(toSelect)
    const usdOption = await screen.findByRole("option", { name: "USD" })
    fireEvent.click(usdOption)

    // RateDisplay should show 1:1
    await waitFor(() => {
      expect(screen.getByText("1 USDc = 1.00 USDc")).toBeInTheDocument()
    })
  })

  it("displays skeleton when cross rate cannot be computed (missing currency)", async () => {
    vi.clearAllMocks()
    // Remove COP from table so cross rate is null for USD > COP
    mockUseGetConversionRates.mockReturnValue({
      data: { USD: 1, ARS: 900, MXN: 17 } as any,
      isLoading: false,
    } as any)
    render(<ExchangeCurrency />)
    await waitFor(() =>
      expect(document.querySelector(".animate-pulse")).toBeTruthy(),
    )
    expect(getExchangeButton()).toBeDisabled()
  })

  it("displays skeleton when cross rate cannot be computed (division by zero)", async () => {
    vi.clearAllMocks()
    // USD > COP where USD rate is 0 causes division by zero guard -> null
    mockUseGetConversionRates.mockReturnValue({
      data: { USD: 0, ARS: 900, MXN: 17, COP: 4000 },
      isLoading: false,
    } as any)
    render(<ExchangeCurrency />)
    await waitFor(() =>
      expect(document.querySelector(".animate-pulse")).toBeTruthy(),
    )
  })

  it("fires confetti and clears inputs on Exchange click", async () => {
    vi.clearAllMocks()
    mockUseGetConversionRates.mockReturnValue({
      data: { USD: 1, ARS: 900, MXN: 17, COP: 4000 },
      isLoading: false,
    } as any)
    render(<ExchangeCurrency />)

    focusFrom()
    fireEvent.change(getFromInput(), { target: { value: "5" } })
    await waitFor(() => expect(getExchangeButton()).not.toBeDisabled())

    fireEvent.click(getExchangeButton())
    // Confetti mounts
    await waitFor(() => {
      expect(document.querySelector(".confetti-piece")).toBeTruthy()
    })
    // Inputs cleared
    await waitFor(() => {
      expect(getFromInput().value).toBe("")
      expect(getToInput("COP").value).toBe("")
    })
  })
})
