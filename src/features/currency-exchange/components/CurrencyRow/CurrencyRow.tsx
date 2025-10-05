import {
  LIST_OF_CURRENCIES,
  CURRENCY_MINOR_UNITS,
} from "@/features/currency-exchange/const"
import { useMemo } from "react"
import { NumericFormat } from "react-number-format"
import { CurrencySelect } from "@/features/currency-exchange/components/CurrencySelect/CurrencySelect"
import type { Currency } from "@/features/currency-exchange/api/types"
import Big from "big.js"

export const CurrencyRow = ({
  label,
  currency,
  amount,
  onAmountChange,
  onCurrencyChange,
  onCurrencyRowFocus,
}: {
  label: string
  currency: Currency
  amount: string
  onAmountChange: (amount: string) => void
  onCurrencyChange: (currency: Currency) => void
  onCurrencyRowFocus?: () => void
}) => {
  const minorUnits = CURRENCY_MINOR_UNITS[currency] ?? 2

  // Calculate dynamic decimal scale for small amounts
  const getDecimalScale = (amount: string, currency: Currency) => {
    if (!amount || amount === "") return minorUnits

    const numericAmount = Big(amount)
    const baseMinorUnits = CURRENCY_MINOR_UNITS[currency] ?? 2

    // For very small amounts (less than 0.01), show more precision
    if (numericAmount.lt(0.01) && numericAmount.gt(0)) {
      return Math.max(baseMinorUnits, 4)
    }

    return baseMinorUnits
  }

  const decimalScale = getDecimalScale(amount, currency)

  const numericFormatProps = useMemo(
    () => ({
      valueIsNumericString: true,
      thousandSeparator: true,
      decimalScale: decimalScale,
      fixedDecimalScale: decimalScale > 0,
      decimalSeparator: ".",
      allowNegative: false,
      placeholder: minorUnits === 0 ? "0" : "0.00",
      prefix: LIST_OF_CURRENCIES.find((c) => c.code === currency)?.label ?? "",
    }),
    [currency, decimalScale, minorUnits],
  )

  return (
    <div className="flex w-full items-center gap-4 rounded-xl bg-white px-8 py-5">
      <CurrencySelect
        value={currency}
        onChange={onCurrencyChange}
        options={LIST_OF_CURRENCIES}
      />

      <NumericFormat
        aria-label={`${label} amount in ${currency}`}
        value={amount}
        onValueChange={(v) => onAmountChange(v.value)}
        onFocus={onCurrencyRowFocus}
        className="flex-1 text-right text-3xl font-semibold outline-none"
        {...numericFormatProps}
      />
    </div>
  )
}

export default CurrencyRow
