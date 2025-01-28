import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { RolesGuard } from "./guards/roles.guard"
import { Roles } from "./decorators/roles.decorator"
import { UserRole } from "../users/user.entity"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: { email: string; password: string; role: string }) {
    return this.authService.register(registerDto.email, registerDto.password, registerDto.role);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('reset-password-request')
  async resetPasswordRequest(@Body() body: { email: string }) {
    return this.authService.resetPasswordRequest(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  async generate2FA(@Request() req) {
    const { otpauthUrl } = await this.authService.generate2FASecret(req.user.id);
    return { otpauthUrl };
  }

  @UseGuards(JwtAuthGuard)
  @Post("2fa/verify")
  async verify2FA(@Request() req, @Body() body: { token: string }) {
    const isValid = await this.authService.verify2FAToken(req.user.id, body.token)
    if (!isValid) {
      throw new UnauthorizedException("Invalid 2FA token")
    }
    return { message: "2FA verified successfully" }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Post('change-role')
  async changeUserRole(@Body() body: { userId: string; newRole: UserRole }) {
    return this.authService.changeUserRole(body.userId, body.newRole);
  }
}

