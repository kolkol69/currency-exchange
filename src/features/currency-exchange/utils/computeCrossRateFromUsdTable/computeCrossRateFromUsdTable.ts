import type {
  Currency,
  ConversionRates,
} from "@/features/currency-exchange/api/types"
import Big from "big.js"

export function computeCrossRateFromUsdTable(
  table: ConversionRates | null | undefined,
  sourceCurrency: Currency,
  targetCurrency: Currency,
): Big | null {
  if (!table) return null
  if (sourceCurrency === targetCurrency) return Big(1)

  const usdToSource = table[sourceCurrency]
  const usdToTarget = table[targetCurrency]

  if (usdToSource == null || usdToTarget == null) return null
  if (usdToSource === 0) return null // avoid division by zero

  return Big(usdToTarget).div(usdToSource)
}
