import { cn } from "@/lib/cn"
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react"
import { Loader2 } from "lucide-react"

export const ExchangeDirection = ({ loading }: { loading: boolean }) => {
  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-offwhite p-3"
    >
      <div className={cn("rounded-full bg-white p-3")}>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        ) : (
          <ArrowDownIcon className="h-6 w-6 animate-in duration-1500 fade-in-0 slide-in-from-top-1" />
        )}
      </div>
    </div>
  )
}

export default ExchangeDirection
