import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Website } from "./website.entity"
import type { User } from "../users/user.entity"

@Injectable()
export class WebsiteBuilderService {
  constructor(
    @InjectRepository(Website)
    private websiteRepository: Repository<Website>,
  ) {}

  async createWebsite(user: User, name: string, template: string): Promise<Website> {
    const website = this.websiteRepository.create({
      user,
      name,
      template,
      content: {},
      domain: `${name.toLowerCase().replace(/\s+/g, "-")}.sellenix.com`,
    })
    return this.websiteRepository.save(website)
  }

  async updateWebsite(id: string, content: object): Promise<Website> {
    const website = await this.websiteRepository.findOne({ where: { id } })
    if (!website) {
      throw new NotFoundException("Website not found")
    }
    website.content = content
    return this.websiteRepository.save(website)
  }

  async publishWebsite(id: string): Promise<Website> {
    const website = await this.websiteRepository.findOne({ where: { id } })
    if (!website) {
      throw new NotFoundException("Website not found")
    }
    website.isPublished = true
    return this.websiteRepository.save(website)
  }

  async getWebsitesByUser(userId: string): Promise<Website[]> {
    return this.websiteRepository.find({ where: { user: { id: userId } } })
  }

  async getWebsiteById(id: string): Promise<Website> {
    const website = await this.websiteRepository.findOne({ where: { id } })
    if (!website) {
      throw new NotFoundException("Website not found")
    }
    return website
  }

  getTemplates(): string[] {
    return ["business", "portfolio", "blog", "ecommerce"]
  }
}

