import type { ConversionRates } from "@/features/currency-exchange/api/types"
import type { Options } from "./types"

export const LIST_OF_CURRENCIES: Options[] = [
  {
    code: "USD",
    country: "US",
    label: "$",
  },

  {
    code: "ARS",
    country: "AR",
    label: "$",
  },

  {
    code: "MXN",
    country: "MX",
    label: "$",
  },
  {
    code: "COP",
    country: "CO",
    label: "$",
  },
]

export const CURRENCY_MINOR_UNITS: ConversionRates = {
  USD: 2,
  ARS: 2,
  MXN: 2,
  COP: 0,
}
