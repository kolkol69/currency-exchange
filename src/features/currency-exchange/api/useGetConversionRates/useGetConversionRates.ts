import { useQuery } from "@tanstack/react-query"
import type { ExchangeRateApiSuccessResponse, ConversionRates } from "../types"

const EXCHANGE_RATE_API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY
const EXCHANGE_RATE_API_URL = import.meta.env.VITE_EXCHANGE_RATE_API_URL

export const useGetConversionRates = () => {
  return useQuery<ExchangeRateApiSuccessResponse, Error, ConversionRates>({
    queryKey: ["conversion-rates"],
    queryFn: async () => {
      if (!EXCHANGE_RATE_API_KEY || !EXCHANGE_RATE_API_URL) {
        throw new Error("Missing exchange rate API configuration")
      }
      const url = `${EXCHANGE_RATE_API_URL}/${EXCHANGE_RATE_API_KEY}/latest/USD`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch conversion rates: ${response.status}`)
      }
      const json: ExchangeRateApiSuccessResponse = await response.json()
      return json
    },
    select: (data) => data.conversion_rates,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: false,
    staleTime: 60 * 1000,
  })
}
