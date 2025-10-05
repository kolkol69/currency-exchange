import { useEffect, useState, useCallback } from "react"
import Big from "big.js"
import { formatAmountForCurrency } from "@/features/currency-exchange/utils"
import type { Currency } from "@/features/currency-exchange/api/types"
import type { CurrencyDirection } from "@/features/currency-exchange/types"
import { isParsableNumberString } from "@/lib/isParsableNumberString"

export function useBidirectionalConversion({
  crossRate,
  sourceCurrency,
  targetCurrency,
}: {
  crossRate: Big | null
  sourceCurrency: Currency
  targetCurrency: Currency
}) {
  const [activeSide, setActiveSide] = useState<CurrencyDirection>("from")
  const [sourceAmount, setSourceAmount] = useState<string>("")
  const [targetAmount, setTargetAmount] = useState<string>("")

  useEffect(() => {
    if (!crossRate) return
    if (activeSide === "from") {
      if (!isParsableNumberString(sourceAmount)) {
        setTargetAmount("")
        return
      }
      const computed = Big(sourceAmount).times(crossRate)
      setTargetAmount(formatAmountForCurrency(computed, targetCurrency))
    } else {
      if (!isParsableNumberString(targetAmount)) {
        setSourceAmount("")
        return
      }
      const computed = Big(targetAmount).div(crossRate)
      setSourceAmount(formatAmountForCurrency(computed, sourceCurrency))
    }
  }, [
    activeSide,
    crossRate,
    sourceAmount,
    targetAmount,
    sourceCurrency,
    targetCurrency,
  ])

  const onSourceAmountChange = useCallback((value: string) => {
    setSourceAmount(value)
  }, [])

  const onTargetAmountChange = useCallback((value: string) => {
    setTargetAmount(value)
  }, [])

  return {
    activeSide,
    setActiveSide,
    sourceAmount,
    targetAmount,
    onSourceAmountChange,
    onTargetAmountChange,
  }
}
