export type UtcDateTimeString = string

export type UrlString = string

export type Currency = "USD" | "ARS" | "MXN" | "COP"

export type ConversionRates = Record<Currency, number>

export interface ExchangeRateApiSuccessResponse {
  result: "success"
  documentation: UrlString
  terms_of_use: UrlString

  time_last_update_unix: number
  time_last_update_utc: UtcDateTimeString

  time_next_update_unix: number
  time_next_update_utc: UtcDateTimeString

  base_code: Currency

  conversion_rates: ConversionRates
}
