import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { User } from "../users/user.entity"

export enum SubscriptionType {
  WEBSHOP = "webshop",
  WEBSITE = "website",
  SEO_TOOL = "seo_tool",
}

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User)
  user: User

  @Column({
    type: "enum",
    enum: SubscriptionType,
    array: true,
  })
  types: SubscriptionType[]

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @Column()
  amount: number

  @Column()
  currency: string

  @Column()
  status: string

  @Column({ nullable: true })
  mollieCustomerId: string

  @Column({ nullable: true })
  mollieSubscriptionId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

