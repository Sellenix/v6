import { Controller, Post, Put, Get, Body, Param, UseGuards, Request } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { WebsiteBuilderService } from "./website-builder.service"

@Controller("website-builder")
@UseGuards(JwtAuthGuard)
export class WebsiteBuilderController {
  constructor(private websiteBuilderService: WebsiteBuilderService) {}

  @Post("create")
  async createWebsite(@Request() req, @Body() body: { name: string, template: string }) {
    return this.websiteBuilderService.createWebsite(req.user, body.name, body.template)
  }

  @Put(":id")
  async updateWebsite(@Param('id') id: string, @Body() body: { content: object }) {
    return this.websiteBuilderService.updateWebsite(id, body.content)
  }

  @Post(':id/publish')
  async publishWebsite(@Param('id') id: string) {
    return this.websiteBuilderService.publishWebsite(id);
  }

  @Get('user')
  async getUserWebsites(@Request() req) {
    return this.websiteBuilderService.getWebsitesByUser(req.user.id);
  }

  @Get(':id')
  async getWebsite(@Param('id') id: string) {
    return this.websiteBuilderService.getWebsiteById(id);
  }

  @Get("templates")
  getTemplates() {
    return this.websiteBuilderService.getTemplates()
  }
}

