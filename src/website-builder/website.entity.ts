import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { User } from "../users/user.entity"

@Entity()
export class Website {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User)
  user: User

  @Column()
  name: string

  @Column("json")
  content: object

  @Column()
  template: string

  @Column()
  domain: string

  @Column({ default: false })
  isPublished: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

