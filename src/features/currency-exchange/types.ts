import type { Currency } from "./api/types"

export type Options = { code: Currency; label: string; country: string }
export type CurrencyDirection = "from" | "to"
