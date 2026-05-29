export const AUTH_TOKEN_KEY = "sunstay_token";

export type AuthPermission = {
  module: {
    id: string;
    code: string;
    name: string;
    route: string;
  };
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canExport: boolean;
  canManage: boolean;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  status: string;
  role: {
    id: string;
    name: string;
  };
  permissions: AuthPermission[];
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthSession(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=28800; SameSite=Lax`;
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}
