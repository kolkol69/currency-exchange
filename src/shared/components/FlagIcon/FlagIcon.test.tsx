import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { FlagIcon } from "./FlagIcon"

describe("FlagIcon", () => {
  it("renders a flag svg for known code", () => {
    const { container } = render(<FlagIcon code="US" />)
    expect(container.querySelector("svg")).toBeTruthy()
  })

  it("returns null for unknown code", () => {
    const { container } = render(<FlagIcon code="ZZ" />)
    expect(container.querySelector("svg")).toBeNull()
  })
})
