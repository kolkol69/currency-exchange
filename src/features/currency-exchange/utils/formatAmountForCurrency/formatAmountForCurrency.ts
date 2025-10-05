import type { Currency } from "@/features/currency-exchange/api/types"
import Big from "big.js"
import { CURRENCY_MINOR_UNITS } from "@/features/currency-exchange/const"

export const formatAmountForCurrency = (
  amount: Big,
  currency: Currency,
): string => {
  const decimalPlaces = CURRENCY_MINOR_UNITS[currency] ?? 2

  // For very small amounts (less than 0.01), show more precision to avoid misleading rounding
  if (amount.lt(0.01) && amount.gt(0)) {
    // Show up to 4 decimal places for small amounts, but respect currency's minimum precision
    const precision = Math.max(decimalPlaces, 4)
    return amount.round(precision, Big.roundHalfUp).toFixed(precision)
  }

  return amount.round(decimalPlaces, Big.roundHalfUp).toFixed(decimalPlaces)
}
