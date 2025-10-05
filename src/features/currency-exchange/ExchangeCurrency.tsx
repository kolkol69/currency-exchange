import { useMemo, useState } from "react"
import { useGetConversionRates } from "@/features/currency-exchange/api"
import type { Currency } from "@/features/currency-exchange/api/types"
import { computeCrossRateFromUsdTable } from "@/features/currency-exchange/utils"
import { useBidirectionalConversion } from "@/features/currency-exchange/hooks"
import { Button, Footer, ConfettiBurst } from "@/shared"
import { RateDisplay, CurrencyRow, ExchangeDirection } from "./components"
import { isZero } from "@/lib/isZero"

export const ExchangeCurrency = () => {
  const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD")
  const [targetCurrency, setTargetCurrency] = useState<Currency>("COP")
  const [burstKey, setBurstKey] = useState(0)

  const { data: conversionRates, isLoading } = useGetConversionRates()

  const crossRateSourceToTarget = useMemo(() => {
    return computeCrossRateFromUsdTable(
      conversionRates,
      sourceCurrency,
      targetCurrency,
    )
  }, [conversionRates, sourceCurrency, targetCurrency])

  const {
    setActiveSide,
    sourceAmount,
    targetAmount,
    onSourceAmountChange,
    onTargetAmountChange,
  } = useBidirectionalConversion({
    crossRate: crossRateSourceToTarget,
    sourceCurrency,
    targetCurrency,
  })

  const shouldDisableExchangeButton =
    !(sourceAmount !== "" || targetAmount !== "") ||
    isZero(sourceAmount) ||
    isZero(targetAmount)

  const handleExchangeClick = () => {
    setBurstKey((k) => k + 1)
    onSourceAmountChange("")
    onTargetAmountChange("")
  }

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-12 px-4 py-20">
      <h1 className="mb-20 text-5xl font-bold">Exchange calculator</h1>

      <section className="relative flex w-full max-w-default flex-col items-center gap-5">
        <CurrencyRow
          label="From"
          currency={sourceCurrency}
          amount={sourceAmount}
          onAmountChange={onSourceAmountChange}
          onCurrencyRowFocus={() => setActiveSide("from")}
          onCurrencyChange={(currency) => {
            setSourceCurrency(currency)
          }}
        />
        <ExchangeDirection loading={isLoading || !conversionRates} />
        <CurrencyRow
          label="To"
          currency={targetCurrency}
          amount={targetAmount}
          onAmountChange={onTargetAmountChange}
          onCurrencyRowFocus={() => setActiveSide("to")}
          onCurrencyChange={(currency) => {
            setTargetCurrency(currency)
          }}
        />
      </section>

      <RateDisplay
        crossRate={crossRateSourceToTarget}
        sourceCurrency={sourceCurrency}
        targetCurrency={targetCurrency}
      />

      <div className="relative mt-2 w-full max-w-md">
        {burstKey > 0 && <ConfettiBurst burstKey={burstKey} />}
        <Button
          disabled={shouldDisableExchangeButton}
          onClick={handleExchangeClick}
        >
          Exchange now
        </Button>
      </div>
      <Footer />
    </main>
  )
}

export default ExchangeCurrency
