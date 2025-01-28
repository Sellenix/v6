import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum UserRole {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  RESELLER = "reseller",
  MERCHANT = "merchant",
  CUSTOMER = "customer",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole

  @Column({ nullable: true })
  resetToken: string

  @Column({ nullable: true })
  resetTokenExpiry: Date

  @Column({ nullable: true })
  twoFactorSecret: string

  @Column({ default: false })
  isTwoFactorEnabled: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

