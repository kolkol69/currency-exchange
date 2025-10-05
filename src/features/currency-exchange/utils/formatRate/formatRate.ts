import Big from "big.js"
import type { Currency } from "@/features/currency-exchange/api/types"
import { formatAmountForCurrency } from "@/features/currency-exchange/utils"

export interface FormattedRate {
  baseAmount: Big
  displayAmount: string
  sourceCurrency: Currency
  targetCurrency: Currency
  key: string
}

export const formatRate = (
  crossRate: Big,
  sourceCurrency: Currency,
  targetCurrency: Currency,
): FormattedRate => {
  const formatted = formatAmountForCurrency(crossRate, targetCurrency)

  // Check if the rate is very small (less than 0.01) to determine if we should use 100 as base amount
  const isVerySmall = crossRate.lt(0.01) && crossRate.gt(0)
  const baseAmount = isVerySmall ? Big(100) : Big(1)
  const displayAmount = isVerySmall
    ? formatAmountForCurrency(crossRate.times(100), targetCurrency)
    : formatted
  const key = `${baseAmount.toString()}-${displayAmount}-${sourceCurrency}-${targetCurrency}`

  return {
    baseAmount,
    displayAmount,
    sourceCurrency,
    targetCurrency,
    key,
  }
}
