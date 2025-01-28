import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { SubscriptionManager } from "@/components/SubscriptionManager"
import axios from "axios"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("SubscriptionManager", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: "1",
          status: "active",
          package: { name: "Basic", price: 9.99 },
          nextBillingDate: "2023-07-01",
        },
      ],
    })
  })

  it("renders subscriptions correctly", async () => {
    render(<SubscriptionManager />)

    await waitFor(() => {
      expect(screen.getByText("Basic")).toBeInTheDocument()
      expect(screen.getByText("Status: active")).toBeInTheDocument()
      expect(screen.getByText("Prijs: €9.99/maand")).toBeInTheDocument()
      expect(screen.getByText("Volgende factuurdatum: 1-7-2023")).toBeInTheDocument()
    })
  })

  it("handles upgrade correctly", async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        id: "1",
        status: "active",
        package: { name: "Pro", price: 19.99 },
        nextBillingDate: "2023-07-01",
      },
    })

    render(<SubscriptionManager />)

    await waitFor(() => {
      fireEvent.click(screen.getByText("Upgrade"))
    })

    expect(mockedAxios.post).toHaveBeenCalledWith("/api/subscriptions/1/upgrade")

    await waitFor(() => {
      expect(screen.getByText("Pro")).toBeInTheDocument()
      expect(screen.getByText("Prijs: €19.99/maand")).toBeInTheDocument()
    })
  })
})

