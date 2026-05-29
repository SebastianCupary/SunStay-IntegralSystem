export type JwtUser = {
  sub: string;
  email: string;
  roleId: string;
};

export type PermissionAction =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "export"
  | "manage";

export type PermissionRequirement = {
  moduleCode: string;
  action: PermissionAction;
};
