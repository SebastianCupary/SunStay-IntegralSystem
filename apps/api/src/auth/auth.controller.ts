import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";
import { RequirePermission } from "./decorators/require-permission.decorator";
import { LoginDto } from "./dto/login.dto";
import type { JwtUser } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  me(@CurrentUser() user: JwtUser) {
    return this.authService.me(user);
  }

  @Get("admin-check")
  @RequirePermission("USERS", "manage")
  adminCheck() {
    return { status: "ok" };
  }
}
