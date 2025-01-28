import { Injectable } from "@nestjs/common"
import { createMollieClient, PaymentStatus } from "@mollie/api-client"

@Injectable()
export class MollieService {
  private readonly mollieClient

  constructor() {
    this.mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY })
  }

  async createCustomer(email: string): Promise<any> {
    return this.mollieClient.customers.create({ email })
  }

  async createSubscription(
    customerId: string,
    amount: number,
    currency: string,
    description: string,
    webhookUrl: string,
  ): Promise<any> {
    return this.mollieClient.customers_subscriptions.create({
      customerId,
      amount: {
        currency,
        value: amount.toFixed(2),
      },
      interval: "1 month",
      description,
      webhookUrl,
    })
  }

  async cancelSubscription(customerId: string, subscriptionId: string): Promise<void> {
    await this.mollieClient.customers_subscriptions.cancel(subscriptionId, { customerId })
  }

  async handleWebhook(id: string): Promise<void> {
    const payment = await this.mollieClient.payments.get(id)
    if (payment.status === PaymentStatus.paid) {
      // Update subscription status in database
      // You would typically call a method in your SubscriptionsService here
    }
  }
}

