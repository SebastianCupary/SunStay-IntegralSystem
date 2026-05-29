# SunStay Architecture Documentation

## 1. Purpose

This document describes the project architecture for **SunStay**, including the update required for the **Users, Roles, and Module Access Control** module.

SunStay is an internal hotel management system for **Hotel Tropical Sun**. It uses:

- Frontend: Next.js + TypeScript
- Backend: NestJS + TypeScript
- Database: PostgreSQL
- ORM: Prisma ORM
- API style: REST
- Containers: Docker
- Cloud target: Azure
- Runtime and package manager: Bun

---

## 2. Architectural Style

SunStay follows a web client-server architecture with modular organization.

The system is organized into:

- frontend application
- backend API
- database layer
- authentication and authorization layer
- documentation and deployment configuration

The backend must enforce business rules and access control. The frontend must improve usability and hide unauthorized modules, but it must not be the only protection layer.

## 2.1 Bun Migration Decision

The project has been migrated completely to **Bun**. Bun is the official runtime and package manager for local development, dependency management, scripts, builds, and tooling execution. The architecture must not assume pnpm, npm, or yarn as package managers.

Architectural implications:

- The monorepo must be managed through Bun workspaces.
- The root dependency lockfile must be `bun.lock`.
- Project scripts must be executed with `bun run`.
- Docker and deployment scripts must be compatible with Bun-based execution.
- Documentation and setup instructions must use Bun commands.

---

## 3. Main Modules

The canonical module taxonomy is defined in `requirements.md` section 7. The business modules are:

1. Dashboard
2. Reservations (includes Stays — Check-in / Check-out)
3. Guests
4. Rooms
5. Billing and Payments
6. Inventory
7. Staff
8. Attendance and Access Control
9. Common Areas
10. Reports
11. Users
12. Roles and Permissions

**Authentication** is a cross-cutting backend layer (`apps/api/src/auth/`), not a business module. It is not listed as a sidebar module.

---

## 4. Users and Roles Architecture

The Users and Roles module supports internal access control.

### Folder structure

**Frontend:**

- `apps/web/app/users/` — Users list, detail, and administration pages
- `apps/web/app/roles/` — Roles and permissions management pages
- `apps/web/app/profile/` — Authenticated user profile, settings, change password
- `apps/web/features/users/` — Users feature logic (hooks, components, context)
- `apps/web/features/roles/` — Roles feature logic (hooks, components, context)

**Backend:**

- `apps/api/src/modules/users/` — Users module (controller, service, DTOs, module)
- `apps/api/src/modules/roles/` — Roles module (controller, service, DTOs, module)
- `apps/api/src/auth/` — Authentication module (login, JWT, guards)

### Frontend responsibilities

- Display Users and Roles only to Administrator users.
- Hide unauthorized sidebar modules according to authenticated user permissions.
- Protect routes from direct navigation when the user lacks access.
- Provide user administration screens.
- Provide role and permission management screens.
- Display clear unauthorized access states.

### Backend responsibilities

- Authenticate users.
- Resolve authenticated user role and permissions.
- Protect endpoints with guards or authorization policies.
- Prevent inactive or blocked users from accessing the system.
- Validate user, role, and permission changes.
- Register traceability for security-relevant changes.

### Database responsibilities

- Store users, roles, modules, and role-module permissions.
- Store user status and relevant access-control history.
- Preserve integrity between users, staff records, roles, and permissions.

---

## 5. Authorization Flow

1. User submits credentials from the login page.
2. Backend validates credentials and user status.
3. Backend returns authenticated user profile and permissions.
4. Frontend builds sidebar and routes according to permissions.
5. User invokes protected operations.
6. Backend validates permission before executing each protected use case.
7. Unauthorized requests return a controlled error.

---

## 6. Base Role Access

| Role              | Architectural purpose                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| Administrator     | Full access, including users, roles, permissions, configuration, and operational modules.          |
| Receptionist      | Operational access to reservations, guests, rooms, billing, common areas, check-in, and check-out. |
| Inventory Manager | Access to inventory, products, stock movements, and stock alerts.                                  |
| Management        | Read-oriented access to dashboard, reports, indicators, and summaries.                             |

---

## 7. Security Notes

- Passwords must be hashed.
- Plain-text passwords must never be stored.
- Frontend route hiding is not sufficient for security.
- Backend authorization guards are mandatory for protected endpoints.
- User status must be checked during login and protected requests.
- Administration actions must be auditable.

---

## 8. Documentation Notes

This architecture update affects:

- `AGENTS.md`
- `requirements.md`
- `database.md`
- `api.md`

`design.md` is intentionally not modified in this update.

---

## 9. API Bootstrap

The API application entry point (`apps/api/src/main.ts`) bootstraps NestJS with the following components:

- **ConfigModule** — loads environment variables from `../../.env` (monorepo root)
- **DatabaseModule** — global module providing `PrismaService` (extends `PrismaClient` with `PrismaPg` adapter, `OnModuleInit/$connect`, `OnModuleDestroy/$disconnect`)
- **AuthModule** — provides `POST /api/auth/login`, `GET /api/auth/me`, JWT verification, and permission enforcement
- **HealthModule** — exposes `GET /api/health` which runs `prisma.$queryRaw\`SELECT 1\`` to verify database connectivity

Global middleware applied in `main.ts`:

- `ValidationPipe` — `whitelist: true, transform: true`
- `HttpExceptionFilter` — consistent error format `{ statusCode, message, error, timestamp, path }`
- `TransformInterceptor` — wraps responses in `{ data, timestamp }`
- CORS enabled for the browser origin in `WEB_ORIGIN` (defaults to `http://localhost:3000`)

Authentication and authorization:

- `JwtAuthGuard` is registered globally with `APP_GUARD` and skips only routes marked with `@Public()`.
- `PermissionsGuard` is registered globally and only enforces checks when a handler declares `@RequirePermission(moduleCode, action)`.
- Password verification uses `Bun.password.verify` to match the argon2id hashes generated by the seed.
- The API development runtime must execute under Bun (`bun --watch src/main.ts`) so `Bun.password` is available.

API prefix is set to `api` (stripping any leading slash from `API_PREFIX` env var).

---

## 10. Web Application Bootstrap

The Next.js web application (`apps/web`) provides:

- Root layout (`app/layout.tsx`) with SunStay metadata and CSS design tokens
- Home page (`app/page.tsx`) redirects to `/login`
- Login page (`app/login/page.tsx`) — authenticates against `POST /api/auth/login`
- Dashboard page (`app/dashboard/page.tsx`) — first protected route and post-login destination
- `AllowedModules` (`features/auth/allowed-modules.tsx`) — reads `/auth/me` and displays viewable modules from role permissions
- `proxy.ts` — redirects protected routes to `/login` when no session cookie is present
- `lib/api.ts` — typed fetch wrapper using `NEXT_PUBLIC_API_URL` and the stored Bearer token

Environment boundaries:

- `WEB_ORIGIN` defines the allowed browser origin for API CORS checks.
- `NEXT_PUBLIC_API_URL` defines the API base URL used by the web application.

Design tokens (defined in `app/globals.css`):

- Primary: `#0d4c6f` | Accent: `#f5a623` | Base font: `14px` | Spacing unit: `8px`
