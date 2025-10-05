export const isParsableNumberString = (value: string): boolean => {
  if (value === "") return false
  if (value === "." || value === "-") return false
  return !isNaN(Number(value))
}
