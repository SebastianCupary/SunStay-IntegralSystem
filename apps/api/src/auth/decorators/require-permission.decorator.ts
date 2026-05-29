import { SetMetadata } from "@nestjs/common";
import type { PermissionAction, PermissionRequirement } from "../auth.types";

export const PERMISSION_KEY = "permission";

export const RequirePermission = (
  moduleCode: string,
  action: PermissionAction,
) => SetMetadata(PERMISSION_KEY, { moduleCode, action } satisfies PermissionRequirement);
