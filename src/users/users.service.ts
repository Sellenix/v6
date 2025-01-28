import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { User, type UserRole } from "./user.entity"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string, role: string): Promise<User> {
    const user = this.usersRepository.create({
      email,
      password,
      role: role as UserRole,
    })
    return this.usersRepository.save(user)
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } })
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } })
  }

  async findByResetToken(token: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { resetToken: token } })
  }

  async updateResetToken(userId: string, token: string, expiry: Date): Promise<void> {
    await this.usersRepository.update(userId, { resetToken: token, resetTokenExpiry: expiry })
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.usersRepository.update(userId, {
      password: newPassword,
      resetToken: null,
      resetTokenExpiry: null,
    })
  }

  async set2FASecret(userId: string, secret: string): Promise<void> {
    await this.usersRepository.update(userId, { twoFactorSecret: secret })
  }

  async enable2FA(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { isTwoFactorEnabled: true })
  }

  async changeRole(userId: string, newRole: UserRole): Promise<User> {
    const user = await this.findById(userId)
    if (!user) {
      throw new NotFoundException("User not found")
    }
    user.role = newRole
    return this.usersRepository.save(user)
  }
}

