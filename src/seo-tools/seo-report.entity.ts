import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { User } from "../users/user.entity"
import { Website } from "../website-builder/website.entity"

@Entity()
export class SeoReport {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Website)
  website: Website

  @Column("json")
  keywordAnalysis: object

  @Column("json")
  backlinkAnalysis: object

  @Column("json")
  siteAudit: object

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

