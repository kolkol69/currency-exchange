import { describe, it, expect } from "vitest"
import { isParsableNumberString } from "./isParsableNumberString"

describe("isParsableNumberString", () => {
  it("rejects empty and edge strings", () => {
    expect(isParsableNumberString("")).toBe(false)
    expect(isParsableNumberString(".")).toBe(false)
    expect(isParsableNumberString("-")).toBe(false)
    expect(isParsableNumberString("a")).toBe(false)
  })

  it("accepts valid numbers", () => {
    expect(isParsableNumberString("0")).toBe(true)
    expect(isParsableNumberString("12.34")).toBe(true)
  })
})
