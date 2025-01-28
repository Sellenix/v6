import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { SeoReport } from "./seo-report.entity"
import type { Website } from "../website-builder/website.entity"
import axios from "axios"

@Injectable()
export class SeoToolsService {
  constructor(
    @InjectRepository(SeoReport)
    private seoReportRepository: Repository<SeoReport>,
  ) {}

  async createReport(website: Website): Promise<SeoReport> {
    const report = this.seoReportRepository.create({
      website,
      keywordAnalysis: await this.performKeywordAnalysis(website),
      backlinkAnalysis: await this.performBacklinkAnalysis(website),
      siteAudit: await this.performSiteAudit(website),
    })
    return this.seoReportRepository.save(report)
  }

  async getReportsByWebsite(websiteId: string): Promise<SeoReport[]> {
    return this.seoReportRepository.find({ where: { website: { id: websiteId } } })
  }

  private async performKeywordAnalysis(website: Website): Promise<object> {
    // In a real application, you would use a third-party SEO API here
    // This is a simplified mock implementation
    const response = await axios.get(`https://api.example.com/keyword-analysis?url=${website.domain}`)
    return response.data
  }

  private async performBacklinkAnalysis(website: Website): Promise<object> {
    // Mock implementation
    const response = await axios.get(`https://api.example.com/backlink-analysis?url=${website.domain}`)
    return response.data
  }

  private async performSiteAudit(website: Website): Promise<object> {
    // Mock implementation
    const response = await axios.get(`https://api.example.com/site-audit?url=${website.domain}`)
    return response.data
  }
}

