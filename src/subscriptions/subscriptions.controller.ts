import { Controller, Post, Body, UseGuards, Request, Get, Param } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { SubscriptionsService } from "./subscriptions.service"
import type { SubscriptionType } from "./subscription.entity"

@Controller("subscriptions")
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post("create")
  async createSubscription(@Request() req, @Body() body: { types: SubscriptionType[] }) {
    return this.subscriptionsService.createSubscription(req.user, body.types)
  }

  @Post('cancel/:id')
  async cancelSubscription(@Param('id') id: string) {
    return this.subscriptionsService.cancelSubscription(id);
  }

  @Post('renew/:id')
  async renewSubscription(@Param('id') id: string) {
    return this.subscriptionsService.renewSubscription(id);
  }

  @Get('user')
  async getUserSubscriptions(@Request() req) {
    return this.subscriptionsService.getSubscriptionsByUser(req.user.id);
  }
}

