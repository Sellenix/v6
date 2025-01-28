import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Subscription, SubscriptionType } from "./subscription.entity"
import type { User } from "../users/user.entity"
import type { MollieService } from "../payments/mollie.service"

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private mollieService: MollieService,
  ) {}

  async createSubscription(user: User, types: SubscriptionType[]): Promise<Subscription> {
    const amount = this.calculateAmount(types)
    const mollieCustomer = await this.mollieService.createCustomer(user.email)
    const mollieSubscription = await this.mollieService.createSubscription(
      mollieCustomer.id,
      amount,
      "EUR",
      "Monthly subscription",
      "https://sellenix.com/webhooks/mollie",
    )

    const subscription = this.subscriptionsRepository.create({
      user,
      types,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      amount,
      currency: "EUR",
      status: "active",
      mollieCustomerId: mollieCustomer.id,
      mollieSubscriptionId: mollieSubscription.id,
    })

    return this.subscriptionsRepository.save(subscription)
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionsRepository.findOne({ where: { id: subscriptionId } })
    if (!subscription) {
      throw new NotFoundException("Subscription not found")
    }

    await this.mollieService.cancelSubscription(subscription.mollieCustomerId, subscription.mollieSubscriptionId)

    subscription.status = "cancelled"
    await this.subscriptionsRepository.save(subscription)
  }

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findOne({ where: { id: subscriptionId } })
    if (!subscription) {
      throw new NotFoundException("Subscription not found")
    }

    const newEndDate = new Date(subscription.endDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    subscription.endDate = newEndDate

    return this.subscriptionsRepository.save(subscription)
  }

  async getSubscriptionsByUser(userId: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({ where: { user: { id: userId } } })
  }

  private calculateAmount(types: SubscriptionType[]): number {
    const prices = {
      [SubscriptionType.WEBSHOP]: 29.99,
      [SubscriptionType.WEBSITE]: 19.99,
      [SubscriptionType.SEO_TOOL]: 39.99,
    }

    return types.reduce((total, type) => total + prices[type], 0)
  }
}

