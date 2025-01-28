import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { UsersService } from "../users/users.service"
import * as bcrypt from "bcrypt"
import * as speakeasy from "speakeasy"
import * as crypto from "crypto"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async register(email: string, password: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 12)
    return this.usersService.create(email, hashedPassword, role)
  }

  async resetPasswordRequest(email: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new BadRequestException("User not found")
    }
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now
    await this.usersService.updateResetToken(user.id, resetToken, resetTokenExpiry)
    // Here you would typically send an email with the reset token
    return { message: "Password reset email sent" }
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token)
    if (!user || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException("Invalid or expired reset token")
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await this.usersService.updatePassword(user.id, hashedPassword)
    return { message: "Password reset successful" }
  }

  async generate2FASecret(userId: string) {
    const secret = speakeasy.generateSecret()
    await this.usersService.set2FASecret(userId, secret.base32)
    return {
      otpauthUrl: secret.otpauth_url,
      base32: secret.base32,
    }
  }

  async verify2FAToken(userId: string, token: string) {
    const user = await this.usersService.findById(userId)
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
    })
    if (verified) {
      await this.usersService.enable2FA(userId)
      return true
    }
    return false
  }
}

