import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { PrismaService } from "../../database/prisma.service";
import type {
  JwtUser,
  PermissionAction,
  PermissionRequirement,
} from "../auth.types";
import { PERMISSION_KEY } from "../decorators/require-permission.decorator";

type RequestWithUser = Request & { user?: JwtUser };

const permissionFieldByAction: Record<PermissionAction, string> = {
  view: "canView",
  create: "canCreate",
  update: "canUpdate",
  delete: "canDelete",
  export: "canExport",
  manage: "canManage",
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<PermissionRequirement>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requirement) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    if (!request.user) {
      throw new ForbiddenException("Missing authenticated user context");
    }

    const permission = await this.prisma.roleModulePermission.findFirst({
      where: {
        roleId: request.user.roleId,
        systemModule: {
          code: requirement.moduleCode,
          isActive: true,
        },
      },
    });

    const field = permissionFieldByAction[requirement.action];
    if (!permission || !Boolean(permission[field as keyof typeof permission])) {
      throw new ForbiddenException("Insufficient role permissions");
    }

    return true;
  }
}
