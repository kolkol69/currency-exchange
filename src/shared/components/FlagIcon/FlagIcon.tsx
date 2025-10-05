import * as Flags from "country-flag-icons/react/1x1"
import { cn } from "@/lib/cn"

export const FlagIcon = ({
  code,
  className,
}: {
  code: string
  className?: string
}) => {
  const SVGFlagIcon = (
    Flags as unknown as Record<
      string,
      React.ComponentType<React.SVGProps<SVGSVGElement>>
    >
  )[code.toUpperCase()]
  return SVGFlagIcon ? (
    <SVGFlagIcon className={cn("h-9 w-9 rounded-full", className)} />
  ) : null
}
