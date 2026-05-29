import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../database/prisma.service";
import { LoginDto } from "./dto/login.dto";
import type { JwtUser } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const payload: JwtUser = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
    };

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastAccessAt: new Date() },
    });

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.toAuthUser(user),
    };
  }

  async me(currentUser: JwtUser) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: currentUser.sub,
        status: "Active",
        deletedAt: null,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: { systemModule: true },
              orderBy: { systemModule: { name: "asc" } },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Authenticated user is no longer active");
    }

    return this.toAuthUser(user);
  }

  private async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        status: "Active",
        deletedAt: null,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: { systemModule: true },
              orderBy: { systemModule: { name: "asc" } },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatches = await Bun.password.verify(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }

  private toAuthUser(user: Awaited<ReturnType<AuthService["validateUser"]>>) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
      permissions: user.role.permissions.map((permission) => ({
        module: {
          id: permission.systemModule.id,
          code: permission.systemModule.code,
          name: permission.systemModule.name,
          route: permission.systemModule.route,
        },
        canView: permission.canView,
        canCreate: permission.canCreate,
        canUpdate: permission.canUpdate,
        canDelete: permission.canDelete,
        canExport: permission.canExport,
        canManage: permission.canManage,
      })),
    };
  }
}
