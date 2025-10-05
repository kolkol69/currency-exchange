import "@testing-library/jest-dom"
import { vi } from "vitest"

if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
}

if (globalThis.ResizeObserver) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserver
}

if (typeof globalThis.fetch === "undefined") {
  globalThis.fetch = () => Promise.reject(new Error("fetch not implemented"))
}
