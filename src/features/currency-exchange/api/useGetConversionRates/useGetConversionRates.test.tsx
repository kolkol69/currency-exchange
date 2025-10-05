import { describe, it, expect, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe("useGetConversionRates", () => {
  it("throws when env is missing", async () => {
    vi.stubEnv("VITE_EXCHANGE_RATE_API_KEY", "")
    vi.stubEnv("VITE_EXCHANGE_RATE_API_URL", "")

    vi.resetModules()
    const { useGetConversionRates } = await import("../useGetConversionRates")
    const { result } = renderHook(() => useGetConversionRates(), { wrapper })
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true)
      },
      { timeout: 10000 },
    )

    vi.unstubAllEnvs()
  })

  it("fetches and selects conversion_rates on success", async () => {
    vi.stubEnv("VITE_EXCHANGE_RATE_API_KEY", "k")
    vi.stubEnv("VITE_EXCHANGE_RATE_API_URL", "https://api.test")

    const mockResponse = {
      ok: true,
      json: async () => ({ conversion_rates: { USD: 1, ARS: 900 } }),
    } as Response
    const spy = vi.spyOn(global, "fetch").mockResolvedValue(mockResponse)

    vi.resetModules()
    const { useGetConversionRates } = await import("../useGetConversionRates")
    const { result } = renderHook(() => useGetConversionRates(), { wrapper })

    await waitFor(() => {
      expect(result.current.data).toEqual({ USD: 1, ARS: 900 })
    })

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
    vi.unstubAllEnvs()
  })

  it("errors on non-ok response", async () => {
    vi.stubEnv("VITE_EXCHANGE_RATE_API_KEY", "k")
    vi.stubEnv("VITE_EXCHANGE_RATE_API_URL", "https://api.test")

    const mockResponse = { ok: false, status: 500 } as Response
    const spy = vi.spyOn(global, "fetch").mockResolvedValue(mockResponse)

    vi.resetModules()
    const { useGetConversionRates } = await import("../useGetConversionRates")
    const { result } = renderHook(() => useGetConversionRates(), { wrapper })
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true)
      },
      { timeout: 10000 },
    )

    spy.mockRestore()
    vi.unstubAllEnvs()
  })
})
