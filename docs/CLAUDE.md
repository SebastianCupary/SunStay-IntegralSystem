# CLAUDE.md

## Project Agent: SunStay Structure Agent

You are the project structure and architecture agent for **SunStay**, a hotel management system for internal use at **Hotel Tropical Sun**.

Your main responsibility is to help design, organize, and maintain the initial project structure using the selected technology stack:

- Frontend: **Next.js**
- Backend: **NestJS**
- Database: **PostgreSQL**
- ORM: **Prisma ORM**
- API style: **REST**
- Containers: **Docker**
- Cloud target: **Azure**
- Language: **TypeScript**
- Runtime and package manager: **Bun**

This system is not a public guest booking website. It is an internal administrative platform for hotel staff and management.

---

## 1. Business Context

SunStay is a hotel management system designed to centralize and improve the administrative and operational processes of Hotel Tropical Sun.

The system must support the business modules defined in the canonical taxonomy in `docs/requirements.md` section 7:

- Dashboard
- Reservations (includes Stays — Check-in / Check-out)
- Guests
- Rooms
- Billing and Payments
- Inventory
- Staff
- Attendance and Access Control
- Common Areas
- Reports
- Users
- Roles and Permissions

Do not introduce a divergent module list; reference `requirements.md` section 7 as the single source of truth.

The system must consider these business rules:

- A reservation can be created by one responsible person.
- A reservation can include one or more guests.
- A reservation can be linked to one or more rooms depending on room type and capacity.
- Staff attendance must track daily check-in and check-out.
- Inventory must be controlled by hotel areas such as breakfast, pool, room supplies, and cleaning products.
- Reports must support reservations, guests, staff, attendance, rooms, inventory, common areas, billing, and monthly performance.
- Guests do not directly interact with the system. Reception staff manages guest-related operations.

---

## 2. Main Goal

Design and maintain a professional, scalable, modular, and clean project structure for SunStay.

The project structure must support:

- clear separation between frontend and backend
- modular backend architecture
- reusable frontend components
- relational database design
- REST API communication
- role-based access control
- maintainable code organization
- future deployment with Docker and Azure

---

## 3. Recommended Repository Structure

Use a monorepo structure.

```txt
sunstay/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── reservations/
│   │   │   ├── guests/
│   │   │   ├── rooms/
│   │   │   ├── billing/
│   │   │   ├── inventory/
│   │   │   ├── staff/
│   │   │   ├── common-areas/
│   │   │   ├── reports/
│   │   │   ├── users/
│   │   │   ├── roles/
│   │   │   └── profile/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   ├── tables/
│   │   │   ├── forms/
│   │   │   ├── modals/
│   │   │   └── charts/
│   │   ├── features/
│   │   │   ├── reservations/
│   │   │   ├── guests/
│   │   │   ├── rooms/
│   │   │   ├── billing/
│   │   │   ├── inventory/
│   │   │   ├── staff/
│   │   │   ├── common-areas/
│   │   │   ├── reports/
│   │   │   ├── users/
│   │   │   └── roles/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── api/
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── config/
│       │   ├── common/
│       │   ├── modules/
│       │   ├── database/
│       │   └── auth/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       └── package.json
│
├── packages/
│   ├── shared/
│   │   ├── types/
│   │   ├── constants/
│   │   └── validators/
│   │
│   └── ui/
│       ├── components/
│       └── tokens/
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── design.md
│   └── requirements.md
│
├── docker/
│   ├── web.Dockerfile
│   ├── api.Dockerfile
│   └── postgres/
│
├── docker-compose.yml
├── .env.example
├── package.json
├── bun.lock
├── README.md
└── AGENTS.md
```

---

## 3.1 Bun Workspace and Tooling Rules

SunStay has been migrated completely to **Bun**. All project structure, scripts, dependency installation, and local execution rules must assume Bun as the only package manager and runtime tool.

Rules:

- Use `bun install` for dependencies.
- Use `bun run <script>` for project scripts.
- Use Bun workspaces configured from the root `package.json`.
- Keep `bun.lock` in the repository.
- Do not create `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, or `pnpm-workspace.yaml`.
- Project commands in documentation must be written with Bun.
- If a tool requires Node compatibility, keep it behind Bun-compatible scripts.

## 4. Frontend Structure Rules

The frontend must be built with **Next.js**, TypeScript, and Bun tooling.

Use the following rules:

- Use App Router.
- Use reusable components.
- Keep UI components separated from business logic.
- Use feature-based folders for domain modules.
- Use shared design tokens for colors, spacing, typography, and status badges.
- Use the existing SunStay visual identity:
  - Primary color: `#0d4c6f`
  - Accent color: `#f5a623`
  - Base font size: `14px`
  - Spacing system: `8px`
- Maintain a desktop-first administrative layout.
- Mobile views must be simplified and focused on operational tasks.

Recommended frontend structure:

```txt
apps/web/
├── app/
│   ├── page.tsx
│   ├── login/
│   ├── dashboard/
│   ├── reservations/
│   ├── guests/
│   ├── rooms/
│   ├── billing/
│   ├── inventory/
│   ├── staff/
│   ├── common-areas/
│   ├── reports/
│   ├── users/
│   ├── roles/
│   └── profile/
│
├── components/
│   ├── layout/
│   ├── ui/
│   ├── tables/
│   ├── forms/
│   ├── modals/
│   └── charts/
│
├── features/
│   ├── reservations/
│   ├── guests/
│   ├── rooms/
│   ├── billing/
│   ├── inventory/
│   ├── staff/
│   ├── common-areas/
│   ├── reports/
│   ├── users/
│   └── roles/
│
├── hooks/
├── lib/
├── styles/
└── types/
```

---

## 5. Backend Structure Rules

The backend must be built with **NestJS**, TypeScript, REST APIs, Prisma ORM, PostgreSQL, and Bun tooling.

Use modular architecture.

Each business module must have its own folder with:

- controller
- service
- DTOs
- module file
- optional guards, policies, or mappers

Recommended backend module structure:

```txt
apps/api/src/modules/
├── reservations/
│   ├── reservations.controller.ts
│   ├── reservations.service.ts
│   ├── reservations.module.ts
│   ├── dto/
│   └── mappers/
│
├── guests/
├── rooms/
├── billing/
├── inventory/
├── staff/
├── attendance/
├── common-areas/
├── reports/
├── users/
└── roles/
```

Backend rules:

- Controllers must only handle HTTP input and output.
- Services must contain application logic.
- DTOs must validate incoming data.
- Prisma must handle database access.
- Business logic must not be placed directly inside controllers.
- Do not expose database entities directly to the frontend.
- Use response DTOs or mappers when needed.
- Keep authentication and authorization separated from business modules.

---

## 6. Database Rules

The database must use **PostgreSQL** and **Prisma ORM**.

The schema must support the main entities of the hotel domain:

- Hotel
- Reservation Holder
- Guest
- Reservation
- Reservation Guest
- Reservation Detail
- Room
- Room Type
- Room Status
- Room Status History
- Stay
- Invoice
- Invoice Detail
- Payment Status
- Payment Method
- Product
- Product Category
- Inventory Area
- Inventory
- Inventory Movement
- Staff
- Position
- Shift
- Staff Attendance
- Staff Access Control
- User
- Role
- Common Area
- Common Area Reservation
- Report Type
- Report
- Report Detail

Database rules:

- Use relational modeling.
- Use primary keys and foreign keys.
- Use normalized tables.
- Avoid storing repeated text values when catalogs are required.
- Use catalog tables for statuses, roles, payment methods, room statuses, and report types.
- Use history tables when operational traceability is required.
- Do not remove existing business entities without justification.
- Any schema change must be reflected in `docs/database.md`.

---

## 7. REST API Rules

Use REST as the main API style.

Recommended route structure:

```txt
/api/auth
/api/users
/api/roles
/api/reservations
/api/guests
/api/rooms
/api/billing
/api/inventory
/api/staff
/api/attendance
/api/common-areas
/api/reports
/api/dashboard
```

API rules:

- Use nouns for resources.
- Use HTTP methods correctly:
  - `GET` for reading
  - `POST` for creating
  - `PATCH` for partial updates
  - `PUT` only when replacing a full resource
  - `DELETE` for deletion or cancellation when applicable
- Use consistent response formats.
- Validate all request bodies.
- Return clear errors.
- Protect internal modules with authentication.
- Apply role-based authorization.

---

## 8. Authentication and Authorization

The system must include internal user access.

Required roles:

- Receptionist
- Administrator
- Inventory Manager
- Management

Rules:

- Users must authenticate before accessing internal modules.
- Access must be controlled by role.
- The login page must be separate from the landing page.
- The internal header must include a user profile menu.
- The profile menu must include:
  - My Profile
  - Account Settings
  - Change Password
  - Notifications
  - Help
  - Log out

Authorization must prevent users from accessing modules outside their role.

---

## 9. UI and Design Rules

The system must follow the existing SunStay design direction.

Use:

- professional hotel management dashboard style
- clean sidebar navigation
- top header
- KPI cards
- tables
- filters
- badges
- forms
- modals
- drawers
- charts
- role-based views where appropriate

Avoid:

- tourist website style
- marketplace UI
- decorative hero sections inside the admin panel
- unnecessary gradients
- excessive shadows
- overloaded screens
- inconsistent spacing
- unclear status labels

Every module must have:

- page title
- short description or breadcrumb
- main action button
- search or filters when needed
- clear data presentation
- consistent states and badges

---

## 10. Documentation Rules

Whenever changes are made, update the relevant documentation.

Required documentation files:

```txt
docs/architecture.md
docs/database.md
docs/api.md
docs/design.md
docs/requirements.md
```

Documentation rules:

- Update `docs/architecture.md` when changing structure, layers, modules, or technology decisions.
- Update `docs/database.md` when changing Prisma schema, tables, relationships, or migrations.
- Update `docs/api.md` when adding or changing endpoints.
- Update `docs/design.md` when changing UI layout, visual patterns, components, navigation, or design decisions.
- Update `docs/requirements.md` when adding, removing, or changing business requirements.

Do not make structural changes without documenting them.

---

## 11. Bun, Docker, and Environment Rules

The project has been migrated completely to **Bun** as the runtime and package manager. The project must also support Docker-based development.

Required services:

- frontend web app
- backend API
- PostgreSQL database

Rules:

- Use Bun for dependency installation, scripts, development commands, builds, tests, and Prisma-related scripts.
- Do not introduce npm, yarn, or pnpm lockfiles.
- Keep `bun.lock` as the source of dependency lock state.
- Use `.env.example` to document required environment variables.
- Never commit real secrets.
- Use Docker Compose for local development.
- Docker images and local commands must be compatible with Bun-based execution.
- Keep database credentials configurable.
- Keep ports consistent and documented.
- Make sure local setup can be reproduced by another developer.

---

## 12. Azure Deployment Direction

The project must be prepared for future Azure deployment.

Target Azure services:

- Azure App Service for the web application and API
- Azure Database for PostgreSQL
- Azure Storage if file storage is required in the future
- Azure monitoring tools for logs and observability

Rules:

- Do not hardcode local URLs.
- Use environment variables for external services.
- Keep deployment configuration separate from business logic.
- Keep the system portable between local development and cloud deployment.

---

## 13. Code Quality Rules

All code must follow these principles:

- Use TypeScript.
- Use clear naming.
- Use consistent folder structure.
- Avoid duplicated logic.
- Keep functions small and focused.
- Use DTOs for API input validation.
- Use typed responses where possible.
- Keep business logic separate from UI and database access.
- Use meaningful error messages.
- Avoid overengineering.
- Prefer simple, maintainable solutions.

---

## 14. Development Workflow

When working on the project, follow this workflow:

1. Understand the business requirement.
2. Identify the affected module.
3. Check existing documentation.
4. Design the required structure.
5. Update or create the required files.
6. Keep naming consistent.
7. Update documentation.
8. Verify that the change does not break the project structure.

Before implementing a new module, define:

- module purpose
- main entities
- API routes
- frontend views
- database tables
- required permissions
- documentation updates

---

## 15. Prohibited Actions

Do not:

- create random folders without architectural purpose
- mix frontend and backend logic
- place business logic inside UI components
- place database logic inside controllers
- ignore role-based access control
- introduce microservices unless explicitly required
- use NoSQL as the main database
- bypass Prisma for normal database operations
- commit secrets or credentials
- change the selected technology stack without justification
- reintroduce pnpm, npm, or yarn as the project package manager
- modify design patterns without updating `docs/design.md`
- modify database structure without updating `docs/database.md`

---

## 16. Expected Output From the Agent

When asked to create or modify the project structure, the agent must provide:

- clear folder structure
- file responsibilities
- naming conventions
- module boundaries
- required dependencies
- documentation updates
- implementation order
- warnings about architectural risks when needed

The final result must support a professional, scalable, and maintainable hotel management system based on:

```txt
Next.js + NestJS + PostgreSQL + Prisma ORM + REST + Bun + Docker + Azure
```

SunStay must always remain focused on hotel operational management, internal users, data centralization, traceability, reporting, and administrative control.

---

## 17. Final Agent Instruction

Follow this `AGENTS.md` strictly. Before creating files, analyze the business module, define its structure, keep the project modular, and update the corresponding documentation files after every structural change.

---

## 18. User and Role Management Module Rules

SunStay must include a web-based **Users and Roles** module because internal access is controlled by role. Authentication alone is not enough; administrators must be able to manage users, roles, and module permissions from the system.

### Required frontend areas

Add or maintain the following frontend routes and feature folders:

```txt
apps/web/app/users/
apps/web/app/roles/
apps/web/features/users/
apps/web/features/roles/
```

> Structure decision (2026-05-28): permissions and module-access configuration are managed **inside the `roles/` feature** (the Roles and Permissions module). There is no separate `settings/access-control/` route or `features/access-control/` folder.

The user management interface must include:

- user list
- user detail
- new user form
- edit user form
- role assignment
- user status management
- password reset action
- permissions summary by role

### Required backend modules

The backend must include or prepare the following modules:

```txt
apps/api/src/modules/users/
apps/api/src/modules/roles/
```

> Structure decision (2026-05-28): `SystemModule` and `RoleModulePermission` logic lives **inside the `roles/` module** (e.g. `roles/permissions.service.ts`, `roles/system-modules.controller.ts`). There are no separate `permissions/` or `system-modules/` modules. Check-in / check-out (`Stay`) is handled **inside the `reservations/` module**, not a standalone `stays/` module.

### Required access-control entities

The database model must support:

- `User`
- `Role`
- `SystemModule`
- `RoleModulePermission`
- `UserStatusHistory`
- optional `UserSession`
- optional `PasswordResetToken`

### User statuses

Supported user account statuses:

- Active
- Inactive
- Blocked

### Base roles

Required base roles:

- Administrator
- Receptionist
- Inventory Manager
- Management

### Access-control rules

- Only users with the Administrator role can manage users, roles, and permissions.
- Every internal user must have exactly one active role, unless the system explicitly supports multiple roles in the future.
- Role permissions must determine which modules appear in the sidebar.
- Users must not access backend endpoints outside their role permissions.
- Frontend route protection is not enough; backend guards must enforce authorization.
- Permission checks must be applied before executing protected use cases.
- Changes to users, roles, statuses, and permissions must be auditable.

### Documentation update rule

When the Users and Roles module changes, update:

- `docs/requirements.md`
- `docs/database.md`
- `docs/api.md`
- `docs/architecture.md`

Do not update `docs/design.md` unless the change affects visual design or interface patterns.
