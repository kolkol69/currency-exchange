import type { Currency } from "@/features/currency-exchange/api/types"

export const getCurrencyDisplayName = (currency: Currency): string => {
  const displayMap: Record<Currency, string> = {
    USD: "USDc",
    ARS: "ARS",
    MXN: "MXN",
    COP: "COP",
  }

  return displayMap[currency]
}
