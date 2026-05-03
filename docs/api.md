# SunStay API Documentation

## 1. Purpose

This document defines the REST API structure for **SunStay**, including the update required for the **Users, Roles, and Module Access Control** module.

SunStay uses a REST API built with **NestJS**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**, using **Bun** as the project runtime and package manager.

---

## 2. General API Rules

- Use REST resource-based routes.
- Use JSON request and response bodies.
- Protect internal endpoints with authentication.
- Apply role-based authorization before executing protected actions.
- Validate request bodies with DTOs.
- Return clear errors for validation, authentication, and authorization failures.

---

## 2.1 Bun API Tooling Rule

All API development commands, scripts, dependency installation, builds, tests, and Prisma commands must be executed through **Bun**. Documentation must use `bun install` and `bun run <script>` instead of npm, yarn, or pnpm commands.

---

## 3. Authentication Endpoints

| Method | Route | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/login` | Authenticate internal user. | Public |
| POST | `/api/auth/logout` | Close current session. | Authenticated |
| GET | `/api/auth/me` | Return authenticated user profile and permissions. | Authenticated |
| PATCH | `/api/auth/change-password` | Change own password. | Authenticated |
| POST | `/api/auth/forgot-password` | Request password reset. | Public / controlled |
| POST | `/api/auth/reset-password` | Complete password reset. | Public / controlled |

---

## 4. User Management Endpoints

Only users with the **Administrator** role can access user administration endpoints.

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/users` | List users with filters. |
| POST | `/api/users` | Create internal user. |
| GET | `/api/users/:id` | View user detail. |
| PATCH | `/api/users/:id` | Update user information. |
| PATCH | `/api/users/:id/status` | Change user status. |
| PATCH | `/api/users/:id/role` | Assign or change user role. |
| POST | `/api/users/:id/reset-password` | Generate temporary password or reset action. |
| GET | `/api/users/:id/activity` | View user access or administration history. |

### User filters

Supported filters:

- name
- email
- role
- status
- lastAccessAt

### User status values

- Active
- Inactive
- Blocked

---

## 5. Role and Permission Endpoints

Only Administrator users can manage roles and permissions.

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/roles` | List roles. |
| POST | `/api/roles` | Create role. |
| GET | `/api/roles/:id` | View role detail. |
| PATCH | `/api/roles/:id` | Update role information. |
| GET | `/api/roles/:id/permissions` | View role permissions. |
| PATCH | `/api/roles/:id/permissions` | Update module permissions by role. |
| GET | `/api/system-modules` | List system modules available for permissions. |

---

## 6. Permission Model

Permissions are applied by role and module.

Recommended permission flags:

| Permission | Meaning |
|---|---|
| canView | Allows viewing a module. |
| canCreate | Allows creating records. |
| canUpdate | Allows updating records. |
| canDelete | Allows deleting, cancelling, or voiding records. |
| canExport | Allows exporting data or reports. |
| canManage | Allows administrative management actions. |

---

## 7. Access-Control Response Contract

The `/api/auth/me` endpoint must return enough information for frontend access control.

Example response structure:

```json
{
  "id": "user-id",
  "fullName": "María González",
  "email": "maria@sunstay.com",
  "role": "Administrator",
  "status": "Active",
  "permissions": [
    {
      "module": "Reservations",
      "route": "/reservations",
      "canView": true,
      "canCreate": true,
      "canUpdate": true,
      "canDelete": true,
      "canExport": true,
      "canManage": true
    }
  ]
}
```

---

## 8. Error Handling

| Scenario | Recommended Status |
|---|---|
| Invalid credentials | 401 Unauthorized |
| User inactive or blocked | 403 Forbidden |
| Authenticated but no permission | 403 Forbidden |
| Validation error | 400 Bad Request |
| Resource not found | 404 Not Found |
| Duplicate user email | 409 Conflict |

---

## 9. Documentation Notes

Any change to user, role, permission, authentication, or access-control endpoints must update this file and be reviewed against `requirements.md`, `database.md`, and `architecture.md`.
