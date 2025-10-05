import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/shared/ui/Select/Select"
import { FlagIcon } from "@/shared/components"
import type { Currency } from "@/features/currency-exchange/api/types"
import type { Options } from "@/features/currency-exchange/types"
import { cn } from "@/lib/cn"

export const CurrencySelect = ({
  value,
  onChange,
  options,
  className,
}: {
  value: Currency
  onChange: (v: Currency) => void
  options: Options[]
  className?: string
}) => {
  const current = options.find((o) => o.code === value) ?? options[0]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn("relative gap-4 bg-white pr-9 pl-2", className)}
      >
        {current && <FlagIcon code={current.country} className="h-8 w-8" />}
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>

      <SelectContent className="-mt-3 -ml-8 w-default rounded-t-none p-4">
        {options.map((opt) => (
          <SelectItem
            key={opt.code}
            value={opt.code}
            country={opt.country}
            label={opt.code}
          />
        ))}
      </SelectContent>
    </Select>
  )
}
