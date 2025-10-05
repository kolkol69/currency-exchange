import Big from "big.js"
import {
  formatRate,
  getCurrencyDisplayName,
} from "@/features/currency-exchange/utils"
import type { Currency } from "@/features/currency-exchange/api/types"
import { cn } from "@/lib/cn"

export function RateDisplay({
  crossRate,
  sourceCurrency,
  targetCurrency,
  className,
}: {
  crossRate: Big | null
  sourceCurrency: Currency
  targetCurrency: Currency
  className?: string
}) {
  if (!crossRate) {
    return <div className="h-5 w-40 animate-pulse rounded-full bg-brand/30" />
  }

  const { baseAmount, displayAmount, key } = formatRate(
    crossRate,
    sourceCurrency,
    targetCurrency,
  )

  return (
    <p
      key={key}
      className={cn(
        "animate-in text-brand duration-150 fade-in-0 zoom-in-95",
        className,
      )}
    >
      {`${baseAmount.toString()} ${getCurrencyDisplayName(sourceCurrency)} = ${displayAmount} ${getCurrencyDisplayName(targetCurrency)}`}
    </p>
  )
}

export default RateDisplay
