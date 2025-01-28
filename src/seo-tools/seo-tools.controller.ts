import { Controller, Post, Get, Body, Param, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { SeoToolsService } from "./seo-tools.service"
import type { WebsiteBuilderService } from "../website-builder/website-builder.service"

@Controller("seo-tools")
@UseGuards(JwtAuthGuard)
export class SeoToolsController {
  constructor(
    private seoToolsService: SeoToolsService,
    private websiteBuilderService: WebsiteBuilderService,
  ) {}

  @Post('create-report/:websiteId')
  async createReport(@Param('websiteId') websiteId: string) {
    const website = await this.websiteBuilderService.getWebsiteById(websiteId);
    return this.seoToolsService.createReport(website);
  }

  @Get('reports/:websiteId')
  async getReportsByWebsite(@Param('websiteId') websiteId: string) {
    return this.seoToolsService.getReportsByWebsite(websiteId);
  }
}

